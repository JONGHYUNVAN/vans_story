import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isValidKrxCode } from '@/lib/stocks/validateSymbol';

/** 요청 시점에 읽는다(모듈 로드 시 고정하면 테스트·런타임 설정 변경이 반영되지 않는다) */
const djangoApiUrl = () => process.env.DJANGO_API_URL || 'http://localhost:8001';

/** KIS 현재가 스냅샷 프록시. 심볼은 KRX 6자리 코드만 허용한다(경로 주입 방지). 내부 URL은 응답에 넣지 않는다. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;
  if (!isValidKrxCode(symbol)) {
    return NextResponse.json(
      {
        success: false,
        error: { message: '종목코드는 숫자 6자리여야 합니다.', code: 'INVALID_SYMBOL' },
      },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${djangoApiUrl()}/api/kis/snapshot/${symbol}/`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[kis/snapshot] 업스트림 호출 실패:', error);
    return NextResponse.json(
      { success: false, error: { message: 'KIS 스냅샷 조회 실패', code: 'PROXY_ERROR' } },
      { status: 502 },
    );
  }
}
