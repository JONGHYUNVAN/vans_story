import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '@/lib/auth/types';

/**
 * 인증 상태 초기값
 * @constant
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * 인증 관련 Redux Slice
 * 상태 관리와 액션 생성을 담당
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 사용자 정보 설정
     * @param {AuthState} state - 현재 상태
     * @param {PayloadAction<User>} action - 사용자 정보
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * 로딩 상태 설정
     * @param {AuthState} state - 현재 상태
     * @param {PayloadAction<boolean>} action - 로딩 상태
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * 에러 상태 설정
     * @param {AuthState} state - 현재 상태
     * @param {PayloadAction<string | null>} action - 에러 메시지
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * 로그아웃 - 상태 초기화
     */
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer; 