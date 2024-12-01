import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@/lib/auth/types';

/**
 * 인증 상태 초기값
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * 인증 관련 Redux Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 사용자 정보 설정
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    /**
     * 로그아웃 - 상태 초기화
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    /**
     * 로딩 상태 설정
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    /**
     * 에러 상태 설정
     */
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer; 