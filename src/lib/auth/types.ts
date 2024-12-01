/**
 * 사용자 정보 인터페이스
 * @interface User
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * 로그인 요청 시 필요한 인증 정보
 * @interface LoginCredentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * 인증 관련 전역 상태 인터페이스
 * @interface AuthState
 */
export interface AuthState {
  user: User | null;              // 현재 로그인한 사용자 정보
  isAuthenticated: boolean;       // 인증 여부
  isLoading: boolean;            // 로딩 상태
  error: string | null;          // 에러 메시지
} 