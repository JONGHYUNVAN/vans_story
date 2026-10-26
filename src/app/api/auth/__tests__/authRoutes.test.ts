import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST as login } from '../(server)/login/route';
import { POST as refresh } from '../(server)/refresh/route';
import { POST as logout } from '../(server)/logout/route';
import { POST as callback } from '../callback/route';
import { NextRequest } from 'next/server';

const SPRING_COOKIE =
  'refreshToken=RT-new; Path=/api/v1/auth/refresh; Max-Age=604800; Secure; HttpOnly; SameSite=Strict';
const SPRING_EXPIRED =
  'refreshToken=; Path=/api/v1/auth/refresh; Max-Age=0; Secure; HttpOnly; SameSite=Strict';

/** Spring 응답 흉내: Authorization 헤더 + Set-Cookie */
function springResponse(status: number, opts: { auth?: string; cookies?: string[] } = {}) {
  const res = new Response(JSON.stringify({ success: status < 400 }), { status });
  if (opts.auth) res.headers.set('Authorization', opts.auth);
  for (const c of opts.cookies ?? []) res.headers.append('Set-Cookie', c);
  return res;
}

function post(url: string, init: ConstructorParameters<typeof NextRequest>[1] = {}) {
  return new NextRequest(`http://localhost:3000${url}`, { method: 'POST', ...init });
}

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv('AUTH_API_URL', 'http://backend.test/api/v1');
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/auth/login', () => {
  it('Authorization 헤더와 Path를 바꾼 refreshToken 쿠키를 브라우저로 전달한다', async () => {
    fetchSpy.mockResolvedValue(
      springResponse(200, { auth: 'Bearer access.jwt', cookies: [SPRING_COOKIE] }),
    );

    const res = await login(
      post('/api/auth/login', {
        body: JSON.stringify({ email: 'a@b.c', password: 'x' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('Authorization')).toBe('Bearer access.jwt');
    const cookies = res.headers.getSetCookie();
    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toContain('refreshToken=RT-new');
    expect(cookies[0]).toContain('Path=/api/auth');
    expect(cookies[0]).not.toContain('/api/v1');
    expect(cookies[0]).toContain('HttpOnly');

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://backend.test/api/v1/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('백엔드 실패 상태 코드를 그대로 돌려주고 쿠키는 내려주지 않는다', async () => {
    fetchSpy.mockResolvedValue(springResponse(401));

    const res = await login(post('/api/auth/login', { body: '{}' }));

    expect(res.status).toBe(401);
    expect(res.headers.getSetCookie()).toHaveLength(0);
  });
});

describe('POST /api/auth/refresh', () => {
  it('브라우저 쿠키 중 refreshToken만 백엔드 Cookie 헤더로 넘기고 새 토큰·쿠키를 돌려준다', async () => {
    fetchSpy.mockResolvedValue(
      springResponse(200, { auth: 'Bearer new.jwt', cookies: [SPRING_COOKIE] }),
    );

    const res = await refresh(
      post('/api/auth/refresh', { headers: { cookie: 'theme=dark; refreshToken=RT-old' } }),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('Authorization')).toBe('Bearer new.jwt');
    expect(res.headers.getSetCookie()[0]).toContain('Path=/api/auth');

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Cookie).toBe('refreshToken=RT-old');
  });

  it('refreshToken 쿠키가 없으면 백엔드를 부르지 않고 401', async () => {
    const res = await refresh(post('/api/auth/refresh'));

    expect(res.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('백엔드가 거부하면 그 상태 코드를 돌려준다', async () => {
    fetchSpy.mockResolvedValue(springResponse(401));

    const res = await refresh(
      post('/api/auth/refresh', { headers: { cookie: 'refreshToken=bad' } }),
    );

    expect(res.status).toBe(401);
    expect(res.headers.get('Authorization')).toBeNull();
  });
});

describe('POST /api/auth/logout', () => {
  it('Authorization과 refreshToken 쿠키를 백엔드로 넘기고 만료 쿠키를 돌려준다', async () => {
    fetchSpy.mockResolvedValue(springResponse(200, { cookies: [SPRING_EXPIRED] }));

    const res = await logout(
      post('/api/auth/logout', {
        headers: { authorization: 'Bearer access.jwt', cookie: 'refreshToken=RT-old' },
      }),
    );

    expect(res.status).toBe(200);
    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toEqual({
      Authorization: 'Bearer access.jwt',
      Cookie: 'refreshToken=RT-old',
    });

    const cookies = res.headers.getSetCookie();
    expect(cookies).toHaveLength(1);
    expect(cookies[0]).toMatch(/^refreshToken=;/);
    expect(cookies[0]).toContain('Max-Age=0');
    expect(cookies[0]).toContain('Path=/api/auth');
  });

  it('백엔드가 실패해도 브라우저 쿠키는 만료시킨다', async () => {
    fetchSpy.mockResolvedValue(springResponse(500));

    const res = await logout(post('/api/auth/logout'));

    expect(res.status).toBe(500);
    expect(res.headers.getSetCookie()[0]).toMatch(/^refreshToken=;.*Max-Age=0/);
  });

  it('백엔드에 연결할 수 없어도 브라우저 쿠키는 만료시킨다', async () => {
    fetchSpy.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await logout(post('/api/auth/logout'));

    expect(res.status).toBe(500);
    expect(res.headers.getSetCookie()[0]).toMatch(/^refreshToken=;.*Max-Age=0/);
  });
});

describe('POST /api/auth/callback (OAuth 교환)', () => {
  it('code가 없으면 400', async () => {
    const res = await callback(post('/api/auth/callback', { body: '{}' }));

    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('JWT를 body로, refreshToken 쿠키는 Path를 바꿔 전달한다', async () => {
    fetchSpy.mockResolvedValue(
      springResponse(200, { auth: 'Bearer oauth.jwt', cookies: [SPRING_COOKIE] }),
    );

    const res = await callback(
      post('/api/auth/callback', { body: JSON.stringify({ code: 'tmp' }) }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, token: 'oauth.jwt' });
    expect(res.headers.getSetCookie()[0]).toContain('Path=/api/auth');

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://backend.test/api/v1/oauth/exchange');
    expect(init.body).toBe(JSON.stringify({ code: 'tmp' }));
  });

  it('백엔드가 토큰을 안 주면 502', async () => {
    fetchSpy.mockResolvedValue(springResponse(200));

    const res = await callback(
      post('/api/auth/callback', { body: JSON.stringify({ code: 'tmp' }) }),
    );

    expect(res.status).toBe(502);
  });
});
