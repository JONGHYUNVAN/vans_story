import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface I18nState {
  locale: 'ko' | 'en';
}

const initialState: I18nState = {
  locale: 'ko', // 기본 언어
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<'ko' | 'en'>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = i18nSlice.actions;
export default i18nSlice.reducer; 