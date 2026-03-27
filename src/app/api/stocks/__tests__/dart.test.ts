import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../dart/route';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function makeDartApiResponse(status: string, list: unknown[] = []) {
  return {
    status,
    message: status === '000' ? '정상' : '오류',
    page_no: 1,
    page_count: 5,
    total_count: list.length,
    total_page: 1,
    list,
  };
}

function makeDartItem(overrides: Record<string, string> = {}) {
  return {
    corp_code: '00126380',
    corp_name: '삼성전자',
    stock_code: '005930',
    corp_cls: 'Y',
    report_nm: '사업보고서',
    rcept_no: '20260327000001',
    flr_nm: '삼성전자',
    rcept_dt: '20260327',
    rm: '',
    ...overrides,
  };
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------
describe('GET /api/stocks/dart', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  const originalEnv = process.env.DART_API_KEY;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // 환경변수 원상 복구
    if (originalEnv === undefined) {
      delete process.env.DART_API_KEY;
    } else {
      process.env.DART_API_KEY = originalEnv;
    }
  });

  // ----------------------------------------------------------
  // 1. DART_API_KEY 미설정 → 빈 배열 반환 (graceful degradation)
  // ----------------------------------------------------------
  it('DART_API_KEY가 없으면 빈 배열을 반환한다', async () => {
    delete process.env.DART_API_KEY;

    const req = new Request('http://localhost/api/stocks/dart?symbol=005930.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.disclosures).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------
  // 2. 지원하지 않는 종목코드 → 빈 배열 반환
  // ----------------------------------------------------------
  it('지원하지 않는 종목코드는 빈 배열을 반환한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    const req = new Request('http://localhost/api/stocks/dart?symbol=999999.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.disclosures).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------
  // 3. 성공 시 DartDisclosure[] 반환
  // ----------------------------------------------------------
  it('성공 시 DartDisclosure[] 구조를 올바르게 반환한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    const items = [makeDartItem(), makeDartItem({ rcept_no: '20260327000002', report_nm: '분기보고서' })];
    const mockResponse = makeDartApiResponse('000', items);

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const req = new Request('http://localhost/api/stocks/dart?symbol=005930.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.disclosures).toHaveLength(2);

    const first = body.data.disclosures[0];
    expect(first).toMatchObject({
      corpCode: '00126380',
      corpName: '삼성전자',
      stockCode: '005930',
      reportName: '사업보고서',
      receiptNo: '20260327000001',
      filerName: '삼성전자',
      receiptDate: '20260327',
    });
    expect(first.detailUrl).toContain('20260327000001');
  });

  // ----------------------------------------------------------
  // 4. DART API 에러 응답 (HTTP 오류) → 502
  // ----------------------------------------------------------
  it('DART API가 HTTP 에러를 반환하면 502를 반환한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    fetchSpy.mockResolvedValueOnce(new Response('Forbidden', { status: 403 }));

    const req = new Request('http://localhost/api/stocks/dart?symbol=005930.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('DART_API_ERROR');
  });

  // ----------------------------------------------------------
  // 5. DART API status != '000' (예: 공시 없음 013) → 빈 배열 반환
  // ----------------------------------------------------------
  it('DART API status가 013(공시 없음)이면 빈 배열을 반환한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    const mockResponse = makeDartApiResponse('013');
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const req = new Request('http://localhost/api/stocks/dart?symbol=005930.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.disclosures).toEqual([]);
  });

  // ----------------------------------------------------------
  // 6. 최대 5개 공시만 반환
  // ----------------------------------------------------------
  it('공시가 7개여도 최대 5개만 반환한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    const items = Array.from({ length: 7 }, (_, i) =>
      makeDartItem({ rcept_no: `2026032700000${i + 1}` }),
    );
    const mockResponse = makeDartApiResponse('000', items);

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const req = new Request('http://localhost/api/stocks/dart?symbol=005930.KS');
    const res = await GET(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.disclosures).toHaveLength(5);
  });

  // ----------------------------------------------------------
  // 7. .KQ 종목 코드도 올바르게 처리
  // ----------------------------------------------------------
  it('.KQ 접미사가 있는 종목코드도 올바르게 파싱한다', async () => {
    process.env.DART_API_KEY = 'test-api-key';

    // 000660.KQ → 000660 — KR_STOCKS에 KQ 종목은 없으므로 빈 배열 반환
    const req = new Request('http://localhost/api/stocks/dart?symbol=000660.KQ');
    const res = await GET(req as never);
    const body = await res.json();

    // KR_STOCKS에 000660은 .KS로만 등록되어 있으므로 corpCode를 찾지 못해 빈 배열
    expect(res.status).toBe(200);
    expect(body.data.disclosures).toEqual([]);
  });
});
