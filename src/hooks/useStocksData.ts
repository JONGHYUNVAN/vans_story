'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockPricesData, MacroData, StocksApiResponse } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

const POLL_INTERVAL_MS = 30_000; // 30초

function isMarketOpen(): boolean {
  const now = new Date();
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const day = kstNow.getDay(); // 0=일, 6=토
  const hour = kstNow.getHours();
  const min = kstNow.getMinutes();
  const time = hour * 60 + min;
  return day >= 1 && day <= 5 && time >= 9 * 60 && time < 15 * 60 + 30;
}

interface UseStocksDataReturn {
  prices: StockPricesData | null;
  macro: MacroData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  refetch: () => void;
  marketOpen: boolean;
}

export function useStocksData(): UseStocksDataReturn {
  const [prices, setPrices] = useState<StockPricesData | null>(null);
  const [macro, setMacro] = useState<MacroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [marketOpen, setMarketOpen] = useState<boolean>(isMarketOpen());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const [pricesRes, macroRes] = await Promise.all([
        fetch(API_URLS.STOCKS.PRICES),
        fetch(API_URLS.STOCKS.MACRO),
      ]);

      const pricesJson: StocksApiResponse<StockPricesData> = await pricesRes.json();
      const macroJson: StocksApiResponse<MacroData> = await macroRes.json();

      if (pricesJson.success) {
        setPrices(pricesJson.data);
      } else {
        throw new Error(pricesJson.error.message);
      }

      if (macroJson.success) {
        setMacro(macroJson.data);
      } else {
        throw new Error(macroJson.error.message);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장 운영 여부 갱신 (1분마다 체크)
  useEffect(() => {
    const id = setInterval(() => {
      setMarketOpen(isMarketOpen());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // 초기 fetch + polling
  useEffect(() => {
    fetchAll();

    if (isMarketOpen()) {
      timerRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchAll]);

  // marketOpen 상태가 바뀌면 polling 재설정
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (marketOpen) {
      timerRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [marketOpen, fetchAll]);

  return { prices, macro, isLoading, isError, errorMessage, refetch: fetchAll, marketOpen };
}
