/**
 * 토큰 저장소 유틸리티
 * @description 
 * JWT 토큰을 로컬 스토리지에 저장하고 관리하는 유틸리티 객체입니다.
 * 이 객체는 클라이언트 환경에서만 작동하며, 
 * 서버 사이드 렌더링(SSR) 환경에서는 로컬 스토리지 접근을 방지합니다.
 */
export const tokenStorage = {
  /**
   * 토큰을 로컬 스토리지에서 가져오는 함수
   * @returns {string | null} - 저장된 토큰 또는 null
   * @description 
   * 클라이언트 환경에서만 로컬 스토리지에서 
   * 'accessToken'을 가져옵니다. 
   * 서버 사이드에서는 null을 반환합니다.
   */
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
  
  /**
   * 토큰을 로컬 스토리지에 저장하는 함수
   * @param {string} token - 저장할 JWT 토큰
   * @returns {void}
   * @description 
   * 클라이언트 환경에서만 로컬 스토리지에 
   * 'accessToken'을 저장합니다. 
   * 서버 사이드에서는 아무 작업도 수행하지 않습니다.
   */
  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  },
  
  /**
   * 로컬 스토리지에서 토큰을 제거하는 함수
   * @returns {void}
   * @description 
   * 클라이언트 환경에서만 로컬 스토리지에서 
   * 'accessToken'을 제거합니다. 
   * 서버 사이드에서는 아무 작업도 수행하지 않습니다.
   */
  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  }
};