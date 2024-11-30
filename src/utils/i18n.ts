'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const [locale, setLocale] = useState('ko');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string): string => {
    if (!mounted) return key;

    try {
      const messages = require(`../messages/${locale}.json`);
      const keys = key.split('.');
      let value: any = messages;
      
      for (const k of keys) {
        value = value[k];
        if (!value) return key;
      }
      
      return value;
    } catch (error) {
      console.error(`Translation error: ${error}`);
      return key;
    }
  };

  return {
    t,
    locale,
    changeLocale: (newLocale: string) => {
      setLocale(newLocale);
    },
  };
}