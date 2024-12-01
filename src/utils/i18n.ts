'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocale } from '@/store/i18n/slice';
import ko from '@/messages/ko.json';
import en from '@/messages/en.json';

const translations = { ko, en };

interface TranslationParams {
  name?: string;
  [key: string]: any;
}

export function useTranslation() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.i18n.locale);

  const t = (key: string, params?: TranslationParams) => {
    const keys = key.split('.');
    let current: any = translations[locale];
    for (const k of keys) {
      current = current?.[k];
    }
    
    if (params) {
      return Object.entries(params).reduce(
        (text, [key, value]) => text.replace(`{${key}}`, value),
        current
      );
    }
    
    return current || key;
  };

  const changeLocale = (newLocale: 'ko' | 'en') => {
    dispatch(setLocale(newLocale));
  };

  return { t, locale, changeLocale };
}