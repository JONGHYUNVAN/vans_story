import { NextRequest, NextResponse } from 'next/server';
import type {
  StockPrice,
  StockPricesData,
  StocksApiResponse,
  YahooChartResponse,
  Market,
  MarketState,
} from '@/types/stocks';
import { KR_STOCKS, US_STOCKS, resolveStockDisplayName } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol));

function resolveMarket(symbol: string): Market {
  return KR_SYMBOL_SET.has(symbol) ? 'kr' : 'us';
}

function finiteNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeFromV8Chart(symbol: string, chartRes: YahooChartResponse): StockPrice | null {
  const chartResult = chartRes.chart?.result?.[0];
  if (!chartResult) return null;

  const meta = chartResult.meta;
  const quote = chartResult.indicators?.quote?.[0];
  const lastIdx = (quote?.close?.length ?? 0) - 1;

  const metaPrice = finiteNum(meta.regularMarketPrice);
  const prevRaw = finiteNum(meta.previousClose);
  const chartPrev = finiteNum(meta.chartPreviousClose);
  const prev = prevRaw > 0 ? prevRaw : chartPrev > 0 ? chartPrev : 0;
  const last = lastIdx >= 0 ? finiteNum(quote?.close?.[lastIdx], metaPrice) : metaPrice;

  const high =
    finiteNum(meta.regularMarketDayHigh) > 0
      ? finiteNum(meta.regularMarketDayHigh)
      : lastIdx >= 0 ? finiteNum(quote?.high?.[lastIdx], last) : last;
  const low =
    finiteNum(meta.regularMarketDayLow) > 0
      ? finiteNum(meta.regularMarketDayLow)
      : lastIdx >= 0 ? finiteNum(quote?.low?.[lastIdx], last) : last;
  const open =
    finiteNum(meta.regularMarketOpen) > 0
      ? finiteNum(meta.regularMarketOpen)
      : lastIdx >= 0 ? finiteNum(quote?.open?.[lastIdx], last) : last;
  const volume =
    finiteNum(meta.regularMarketVolume) > 0
      ? finiteNum(meta.regularMarketVolume)
      : lastIdx >= 0 ? finiteNum(quote?.volume?.[lastIdx]) : 0;

  return {
    symbol,
    name: resolveStockDisplayName(symbol, meta.shortName ?? null, meta.longName ?? null),
    price: last,
    change: prev > 0 ? last - prev : 0,
    changePercent: prev > 0 ? ((last - prev) / prev) * 100 : 0,
    previousClose: prev,
    open,
    high,
    low,
    volume,
    marketCap: null,
    currency: meta.currency,
    market: resolveMarket(symbol),
    marketState: ((meta.marketState ?? 'CLOSED') as MarketState),
    updatedAt: finiteNum(meta.regularMarketTime, Date.now() / 1000),
  };
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
