import { NextRequest, NextResponse } from 'next/server';
import type { NewsItem, StockNewsData, StocksApiResponse } from '@/types/stocks';

const NEWS_LIMIT_DEFAULT = 5;
const NEWS_LIMIT_MAX = 20;

function extractTagContent(xml: string, tag: string): string {
  const cdataPattern = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = cdataPattern.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainPattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const plainMatch = plainPattern.exec(xml);
  if (plainMatch) return plainMatch[1].trim();
  return '';
}

function parseRssXml(xml: string, limit: number): NewsItem[] {
  const items: NewsItem[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null && items.length < limit) {
    const block = match[1];
    const title = extractTagContent(block, 'title');
    const link = extractTagContent(block, 'link');
    const rawDate = extractTagContent(block, 'pubDate');
    const description = extractTagContent(block, 'description');

    // source 파싱
    const sourceTagMatch = /<source[^>]*url=["']([^"']*)["'][^>]*>([\s\S]*?)<\/source>/i.exec(block);
    const source = sourceTagMatch ? sourceTagMatch[2].trim() : 'Yahoo Finance';

    if (!title || !link) continue;

    let pubDate = rawDate;
    try {
      if (rawDate) pubDate = new Date(rawDate).toISOString();
    } catch {
      pubDate = rawDate;
    }

    items.push({ title, link, pubDate, description, source });
  }
  return items;
}

export async function GET(request: NextRequest): Promise<NextResponse<StocksApiResponse<StockNewsData>>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const limitParam = parseInt(searchParams.get('limit') ?? String(NEWS_LIMIT_DEFAULT), 10);
    const limit = isNaN(limitParam) ? NEWS_LIMIT_DEFAULT : Math.min(limitParam, NEWS_LIMIT_MAX);

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: { message: 'symbol 파라미터가 필요합니다.', code: 'MISSING_SYMBOL' } },
        { status: 400 },
      );
    }

    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: { message: `뉴스 RSS 응답 오류: ${res.status}`, code: 'RSS_ERROR' },
        },
        { status: 502 },
      );
    }

    const xml = await res.text();
    const news = parseRssXml(xml, limit);

    return NextResponse.json({
      success: true,
      data: { symbol, news, fetchedAt: new Date().toISOString() },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '뉴스 조회 중 오류 발생',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
