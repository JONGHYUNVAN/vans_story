'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  stocksThemeTokens,
  type StocksTheme,
  type StocksThemeTokens,
} from '@/components/features/stocks/stocksThemeTokens';

const STORAGE_KEY = 'vans-story-stocks-theme';

function isStocksTheme(s: string | null): s is StocksTheme {
  return s === 'light' || s === 'dark';
}

export interface StocksThemeContextValue {
  theme: StocksTheme;
  setTheme: (t: StocksTheme) => void;
  toggleTheme: () => void;
  tokens: StocksThemeTokens;
}

const defaultValue: StocksThemeContextValue = {
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  tokens: stocksThemeTokens.dark,
};

const StocksThemeContext = createContext<StocksThemeContextValue | null>(null);

export function StocksThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<StocksTheme>('dark');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (isStocksTheme(raw)) setThemeState(raw);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: StocksTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: StocksTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    (): StocksThemeContextValue => ({
      theme,
      setTheme,
      toggleTheme,
      tokens: stocksThemeTokens[theme],
    }),
    [theme, setTheme, toggleTheme],
  );

  return <StocksThemeContext.Provider value={value}>{children}</StocksThemeContext.Provider>;
}

export function useStocksTheme(): StocksThemeContextValue {
  const ctx = useContext(StocksThemeContext);
  return ctx ?? defaultValue;
}
