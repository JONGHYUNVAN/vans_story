import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import i18nReducer from './i18n/slice';
import modalReducer from './modal/slice';
/**
 * Redux 스토어 설정
 * - auth: 인증 상태 관리
 * - i18n: 다국어 상태 관리
 * - modal: 모달 상태 관리
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    i18n: i18nReducer,
    modal: modalReducer,
  },
});

// 타입스크립트를 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;