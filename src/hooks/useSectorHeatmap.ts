'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SectorHeatmapItem } from '@/types/stocks';

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
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error };
}
