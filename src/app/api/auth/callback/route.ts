import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { forwardRefreshCookies } from '@/lib/auth/refreshCookie';

/**
 * OAuth 임시 코드를 JWT로 교환하는 BFF.
 * 중간 서버가 준 일회용 코드를 백엔드 `/oauth/exchange`로 보내고, Access Token은 JSON body로,
 * Refresh Token은 (Path를 바꾼) HttpOnly 쿠키로 브라우저에 전달한다.
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '임시 코드가 필요합니다.' }, { status: 400 });
    }

    const exchangeResponse = await fetch(`${process.env.AUTH_API_URL}/oauth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!exchangeResponse.ok) {
      console.error(
        'OAuth 토큰 교환 실패:',
        exchangeResponse.status,
        await exchangeResponse.text(),
      );
      return NextResponse.json(
        { error: '토큰 교환에 실패했습니다.' },
        { status: exchangeResponse.status },
      );
    }

    const authHeader = exchangeResponse.headers.get('Authorization');
    const jwtToken = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

    if (!jwtToken) {
      return NextResponse.json(
        { error: '백엔드에서 JWT 토큰을 받지 못했습니다.' },
        { status: 502 },
      );
    }

    const response = NextResponse.json({ success: true, token: jwtToken });
    forwardRefreshCookies(exchangeResponse, response);

    return response;
  } catch (error) {
    console.error('OAuth callback BFF 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
