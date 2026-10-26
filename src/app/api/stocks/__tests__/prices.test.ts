import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { GET } from '../prices/route';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';
import type { YahooChartResponse } from '@/types/stocks';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
type ChartMeta = YahooChartResponse['chart']['result'][number]['meta'];
type MockEntry = YahooChartResponse | { failStatus: number };

function makeRequest(url: string): Request {
  return new Request(url);
}

function urlOf(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function symbolFromUrl(url: string): string {
  const m = /\/v8\/finance\/chart\/([^?]+)/.exec(url);
  return m ? decodeURIComponent(m[1]) : '';
}

/** Yahoo v8 chart 응답 mock (interval=1d&range=1d, 캔들 1개) */
function makeV8ChartResponse(symbol: string, metaOverrides: Partial<ChartMeta> = {}): YahooChartResponse {
  return {
    chart: {
      result: [
        {
          meta: {
            currency: 'KRW',
            symbol,
            exchangeName: 'KSC',
            fullExchangeName: 'KSE',
            regularMarketPrice: 60000,
            previousClose: 59500,
            chartPreviousClose: 59500,
            regularMarketTime: 1700000000,
            regularMarketDayHigh: 60500,
            regularMarketDayLow: 59300,
            regularMarketVolume: 1000000,
            marketState: 'CLOSED',
            dataGranularity: '1d',
            range: '1d',
            ...metaOverrides,
          },
          timestamp: [1700000000],
          indicators: {
            quote: [{ open: [59800], high: [60500], low: [59300], close: [60000], volume: [1000000] }],
          },
        },
      ],
      error: null,
    },
  };
}

/** 심볼별 v8 응답을 요청 URL로 매칭해 돌려주는 fetch mock (네트워크 호출 없음) */
function mockV8ByUrl(spy: MockInstance<typeof fetch>, responses: Record<string, MockEntry>) {
  spy.mockImplementation(async (input) => {
    const entry = responses[symbolFromUrl(urlOf(input))];
    if (!entry) return new Response('not found', { status: 404 });
    if ('failStatus' in entry) return new Response('error', { status: entry.failStatus });
    return new Response(JSON.stringify(entry), { status: 200 });
  });
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/prices', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------
  // 1. KRX 종목 market/currency/표시명 검증
  // ----------------------------------------------------------
  it('KRX 종목에 대해 market=kr, currency=KRW를 반환한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol; // '005930.KS'
    mockV8ByUrl(fetchSpy, { [krSymbol]: makeV8ChartResponse(krSymbol, { currency: 'KRW' }) });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock.symbol).toBe(krSymbol);
    expect(stock.market).toBe('kr');
    expect(stock.currency).toBe('KRW');
    expect(stock.name).toBe(KR_STOCKS[0].name); // STOCK_DISPLAY_NAME 우선
  });

  // ----------------------------------------------------------
  // 2. US 종목 market=us, currency=USD 검증
  // ----------------------------------------------------------
  it('US 종목에 대해 market=us, currency=USD를 반환한다', async () => {
    const usSymbol = US_STOCKS[0].symbol; // 'NVDA'
    mockV8ByUrl(fetchSpy, {
      [usSymbol]: makeV8ChartResponse(usSymbol, { currency: 'USD', exchangeName: 'NMS', fullExchangeName: 'NasdaqGS' }),
    });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${usSymbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    const stock = body.data.stocks[0];
    expect(stock.symbol).toBe(usSymbol);
    expect(stock.market).toBe('us');
    expect(stock.currency).toBe('USD');
  });

  // ----------------------------------------------------------
  // 3. 심볼마다 v8 chart API를 한 번씩 호출한다
  // ----------------------------------------------------------
  it('심볼마다 v8 chart API를 한 번씩 호출한다', async () => {
    const symbols = [KR_STOCKS[0].symbol, US_STOCKS[0].symbol];
    mockV8ByUrl(fetchSpy, {
      [symbols[0]]: makeV8ChartResponse(symbols[0]),
      [symbols[1]]: makeV8ChartResponse(symbols[1], { currency: 'USD' }),
    });

    await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${symbols.join(',')}`) as never);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const urls = fetchSpy.mock.calls.map(([input]) => urlOf(input));
    expect(urls[0]).toContain(`/v8/finance/chart/${encodeURIComponent(symbols[0])}`);
    expect(urls[1]).toContain(`/v8/finance/chart/${encodeURIComponent(symbols[1])}`);
    urls.forEach((u) => expect(u).toContain('interval=1d&range=1d'));
  });

  // ----------------------------------------------------------
  // 4. v8 성공 — 올바른 StockPrice[] 구조 반환
  // ----------------------------------------------------------
  it('v8 API 성공 시 올바른 StockPrice[] 구조를 반환한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    const usSymbol = US_STOCKS[0].symbol;
    mockV8ByUrl(fetchSpy, {
      [krSymbol]: makeV8ChartResponse(krSymbol),
      [usSymbol]: makeV8ChartResponse(usSymbol, {
        currency: 'USD',
        regularMarketPrice: 120,
        previousClose: 118,
        chartPreviousClose: 118,
        regularMarketDayHigh: 121,
        regularMarketDayLow: 117,
        regularMarketVolume: 500,
      }),
    });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol},${usSymbol}`) as never);
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.stocks)).toBe(true);
    expect(body.data.stocks).toHaveLength(2);
    expect(body.data.fetchedAt).toBeDefined();

    const [kr, us] = body.data.stocks;
    expect(kr).toMatchObject({
      symbol: krSymbol,
      name: KR_STOCKS[0].name,
      price: 60000,
      change: 500,
      previousClose: 59500,
      high: 60500,
      low: 59300,
      volume: 1000000,
      marketCap: null,
      currency: 'KRW',
      market: 'kr',
      marketState: 'CLOSED',
      updatedAt: 1700000000,
    });
    expect(kr.changePercent).toBeCloseTo((500 / 59500) * 100, 5);
    expect(us).toMatchObject({ symbol: usSymbol, name: US_STOCKS[0].name, market: 'us', currency: 'USD', price: 120, change: 2 });
  });

  // ----------------------------------------------------------
  // 5. 기준가 계산
  // ----------------------------------------------------------
  it('regularMarketOpen이 없으면 previousClose를 기준으로 change와 changePercent를 계산한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    mockV8ByUrl(fetchSpy, {
      [krSymbol]: makeV8ChartResponse(krSymbol, { regularMarketPrice: 60000, previousClose: 59500 }),
    });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    const stock = body.data.stocks[0];
    expect(stock).toMatchObject({ price: 60000, change: 500 });
    expect(stock.changePercent).toBeCloseTo((500 / 59500) * 100, 5);
  });

  it('previousClose가 0이면 chartPreviousClose로 보정한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    mockV8ByUrl(fetchSpy, {
      [krSymbol]: makeV8ChartResponse(krSymbol, {
        regularMarketPrice: 60_000,
        previousClose: 0,
        chartPreviousClose: 59_500,
      }),
    });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    const stock = body.data.stocks[0];
    expect(stock.previousClose).toBe(59_500);
    expect(stock.change).toBe(500);
  });

  // ----------------------------------------------------------
  // 6. 실패 처리
  // ----------------------------------------------------------
  it('v8 응답이 모두 실패하면 502 에러를 반환한다', async () => {
    fetchSpy.mockResolvedValue(new Response('error', { status: 500 }));

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${KR_STOCKS[0].symbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('YAHOO_FINANCE_ERROR');
  });

  it('일부 심볼만 실패하면 성공한 종목만 반환한다', async () => {
    const krSymbol = KR_STOCKS[0].symbol;
    const usSymbol = US_STOCKS[0].symbol;
    mockV8ByUrl(fetchSpy, {
      [krSymbol]: makeV8ChartResponse(krSymbol),
      [usSymbol]: { failStatus: 500 },
    });

    const res = await GET(makeRequest(`http://localhost/api/stocks/prices?symbols=${krSymbol},${usSymbol}`) as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.stocks).toHaveLength(1);
    expect(body.data.stocks[0].symbol).toBe(krSymbol);
  });

  it('symbols 파라미터가 비어 있으면 400을 반환한다', async () => {
    const res = await GET(makeRequest('http://localhost/api/stocks/prices?symbols=,') as never);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('NO_SYMBOLS');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------
  // 7. symbols 없이 market=kr → KR_STOCKS 전체 조회
  // ----------------------------------------------------------
  it('market=kr 파라미터만 있을 때 KR_STOCKS 전체를 조회한다', async () => {
    mockV8ByUrl(
      fetchSpy,
      Object.fromEntries(KR_STOCKS.map((s) => [s.symbol, makeV8ChartResponse(s.symbol)])),
    );

    const res = await GET(makeRequest('http://localhost/api/stocks/prices?market=kr') as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(KR_STOCKS.length);
    expect(body.data.stocks).toHaveLength(KR_STOCKS.length);
    body.data.stocks.forEach((s: { market: string }) => expect(s.market).toBe('kr'));
  });
});
