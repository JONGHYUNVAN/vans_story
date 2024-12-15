import { API_ROUTES } from '@/constants/api';
import { tokenStorage } from '@/utils/token';
import { useTranslation } from '@/utils/i18n';

/**
 * 인증 관련 API 함수들
 */
export const authApi = {
  /**
   * 로그인
   * @param {Object} credentials - 사용자 인증 정보
   * @param {string} credentials.email - 사용자 이메일
   * @param {string} credentials.password - 사용자 비밀번호
   * @returns {Promise<Object>} 로그인 응답 데이터
   * @throws {Error} 로그인 실패 시 에러 발생
   */
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_ROUTES.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', 
    });

    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = res.headers.get('authorization');
    const accessToken = authHeader ? authHeader.split(' ')[1] : ''; // 'Bearer ' 부분 제거
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
    const res = await fetch(`${API_ROUTES.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenStorage.getToken()}`,
      },
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
    const res = await fetch(`${API_ROUTES.AUTH.REFRESH}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Token refresh failed');

    const data = await res.json();
    tokenStorage.setToken(data.accessToken);
    return data;
  },
};