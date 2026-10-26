// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { oauthUtils } from '../oauth';

beforeEach(() => {
  sessionStorage.clear();
  vi.stubEnv('NEXT_PUBLIC_OAUTH_SERVER_URL', 'https://oauth.test');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('oauthUtils state', () => {
  it('generateState → parseState 왕복', () => {
    const state = oauthUtils.generateState('google');
    expect(oauthUtils.parseState(state)).toMatchObject({ provider: 'google' });
  });

  it('매번 다른 state를 만든다', () => {
    expect(oauthUtils.generateState('kakao')).not.toBe(oauthUtils.generateState('kakao'));
  });

  it('validateState: provider가 다르면 거부', () => {
    const state = oauthUtils.generateState('kakao');
    expect(oauthUtils.validateState(state, 'kakao')).toBe(true);
    expect(oauthUtils.validateState(state, 'google')).toBe(false);
  });

  it('validateState: 1시간이 지나면 거부', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-26T00:00:00Z'));
    const state = oauthUtils.generateState('kakao');
    vi.setSystemTime(new Date('2026-10-26T01:00:01Z'));
    expect(oauthUtils.validateState(state, 'kakao')).toBe(false);
  });

  it('validateState/parseState: 깨진 문자열은 거부', () => {
    expect(oauthUtils.parseState('%%%')).toBeNull();
    expect(oauthUtils.parseState(btoa('{"provider":"naver","timestamp":1}'))).toBeNull();
    expect(oauthUtils.validateState('%%%', 'kakao')).toBe(false);
  });

  it('saveState/takeState: 한 번 꺼내면 사라진다', () => {
    oauthUtils.saveState('abc');
    expect(oauthUtils.takeState()).toBe('abc');
    expect(oauthUtils.takeState()).toBeNull();
  });
});

describe('oauthUtils.buildOAuthUrl', () => {
  it('중간 서버 로그인 URL에 frontend_url과 state를 붙인다', () => {
    const url = new URL(oauthUtils.buildOAuthUrl('kakao', 'http://localhost:3000', 'st4te'));
    expect(url.origin + url.pathname).toBe('https://oauth.test/api/auth/kakao/login');
    expect(url.searchParams.get('frontend_url')).toBe('http://localhost:3000');
    expect(url.searchParams.get('state')).toBe('st4te');
  });
});
