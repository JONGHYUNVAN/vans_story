import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 언어설정 인터페이스
 * @interface I18nState
 * @property {('ko' | 'en')} locale - 현재 언어 설정
 */
interface I18nState {
  locale: 'ko' | 'en';
}

/**
 * 언어설정  상태 초기값
 * @type {I18nState}
 */
const initialState: I18nState = {
  locale: 'ko', 
};

/**
 * 언어설정  관련 Redux Slice
 * @description 언어 설정을 관리하는 Redux Slice
 */
const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    /**
     * 언어 설정 변경
     * @param {I18nState} state - 현재 언어설정  상태
     * @param {PayloadAction<'ko' | 'en'>} action - 변경할 언어
     * @returns {void}
     */
    setLocale: (state, action: PayloadAction<'ko' | 'en'>) => {
      state.locale = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const { setLocale } = i18nSlice.actions;

// reducer 내보내기
export default i18nSlice.reducer; 