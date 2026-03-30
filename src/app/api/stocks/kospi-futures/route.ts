import { NextResponse } from 'next/server';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function fetchYahooMeta(symbol: string) {
  const encoded = encodeURIComponent(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=1d`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('No meta');
  return meta;
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && isFinite(value) ? value : null;
}

function toSnapshot(meta: Record<string, unknown> | null) {
  if (!meta) return null;
  const price = toNumber(meta.regularMarketPrice);
  if (price === null) return null;
  const prevClose = toNumber(meta.chartPreviousClose) ?? toNumber(meta.regularMarketPreviousClose) ?? 0;
  const change = toNumber(meta.regularMarketChange) ?? (price - prevClose);
  const changePercent = toNumber(meta.regularMarketChangePercent) ?? (prevClose !== 0 ? ((price - prevClose) / prevClose) * 100 : 0);
  return { price, change, changePercent };
}

export async function GET() {
  try {
    const [kospiResult, kkFuturesResult, ks200Result] = await Promise.allSettled([
      fetchYahooMeta('^KS11'),
      fetchYahooMeta('KK=F'),
      fetchYahooMeta('^KS200'),
    ]);

    const kospiMeta = kospiResult.status === 'fulfilled' ? (kospiResult.value as Record<string, unknown>) : null;
    const kkFuturesMeta = kkFuturesResult.status === 'fulfilled' ? (kkFuturesResult.value as Record<string, unknown>) : null;
    const ks200Meta = ks200Result.status === 'fulfilled' ? (ks200Result.value as Record<string, unknown>) : null;

    const kospi = toSnapshot(kospiMeta);
    if (!kospi) {
      throw new Error('KOSPI snapshot unavailable');
    }
    const kkFutures = toSnapshot(kkFuturesMeta);
    const ks200 = toSnapshot(ks200Meta);
    const futures = kkFutures ?? ks200 ?? kospi;

    return NextResponse.json({
      success: true,
      data: {
        symbol: '^KS11',
        label: 'KOSPI',
        sublabel: 'KOSPI 지수',
        price: kospi.price,
        change: kospi.change,
        changePercent: kospi.changePercent,
        futures: futures
          ? {
              symbol: kkFutures ? 'KK=F' : ks200 ? '^KS200' : '^KS11',
              label: '야간 선물 지수',
              sublabel: kkFutures
                ? 'CME KOSPI 200'
                : ks200
                  ? 'KOSPI 200 지수(대체)'
                  : 'KOSPI 지수(대체)',
              price: futures.price,
              change: futures.change,
              changePercent: futures.changePercent,
            }
          : null,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch KOSPI futures', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
