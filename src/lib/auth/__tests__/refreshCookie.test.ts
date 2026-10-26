import { describe, it, expect } from 'vitest';
import {
  expiredRefreshCookie,
  forwardRefreshCookies,
  pickRefreshCookie,
  rewriteRefreshCookiePath,
} from '../refreshCookie';

const SPRING_COOKIE =
  'refreshToken=RT1; Path=/api/v1/auth/refresh; Max-Age=604800; Secure; HttpOnly; SameSite=Strict';

describe('rewriteRefreshCookiePath', () => {
  it('백엔드 Path(/api/v1/auth/refresh)를 프론트 BFF 경로(/api/auth)로 바꾸고 나머지 속성은 유지한다', () => {
    const out = rewriteRefreshCookiePath(SPRING_COOKIE);
    expect(out).toContain('refreshToken=RT1');
    expect(out).toContain('Path=/api/auth');
    expect(out).not.toContain('/api/v1');
    expect(out).toContain('Max-Age=604800');
    expect(out).toContain('HttpOnly');
    expect(out).toContain('SameSite=Strict');
  });

  it('Path가 없는 쿠키에는 Path를 추가한다', () => {
    expect(rewriteRefreshCookiePath('refreshToken=x; HttpOnly')).toBe(
      'refreshToken=x; HttpOnly; Path=/api/auth',
    );
  });
});

describe('forwardRefreshCookies', () => {
  it('refreshToken 쿠키만 전달하고 다른 쿠키는 버린다', () => {
    const from = new Response(null, { status: 200 });
    from.headers.append('Set-Cookie', SPRING_COOKIE);
    from.headers.append('Set-Cookie', 'JSESSIONID=abc; Path=/');
    const to = new Response(null);

    forwardRefreshCookies(from, to);

    const cookies = to.headers.getSetCookie();
    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toMatch(/^refreshToken=RT1;.*Path=\/api\/auth$/);
  });
});

describe('pickRefreshCookie', () => {
  it('브라우저 Cookie 헤더에서 refreshToken만 골라낸다', () => {
    expect(pickRefreshCookie('theme=dark; refreshToken=RT1; other=1')).toBe('refreshToken=RT1');
  });

  it('없거나 값이 비어 있으면 null', () => {
    expect(pickRefreshCookie(null)).toBeNull();
    expect(pickRefreshCookie('theme=dark')).toBeNull();
    expect(pickRefreshCookie('refreshToken=')).toBeNull();
  });
});

describe('expiredRefreshCookie', () => {
  it('같은 Path로 Max-Age=0 쿠키를 만든다', () => {
    const c = expiredRefreshCookie();
    expect(c).toMatch(/^refreshToken=;/);
    expect(c).toContain('Max-Age=0');
    expect(c).toContain('Path=/api/auth');
  });
});
