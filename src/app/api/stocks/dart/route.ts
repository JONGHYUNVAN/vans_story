import { NextRequest, NextResponse } from 'next/server';
import type { DartDisclosure, DartData, DartApiResponse, StocksApiResponse } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';

// KR_STOCKS 상수에서 dartCorpCode 매핑 추출
const CORP_CODE_MAP: Record<string, string> = Object.fromEntries(
  KR_STOCKS.filter((s) => 'dartCorpCode' in s).map((s) => [
    (s as typeof KR_STOCKS[0]).stockCode,
    (s as typeof KR_STOCKS[0]).dartCorpCode,
  ]),
);

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export async function GET(request: NextRequest): Promise<NextResponse<StocksApiResponse<DartData>>> {
  const { searchParams } = new URL(request.url);
  const symbolParam = searchParams.get('symbol') ?? '';

  // symbol에서 종목코드 추출 (005930.KS → 005930)
  const stockCode = symbolParam.replace(/\.(KS|KQ)$/i, '');
  const corpCode = CORP_CODE_MAP[stockCode];
  const apiKey = process.env.DART_API_KEY;

  // API 키 또는 종목 코드가 없으면 빈 배열 반환 (graceful degradation)
  if (!apiKey || !corpCode) {
    return NextResponse.json({
      success: true,
      data: { disclosures: [], fetchedAt: new Date().toISOString() },
    });
  }

  try {
    const today = new Date();
    const bgn = new Date(today);
    bgn.setDate(bgn.getDate() - 30);

    const url =
      `https://opendart.fss.or.kr/api/list.json` +
      `?crtfc_key=${apiKey}` +
      `&corp_code=${corpCode}` +
      `&bgn_de=${formatDate(bgn)}` +
      `&end_de=${formatDate(today)}` +
      `&page_count=5`;

    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: { message: `DART API 응답 오류: ${res.status}`, code: 'DART_API_ERROR' },
        },
        { status: 502 },
      );
    }

    const json: DartApiResponse = await res.json();

    // DART API 상태 코드 확인 (000 = 정상)
    if (json.status !== '000') {
      // 공시 없음(013)은 정상 케이스 — 빈 배열 반환
      return NextResponse.json({
        success: true,
        data: { disclosures: [], fetchedAt: new Date().toISOString() },
      });
    }

    const disclosures: DartDisclosure[] = (json.list ?? []).slice(0, 5).map((item) => ({
      corpCode: item.corp_code,
      corpName: item.corp_name,
      stockCode: item.stock_code,
      reportName: item.report_nm,
      receiptNo: item.rcept_no,
      filerName: item.flr_nm,
      receiptDate: item.rcept_dt,
      remark: item.rm,
      detailUrl: `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${item.rcept_no}`,
    }));

    return NextResponse.json({
      success: true,
      data: { disclosures, fetchedAt: new Date().toISOString() },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'DART 공시 조회 중 오류 발생',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
