'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { MarketState } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

interface UsUsRealtimeData {
  price: number | null;
  change: number | null;
  changePercent: number | null;
  marketState: MarketState | null;
  preMarketPrice: number | null;
  preMarketChange: number | null;
  preMarketChangePercent: number | null;
  postMarketPrice: number | null;
  postMarketChange: number | null;
  postMarketChangePercent: number | null;
  isLoading: boolean;
  lastUpdatedAt: number | null;
  error: string | null;
}

const POLL_INTERVAL_MS = 30_000;
const ACTIVE_MARKET_STATES: MarketState[] = ['PRE', 'REGULAR', 'POST', 'POSTPOST'];

export function useUsRealtime(symbol: string | null): UsUsRealtimeData {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number | null>(null);
  const [marketState, setMarketState] = useState<MarketState | null>(null);
  const [preMarketPrice, setPreMarketPrice] = useState<number | null>(null);
  const [preMarketChange, setPreMarketChange] = useState<number | null>(null);
  const [preMarketChangePercent, setPreMarketChangePercent] = useState<number | null>(null);
  const [postMarketPrice, setPostMarketPrice] = useState<number | null>(null);
  const [postMarketChange, setPostMarketChange] = useState<number | null>(null);
  const [postMarketChangePercent, setPostMarketChangePercent] = useState<number | null>(null);
  // 첫 데이터를 받은 심볼 — 현재 symbol과 다르면 로딩 중으로 간주 (렌더 중 파생)
  const [loadedSymbol, setLoadedSymbol] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  // 에러는 발생한 심볼과 함께 저장해 심볼 변경 시 자동으로 무시
  const [errorState, setErrorState] = useState<{ symbol: string; message: string } | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const marketStateRef = useRef<MarketState | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!symbol) return;

    clearPolling();

    const fetchQuote = async () => {
      try {
        const res = await fetch(`${API_URLS.STOCKS.QUOTE}?symbol=${encodeURIComponent(symbol)}`);
        const json = await res.json();

        if (!json.success) {
          setErrorState({ symbol, message: json.error ?? '시세 조회 실패' });
          return;
        }

        const d = json.data;
        setPrice(d.price);
        setChange(d.change);
        setChangePercent(d.changePercent);
        setMarketState(d.marketState);
        marketStateRef.current = d.marketState;
        setPreMarketPrice(d.preMarketPrice);
        setPreMarketChange(d.preMarketChange);
        setPreMarketChangePercent(d.preMarketChangePercent);
        setPostMarketPrice(d.postMarketPrice);
        setPostMarketChange(d.postMarketChange);
        setPostMarketChangePercent(d.postMarketChangePercent);
        setLastUpdatedAt(Date.now());
        setErrorState(null);
        setLoadedSymbol(symbol);

        // 장이 CLOSED 상태이면 폴링 중단
        if (d.marketState === 'CLOSED') {
          clearPolling();
        }
      } catch (err) {
        // 에러 발생 시 기존 데이터 유지, 에러만 기록
        setErrorState({
          symbol,
          message: err instanceof Error ? err.message : '시세 조회 중 오류 발생',
        });
      }
    };

    // 즉시 첫 번째 조회
    fetchQuote();

    // 30초마다 폴링 (단, CLOSED가 되면 fetchQuote 내부에서 중단)
    intervalRef.current = setInterval(() => {
      const prev = marketStateRef.current;
      if (prev !== null && !ACTIVE_MARKET_STATES.includes(prev)) {
        clearPolling();
        return;
      }
      fetchQuote();
    }, POLL_INTERVAL_MS);

    return () => {
      clearPolling();
    };
  }, [symbol, clearPolling]);

  const isLoading = Boolean(symbol) && loadedSymbol !== symbol;
  const error = errorState !== null && errorState.symbol === symbol ? errorState.message : null;

  return {
    price,
    change,
    changePercent,
    marketState,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
    isLoading,
    lastUpdatedAt,
    error,
  };
}
