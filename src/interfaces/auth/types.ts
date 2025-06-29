/**
 * 사용자 정보 인터페이스
 * @interface User
 */
export interface User {
  email: string;
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
  // OAuth 관련 상태
  oauthLoading: boolean;         // OAuth 로딩 상태
  oauthProvider: OAuthProvider | null;  // 현재 OAuth 제공자
  oauthError: string | null;     // OAuth 에러 메시지
}

// OAuth 관련 타입 정의
export type OAuthProvider = 'kakao' | 'google';

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  provider: OAuthProvider;
}

export interface OAuthCallbackData {
  token?: string;           // 기존 방식 (JWT 토큰)
  code?: string;            // 새로운 방식 (임시 코드)
  error?: string;
  provider?: OAuthProvider;
  state?: string;
}

export interface OAuthState {
  oauthLoading: boolean;
  oauthProvider: OAuthProvider | null;
  oauthError: string | null;
}

// OAuth 계정 연결 정보
export interface LinkedOAuthAccount {
  provider: OAuthProvider;
  providerEmail?: string;
  createdAt: string;
}

// OAuth 계정 목록 응답
export interface LinkedOAuthAccountsResponse {
  success: boolean;
  data: {
    linkedAccounts: LinkedOAuthAccount[];
  };
  message: string;
}

// OAuth 계정 연결/해제 응답
export interface OAuthAccountResponse {
  success: boolean;
  data?: any;
  message: string;
} 