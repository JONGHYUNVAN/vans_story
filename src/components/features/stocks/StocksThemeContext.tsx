'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { stocksThemeTokens, type StocksTheme, type StocksThemeTokens } from './stocksThemeTokens';

const STORAGE_KEY = 'vans-story-stocks-theme';
const DEFAULT_THEME: StocksTheme = 'dark';

function isStocksTheme(s: string | null): s is StocksTheme {
  return s === 'light' || s === 'dark';
}

// ── localStorage 기반 외부 스토어 (useSyncExternalStore용) ──
// localStorage 접근 실패 시에도 메모리 값으로 테마 전환이 동작하도록 캐시 유지
let memoryTheme: StocksTheme | null = null;
const listeners = new Set<() => void>();

function readTheme(): StocksTheme {
  if (memoryTheme) return memoryTheme;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memoryTheme = isStocksTheme(raw) ? raw : DEFAULT_THEME;
  } catch {
    memoryTheme = DEFAULT_THEME;
  }
  return memoryTheme;
}

function writeTheme(t: StocksTheme) {
  memoryTheme = t;
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): StocksTheme {
  return DEFAULT_THEME;
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
  // SSR/하이드레이션 시에는 기본 테마, 클라이언트에서는 저장된 테마 사용
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const setTheme = useCallback((t: StocksTheme) => {
    writeTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    writeTheme(readTheme() === 'dark' ? 'light' : 'dark');
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
