import { NextResponse } from 'next/server';
import {
  REFRESH_COOKIE_NAME,
  expiredRefreshCookie,
  forwardRefreshCookies,
  pickRefreshCookie,
} from '@/lib/auth/refreshCookie';

/**
 * 로그아웃 BFF.
 * Authorization 헤더와 refreshToken 쿠키를 백엔드로 넘겨 서버 세션(Refresh Token DB 레코드)을 지우고,
 * 백엔드 결과와 무관하게 브라우저의 refreshToken 쿠키는 항상 만료시킨다.
 */
export async function POST(request: Request) {
  const token = request.headers.get('authorization');
  const refreshCookie = pickRefreshCookie(request.headers.get('cookie'));

  let response: NextResponse;
  try {
    const res = await fetch(`${process.env.AUTH_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: token }),
        ...(refreshCookie && { Cookie: refreshCookie }),
      },
    });

    response = new NextResponse(null, { status: res.ok ? 200 : res.status });
    forwardRefreshCookies(res, response);
  } catch (error) {
    console.error('로그아웃 BFF 오류:', error);
    response = new NextResponse(null, { status: 500 });
  }

  const alreadyExpired = response.headers
    .getSetCookie()
    .some((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
  if (!alreadyExpired) {
    response.headers.append('Set-Cookie', expiredRefreshCookie());
  }

  return response;
}
