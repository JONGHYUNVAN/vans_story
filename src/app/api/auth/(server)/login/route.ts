import { NextResponse } from 'next/server';
import { forwardRefreshCookies } from '@/lib/auth/refreshCookie';

/**
 * 이메일·비밀번호 로그인 BFF.
 * Access Token은 Authorization 헤더로, Refresh Token은 (Path를 바꾼) HttpOnly 쿠키로 브라우저에 전달한다.
 */
export async function POST(request: Request) {
  try {
    const credentials = await request.json();

    const res = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const response = new NextResponse(null, { status: 200 });
    const authHeader = res.headers.get('Authorization');
    if (authHeader) {
      response.headers.set('Authorization', authHeader);
    }
    forwardRefreshCookies(res, response);

    return response;
  } catch (error) {
    console.error('로그인 BFF 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}
