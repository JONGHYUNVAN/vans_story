'use client';

import { useTranslation } from "../../utils/i18n";

export function LanguageSwitch() {
  const { locale, changeLocale } = useTranslation();

  return (
    <select 
      value={locale} 
      onChange={(e) => changeLocale(e.target.value)}
      className="bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
} 