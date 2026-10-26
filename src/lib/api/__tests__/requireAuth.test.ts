import { describe, it, expect, vi, afterEach } from 'vitest';
import { getBearerToken, unauthorizedResponse } from '../requireAuth';

function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}

function req(authorization?: string): Request {
  return new Request('http://localhost/api/x', {
    headers: authorization ? { authorization } : {},
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('getBearerToken', () => {
  it('유효한 Bearer JWT는 토큰을 돌려준다', () => {
    const token = jwt({ sub: 'a@b.c', exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(getBearerToken(req(`Bearer ${token}`))).toBe(token);
  });

  it('헤더가 없거나 Bearer가 아니면 null', () => {
    expect(getBearerToken(req())).toBeNull();
    expect(getBearerToken(req('Basic abc'))).toBeNull();
    expect(getBearerToken(req('Bearer '))).toBeNull();
  });

  it('JWT 형식이 아니면 null', () => {
    expect(getBearerToken(req('Bearer not.a.jwt'))).toBeNull();
    expect(getBearerToken(req('Bearer onlyone'))).toBeNull();
    expect(getBearerToken(req('Bearer a..c'))).toBeNull();
  });

  it('exp가 지난 토큰은 null', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-26T12:00:00Z'));
    const expired = jwt({ sub: 'a', exp: Math.floor(Date.now() / 1000) - 1 });
    expect(getBearerToken(req(`Bearer ${expired}`))).toBeNull();
  });

  it('exp가 없는 토큰은 통과시킨다(만료 판단은 백엔드 몫)', () => {
    const token = jwt({ sub: 'a' });
    expect(getBearerToken(req(`Bearer ${token}`))).toBe(token);
  });
});

describe('unauthorizedResponse', () => {
  it('401과 UNAUTHORIZED 코드를 돌려준다', async () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: { message: '로그인이 필요합니다.', code: 'UNAUTHORIZED' },
    });
  });
});
