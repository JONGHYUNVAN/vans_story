import { NextRequest, NextResponse } from 'next/server';
import type {
  StockPrice,
  StockPricesData,
  StocksApiResponse,
  YahooQuoteResponse,
  YahooChartResponse,
  Market,
  MarketState,
} from '@/types/stocks';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol));

function resolveMarket(symbol: string): Market {
  return KR_SYMBOL_SET.has(symbol) ? 'kr' : 'us';
}

function normalizeFromV7Quote(
  result: YahooQuoteResponse['quoteResponse']['result'][number],
): StockPrice {
  return {
    symbol: result.symbol,
    name: result.shortName ?? result.longName ?? result.symbol,
    price: result.regularMarketPrice,
    change: result.regularMarketChange,
    changePercent: result.regularMarketChangePercent,
    previousClose: result.regularMarketPreviousClose,
    open: result.regularMarketOpen,
    high: result.regularMarketDayHigh,
    low: result.regularMarketDayLow,
    volume: result.regularMarketVolume,
    marketCap: result.marketCap ?? null,
    currency: result.currency,
    market: resolveMarket(result.symbol),
    marketState: (result.marketState as MarketState) ?? 'CLOSED',
    updatedAt: result.regularMarketTime,
  };
}

function normalizeFromV8Chart(symbol: string, chartRes: YahooChartResponse): StockPrice | null {
  const chartResult = chartRes.chart?.result?.[0];
  if (!chartResult) return null;

  const meta = chartResult.meta;
  const quote = chartResult.indicators?.quote?.[0];
  const lastIdx = (quote?.close?.length ?? 0) - 1;
  const close = lastIdx >= 0 ? quote?.close?.[lastIdx] : undefined;
  const open = lastIdx >= 0 ? quote?.open?.[lastIdx] : undefined;
  const high = lastIdx >= 0 ? quote?.high?.[lastIdx] : undefined;
  const low = lastIdx >= 0 ? quote?.low?.[lastIdx] : undefined;
  const volume = lastIdx >= 0 ? quote?.volume?.[lastIdx] : undefined;

  return {
    symbol,
    name: symbol,
    price: close ?? meta.regularMarketPrice,
    change: (close ?? meta.regularMarketPrice) - meta.previousClose,
    changePercent:
      meta.previousClose > 0
        ? (((close ?? meta.regularMarketPrice) - meta.previousClose) / meta.previousClose) * 100
        : 0,
    previousClose: meta.previousClose,
    open: open ?? meta.regularMarketPrice,
    high: high ?? meta.regularMarketPrice,
    low: low ?? meta.regularMarketPrice,
    volume: volume ?? 0,
    marketCap: null,
    currency: meta.currency,
    market: resolveMarket(symbol),
    marketState: 'CLOSED',
    updatedAt: meta.regularMarketTime,
  };
}

async function fetchV7Quote(symbols: string[]): Promise<StockPrice[]> {
  const symbolsParam = symbols.map(encodeURIComponent).join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error(`Yahoo Finance v7 오류: ${res.status}`);
  const json: YahooQuoteResponse = await res.json();
  const results = json?.quoteResponse?.result;
  if (!Array.isArray(results) || results.length === 0) throw new Error('v7 결과 없음');
  return results.map(normalizeFromV7Quote);
}

async function fetchV8ChartSingle(symbol: string): Promise<StockPrice | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
  if (!res.ok) return null;
  const json: YahooChartResponse = await res.json();
  return normalizeFromV8Chart(symbol, json);
}

async function fetchV8ChartAll(symbols: string[]): Promise<StockPrice[]> {
  const results = await Promise.allSettled(symbols.map(fetchV8ChartSingle));
  return results
    .filter((r): r is PromiseFulfilledResult<StockPrice | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((v): v is StockPrice => v !== null);
}

export async function GET(request: NextRequest): Promise<NextResponse<StocksApiResponse<StockPricesData>>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    const market = searchParams.get('market') ?? 'all';

    let symbols: string[];
    if (symbolsParam) {
      symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (market === 'kr') {
      symbols = KR_STOCKS.map((s) => s.symbol as string);
    } else if (market === 'us') {
      symbols = US_STOCKS.map((s) => s.symbol as string);
    } else {
      symbols = [
        ...KR_STOCKS.map((s) => s.symbol as string),
        ...US_STOCKS.map((s) => s.symbol as string),
      ];
    }

    if (symbols.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: '조회할 종목이 없습니다.', code: 'NO_SYMBOLS' } },
        { status: 400 },
      );
    }

    let stocks: StockPrice[];
    try {
      stocks = await fetchV7Quote(symbols);
    } catch (v7Error) {
      console.warn('[stocks/prices] v7 실패, v8 fallback:', v7Error);
      stocks = await fetchV8ChartAll(symbols);
      if (stocks.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: { message: 'Yahoo Finance 데이터를 불러오는 데 실패했습니다.', code: 'YAHOO_FINANCE_ERROR' },
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: { stocks, fetchedAt: new Date().toISOString() },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '주가 데이터 조회 중 오류가 발생했습니다.',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
