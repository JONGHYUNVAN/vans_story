'use client';

import { useState, useEffect, useCallback } from 'react';
import { SectorHeatmapItem } from '@/types/stocks';

interface UseSectorHeatmapReturn {
  data: SectorHeatmapItem[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useSectorHeatmap(): UseSectorHeatmapReturn {
  const [data, setData] = useState<SectorHeatmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/stocks/heatmap', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setError(null);
      } else {
        setError(json.error?.message ?? 'Failed to load heatmap');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error };
}
