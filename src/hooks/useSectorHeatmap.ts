'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SectorHeatmapItem } from '@/types/stocks';
import { isAnyMarketActive } from '@/lib/stocks/marketHours';

interface UseSectorHeatmapReturn {
  data: SectorHeatmapItem[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useSectorHeatmap(): UseSectorHeatmapReturn {
  const [data, setData] = useState<SectorHeatmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상태 갱신은 모두 응답 콜백 안에서만 일어난다 (effect 내 동기 setState 없음)
  const fetchData = useCallback(() => {
    return fetch('/api/stocks/heatmap', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError(json.error?.message ?? 'Failed to load heatmap');
        }
      })
      .catch(() => {
        setError('Network error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    // 장 마감 시간대(KR·US 모두 CLOSED)에는 값이 바뀌지 않으므로 폴링하지 않는다.
    const interval = setInterval(() => {
      if (isAnyMarketActive()) fetchData();
    }, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error };
}
