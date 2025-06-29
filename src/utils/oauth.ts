import type { OAuthProvider, OAuthCallbackData } from '@/interfaces/auth/types';

/**
 * OAuth 관련 유틸리티 함수들
 */
export const oauthUtils = {
  /**
   * OAuth 상태 파라미터 생성
   * @param {OAuthProvider} provider - OAuth 제공자
   * @returns {string} Base64 인코딩된 상태 문자열
   */
  generateState(provider: OAuthProvider): string {
    const state = {
      provider,
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(2, 15)
    };
    return btoa(JSON.stringify(state));
  },

  /**
   * OAuth 상태 파라미터 검증
   * @param {string} state - 검증할 상태 문자열
   * @param {OAuthProvider} expectedProvider - 예상 제공자
   * @returns {boolean} 검증 결과
   */
  validateState(state: string, expectedProvider: OAuthProvider): boolean {
    try {
      const decoded = JSON.parse(atob(state));
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1시간

      return (
        decoded.provider === expectedProvider &&
        decoded.timestamp &&
        (now - decoded.timestamp) < maxAge
      );
    } catch (error) {
      console.error('State validation error:', error);
      return false;
    }
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
      google: '구글'
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
      'access_denied': `${providerName} 로그인이 취소되었습니다.`,
      'invalid_request': '잘못된 요청입니다. 다시 시도해주세요.',
      'invalid_client': '클라이언트 설정 오류입니다. 관리자에게 문의하세요.',
      'invalid_grant': '인증 코드가 유효하지 않습니다.',
      'expired_token': '토큰이 만료되었습니다. 다시 로그인해주세요.',
      'server_error': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      'temporarily_unavailable': `${providerName} 서비스가 일시적으로 사용할 수 없습니다.`,
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
  buildOAuthUrl(provider: OAuthProvider, frontendUrl: string): string {
    const oauthServerUrl = process.env.NEXT_PUBLIC_OAUTH_SERVER_URL || 'http://localhost:3004';
    const endpoint = provider === 'kakao' ? '/api/auth/kakao/login' : '/api/auth/google/login';
    
    return `${oauthServerUrl}${endpoint}?frontend_url=${encodeURIComponent(frontendUrl)}`;
  }
}; 