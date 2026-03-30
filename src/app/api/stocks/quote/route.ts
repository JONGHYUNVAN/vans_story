import { NextRequest, NextResponse } from 'next/server';
import type { MarketState } from '@/types/stocks';

const YAHOO_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

function finiteNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export interface StockQuoteData {
  price: number;
  change: number;
  changePercent: number;
  marketState: MarketState;
  preMarketPrice: number | null;
  preMarketChange: number | null;
  preMarketChangePercent: number | null;
  postMarketPrice: number | null;
  postMarketChange: number | null;
  postMarketChangePercent: number | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { success: false, error: 'symbol 파라미터가 필요합니다.' },
      { status: 400 },
    );
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Yahoo Finance 오류: ${res.status}` },
        { status: 502 },
      );
    }

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;

    if (!meta) {
      return NextResponse.json(
        { success: false, error: 'Yahoo Finance 결과 없음' },
        { status: 502 },
      );
    }

    const price = finiteNum(meta.regularMarketPrice);
    const prevClose =
      finiteNum(meta.previousClose) > 0
        ? finiteNum(meta.previousClose)
        : finiteNum(meta.chartPreviousClose);
    const change = prevClose !== 0 ? price - prevClose : finiteNum(meta.regularMarketChange);
    const changePercent =
      prevClose !== 0
        ? (change / prevClose) * 100
        : finiteNum(meta.regularMarketChangePercent);

    const data: StockQuoteData = {
      price,
      change,
      changePercent,
      marketState: ((meta.marketState ?? 'CLOSED') as MarketState),
      preMarketPrice: finiteNum(meta.preMarketPrice) || null,
      preMarketChange: finiteNum(meta.preMarketChange) || null,
      preMarketChangePercent: finiteNum(meta.preMarketChangePercent) || null,
      postMarketPrice: finiteNum(meta.postMarketPrice) || null,
      postMarketChange: finiteNum(meta.postMarketChange) || null,
      postMarketChangePercent: finiteNum(meta.postMarketChangePercent) || null,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
