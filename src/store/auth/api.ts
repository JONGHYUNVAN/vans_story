import { API_ROUTES } from '@/constants/api';
import { tokenStorage } from '@/utils/token';

/**
 * 인증 관련 API 함수들
 */
export const authApi = {
  /**
   * 로그인
   */
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_ROUTES.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    tokenStorage.setToken(data.accessToken);
    return data;
  },

  /**
   * 로그아웃
   */
  async logout() {
    const res = await fetch(`${API_ROUTES.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenStorage.getToken()}`,
      },
    });

    if (!res.ok) throw new Error('Logout failed');
    tokenStorage.removeToken();
  },

  /**
   * 토큰 갱신
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