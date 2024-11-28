import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/lib/auth/auth.service';
import { LoginCredentials } from '@/lib/auth/types';
import { setUser, setLoading, setError, logout } from './auth.slice';

/**
 * 로그인 비동기 액션 생성자
 * Redux Thunk를 사용하여 로그인 프로세스 처리
 * 
 * @async
 * @param {LoginCredentials} credentials - 로그인 정보
 * @param {ThunkAPI} thunkAPI - Redux Thunk API
 * @returns {Promise} 로그인 결과
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      // 로딩 상태 시작
      dispatch(setLoading(true));
      
      // 로그인 API 호출
      const response = await authService.login(credentials);
      
      // 성공 시 사용자 정보 저장
      dispatch(setUser(response.user));
      
      // 로컬 스토리지에 토큰 저장 (필요한 경우)
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      // 에러 처리
      const errorMessage = error instanceof Error 
        ? error.message 
        : '알 수 없는 오류가 발생했습니다.';
      
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      // 로딩 상태 종료
      dispatch(setLoading(false));
    }
  }
);

/**
 * 로그아웃 비동기 액션 생성자
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      dispatch(logout());
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }
); 