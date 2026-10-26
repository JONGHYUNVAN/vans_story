import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { GET } from '@/app/api/stocks/news/route';
import { KR_STOCKS } from '@/types/stocks';

// -------------------------------------------------------
// Mock RSS XML helpers
// -------------------------------------------------------
const DEFAULT_PUB_DATE = 'Thu, 27 Mar 2026 09:00:00 +0000';

function titles(count: number, prefix = 'News Title'): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix} ${i + 1}`);
}

/** RSS 2.0 XML 생성. source를 주면 <source> 태그를 포함(Yahoo 피드 형태), 없으면 생략(Google 피드 형태) */
function makeRssXml(
  itemTitles: string[],
  { source, pubDates = [] }: { source?: string; pubDates?: string[] } = {},
): string {
  const items = itemTitles
    .map((title, i) => {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const sourceTag = source ? `<source url="https://finance.yahoo.com">${source}</source>` : '';
      return `<item>
      <title><![CDATA[${title}]]></title>
      <link>https://example.com/news/${slug}</link>
      <pubDate>${pubDates[i] ?? DEFAULT_PUB_DATE}</pubDate>
      <description><![CDATA[Description for ${title}]]></description>
      ${sourceTag}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed</title>
    ${items}
  </channel>
</rss>`;
}

/** Yahoo 피드 형태(<source>Yahoo Finance</source> 포함) */
function yahooFeed(itemTitles: string[], pubDates?: string[]): string {
  return makeRssXml(itemTitles, { source: 'Yahoo Finance', pubDates });
}

const EMPTY_RSS = makeRssXml([]);

function urlOf(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

/** Yahoo RSS / Google News RSS 요청을 URL로 구분해 응답하는 fetch mock. 문자열은 XML 본문, 숫자는 HTTP 실패 상태 */
function mockRss(
  spy: MockInstance<typeof fetch>,
  feeds: { yahoo?: string | number; google?: string | number },
) {
  spy.mockImplementation(async (input) => {
    const url = urlOf(input);
    const pick = url.includes('feeds.finance.yahoo.com')
      ? feeds.yahoo
      : url.includes('news.google.com')
        ? feeds.google
        : undefined;
    if (pick === undefined) return new Response('unexpected url', { status: 404 });
    if (typeof pick === 'number') return new Response('error', { status: pick });
    return new Response(pick, { status: 200 });
  });
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/news', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------
  // 1. symbol 파라미터 없으면 400 에러
  // ----------------------------------------------------------
  it('symbol 파라미터가 없으면 400을 반환한다', async () => {
    const req = new Request('http://localhost/api/stocks/news');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('MISSING_SYMBOL');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------
  // 2. RSS XML 파싱 정상 동작 (미국 종목: Yahoo + Google 병렬 조회)
  // ----------------------------------------------------------
  it('Yahoo RSS XML을 정상 파싱하여 뉴스 항목을 반환한다', async () => {
    mockRss(fetchSpy, { yahoo: yahooFeed(titles(3)), google: EMPTY_RSS });

    const req = new Request('http://localhost/api/stocks/news?symbol=AAPL');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.symbol).toBe('AAPL');
    expect(Array.isArray(body.data.news)).toBe(true);
    expect(body.data.news).toHaveLength(3);

    const first = body.data.news[0];
    expect(first.title).toBe('News Title 1');
    expect(first.link).toBe('https://example.com/news/news-title-1');
    expect(first.description).toBe('Description for News Title 1');
    expect(first.source).toBe('Yahoo Finance');
    expect(first.pubDate).toBe(new Date(DEFAULT_PUB_DATE).toISOString());
  });

  it('미국 종목은 Yahoo RSS와 Google 뉴스 RSS를 각각 한 번씩 조회한다', async () => {
    mockRss(fetchSpy, { yahoo: yahooFeed(titles(1)), google: EMPTY_RSS });

    await GET(new Request('http://localhost/api/stocks/news?symbol=AAPL') as never);

    const urls = fetchSpy.mock.calls.map(([input]) => urlOf(input));
    expect(urls).toHaveLength(2);
    expect(urls.some((u) => u.includes('feeds.finance.yahoo.com') && u.includes('s=AAPL'))).toBe(
      true,
    );
    expect(
      urls.some(
        (u) => u.includes('news.google.com') && u.includes(encodeURIComponent('AAPL stock')),
      ),
    ).toBe(true);
  });

  // ----------------------------------------------------------
  // 3. limit 처리 (기본 8, 최대 20)
  // ----------------------------------------------------------
  it('뉴스가 10개여도 기본 limit인 8개만 반환한다', async () => {
    mockRss(fetchSpy, { yahoo: yahooFeed(titles(10)), google: EMPTY_RSS });

    const req = new Request('http://localhost/api/stocks/news?symbol=NVDA');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.news).toHaveLength(8);
  });

  it('limit=3 파라미터를 전달하면 최대 3개 뉴스를 반환한다', async () => {
    mockRss(fetchSpy, { yahoo: yahooFeed(titles(10)), google: EMPTY_RSS });

    const req = new Request('http://localhost/api/stocks/news?symbol=TSLA&limit=3');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(3);
  });

  it('limit은 최대 20으로 제한된다', async () => {
    mockRss(fetchSpy, { yahoo: yahooFeed(titles(25)), google: EMPTY_RSS });

    const req = new Request('http://localhost/api/stocks/news?symbol=TSLA&limit=50');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(20);
  });

  // ----------------------------------------------------------
  // 4. 합산 · 중복 제거 · 정렬
  // ----------------------------------------------------------
  it('Yahoo와 Google 결과를 합산하고 같은 제목은 하나만 남긴다', async () => {
    mockRss(fetchSpy, {
      yahoo: yahooFeed(['Alpha earnings beat', 'Beta guidance cut']),
      google: makeRssXml(['Beta guidance cut', 'Gamma new product']),
    });

    const req = new Request('http://localhost/api/stocks/news?symbol=AAPL');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(3);
    const byTitle = Object.fromEntries(
      body.data.news.map((n: { title: string; source: string }) => [n.title, n.source]),
    );
    expect(byTitle).toEqual({
      'Alpha earnings beat': 'Yahoo Finance',
      'Beta guidance cut': 'Yahoo Finance', // Yahoo 항목이 먼저 들어오므로 Yahoo 것이 남는다
      'Gamma new product': 'Google 뉴스', // Google 피드는 <source>가 없어 기본 출처명 사용
    });
  });

  it('뉴스를 pubDate 역순(최신 먼저)으로 정렬한다', async () => {
    mockRss(fetchSpy, {
      yahoo: yahooFeed(
        ['Older', 'Newer'],
        ['Mon, 23 Mar 2026 09:00:00 +0000', 'Fri, 27 Mar 2026 09:00:00 +0000'],
      ),
      google: EMPTY_RSS,
    });

    const req = new Request('http://localhost/api/stocks/news?symbol=AAPL');
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.data.news.map((n: { title: string }) => n.title)).toEqual(['Newer', 'Older']);
  });

  // ----------------------------------------------------------
  // 5. 심볼 종류별 피드 선택
  // ----------------------------------------------------------
  it('국내 종목은 Yahoo RSS를 건너뛰고 Google 뉴스(한글 이름 + "주가")만 조회한다', async () => {
    const kr = KR_STOCKS[0]; // 005930.KS 삼성전자
    mockRss(fetchSpy, { google: makeRssXml(titles(2, '삼성전자 뉴스')) });

    const req = new Request(`http://localhost/api/stocks/news?symbol=${kr.symbol}`);
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = urlOf(fetchSpy.mock.calls[0][0]);
    expect(url).toContain('news.google.com');
    expect(url).toContain(encodeURIComponent(`${kr.name} 주가`));
    expect(body.data.news).toHaveLength(2);
    body.data.news.forEach((n: { source: string }) => expect(n.source).toBe('Google 뉴스'));
  });

  it('거시지표 심볼은 매핑된 쿼리 수만큼 Google 뉴스를 병렬 조회한다', async () => {
    // ^IXIC → 영문/한글 쿼리 2개
    mockRss(fetchSpy, { google: makeRssXml(titles(1, 'Nasdaq')) });

    const req = new Request(
      `http://localhost/api/stocks/news?symbol=${encodeURIComponent('^IXIC')}`,
    );
    const res = await GET(req as never);

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mock.calls.forEach(([input]) => expect(urlOf(input)).toContain('news.google.com'));
  });

  // ----------------------------------------------------------
  // 6. 실패 처리 → 502 NO_NEWS
  // ----------------------------------------------------------
  it('Yahoo와 Google 응답이 모두 실패하면 502를 반환한다', async () => {
    mockRss(fetchSpy, { yahoo: 503, google: 503 });

    const req = new Request('http://localhost/api/stocks/news?symbol=MSFT');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NO_NEWS');
  });

  // ----------------------------------------------------------
  // 7. 뉴스 항목에 title 또는 link 없으면 건너뜀
  // ----------------------------------------------------------
  it('title 또는 link가 없는 항목은 파싱 결과에서 제외된다', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title><![CDATA[Valid News]]></title>
      <link>https://example.com/valid</link>
      <pubDate>${DEFAULT_PUB_DATE}</pubDate>
      <description><![CDATA[Valid]]></description>
    </item>
    <item>
      <link>https://example.com/no-title</link>
      <description><![CDATA[No title item]]></description>
    </item>
    <item>
      <title><![CDATA[No Link Item]]></title>
      <description><![CDATA[No link item]]></description>
    </item>
  </channel>
</rss>`;

    mockRss(fetchSpy, { yahoo: xml, google: EMPTY_RSS });

    const req = new Request('http://localhost/api/stocks/news?symbol=AAPL');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(1);
    expect(body.data.news[0].title).toBe('Valid News');
  });
});
