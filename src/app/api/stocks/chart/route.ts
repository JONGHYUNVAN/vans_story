import { NextRequest, NextResponse } from 'next/server';
import type { ChartDataPoint, StocksApiResponse, YahooChartResponse } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
};

type ChartRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

const RANGE_MAP: Record<ChartRange, { range: string; interval: string }> = {
  '1D': { range: '1d',  interval: '5m'  },
  '1W': { range: '5d',  interval: '1h'  },
  '1M': { range: '1mo', interval: '1d'  },
  '3M': { range: '3mo', interval: '1d'  },
  '6M': { range: '6mo', interval: '1d'  },
  '1Y': { range: '1y',  interval: '1wk' },
};

function finiteNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<StocksApiResponse<{ symbol: string; range: string; data: ChartDataPoint[] }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const rangeParam = (searchParams.get('range') ?? '1D') as ChartRange;

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: { message: '심볼이 필요합니다.', code: 'NO_SYMBOL' } },
        { status: 400 },
      );
    }

    const config = RANGE_MAP[rangeParam] ?? RANGE_MAP['1D'];
    const path = `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${config.interval}&range=${config.range}`;
    const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];

    let res: Response | null = null;
    for (const host of hosts) {
      try {
        const r = await fetch(`https://${host}${path}`, { headers: YAHOO_HEADERS, cache: 'no-store' });
        if (r.ok) { res = r; break; }
      } catch { /* 다음 host 시도 */ }
    }
    if (!res) {
      return NextResponse.json(
        { success: false, error: { message: 'Yahoo Finance 요청 실패', code: 'YAHOO_ERROR' } },
        { status: 502 },
      );
    }

    const json: YahooChartResponse = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) {
      return NextResponse.json(
        { success: false, error: { message: '차트 데이터 없음', code: 'NO_DATA' } },
        { status: 404 },
      );
    }

    const timestamps = result.timestamp ?? [];
    const q = result.indicators?.quote?.[0];
    // 인덱스·수익률 심볼(^)은 거래량이 없거나 무관한 값이므로 0으로 고정
    const isIndex = symbol.startsWith('^');

    const data: ChartDataPoint[] = timestamps
      .map((ts, i) => ({
        timestamp: ts,
        open:   finiteNum(q?.open?.[i]),
        high:   finiteNum(q?.high?.[i]),
        low:    finiteNum(q?.low?.[i]),
        close:  finiteNum(q?.close?.[i]),
        volume: isIndex ? 0 : finiteNum(q?.volume?.[i]),
      }))
      .filter((d) => d.close > 0);

    return NextResponse.json({ success: true, data: { symbol, range: rangeParam, data } });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '차트 데이터 조회 중 오류 발생',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
