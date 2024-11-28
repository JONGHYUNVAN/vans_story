import { LoginCredentials } from './types';
import { API_ROUTES } from '@/constants/api';

/**
 * 인증 관련 API 호출을 담당하는 서비스
 * @namespace authService
 */
export const authService = {
  /**
   * 사용자 로그인 처리
   * @async
   * @param {LoginCredentials} credentials - 이메일과 비밀번호
   * @returns {Promise<{user: User, token: string}>} 사용자 정보와 토큰
   * @throws {Error} 로그인 실패 시 에러
   */
  async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // 쿠키 포함
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * 로그아웃 처리
   * @async
   * @returns {Promise<void>}
   */
  async logout() {
    // 로그아웃 로직 구현
  },

  /**
   * 토큰 갱신
   * @async
   * @returns {Promise<{token: string}>} 새로운 액세스 토큰
   */
  async refreshToken() {
    // 토큰 갱신 로직 구현
  }
}; 