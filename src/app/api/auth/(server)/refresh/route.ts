import { NextResponse } from 'next/server';
import { forwardRefreshCookies, pickRefreshCookie } from '@/lib/auth/refreshCookie';

/**
 * Access Token 갱신 BFF.
 * 브라우저의 refreshToken 쿠키를 백엔드로 넘기고, 새 Access Token(헤더)과 새 Refresh 쿠키를 돌려준다.
 */
export async function POST(request: Request) {
  const refreshCookie = pickRefreshCookie(request.headers.get('cookie'));
  if (!refreshCookie) {
    // 쿠키가 없으면 백엔드를 부를 필요가 없다(백엔드는 400을 내지만 의미상 인증 없음).
    return new NextResponse(null, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.AUTH_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: refreshCookie },
    });

    const response = new NextResponse(null, { status: res.ok ? 200 : res.status });
    if (res.ok) {
      const authHeader = res.headers.get('Authorization');
      if (authHeader) {
        response.headers.set('Authorization', authHeader);
      }
    }
    // 성공 시 새 쿠키, 실패 시 백엔드가 만료 쿠키를 내려줄 수 있으므로 둘 다 전달
    forwardRefreshCookies(res, response);

    return response;
  } catch (error) {
    console.error('토큰 갱신 BFF 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}
