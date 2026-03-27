'use client';

import { useState, useEffect } from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
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
    <div className="flex items-center gap-2">
      {lastUpdated && (
        <span className="text-xs text-gray-500 hidden sm:inline">
          갱신: {displayTime}
        </span>
      )}
      <button
        onClick={onClick}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700
                   text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="데이터 새로고침"
      >
        <svg
          className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>새로고침</span>
      </button>
    </div>
  );
}
