import { NextResponse } from 'next/server';
import type {
  MacroData,
  MacroIndicator,
  StocksApiResponse,
  YahooChartResponse,
  MacroCategory,
} from '@/types/stocks';
import { MACRO_SYMBOLS } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

function normalizeFromV8Chart(
  symbol: string,
  chartRes: YahooChartResponse,
  meta: { name: string; displayName: string; category: MacroCategory },
): MacroIndicator | null {
  const chartResult = chartRes.chart?.result?.[0];
  if (!chartResult) return null;
  const m = chartResult.meta;
  const quote = chartResult.indicators?.quote?.[0];
  const lastIdx = (quote?.close?.length ?? 0) - 1;
  const close = lastIdx >= 0 ? quote?.close?.[lastIdx] : undefined;
  const price = close ?? m.regularMarketPrice;
  const prev = m.previousClose > 0 ? m.previousClose : (m.chartPreviousClose ?? 0);
  const change = prev > 0 ? price - prev : 0;
  const changePercent = prev > 0 ? (change / prev) * 100 : 0;
  return { symbol, name: meta.name, displayName: meta.displayName, price, change, changePercent, category: meta.category };
}

async function fetchMacroV8Single(symbol: string): Promise<YahooChartResponse | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(): Promise<NextResponse<StocksApiResponse<MacroData>>> {
  try {
    // v7은 서버사이드 요청을 401로 차단 → v8 병렬 fetch만 사용
    const chartResults = await Promise.allSettled(
      MACRO_SYMBOLS.map(async (symbolMeta) => {
        const chartRes = await fetchMacroV8Single(symbolMeta.symbol);
        if (!chartRes) return null;
        return normalizeFromV8Chart(symbolMeta.symbol, chartRes, symbolMeta);
      }),
    );

    const indicators: MacroIndicator[] = chartResults
      .filter((r): r is PromiseFulfilledResult<MacroIndicator | null> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((v): v is MacroIndicator => v !== null);

    if (indicators.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Yahoo Finance 거시지표 불러오기 실패', code: 'YAHOO_FINANCE_ERROR' },
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        currency:  indicators.filter((i) => i.category === 'currency'),
        bond:      indicators.filter((i) => i.category === 'bond'),
        index:     indicators.filter((i) => i.category === 'index'),
        commodity: indicators.filter((i) => i.category === 'commodity'),
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '거시지표 조회 중 오류 발생',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
