'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocale } from '@/store/i18n/slice';
import ko from '@/messages/ko.json';
import en from '@/messages/en.json';

const translations = { ko, en };

export function useTranslation() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.i18n.locale);

  const t = (key: string) => {
    const keys = key.split('.');
    let current: any = translations[locale];
    for (const k of keys) {
      current = current?.[k];
    }
    return current || key;
  };

  const changeLocale = (newLocale: 'ko' | 'en') => {
    dispatch(setLocale(newLocale));
  };

  return { t, locale, changeLocale };
}