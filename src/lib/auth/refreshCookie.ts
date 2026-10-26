/**
 * Refresh Token 쿠키를 백엔드(Spring) ↔ 브라우저 사이에서 중계하는 헬퍼.
 *
 * 백엔드는 쿠키를 `Path=/api/v1/auth/refresh`(백엔드 경로)로 내려주지만, 브라우저가 실제로 요청하는 곳은
 * 이 앱의 BFF 라우트(`/api/auth/refresh`, `/api/auth/logout`)다. Path를 바꾸지 않으면 브라우저가 쿠키를
 * 저장은 해도 BFF 요청에는 붙이지 않는다. 그래서 전달할 때 Path만 `/api/auth`로 바꾼다.
 * (서버 사이드 fetch의 `credentials: 'include'`는 아무 효과가 없으므로 Cookie 헤더도 직접 복사해야 한다.)
 */

export const REFRESH_COOKIE_NAME = 'refreshToken';

/** 브라우저에 저장되는 Refresh 쿠키의 Path. refresh·logout BFF 라우트가 모두 이 아래에 있다. */
export const FRONTEND_REFRESH_COOKIE_PATH = '/api/auth';

function isRefreshCookie(setCookie: string): boolean {
  return setCookie.trimStart().startsWith(`${REFRESH_COOKIE_NAME}=`);
}

/**
 * 백엔드 Set-Cookie 한 줄의 Path 속성을 프론트 경로로 바꾼다. Path가 없으면 추가한다.
 */
export function rewriteRefreshCookiePath(setCookie: string): string {
  const parts = setCookie.split(';').map((p) => p.trim());
  const withoutPath = parts.filter((p) => !/^path=/i.test(p));
  return [...withoutPath, `Path=${FRONTEND_REFRESH_COOKIE_PATH}`].join('; ');
}

/**
 * 백엔드 응답의 refreshToken Set-Cookie를 (Path를 바꿔) 프론트 응답에 전부 붙인다.
 * refreshToken이 아닌 쿠키는 브라우저로 흘리지 않는다.
 */
export function forwardRefreshCookies(from: Response, to: Response): void {
  for (const cookie of from.headers.getSetCookie()) {
    if (isRefreshCookie(cookie)) {
      to.headers.append('Set-Cookie', rewriteRefreshCookiePath(cookie));
    }
  }
}

/**
 * 브라우저가 보낸 Cookie 헤더에서 refreshToken 쿠키만 골라 `refreshToken=값` 형태로 돌려준다.
 * 다른 쿠키는 백엔드로 넘기지 않는다.
 */
export function pickRefreshCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    if (
      trimmed.startsWith(`${REFRESH_COOKIE_NAME}=`) &&
      trimmed.length > REFRESH_COOKIE_NAME.length + 1
    ) {
      return trimmed;
    }
  }
  return null;
}

/**
 * 브라우저의 refreshToken 쿠키를 지우는 Set-Cookie. 백엔드 로그아웃이 실패해도 클라이언트 세션은 끝내야 하므로
 * 로그아웃 라우트는 항상 이 쿠키를 내려준다.
 */
export function expiredRefreshCookie(): string {
  return `${REFRESH_COOKIE_NAME}=; Max-Age=0; Secure; HttpOnly; SameSite=Strict; Path=${FRONTEND_REFRESH_COOKIE_PATH}`;
}
