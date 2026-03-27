'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, StocksApiResponse, StockNewsData } from '@/types/stocks';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

const ALL_STOCKS = [
  ...KR_STOCKS.map((s) => ({ symbol: s.symbol, name: s.name })),
  ...US_STOCKS.map((s) => ({ symbol: s.symbol, name: s.name })),
];

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function SkeletonNews() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse border-b border-gray-800 pb-3">
          <div className="h-4 bg-gray-800 rounded w-full mb-1.5" />
          <div className="h-4 bg-gray-800 rounded w-4/5 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function NewsSection() {
  const [selectedSymbol, setSelectedSymbol] = useState(ALL_STOCKS[0].symbol);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchNews = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`${API_URLS.STOCKS.NEWS}?symbol=${encodeURIComponent(symbol)}&limit=5`);
      const json: StocksApiResponse<StockNewsData> = await res.json();
      if (json.success) {
        setNews(json.data.news);
      } else {
        throw new Error(json.error.message);
      }
    } catch {
      setIsError(true);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(selectedSymbol);
  }, [selectedSymbol, fetchNews]);

  const selectedStock = ALL_STOCKS.find((s) => s.symbol === selectedSymbol);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-blue-400 rounded-full inline-block" />
        관련 뉴스
      </h2>

      {/* 종목 선택 탭 */}
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-800 pb-3">
        {ALL_STOCKS.map((s) => (
          <button
            key={s.symbol}
            onClick={() => setSelectedSymbol(s.symbol)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
              selectedSymbol === s.symbol
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 뉴스 목록 */}
      {isLoading ? (
        <SkeletonNews />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className="text-gray-500 text-sm">뉴스를 불러오지 못했습니다.</p>
          <button
            onClick={() => fetchNews(selectedSymbol)}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : news.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">{selectedStock?.name} 관련 뉴스가 없습니다.</p>
      ) : (
        <ul className="space-y-0 divide-y divide-gray-800">
          {news.map((item, idx) => (
            <li key={idx} className="py-3 first:pt-0 last:pb-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <p className="text-gray-200 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2 mb-1.5">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-gray-400">{item.source}</span>
                  <span>·</span>
                  <span>{formatDate(item.pubDate)}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
