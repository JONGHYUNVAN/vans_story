'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StockPricesData, MacroData, StocksApiResponse } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';
import { getKrMarketState, getUsMarketState, MarketState } from '@/utils/marketHours';

const POLL_INTERVAL_MS = 30_000; // 30초

const WEEKDAY_TO_DOW: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/** IANA 타임존 기준 요일(0=일)·자정부터 분 수 */
function getLocalDayAndMinutes(timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const wd     = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour   = parseInt(parts.find((p) => p.type === 'hour')?.value   ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  return { day: WEEKDAY_TO_DOW[wd] ?? 0, minutes: hour * 60 + minute };
}

/** KRX 정규 장 (평일 09:00~15:30 KST) */
function isKrxRegularSession(): boolean {
  const { day, minutes } = getLocalDayAndMinutes('Asia/Seoul');
  return day >= 1 && day <= 5 && minutes >= 9 * 60 && minutes < 15 * 60 + 30;
}

/** NYSE 정규 장 (평일 09:30~16:00 ET, 휴장 미반영) */
function isNyseRegularSession(): boolean {
  const { day, minutes } = getLocalDayAndMinutes('America/New_York');
  return day >= 1 && day <= 5 && minutes >= 9 * 60 + 30 && minutes < 16 * 60;
}

/** 한국·미국 중 하나라도 정규 세션이면 true */
function isMarketOpen(): boolean {
  return isKrxRegularSession() || isNyseRegularSession();
}

async function readApiJson<T>(res: Response): Promise<StocksApiResponse<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as StocksApiResponse<T>;
  } catch {
    throw new Error('서버 응답을 해석할 수 없습니다.');
  }
}

interface UseStocksDataReturn {
  prices:         StockPricesData | null;
  macro:          MacroData | null;
  isLoading:      boolean;   // 초기 전체 로딩 (스켈레톤 표시용)
  isRefreshing:   boolean;   // 수동 주가 갱신 중 (버튼 스피너용)
  isError:        boolean;
  errorMessage:   string;
  refetch:        () => void; // 전체 재시도 (에러 복구용)
  refetchPrices:  () => void; // 주가만 갱신 (새로고침 버튼용)
  marketOpen:     boolean;
  krMarketState:  MarketState;
  usMarketState:  MarketState;
}

export function useStocksData(): UseStocksDataReturn {
  const [prices,       setPrices]       = useState<StockPricesData | null>(null);
  const [macro,        setMacro]        = useState<MacroData | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError,      setIsError]      = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [marketOpen,   setMarketOpen]   = useState(() => isMarketOpen());
  const [krMarketState, setKrMarketState] = useState<MarketState>(() => getKrMarketState());
  const [usMarketState, setUsMarketState] = useState<MarketState>(() => getUsMarketState());

  /** 초기 로드 또는 에러 재시도: 주가 + 거시지표 모두 가져옴 */
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const [pricesRes, macroRes] = await Promise.all([
        fetch(API_URLS.STOCKS.PRICES),
        fetch(API_URLS.STOCKS.MACRO),
      ]);
      const [pricesJson, macroJson] = await Promise.all([
        readApiJson<StockPricesData>(pricesRes),
        readApiJson<MacroData>(macroRes),
      ]);
      if (!pricesJson.success) throw new Error(pricesJson.error.message);
      if (!macroJson.success)  throw new Error(macroJson.error.message);
      setPrices(pricesJson.data);
      setMacro(macroJson.data);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 주가 전용 갱신: 거시지표·뉴스는 건드리지 않음 */
  const fetchPricesOnly = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res  = await fetch(API_URLS.STOCKS.PRICES);
      const json = await readApiJson<StockPricesData>(res);
      if (!json.success) throw new Error(json.error.message);
      setPrices(json.data);
    } catch {
      // 갱신 실패 시 기존 데이터 유지, 조용히 처리
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // 장 운영 여부 갱신 (1분마다 체크)
  useEffect(() => {
    const tick = () => {
      const kr = getKrMarketState();
      const us = getUsMarketState();
      setKrMarketState(kr);
      setUsMarketState(us);
      setMarketOpen(kr === 'REGULAR' || kr === 'PRE' || us === 'REGULAR');
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // 초기 전체 fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 장 중일 때 주가만 폴링 (거시지표는 재로드하지 않음)
  useEffect(() => {
    if (!marketOpen) return;
    const id = setInterval(fetchPricesOnly, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [marketOpen, fetchPricesOnly]);

  return {
    prices, macro,
    isLoading, isRefreshing,
    isError, errorMessage,
    refetch: fetchAll,
    refetchPrices: fetchPricesOnly,
    marketOpen,
    krMarketState,
    usMarketState,
  };
}
