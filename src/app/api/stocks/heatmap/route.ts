import { NextResponse } from 'next/server';
import { SECTOR_HEATMAP_STOCKS, SectorHeatmapItem } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function fetchHeatmapItem(
  stock: { symbol: string; name: string; market: string; weight: number }
): Promise<SectorHeatmapItem> {
  const encoded = encodeURIComponent(stock.symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=1d`;
  try {
    const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    const price: number = meta?.regularMarketPrice ?? 0;
    const marketCapRaw: unknown = meta?.marketCap;
    const marketCap =
      typeof marketCapRaw === 'number' && isFinite(marketCapRaw) && marketCapRaw > 0
        ? marketCapRaw
        : null;
    const marketState: string = meta?.marketState ?? 'CLOSED';

    // Yahoo v8 does not reliably return *ChangePercent fields — calculate manually
    const prevClose: number = meta?.previousClose || meta?.chartPreviousClose || 0;
    const regularChangePercent = prevClose !== 0 ? ((price - prevClose) / prevClose) * 100 : null;

    // Pre/post market: use Yahoo fields if present, else fall back to regular
    const prePrice: number = meta?.preMarketPrice ?? 0;
    const preChangePercent = prevClose !== 0 && prePrice !== 0
      ? ((prePrice - prevClose) / prevClose) * 100
      : regularChangePercent;

    const postPrice: number = meta?.postMarketPrice ?? 0;
    const postChangePercent = prevClose !== 0 && postPrice !== 0
      ? ((postPrice - prevClose) / prevClose) * 100
      : regularChangePercent;

    let rawChangePercent: number | null;
    if (marketState === 'PRE') {
      rawChangePercent = preChangePercent ?? regularChangePercent;
    } else if (marketState === 'POST' || marketState === 'POSTPOST') {
      rawChangePercent = postChangePercent ?? regularChangePercent;
    } else {
      rawChangePercent = regularChangePercent;
    }

    return {
      symbol: stock.symbol,
      name: stock.name,
      market: stock.market as 'kr' | 'us',
      weight: stock.weight,
      marketCap,
      price: typeof price === 'number' && isFinite(price) ? price : null,
      changePercent: typeof rawChangePercent === 'number' && isFinite(rawChangePercent) ? rawChangePercent : null,
      marketState: marketState ?? undefined,
    };
  } catch {
    return {
      symbol: stock.symbol,
      name: stock.name,
      market: stock.market as 'kr' | 'us',
      weight: stock.weight,
      marketCap: null,
      price: null,
      changePercent: null,
    };
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      SECTOR_HEATMAP_STOCKS.map(s => fetchHeatmapItem(s))
    );

    const data: SectorHeatmapItem[] = results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      const s = SECTOR_HEATMAP_STOCKS[i];
      return {
        symbol: s.symbol,
        name: s.name,
        market: s.market as 'kr' | 'us',
        weight: s.weight,
        marketCap: null,
        price: null,
        changePercent: null,
        marketState: undefined,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch heatmap data', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
