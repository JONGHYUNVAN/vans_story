import type { OAuthProvider, OAuthCallbackData } from '@/types/auth';

/** 로그인 시작 시 만든 state를 콜백까지 들고 있는 sessionStorage 키 */
const STATE_STORAGE_KEY = 'oauth_state';
const STATE_MAX_AGE_MS = 60 * 60 * 1000; // 1시간

function randomToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * OAuth 관련 유틸리티 함수들
 */
export const oauthUtils = {
  /**
   * OAuth 상태 파라미터 생성 (provider + 생성 시각 + 난수, base64)
   */
  generateState(provider: OAuthProvider): string {
    const state = { provider, timestamp: Date.now(), random: randomToken() };
    return btoa(JSON.stringify(state));
  },

  /**
   * state를 디코딩한다. 형식이 맞지 않으면 null.
   */
  parseState(state: string): { provider: OAuthProvider; timestamp: number } | null {
    try {
      const decoded = JSON.parse(atob(state));
      if (
        (decoded.provider === 'kakao' || decoded.provider === 'google') &&
        typeof decoded.timestamp === 'number'
      ) {
        return { provider: decoded.provider, timestamp: decoded.timestamp };
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * state가 기대한 provider의 것이고 아직 만료되지 않았는지 검증
   */
  validateState(state: string, expectedProvider: OAuthProvider): boolean {
    const parsed = this.parseState(state);
    return (
      parsed !== null &&
      parsed.provider === expectedProvider &&
      Date.now() - parsed.timestamp < STATE_MAX_AGE_MS
    );
  },

  /** 로그인 시작 시 state를 이 브라우저 탭 세션에 보관 */
  saveState(state: string): void {
    sessionStorage.setItem(STATE_STORAGE_KEY, state);
  },

  /** 보관된 state를 꺼내고 지운다(일회용). 없으면 null */
  takeState(): string | null {
    const state = sessionStorage.getItem(STATE_STORAGE_KEY);
    sessionStorage.removeItem(STATE_STORAGE_KEY);
    return state;
  },

  /**
   * URL 파라미터에서 OAuth 콜백 데이터 추출 (Query Parameter 방식)
   * @param {URLSearchParams} searchParams - URL 검색 파라미터
   * @returns {OAuthCallbackData} 콜백 데이터
   */
  extractCallbackData(searchParams: URLSearchParams): OAuthCallbackData {
    return {
      token: searchParams.get('token') || undefined,
      code: searchParams.get('code') || undefined,
      error: searchParams.get('error') || undefined,
      provider: (searchParams.get('provider') as OAuthProvider) || undefined,
      state: searchParams.get('state') || undefined,
    };
  },

  /**
   * URL Fragment에서 OAuth 콜백 데이터 추출 (Fragment 방식)
   * @param {string} hash - window.location.hash 값
   * @returns {OAuthCallbackData} 콜백 데이터
   * @description Fragment 방식으로 전달된 OAuth 토큰을 파싱
   * @example
   * // URL: https://app.com/oauth/callback#access_token=abc123&token_type=Bearer&provider=google
   * const data = extractCallbackDataFromFragment(window.location.hash);
   */
  extractCallbackDataFromFragment(hash: string): OAuthCallbackData {
    // # 제거
    const fragment = hash.startsWith('#') ? hash.substring(1) : hash;

    if (!fragment) {
      return {};
    }

    // Fragment를 URLSearchParams로 파싱
    const params = new URLSearchParams(fragment);

    return {
      token: params.get('access_token') || undefined,
      code: params.get('code') || undefined,
      error: params.get('error') || undefined,
      provider: (params.get('provider') as OAuthProvider) || undefined,
      state: params.get('state') || undefined,
    };
  },

  /**
   * OAuth 콜백 데이터 추출 (Query Parameter + Fragment 방식 통합)
   * @param {URLSearchParams} searchParams - URL 검색 파라미터
   * @param {string} hash - window.location.hash 값
   * @returns {OAuthCallbackData} 콜백 데이터
   * @description Query Parameter 방식을 우선으로 하고, Fragment 방식도 지원
   */
  extractCallbackDataUnified(searchParams: URLSearchParams, hash: string): OAuthCallbackData {
    // 1. Query Parameter 방식 먼저 확인
    const queryData = this.extractCallbackData(searchParams);

    // 2. Query Parameter에 토큰이나 코드가 없으면 Fragment 방식 확인
    if (!queryData.token && !queryData.code && !queryData.error && hash) {
      const fragmentData = this.extractCallbackDataFromFragment(hash);
      return fragmentData;
    }

    return queryData;
  },

  /**
   * OAuth 제공자 표시명 반환
   * @param {OAuthProvider} provider - OAuth 제공자
   * @returns {string} 표시명
   */
  getProviderDisplayName(provider: OAuthProvider): string {
    const displayNames = {
      kakao: '카카오',
      google: '구글',
    };
    return displayNames[provider] || provider;
  },

  /**
   * OAuth 에러 메시지 생성
   * @param {string} error - 에러 코드
   * @param {OAuthProvider} provider - OAuth 제공자
   * @returns {string} 사용자 친화적 에러 메시지
   */
  getErrorMessage(error: string, provider: OAuthProvider): string {
    const providerName = this.getProviderDisplayName(provider);

    const errorMessages: Record<string, string> = {
      access_denied: `${providerName} 로그인이 취소되었습니다.`,
      invalid_request: '잘못된 요청입니다. 다시 시도해주세요.',
      invalid_client: '클라이언트 설정 오류입니다. 관리자에게 문의하세요.',
      invalid_grant: '인증 코드가 유효하지 않습니다.',
      expired_token: '토큰이 만료되었습니다. 다시 로그인해주세요.',
      server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      temporarily_unavailable: `${providerName} 서비스가 일시적으로 사용할 수 없습니다.`,
    };

    return errorMessages[error] || `${providerName} 로그인 중 오류가 발생했습니다: ${error}`;
  },

  /**
   * 리다이렉트 URL 생성
   * @param {string} baseUrl - 기본 URL
   * @param {OAuthCallbackData} data - 콜백 데이터
   * @returns {string} 완성된 리다이렉트 URL
   */
  buildRedirectUrl(baseUrl: string, data: OAuthCallbackData): string {
    const url = new URL(baseUrl);

    if (data.token) url.searchParams.set('token', data.token);
    if (data.error) url.searchParams.set('error', data.error);
    if (data.provider) url.searchParams.set('provider', data.provider);
    if (data.state) url.searchParams.set('state', data.state);

    return url.toString();
  },

  /**
   * Fragment 방식 리다이렉트 URL 생성
   * @param {string} baseUrl - 기본 URL
   * @param {OAuthCallbackData} data - 콜백 데이터
   * @returns {string} Fragment 방식 리다이렉트 URL
   */
  buildFragmentRedirectUrl(baseUrl: string, data: OAuthCallbackData): string {
    const url = new URL(baseUrl);
    const fragment = new URLSearchParams();

    if (data.token) fragment.set('access_token', data.token);
    if (data.error) fragment.set('error', data.error);
    if (data.provider) fragment.set('provider', data.provider);
    if (data.state) fragment.set('state', data.state);

    return `${url.toString()}#${fragment.toString()}`;
  },

  /**
   * OAuth 중간 서버 URL 생성
   * @param {OAuthProvider} provider - OAuth 제공자
   * @param {string} frontendUrl - 프론트엔드 URL
   * @returns {string} OAuth 중간 서버 URL
   */
  buildOAuthUrl(provider: OAuthProvider, frontendUrl: string, state: string): string {
    const oauthServerUrl = process.env.NEXT_PUBLIC_OAUTH_SERVER_URL;
    const endpoint = provider === 'kakao' ? '/api/auth/kakao/login' : '/api/auth/google/login';
    const params = new URLSearchParams({ frontend_url: frontendUrl, state });

    return `${oauthServerUrl}${endpoint}?${params.toString()}`;
  },
};
