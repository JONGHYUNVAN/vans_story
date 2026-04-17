'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { StockDetailData, StocksApiResponse } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

export interface UseStockDetailResult {
  detail: StockDetailData | null;
  isLoading: boolean;      // 최초 로드 스켈레톤용
  isRefreshing: boolean;   // 새로고침 스피너용
  isError: boolean;
  errorMessage: string;
  refetch: () => Promise<void>;
}

export function useStockDetail(symbol: string): UseStockDetailResult {
  const [detail, setDetail] = useState<StockDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hasLoadedRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!hasLoadedRef.current) setIsLoading(true);
    else setIsRefreshing(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const res = await fetch(
        `${API_URLS.STOCKS.DETAIL}?symbol=${encodeURIComponent(symbol)}`,
      );
      const json: StocksApiResponse<StockDetailData> = await res.json();
      if (json.success) {
        setDetail(json.data);
        hasLoadedRef.current = true;
      } else {
        throw new Error(json.error.message);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(
        err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [symbol]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { detail, isLoading, isRefreshing, isError, errorMessage, refetch };
}
