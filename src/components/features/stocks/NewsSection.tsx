'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, StocksApiResponse, StockNewsData } from '@/types/stocks';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

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

interface NewsSectionProps {
  fixedSymbol?: string;
}

export default function NewsSection({ fixedSymbol }: NewsSectionProps = {}) {
  const { tokens: t } = useStocksTheme();
  const n = t.news;
  const [selectedSymbol, setSelectedSymbol] = useState(fixedSymbol ?? ALL_STOCKS[0].symbol);

  useEffect(() => {
    if (fixedSymbol) setSelectedSymbol(fixedSymbol);
  }, [fixedSymbol]);
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
    <div className={n.panel}>
      <div className={n.headerRule}>
        <h2 className={n.title}>관련 뉴스</h2>
        <span className={n.meta}>News</span>
      </div>

      {!fixedSymbol && (
        <div className={n.chipRowRule}>
          {ALL_STOCKS.map((s) => (
            <button
              key={s.symbol}
              type="button"
              onClick={() => setSelectedSymbol(s.symbol)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSymbol === s.symbol ? n.chipOn : n.chipOff
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={n.skeletonRow}>
              <div className={`h-4 ${n.skeletonBar} w-full mb-1.5`} />
              <div className={`h-4 ${n.skeletonBar} w-4/5 mb-2`} />
              <div className={`h-3 ${n.skeletonBar} w-1/3`} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className={n.empty}>뉴스를 불러오지 못했습니다.</p>
          <button type="button" onClick={() => fetchNews(selectedSymbol)} className={n.retry}>
            다시 시도
          </button>
        </div>
      ) : news.length === 0 ? (
        <p className={n.empty}>{selectedStock?.name} 관련 뉴스가 없습니다.</p>
      ) : (
        <ul className={`space-y-0 ${n.divide}`}>
          {news.map((item, idx) => (
            <li key={idx} className="py-3 first:pt-0 last:pb-0">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
                <p className={`${n.itemTitle} ${n.itemTitleHover}`}>{item.title}</p>
                <div className={n.itemMeta}>
                  <span className={n.itemSource}>{item.source}</span>
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
