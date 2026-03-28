import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../prices/route';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function makeRequest(url: string): Request {
  return new Request(url);
}

function makeMockQuoteResult(overrides: Record<string, unknown> = {}) {
  return {
    symbol: '005930.KS',
    shortName: '삼성전자',
    regularMarketPrice: 60000,
    regularMarketChange: 500,
    regularMarketChangePercent: 0.84,
    regularMarketPreviousClose: 59500,
    regularMarketOpen: 59800,
    regularMarketDayHigh: 60500,
    regularMarketDayLow: 59300,
    regularMarketVolume: 1000000,
    marketCap: 357000000000,
    currency: 'KRW',
    marketState: 'CLOSED',
    regularMarketTime: 1700000000,
    ...overrides,
  };
}

function makeV7Response(results: unknown[]) {
  return {
    quoteResponse: { result: results, error: null },
  };
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/prices', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------
  // 1. Yahoo Finance v7 성공 — KRX 종목 market/currency 검증
  // ----------------------------------------------------------
  it('KRX 종목에 대해 market=kr, currency=KRW를 반환한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol; // '005930.KS'
    const mockResult = makeMockQuoteResult({ symbol: krSymbol, currency: 'KRW' });

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response([mockResult])), { status: 200 }),
    );

    const req = makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`);
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock.symbol).toBe(krSymbol);
    expect(stock.market).toBe('kr');
    expect(stock.currency).toBe('KRW');
  });

  // ----------------------------------------------------------
  // 2. US 종목 market=us, currency=USD 검증
  // ----------------------------------------------------------
  it('US 종목에 대해 market=us, currency=USD를 반환한다', async () => {
    const usSymbol = US_STOCKS[0].symbol; // 'NVDA'
    const mockResult = makeMockQuoteResult({ symbol: usSymbol, currency: 'USD', marketCap: undefined });

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response([mockResult])), { status: 200 }),
    );

    const req = makeRequest(`http://localhost/api/stocks/prices?symbols=${usSymbol}`);
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock.symbol).toBe(usSymbol);
    expect(stock.market).toBe('us');
    expect(stock.currency).toBe('USD');
  });

  // ----------------------------------------------------------
  // 3. v7 성공 — 올바른 StockPrice[] 구조 반환
  // ----------------------------------------------------------
  it('v7 API 성공 시 올바른 StockPrice[] 구조를 반환한다', async () => {
    const mockResults = [
      makeMockQuoteResult({ symbol: KR_STOCKS[0].symbol, currency: 'KRW' }),
      makeMockQuoteResult({ symbol: US_STOCKS[0].symbol, currency: 'USD', marketCap: undefined }),
    ];

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response(mockResults)), { status: 200 }),
    );

    const req = makeRequest(
      `http://localhost/api/stocks/prices?symbols=${KR_STOCKS[0].symbol},${US_STOCKS[0].symbol}`,
    );
    const res = await GET(req as never);
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.stocks)).toBe(true);
    expect(body.data.stocks).toHaveLength(2);
    expect(body.data.fetchedAt).toBeDefined();

    const [kr, us] = body.data.stocks;
    expect(kr).toMatchObject({ price: 60000, change: 500, volume: 1000000 });
    expect(us).toMatchObject({ symbol: US_STOCKS[0].symbol });
  });

  it('v7에서 regularMarketChange가 null이면 전일 대비로 change를 계산한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    const mockResult = makeMockQuoteResult({
      symbol: krSymbol,
      regularMarketPrice: 60000,
      regularMarketChange: null,
      regularMarketChangePercent: null,
      regularMarketPreviousClose: 59500,
    });

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response([mockResult])), { status: 200 }),
    );

    const req = makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`);
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock).toMatchObject({ price: 60000, change: 500 });
    expect(stock.changePercent).toBeCloseTo((500 / 59500) * 100, 5);
  });

  it('v7에서 regularMarketPreviousClose가 0이면 chartPreviousClose로 보정한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    const mockResult = makeMockQuoteResult({
      symbol: krSymbol,
      regularMarketPrice: 60_000,
      regularMarketPreviousClose: 0,
      chartPreviousClose: 59_500,
      regularMarketChange: null,
      regularMarketChangePercent: null,
    });

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response([mockResult])), { status: 200 }),
    );

    const req = makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`);
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock.previousClose).toBe(59_500);
    expect(stock.change).toBe(500);
  });

  // ----------------------------------------------------------
  // 4. v7 실패 후 v8 fallback 도 실패 → 502
  // ----------------------------------------------------------
  it('v7와 v8 모두 실패하면 502 에러를 반환한다', async () => {
    // v7 호출 실패
    fetchSpy.mockResolvedValueOnce(new Response('error', { status: 500 }));
    // v8 호출도 모두 실패 (symbols가 여러 개일 수 있으므로 한 번에 처리)
    fetchSpy.mockResolvedValue(new Response('error', { status: 500 }));

    const req = makeRequest(
      `http://localhost/api/stocks/prices?symbols=${KR_STOCKS[0].symbol}`,
    );
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('YAHOO_FINANCE_ERROR');
  });

  // ----------------------------------------------------------
  // 5. symbols 파라미터 없이 market=kr 로 요청 → KR_STOCKS 전체 조회
  // ----------------------------------------------------------
  it('market=kr 파라미터만 있을 때 KR_STOCKS 전체를 조회한다', async () => {
    const mockResults = KR_STOCKS.map((s) =>
      makeMockQuoteResult({ symbol: s.symbol, currency: 'KRW' }),
    );

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response(mockResults)), { status: 200 }),
    );

    const req = makeRequest('http://localhost/api/stocks/prices?market=kr');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.stocks).toHaveLength(KR_STOCKS.length);
    body.data.stocks.forEach((s: { market: string }) => expect(s.market).toBe('kr'));
  });
});
