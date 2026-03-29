import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;

  const targetUrl = `${DJANGO_API_URL}/api/kis/snapshot/${symbol}/`;
  console.log(`[kis/snapshot] ▶ 요청 심볼: ${symbol}`);
  console.log(`[kis/snapshot] ▶ 업스트림 URL: ${targetUrl}`);
  console.log(`[kis/snapshot] ▶ DJANGO_API_URL 환경변수: ${process.env.DJANGO_API_URL ?? '(미설정 → 기본값 http://localhost:8001)'}`);

  try {
    console.log(`[kis/snapshot] ▶ fetch 시작...`);
    const res = await fetch(targetUrl, { cache: 'no-store' });
    console.log(`[kis/snapshot] ✔ 응답: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[kis/snapshot] ✖ fetch 실패: ${msg}`);
    console.error(`[kis/snapshot] ✖ 실패한 URL: ${targetUrl}`);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'KIS 스냅샷 조회 실패',
          code: 'PROXY_ERROR',
          details: msg,
          url: targetUrl,
        },
      },
      { status: 502 },
    );
  }
}
