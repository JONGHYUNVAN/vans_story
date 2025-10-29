import { tokenStorage } from '@/utils/token';
import { ApiFetch } from '@/lib/apiFetch';
import { API_URLS } from '@/constants/apiUrl';
import { oauthUtils } from '@/utils/oauth';
import type { OAuthProvider, OAuthUserInfo } from '@/interfaces/auth/types';

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
      nickname: signupData.nickname
    });

    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    // 성공 시 간단한 결과 반환
    return { 
      success: true,
      email: signupData.email 
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
      email: credentials.email 
    };
  },

  /**
   * 로그아웃
   * @returns {Promise<void>} 로그아웃 처리
   * @throws {Error} 로그아웃 실패 시 에러 발생
   */
  async logout() {
    const res = await ApiFetch.postWithAuth('/api/auth/logout', {}, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Logout failed');
    tokenStorage.removeToken();
  },

  /**
   * 토큰 갱신
   * @returns {Promise<Object>} 갱신된 토큰 데이터
   * @throws {Error} 토큰 갱신 실패 시 에러 발생
   */
  async refresh() {
    const res = await ApiFetch.basicPost('/api/auth/refresh', {}, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Token refresh failed');

    const newToken = res.headers.get('authorization')?.split(' ')[1];
    tokenStorage.setToken(newToken ?? '');
    return newToken ?? '';
  },

  /**
   * Kakao OAuth 로그인 시작
   * @description OAuth 중간 서버로 리다이렉트하여 Kakao 로그인 프로세스 시작
   */
  kakaoLogin() {
    const frontendUrl = window.location.origin;
    const oauthUrl = oauthUtils.buildOAuthUrl('kakao', frontendUrl);
    
    // OAuth 중간 서버로 리다이렉트
    window.location.href = oauthUrl;
  },

  /**
   * Google OAuth 로그인 시작
   * @description OAuth 중간 서버로 리다이렉트하여 Google 로그인 프로세스 시작
   */
  googleLogin() {
    const frontendUrl = window.location.origin;
    const oauthUrl = oauthUtils.buildOAuthUrl('google', frontendUrl);
    
    // OAuth 중간 서버로 리다이렉트
    window.location.href = oauthUrl;
  },

  /**
   * 임시 코드를 JWT 토큰으로 교환
   * @param {string} code - OAuth 중간 서버에서 받은 임시 코드
   * @returns {Promise<Object>} 로그인 응답 데이터
   * @throws {Error} 토큰 교환 실패 시 에러 발생
   * @description 임시 코드를 프론트엔드 API를 통해 백엔드로 전송하여 실제 JWT 토큰으로 교환
   */
  async exchangeCodeForToken(code: string) {
    try {
      // 프론트엔드 콜백 API 호출 (내부적으로 백엔드로 요청 전달)
      const response = await ApiFetch.basicPost(API_URLS.AUTH.CALLBACK, {
        code: code
      }, {
        credentials: 'include', // 쿠키 포함 (Refresh Token)
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.token) {
        throw new Error(data.error || 'No JWT token received');
      }

      const jwtToken = data.token;

      // JWT 토큰 저장
      tokenStorage.setToken(jwtToken);

      // 토큰에서 사용자 정보 추출 (간단한 디코딩)
      try {
        const payload = JSON.parse(atob(jwtToken.split('.')[1]));
        return {
          accessToken: jwtToken,
          email: payload.email || payload.sub,
          user: {
            email: payload.email || payload.sub,
            name: payload.name || payload.email?.split('@')[0]
          }
        };
      } catch (decodeError) {
        // 토큰 디코딩 실패 시 기본 정보만 반환
        return {
          accessToken: jwtToken,
          email: 'user@example.com',
          user: {
            email: 'user@example.com',
            name: 'User'
          }
        };
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error instanceof Error ? error : new Error('Token exchange failed');
    }
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
        ...(token && { 'Authorization': `Bearer ${token}` }),
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