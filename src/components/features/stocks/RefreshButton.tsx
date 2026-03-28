'use client';

import { useState, useEffect } from 'react';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
  const { tokens } = useStocksTheme();
  const r = tokens.refresh;
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date());
    }
  }, [isLoading]);

  useEffect(() => {
    if (!lastUpdated) return;

    const update = () => {
      const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (diff < 60) {
        setDisplayTime(`${diff}초 전`);
      } else {
        setDisplayTime(lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      }
    };

    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-3">
      {lastUpdated && <span className={r.meta}>갱신 {displayTime}</span>}
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={r.button}
        aria-label="데이터 새로고침"
      >
        <svg
          className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        새로고침
      </button>
    </div>
  );
}
