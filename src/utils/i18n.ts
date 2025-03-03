'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocale } from '@/store/i18n/slice';
import ko from '@/messages/ko.json';
import en from '@/messages/en.json';

// 지원하는 언어의 번역을 객체로 정의
const translations = { ko, en };

// 번역 파라미터 인터페이스
interface TranslationParams {
  name?: string;
  [key: string]: any;
}

/**
 * 번역 훅
 * @description 
 * 현재 언어 설정에 따라 번역된 문자열을 반환하고, 
 * 언어를 변경하는 기능을 제공합니다.
 * 
 * @returns {{ t: (key: string, params?: TranslationParams) => string; locale: 'ko' | 'en'; changeLocale: (newLocale: 'ko' | 'en') => void; }}
 * - t: 번역된 문자열을 반환하는 함수
 * - locale: 현재 언어 설정
 * - changeLocale: 언어를 변경하는 함수
 */
export function useTranslation(p0: string) {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.i18n.locale);

  /**
   * 번역 함수
   * @param {string} key - 번역할 키
   * @param {TranslationParams} [params] - 번역에 사용할 파라미터
   * @returns {string} - 번역된 문자열
   * @description 
   * 주어진 키를 사용하여 현재 언어에 맞는 번역된 문자열을 반환합니다. 
   * 파라미터가 제공되면 해당 값을 문자열에 삽입합니다.
   */
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

  /**
   * 언어 변경 함수
   * @param {'ko' | 'en'} newLocale - 변경할 언어
   * @returns {void}
   * @description 
   * 주어진 언어로 변경하고, Redux 상태를 업데이트합니다.
   */
  const changeLocale = (newLocale: 'ko' | 'en') => {
    dispatch(setLocale(newLocale));
  };

  return { t, locale, changeLocale };
}