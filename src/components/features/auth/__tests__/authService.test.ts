// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../authService';
import { tokenStorage } from '@/lib/auth/token';
import { ApiFetch } from '@/lib/api/apiFetch';

function jwtWith(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) => btoa(JSON.stringify(o));
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}

function jsonResponse(status: number, body: unknown = {}, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

let fetchSpy: ReturnType<typeof vi.spyOn>;

/** Node 26은 globalThis.localStorage를 직접 정의해(설정 없이는 undefined) jsdom 것이 가려지므로 메모리 스토리지로 대체 */
function memoryStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'> {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('authService.logout', () => {
  it('토큰을 Authorization으로 보내고 로컬 토큰을 지운다', async () => {
    tokenStorage.setToken('access.jwt');
    fetchSpy.mockResolvedValue(jsonResponse(200));

    await authService.logout();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/auth/logout');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer access.jwt');
    expect(tokenStorage.getToken()).toBeNull();
  });

  it('서버가 401을 내도 refresh/logout 재귀 없이 한 번만 요청하고 로컬 토큰은 지운다', async () => {
    tokenStorage.setToken('access.jwt');
    fetchSpy.mockResolvedValue(jsonResponse(401));

    await expect(authService.logout()).rejects.toThrow('Logout failed: 401');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(tokenStorage.getToken()).toBeNull();
  });
});

describe('ApiFetch.authFetch 401 처리', () => {
  it('refresh 실패 시 logout을 한 번만 부르고 세션 만료 에러를 던진다(무한 재귀 없음)', async () => {
    tokenStorage.setToken('expired.jwt');
    fetchSpy
      .mockResolvedValueOnce(jsonResponse(401)) // 원래 요청
      .mockResolvedValueOnce(jsonResponse(401)) // /api/auth/refresh
      .mockResolvedValueOnce(jsonResponse(401)); // /api/auth/logout (서버도 실패)

    await expect(ApiFetch.getWithAuth('/api/posts/1/edit')).rejects.toThrow('Token refresh failed');

    const urls = fetchSpy.mock.calls.map((call: unknown[]) => call[0]);
    expect(urls).toEqual(['/api/posts/1/edit', '/api/auth/refresh', '/api/auth/logout']);
    expect(tokenStorage.getToken()).toBeNull();
  });

  it('refresh 성공 시 새 토큰으로 한 번 재시도한다', async () => {
    tokenStorage.setToken('expired.jwt');
    fetchSpy
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(jsonResponse(200, {}, { authorization: 'Bearer fresh.jwt' }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const res = await ApiFetch.getWithAuth('/api/posts/1/edit');

    expect(res.status).toBe(200);
    expect(tokenStorage.getToken()).toBe('fresh.jwt');
    const [, retryInit] = fetchSpy.mock.calls[2] as [string, RequestInit];
    expect((retryInit.headers as Record<string, string>).Authorization).toBe('Bearer fresh.jwt');
  });
});

describe('authService.exchangeCodeForToken', () => {
  it('JWT를 저장하고 sub를 이메일로 돌려준다', async () => {
    const token = jwtWith({ sub: 'van@vansdevblog.online', auth: 'ROLE_USER' });
    fetchSpy.mockResolvedValue(jsonResponse(200, { success: true, token }));

    const result = await authService.exchangeCodeForToken('tmp-code');

    expect(result).toEqual({
      accessToken: token,
      email: 'van@vansdevblog.online',
      name: 'van',
    });
    expect(tokenStorage.getToken()).toBe(token);
  });

  it('JWT가 아닌 토큰은 로그인 실패로 처리하고 저장하지 않는다', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, { success: true, token: 'not.a.jwt' }));

    await expect(authService.exchangeCodeForToken('tmp-code')).rejects.toThrow(
      '유효하지 않은 토큰을 받았습니다.',
    );
    expect(tokenStorage.getToken()).toBeNull();
  });

  it('교환 실패(4xx)는 에러로 던진다', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(401, { error: 'expired' }));

    await expect(authService.exchangeCodeForToken('old')).rejects.toThrow(
      'Token exchange failed: 401',
    );
    expect(tokenStorage.getToken()).toBeNull();
  });
});
