import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { GET } from '@/app/api/stocks/macro/route';
import { MACRO_SYMBOLS } from '@/types/stocks';
import type { YahooChartResponse } from '@/types/stocks';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
type MockEntry = YahooChartResponse | { failStatus: number };

function urlOf(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function symbolFromUrl(url: string): string {
  const m = /\/v8\/finance\/chart\/([^?]+)/.exec(url);
  return m ? decodeURIComponent(m[1]) : '';
}

/** Yahoo v8 chart 응답 mock (interval=1d&range=5d, 캔들 5개 — 마지막 종가가 현재가) */
function makeV8ChartResponse(
  symbol: string,
  { price = 1300, previousClose = 1295, chartPreviousClose = 1295 } = {},
): YahooChartResponse {
  return {
    chart: {
      result: [
        {
          meta: {
            currency: 'USD',
            symbol,
            exchangeName: 'CCY',
            fullExchangeName: 'CCY',
            regularMarketPrice: price,
            previousClose,
            chartPreviousClose,
            regularMarketTime: 1700000000,
            dataGranularity: '1d',
            range: '5d',
          },
          timestamp: [1699600000, 1699700000, 1699800000, 1699900000, 1700000000],
          indicators: {
            quote: [
              {
                open: [1290, 1291, 1293, 1296, 1295],
                high: [1295, 1296, 1299, 1301, 1305],
                low: [1288, 1289, 1290, 1292, 1290],
                close: [1292, 1294, 1298, 1296, price],
                volume: [0, 0, 0, 0, 0],
              },
            ],
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

function allSuccess(): Record<string, MockEntry> {
  return Object.fromEntries(MACRO_SYMBOLS.map((s) => [s.symbol, makeV8ChartResponse(s.symbol)]));
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/macro', () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------
  // 1. MACRO_SYMBOLS 9개 심볼 정의 검증
  // ----------------------------------------------------------
  it('MACRO_SYMBOLS에 9개 심볼이 카테고리별로 정의되어 있다', () => {
    expect(MACRO_SYMBOLS).toHaveLength(9);
    const symbols = MACRO_SYMBOLS.map((s) => s.symbol);
    expect(symbols).toEqual(
      expect.arrayContaining([
        'USDKRW=X',
        '^TNX',
        '^KS11',
        '^KQ11',
        '^IXIC',
        '^GSPC',
        '^SOX',
        'CL=F',
        'GC=F',
      ]),
    );

    const byCategory = (c: string) => MACRO_SYMBOLS.filter((s) => s.category === c).length;
    expect(byCategory('currency')).toBe(1);
    expect(byCategory('bond')).toBe(1);
    expect(byCategory('index')).toBe(5);
    expect(byCategory('commodity')).toBe(2);
  });

  // ----------------------------------------------------------
  // 2. v8 성공 → MacroData 구조 반환
  // ----------------------------------------------------------
  it('v8 API 성공 시 MacroData 구조(currency/bond/index/commodity)를 올바르게 반환한다', async () => {
    mockV8ByUrl(fetchSpy, allSuccess());

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.fetchedAt).toBeDefined();

    expect(body.data.currency).toHaveLength(1);
    expect(body.data.bond).toHaveLength(1);
    expect(body.data.index).toHaveLength(5);
    expect(body.data.commodity).toHaveLength(2);

    body.data.currency.forEach((i: { category: string }) => expect(i.category).toBe('currency'));
    body.data.bond.forEach((i: { category: string }) => expect(i.category).toBe('bond'));
    body.data.index.forEach((i: { category: string }) => expect(i.category).toBe('index'));
    body.data.commodity.forEach((i: { category: string }) => expect(i.category).toBe('commodity'));
  });

  // ----------------------------------------------------------
  // 3. MacroIndicator 필드 + 가격 계산 검증
  // ----------------------------------------------------------
  it('모든 지표가 MacroIndicator 필드를 갖고, 마지막 종가 기준으로 change/changePercent를 계산한다', async () => {
    mockV8ByUrl(fetchSpy, allSuccess());

    const res = await GET();
    const body = await res.json();

    const allIndicators = [
      ...body.data.currency,
      ...body.data.bond,
      ...body.data.index,
      ...body.data.commodity,
    ];
    expect(allIndicators).toHaveLength(MACRO_SYMBOLS.length);

    allIndicators.forEach((ind: Record<string, unknown>) => {
      expect(ind).toHaveProperty('symbol');
      expect(ind).toHaveProperty('name');
      expect(ind).toHaveProperty('displayName');
      expect(ind).toHaveProperty('price');
      expect(ind).toHaveProperty('change');
      expect(ind).toHaveProperty('changePercent');
      expect(ind).toHaveProperty('category');
    });

    const usdkrw = body.data.currency[0];
    const meta = MACRO_SYMBOLS.find((s) => s.symbol === 'USDKRW=X')!;
    expect(usdkrw).toMatchObject({
      symbol: 'USDKRW=X',
      name: meta.name,
      displayName: meta.displayName,
      price: 1300,
      change: 5,
    });
    expect(usdkrw.changePercent).toBeCloseTo((5 / 1295) * 100, 5);
  });

  it('previousClose가 0이면 chartPreviousClose로 보정한다', async () => {
    mockV8ByUrl(
      fetchSpy,
      Object.fromEntries(
        MACRO_SYMBOLS.map((s) => [
          s.symbol,
          makeV8ChartResponse(s.symbol, {
            price: 1300,
            previousClose: 0,
            chartPreviousClose: 1295,
          }),
        ]),
      ),
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.currency[0]).toMatchObject({ price: 1300, change: 5 });
  });

  // ----------------------------------------------------------
  // 4. 호출 패턴: 심볼마다 v8 chart 1회 (range=5d)
  // ----------------------------------------------------------
  it('심볼마다 v8 chart API를 한 번씩 호출한다 (총 9회, range=5d)', async () => {
    mockV8ByUrl(fetchSpy, allSuccess());

    await GET();

    expect(fetchSpy).toHaveBeenCalledTimes(MACRO_SYMBOLS.length);
    const called = fetchSpy.mock.calls.map(([input]) => symbolFromUrl(urlOf(input))).sort();
    expect(called).toEqual(
      MACRO_SYMBOLS.map((s) => s.symbol)
        .slice()
        .sort(),
    );
    fetchSpy.mock.calls.forEach(([input]) =>
      expect(urlOf(input)).toContain('interval=1d&range=5d'),
    );
  });

  // ----------------------------------------------------------
  // 5. 실패 처리
  // ----------------------------------------------------------
  it('모든 심볼 조회가 실패하면 502 에러를 반환한다', async () => {
    fetchSpy.mockResolvedValue(new Response('error', { status: 500 }));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('YAHOO_FINANCE_ERROR');
  });

  it('일부 심볼만 실패하면 성공한 지표만 반환한다', async () => {
    const responses = allSuccess();
    responses['CL=F'] = { failStatus: 500 };
    responses['GC=F'] = { failStatus: 500 };
    mockV8ByUrl(fetchSpy, responses);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.commodity).toHaveLength(0);
    expect(body.data.currency.length + body.data.bond.length + body.data.index.length).toBe(7);
  });
});
