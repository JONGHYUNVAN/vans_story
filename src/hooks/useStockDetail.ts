'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StockDetailData, StocksApiResponse } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

export interface UseStockDetailResult {
  detail: StockDetailData | null;
  isLoading: boolean; // 최초 로드 스켈레톤용
  isRefreshing: boolean; // 새로고침 스피너용
  isError: boolean;
  errorMessage: string;
  refetch: () => Promise<void>;
}

async function requestDetail(symbol: string): Promise<StockDetailData> {
  const res = await fetch(`${API_URLS.STOCKS.DETAIL}?symbol=${encodeURIComponent(symbol)}`);
  const json: StocksApiResponse<StockDetailData> = await res.json();
  if (json.success) return json.data;
  throw new Error(json.error.message);
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
}

export function useStockDetail(symbol: string): UseStockDetailResult {
  const [detail, setDetail] = useState<StockDetailData | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  // 마지막으로 응답(성공/실패)이 처리된 심볼 — symbol과 다르면 조회 진행 중으로 간주
  const [settledSymbol, setSettledSymbol] = useState<string | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // symbol 변경 시 자동 조회
  useEffect(() => {
    const run = async () => {
      try {
        setDetail(await requestDetail(symbol));
        setHasLoaded(true);
        setIsError(false);
        setErrorMessage('');
      } catch (err) {
        setIsError(true);
        setErrorMessage(toErrorMessage(err));
      } finally {
        setSettledSymbol(symbol);
      }
    };
    run();
  }, [symbol]);

  const refetch = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      setDetail(await requestDetail(symbol));
      setHasLoaded(true);
      setIsError(false);
      setErrorMessage('');
    } catch (err) {
      setIsError(true);
      setErrorMessage(toErrorMessage(err));
    } finally {
      setIsManualRefreshing(false);
    }
  }, [symbol]);

  // 로딩/새로고침/에러 상태는 조회 진행 여부에서 파생
  const inFlight = settledSymbol !== symbol || isManualRefreshing;
  const isLoading = inFlight && !hasLoaded;
  const isRefreshing = inFlight && hasLoaded;

  return {
    detail,
    isLoading,
    isRefreshing,
    isError: isError && !inFlight,
    errorMessage: inFlight ? '' : errorMessage,
    refetch,
  };
}
