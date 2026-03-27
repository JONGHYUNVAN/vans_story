import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../news/route';

// -------------------------------------------------------
// Mock RSS XML helper
// -------------------------------------------------------
function makeRssXml(itemCount: number): string {
  const items = Array.from({ length: itemCount }, (_, i) =>
    `<item>
      <title><![CDATA[News Title ${i + 1}]]></title>
      <link>https://example.com/news/${i + 1}</link>
      <pubDate>Thu, 27 Mar 2026 09:00:00 +0000</pubDate>
      <description><![CDATA[Description for news ${i + 1}]]></description>
      <source url="https://finance.yahoo.com">Yahoo Finance</source>
    </item>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yahoo Finance</title>
    ${items}
  </channel>
</rss>`;
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/news', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

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
  });

  // ----------------------------------------------------------
  // 2. RSS XML 파싱 정상 동작
  // ----------------------------------------------------------
  it('RSS XML을 정상 파싱하여 뉴스 항목을 반환한다', async () => {
    const xml = makeRssXml(3);

    fetchSpy.mockResolvedValueOnce(new Response(xml, { status: 200 }));

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
    expect(first.link).toBe('https://example.com/news/1');
    expect(first.description).toBe('Description for news 1');
    expect(first.source).toBe('Yahoo Finance');
  });

  // ----------------------------------------------------------
  // 3. 최대 5개 뉴스 반환 검증 (기본 limit=5)
  // ----------------------------------------------------------
  it('뉴스가 10개여도 기본 limit인 5개만 반환한다', async () => {
    const xml = makeRssXml(10);

    fetchSpy.mockResolvedValueOnce(new Response(xml, { status: 200 }));

    const req = new Request('http://localhost/api/stocks/news?symbol=NVDA');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.news).toHaveLength(5);
  });

  // ----------------------------------------------------------
  // 4. limit 파라미터로 개수 제한 가능
  // ----------------------------------------------------------
  it('limit=3 파라미터를 전달하면 최대 3개 뉴스를 반환한다', async () => {
    const xml = makeRssXml(10);

    fetchSpy.mockResolvedValueOnce(new Response(xml, { status: 200 }));

    const req = new Request('http://localhost/api/stocks/news?symbol=TSLA&limit=3');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(3);
  });

  // ----------------------------------------------------------
  // 5. RSS 응답 오류 → 502
  // ----------------------------------------------------------
  it('RSS 응답이 실패하면 502를 반환한다', async () => {
    fetchSpy.mockResolvedValueOnce(new Response('error', { status: 503 }));

    const req = new Request('http://localhost/api/stocks/news?symbol=MSFT');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('RSS_ERROR');
  });

  // ----------------------------------------------------------
  // 6. 뉴스 항목에 title 또는 link 없으면 건너뜀
  // ----------------------------------------------------------
  it('title 또는 link가 없는 항목은 파싱 결과에서 제외된다', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title><![CDATA[Valid News]]></title>
      <link>https://example.com/valid</link>
      <pubDate>Thu, 27 Mar 2026 09:00:00 +0000</pubDate>
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

    fetchSpy.mockResolvedValueOnce(new Response(xml, { status: 200 }));

    const req = new Request('http://localhost/api/stocks/news?symbol=AAPL');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.news).toHaveLength(1);
    expect(body.data.news[0].title).toBe('Valid News');
  });
});
