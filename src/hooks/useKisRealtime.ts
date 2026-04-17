'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { KisTradeData, KisOrderbookData, KisSnapshotData, StocksApiResponse } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

interface UseKisRealtimeReturn {
  trade: KisTradeData | null;
  orderbook: KisOrderbookData | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useKisRealtime(symbol: string | null): UseKisRealtimeReturn {
  const [trade, setTrade] = useState<KisTradeData | null>(null);
  const [orderbook, setOrderbook] = useState<KisOrderbookData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxRetries = 5;

  // 6자리 종목코드 추출 (005930.KS → 005930)
  const stockCode = symbol?.replace(/\.(KS|KQ)$/i, '') ?? null;

  const connect = useCallback(() => {
    if (!stockCode || stockCode.length !== 6) return;

    // 기존 연결 정리
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    const url = `${API_URLS.STOCKS.KIS_STREAM}/${stockCode}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('trade', (e: MessageEvent) => {
      try {
        const data: KisTradeData = JSON.parse(e.data);
        setTrade(data);
        setIsConnected(true);
        setIsLoading(false);
        retryCountRef.current = 0;
      } catch {
        // 파싱 에러 무시
      }
    });

    es.addEventListener('orderbook', (e: MessageEvent) => {
      try {
        const data: KisOrderbookData = JSON.parse(e.data);
        setOrderbook(data);
        setIsConnected(true);
        setIsLoading(false);
      } catch {
        // 파싱 에러 무시
      }
    });

    es.addEventListener('ping', () => {
      // 연결 유지 확인
      setIsConnected(true);
    });

    es.addEventListener('error', (e: Event) => {
      try {
        const data = JSON.parse((e as MessageEvent).data ?? '{}') as { message?: string };
        setError(data.message ?? '스트림 에러');
      } catch {
        // 일반 에러 이벤트
      }
    });

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      eventSourceRef.current = null;

      // 지수 백오프 자동 재연결 (최대 5회, 최대 30초)
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          connect();
        }, delay);
      } else {
        setError('실시간 연결이 끊어졌습니다. 새로고침해주세요.');
        setIsLoading(false);
      }
    };
  }, [stockCode]); // eslint-disable-line react-hooks/exhaustive-deps

  // SSE 연결이 안 될 경우를 대비한 초기 스냅샷 fetch
  useEffect(() => {
    if (!stockCode || stockCode.length !== 6) return;

    fetch(`${API_URLS.STOCKS.KIS_SNAPSHOT}/${stockCode}`)
      .then((res) => res.json())
      .then((json: StocksApiResponse<KisSnapshotData>) => {
        if (json.success) {
          setTrade(json.data.trade);
          setOrderbook(json.data.orderbook);
          setIsLoading(false);
        }
      })
      .catch(() => {
        // 스냅샷 실패는 SSE로 보충됨
      });
  }, [stockCode]);

  // SSE 연결
  useEffect(() => {
    connect();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    retryCountRef.current = 0;
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    connect();
  }, [connect]);

  return { trade, orderbook, isConnected, isLoading, error, reconnect };
}
