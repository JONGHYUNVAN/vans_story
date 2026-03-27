import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../macro/route';
import { MACRO_SYMBOLS } from '@/types/stocks';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function makeMockMacroResult(symbol: string) {
  return {
    symbol,
    regularMarketPrice: 1300.0,
    regularMarketChange: 5.0,
    regularMarketChangePercent: 0.39,
    regularMarketPreviousClose: 1295.0,
    currency: 'USD',
    marketState: 'CLOSED',
    regularMarketTime: 1700000000,
  };
}

function makeV7Response(results: unknown[]) {
  return { quoteResponse: { result: results, error: null } };
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/macro', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------
  // 1. MACRO_SYMBOLS 7개 symbol 모두 포함 검증
  // ----------------------------------------------------------
  it('MACRO_SYMBOLS에 정의된 7개 심볼이 모두 포함된다', () => {
    expect(MACRO_SYMBOLS).toHaveLength(7);
    const symbols = MACRO_SYMBOLS.map((s) => s.symbol);
    expect(symbols).toContain('USDKRW=X');
    expect(symbols).toContain('^TNX');
    expect(symbols).toContain('^KS11');
    expect(symbols).toContain('^KQ11');
    expect(symbols).toContain('^IXIC');
    expect(symbols).toContain('^GSPC');
    expect(symbols).toContain('^SOX');
  });

  // ----------------------------------------------------------
  // 2. v7 API 성공 → MacroIndicator[] 올바른 구조 반환
  // ----------------------------------------------------------
  it('v7 API 성공 시 MacroData 구조를 올바르게 반환한다', async () => {
    const mockResults = MACRO_SYMBOLS.map((s) => makeMockMacroResult(s.symbol));

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response(mockResults)), { status: 200 }),
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.fetchedAt).toBeDefined();

    // currency / bond / index 분류 검증
    expect(Array.isArray(body.data.currency)).toBe(true);
    expect(Array.isArray(body.data.bond)).toBe(true);
    expect(Array.isArray(body.data.index)).toBe(true);

    // category 필드 검증
    body.data.currency.forEach((i: { category: string }) => expect(i.category).toBe('currency'));
    body.data.bond.forEach((i: { category: string }) => expect(i.category).toBe('bond'));
    body.data.index.forEach((i: { category: string }) => expect(i.category).toBe('index'));
  });

  // ----------------------------------------------------------
  // 3. v7 성공 — MacroIndicator 필드 검증
  // ----------------------------------------------------------
  it('v7 성공 시 MacroIndicator 필드(name, displayName, price, change, changePercent)를 포함한다', async () => {
    const mockResults = MACRO_SYMBOLS.map((s) => makeMockMacroResult(s.symbol));

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(makeV7Response(mockResults)), { status: 200 }),
    );

    const res = await GET();
    const body = await res.json();

    const allIndicators = [
      ...body.data.currency,
      ...body.data.bond,
      ...body.data.index,
    ];
    expect(allIndicators.length).toBe(MACRO_SYMBOLS.length);

    allIndicators.forEach((ind: Record<string, unknown>) => {
      expect(ind).toHaveProperty('symbol');
      expect(ind).toHaveProperty('name');
      expect(ind).toHaveProperty('displayName');
      expect(ind).toHaveProperty('price');
      expect(ind).toHaveProperty('change');
      expect(ind).toHaveProperty('changePercent');
      expect(ind).toHaveProperty('category');
    });
  });

  // ----------------------------------------------------------
  // 4. v7 실패 후 v8 fallback도 모두 실패 → 502
  // ----------------------------------------------------------
  it('v7와 v8 모두 실패하면 502 에러를 반환한다', async () => {
    // v7 실패
    fetchSpy.mockResolvedValueOnce(new Response('error', { status: 500 }));
    // v8 모두 실패
    fetchSpy.mockResolvedValue(new Response('error', { status: 500 }));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('YAHOO_FINANCE_ERROR');
  });

  // ----------------------------------------------------------
  // 5. v7 결과가 빈 배열 → v8 fallback 시도
  // ----------------------------------------------------------
  it('v7가 빈 배열을 반환하면 v8 fallback을 시도한다', async () => {
    // v7: 빈 결과
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ quoteResponse: { result: [], error: null } }), { status: 200 }),
    );

    // v8: 각 심볼에 대해 성공 응답
    const v8Response = {
      chart: {
        result: [
          {
            meta: {
              currency: 'USD',
              symbol: 'USDKRW=X',
              exchangeName: 'CCY',
              fullExchangeName: 'CCY',
              regularMarketPrice: 1300,
              previousClose: 1295,
              chartPreviousClose: 1295,
              regularMarketTime: 1700000000,
              dataGranularity: '1d',
              range: '1d',
            },
            timestamp: [1700000000],
            indicators: {
              quote: [{ open: [1295], high: [1305], low: [1290], close: [1300], volume: [0] }],
            },
          },
        ],
        error: null,
      },
    };

    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify(v8Response), { status: 200 }),
    );

    const res = await GET();
    const body = await res.json();

    // v8 fallback이 성공하면 200 반환
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});
