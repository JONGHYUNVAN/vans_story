'use client';

import { Moon, Sun } from 'lucide-react';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

export default function StocksThemeToggle() {
  const { theme, toggleTheme, tokens } = useStocksTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={tokens.toggle}
      aria-label={isDark ? '라이트 테마로 전환' : '다크 테마로 전환'}
      title={isDark ? '라이트 테마' : '다크 테마'}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}
