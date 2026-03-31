import { NextRequest, NextResponse } from 'next/server';
import type { NewsItem, StockNewsData, StocksApiResponse } from '@/types/stocks';
import { KR_STOCKS, MACRO_SYMBOLS } from '@/types/stocks';

const NEWS_LIMIT_DEFAULT = 8;
const NEWS_LIMIT_MAX = 20;

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol as string));

/** 심볼 → 구글 뉴스 검색 쿼리 목록 (여러 언어 동시 지원 가능) */
const MACRO_QUERY_MAP: Record<string, Array<{ query: string; lang: 'ko' | 'en' }>> = {
  '^KS11':    [{ query: '코스피 증시',                             lang: 'ko' }],
  '^KQ11':    [{ query: '코스닥 증시',                             lang: 'ko' }],
  '^IXIC':    [{ query: 'NASDAQ stock market',                    lang: 'en' },
               { query: '나스닥 증시',                             lang: 'ko' }],
  '^GSPC':    [{ query: 'S&P 500 stock market',                   lang: 'en' },
               { query: 'S&P500 증시',                            lang: 'ko' }],
  '^SOX':     [{ query: 'Philadelphia Semiconductor Index SOX',   lang: 'en' },
               { query: '필라델피아 반도체 지수',                   lang: 'ko' }],
  '^TNX':     [{ query: 'US 10 year treasury bond yield',         lang: 'en' },
               { query: '미국 국채 금리',                          lang: 'ko' }],
  'USDKRW=X': [{ query: '원달러 환율',                             lang: 'ko' },
               { query: 'USD KRW exchange rate',                  lang: 'en' }],
  'CL=F':     [{ query: 'WTI 유가 원유',                          lang: 'ko' },
               { query: 'WTI crude oil price',                    lang: 'en' }],
};

function extractTagContent(xml: string, tag: string): string {
  const cdataPattern = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = cdataPattern.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainPattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const plainMatch = plainPattern.exec(xml);
  if (plainMatch) return plainMatch[1].trim();
  return '';
}

function parseRssXml(xml: string, limit: number, defaultSource = 'Yahoo Finance'): NewsItem[] {
  const items: NewsItem[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null && items.length < limit) {
    const block = match[1];
    const title = extractTagContent(block, 'title').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    const link  = extractTagContent(block, 'link');
    const rawDate = extractTagContent(block, 'pubDate');
    const description = extractTagContent(block, 'description');

    const sourceTagMatch = /<source[^>]*url=["']([^"']*)["'][^>]*>([\s\S]*?)<\/source>/i.exec(block);
    const source = sourceTagMatch ? sourceTagMatch[2].trim() : defaultSource;

    if (!title || !link) continue;

    let pubDate = rawDate;
    try { if (rawDate) pubDate = new Date(rawDate).toISOString(); } catch { /* keep raw */ }

    items.push({ title, link, pubDate, description, source });
  }
  return items;
}

function dedup(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.slice(0, 40).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchYahooRSS(symbol: string, limit: number): Promise<NewsItem[]> {
  try {
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssXml(xml, limit);
  } catch {
    return [];
  }
}

/** Yahoo Finance RSS를 건너뛸 심볼 판별
 * - 국내 종목: Yahoo RSS가 영어 기사만 반환
 * - 거시지표 전체: Yahoo RSS가 지수/원자재 심볼에 결과 없음
 */
function skipYahooRSS(symbol: string): boolean {
  if (KR_SYMBOL_SET.has(symbol)) return true;       // 국내 주가
  if (symbol in MACRO_QUERY_MAP) return true;        // 거시지표 전체
  return false;
}

/** 심볼 → Google News 검색 쿼리 목록 */
function buildGoogleQueries(symbol: string): Array<{ query: string; lang: 'ko' | 'en' }> {
  // 1. 거시지표 매핑
  if (MACRO_QUERY_MAP[symbol]) return MACRO_QUERY_MAP[symbol];
  // 2. 국내 종목: 한글 이름 + "주가"
  const kr = KR_STOCKS.find((s) => s.symbol === symbol);
  if (kr) return [{ query: kr.name + ' 주가', lang: 'ko' }];
  // 3. 그 외 MACRO_SYMBOLS (매핑 누락 시)
  const macro = MACRO_SYMBOLS.find((m) => m.symbol === symbol);
  if (macro) return [{ query: macro.displayName, lang: 'ko' }];
  // 4. 미국 종목
  return [{ query: symbol.replace(/[^A-Za-z0-9]/g, '') + ' stock', lang: 'en' }];
}

async function fetchSingleGoogleRSS(
  query: string, lang: 'ko' | 'en', limit: number,
): Promise<NewsItem[]> {
  try {
    const gl   = lang === 'ko' ? 'KR' : 'US';
    const ceid = lang === 'ko' ? 'KR:ko' : 'US:en';
    const url  = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${lang}&gl=${gl}&ceid=${ceid}`;
    const res  = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return parseRssXml(await res.text(), limit, 'Google 뉴스');
  } catch {
    return [];
  }
}

async function fetchGoogleNewsRSS(symbol: string, limit: number): Promise<NewsItem[]> {
  const queries = buildGoogleQueries(symbol);
  // 쿼리가 여러 개면 병렬 요청 후 합산
  const results = await Promise.all(
    queries.map(({ query, lang }) => fetchSingleGoogleRSS(query, lang, limit)),
  );
  return results.flat();
}

export async function GET(request: NextRequest): Promise<NextResponse<StocksApiResponse<StockNewsData>>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbol   = searchParams.get('symbol');
    const limitParam = parseInt(searchParams.get('limit') ?? String(NEWS_LIMIT_DEFAULT), 10);
    const limit    = isNaN(limitParam) ? NEWS_LIMIT_DEFAULT : Math.min(limitParam, NEWS_LIMIT_MAX);

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: { message: 'symbol 파라미터가 필요합니다.', code: 'MISSING_SYMBOL' } },
        { status: 400 },
      );
    }

    // 국내종목·거시지표는 Yahoo RSS(주가 전용) 생략, Google 뉴스만 사용
    const [yahooItems, googleItems] = await Promise.all([
      skipYahooRSS(symbol) ? Promise.resolve([]) : fetchYahooRSS(symbol, limit),
      fetchGoogleNewsRSS(symbol, limit),
    ]);

    // 합산 → 중복 제거 → 시간 역순 → limit
    const merged = dedup([...yahooItems, ...googleItems])
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, limit);

    // 둘 다 실패
    if (merged.length === 0 && yahooItems.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: '뉴스를 불러오지 못했습니다.', code: 'NO_NEWS' } },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { symbol, news: merged, fetchedAt: new Date().toISOString() },
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
