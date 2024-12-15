import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@/interfaces/auth/types';
import { decodeToken } from '@/utils/decodeToken';

/**
 * 인증 상태 초기값
 * @type {AuthState}
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * 인증 관련 Redux Slice
 * @description 사용자 인증 상태를 관리하는 Redux Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 로그아웃 처리 및 상태 초기화
     * @param {AuthState} state - 현재 인증 상태
     * @returns {void}
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /**
     * 로딩 상태 설정
     * @param {AuthState} state - 현재 인증 상태
     * @param {PayloadAction<boolean>} action - 로딩 상태값
     * @returns {void}
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    /**
     * 에러 상태 설정
     * @param {AuthState} state - 현재 인증 상태
     * @param {PayloadAction<string | null>} action - 에러 메시지
     * @returns {void}
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * 로그인 시작 시 상태 설정
     * @param {AuthState} state - 현재 인증 상태
     * @returns {void}
     */
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * 로그인 성공 시 사용자 정보 설정
     * @param {AuthState} state - 현재 인증 상태
     * @param {PayloadAction<{ email: string }>} action - 사용자 정보
     * @returns {void}
     */
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * 로그인 실패 시 에러 설정
     * @param {AuthState} state - 현재 인증 상태
     * @param {PayloadAction<string>} action - 에러 메시지
     * @returns {void}
     */
    loginFailure: (state, action) => {
      state.error = action.payload;
    },

    /**
     * 로그인 프로세스 종료 시 로딩 상태 해제
     * @param {AuthState} state - 현재 인증 상태
     * @returns {void}
     */
    loginFinish: (state) => {
      state.isLoading = false; 
    },

    /**
     * 저장된 토큰으로 인증 상태 확인
     * @param {AuthState} state - 현재 인증 상태
     * @returns {void}
     * @description localStorage의 토큰을 확인하여 사용자 인증 상태를 복원
     */
    checkAuth: (state) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const userData = decodeToken(token);
        if (userData) {
          state.user = { email: userData.email };
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { 
  logout, 
  setLoading, 
  setError, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  loginFinish, 
  checkAuth 
} = authSlice.actions;

export default authSlice.reducer;