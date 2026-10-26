import { tokenStorage } from '@/lib/auth/token';
import { decodeToken } from '@/lib/auth/decodeToken';
import { ApiFetch } from '@/lib/api/apiFetch';
import { API_URLS } from '@/constants/apiUrl';
import { oauthUtils } from '@/lib/auth/oauth';
import type { OAuthProvider } from '@/types/auth';

/**
 * 인증 관련 API 함수들
 */
export const authService = {
  /**
   * 회원가입
   * @param {Object} signupData - 회원가입 정보
   * @param {string} signupData.email - 사용자 이메일
   * @param {string} signupData.password - 사용자 비밀번호
   * @param {string} signupData.nickname - 사용자 닉네임
   * @returns {Promise<Object>} 회원가입 응답 데이터
   * @throws {Error} 회원가입 실패 시 에러 발생
   */
  async signup(signupData: { email: string; password: string; nickname: string }) {
    const res = await ApiFetch.basicPost(API_URLS.AUTH.SIGNUP, {
      name: signupData.nickname, // API 스펙에 맞게 name으로 매핑
      email: signupData.email,
      password: signupData.password,
      nickname: signupData.nickname,
    });

    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    // 성공 시 간단한 결과 반환
    return {
      success: true,
      email: signupData.email,
    };
  },

  /**
   * 로그인
   * @param {Object} credentials - 사용자 인증 정보
   * @param {string} credentials.email - 사용자 이메일
   * @param {string} credentials.password - 사용자 비밀번호
   * @returns {Promise<Object>} 로그인 응답 데이터
   * @throws {Error} 로그인 실패 시 에러 발생
   */
  async login(credentials: { email: string; password: string }) {
    const res = await ApiFetch.basicPost('/api/auth/login', credentials, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = res.headers.get('Authorization');
    const accessToken = authHeader ? authHeader.split(' ')[1] : '';
    tokenStorage.setToken(accessToken);

    return {
      accessToken,
      email: credentials.email,
    };
  },

  /**
   * 로그아웃
   * 토큰 없는 basicPost로 보낸다. postWithAuth(authFetch)를 쓰면 서버가 401을 돌려줄 때
   * refresh → logout → authFetch → … 무한 재귀가 생긴다. 서버 결과와 무관하게 로컬 토큰은 항상 지운다.
   * @throws {Error} 서버 로그아웃이 실패하면 (토큰을 지운 뒤) 던진다
   */
  async logout() {
    const token = tokenStorage.getToken();
    try {
      const res = await ApiFetch.basicPost(
        '/api/auth/logout',
        {},
        {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!res.ok) throw new Error(`Logout failed: ${res.status}`);
    } finally {
      tokenStorage.removeToken();
    }
  },

  /**
   * 토큰 갱신
   * @returns {Promise<Object>} 갱신된 토큰 데이터
   * @throws {Error} 토큰 갱신 실패 시 에러 발생
   */
  async refresh() {
    const res = await ApiFetch.basicPost(
      '/api/auth/refresh',
      {},
      {
        credentials: 'include',
      },
    );

    if (!res.ok) throw new Error('Token refresh failed');

    const newToken = res.headers.get('authorization')?.split(' ')[1];
    tokenStorage.setToken(newToken ?? '');
    return newToken ?? '';
  },

  /**
   * OAuth 로그인 시작. CSRF 방어용 state를 만들어 sessionStorage에 두고 중간 서버로 넘긴다.
   * 중간 서버는 같은 state를 `/oauth/callback?state=`로 되돌려주고, 콜백 페이지가 둘을 대조한다.
   */
  startOAuthLogin(provider: OAuthProvider) {
    const state = oauthUtils.generateState(provider);
    oauthUtils.saveState(state);
    window.location.href = oauthUtils.buildOAuthUrl(provider, window.location.origin, state);
  },

  kakaoLogin() {
    this.startOAuthLogin('kakao');
  },

  googleLogin() {
    this.startOAuthLogin('google');
  },

  /**
   * 임시 코드를 JWT 토큰으로 교환하고 저장한다.
   * 디코딩되지 않는 토큰은 로그인 실패로 처리한다(저장하지 않음). 예전에는 `user@example.com`으로 로그인시켰다.
   * @throws {Error} 교환 실패 또는 토큰이 JWT가 아닐 때
   */
  async exchangeCodeForToken(
    code: string,
  ): Promise<{ accessToken: string; email: string; name: string }> {
    const response = await ApiFetch.basicPost(
      API_URLS.AUTH.CALLBACK,
      { code },
      { credentials: 'include' }, // Refresh 쿠키를 받기 위해
    );

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    const jwtToken: unknown = data?.token;
    if (!data?.success || typeof jwtToken !== 'string') {
      throw new Error(data?.error || 'No JWT token received');
    }

    const decoded = decodeToken(jwtToken);
    if (!decoded?.email) {
      throw new Error('유효하지 않은 토큰을 받았습니다.');
    }

    tokenStorage.setToken(jwtToken);
    return { accessToken: jwtToken, email: decoded.email, name: decoded.email.split('@')[0] };
  },

  /**
   * OAuth 계정 연결 해제
   * @param {OAuthProvider} provider - OAuth 제공자 (kakao/google)
   * @returns {Promise<Object>} 해제 결과
   * @throws {Error} 해제 실패 시 에러 발생
   * @description 연결된 OAuth 계정을 해제
   */
  async unlinkOAuthAccount(provider: OAuthProvider) {
    const token = tokenStorage.getToken();

    const res = await fetch(API_URLS.OAUTH.BACKEND_UNLINK, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ provider }),
    });

    if (!res.ok) {
      throw new Error(`OAuth account unlinking failed: ${res.status}`);
    }

    return res.json();
  },

  /**
   * 연결된 OAuth 계정 목록 조회
   * @returns {Promise<Object>} 연결된 OAuth 계정 목록
   * @throws {Error} 조회 실패 시 에러 발생
   * @description 현재 사용자에게 연결된 모든 OAuth 계정을 조회
   */
  async getLinkedOAuthAccounts() {
    const res = await ApiFetch.getWithAuth(API_URLS.OAUTH.BACKEND_LINKED);

    if (!res.ok) {
      throw new Error(`Failed to fetch linked OAuth accounts: ${res.status}`);
    }

    return res.json();
  },
};
