/**
 * 토큰 관리 유틸리티
 */
export const tokenStorage = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
  
  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  },
  
  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  }
}; 