'use client';

import { useState, useEffect } from 'react';

interface KospiData {
  symbol: string;
  label: string;
  sublabel: string;
  price: number;
  change: number;
  changePercent: number;
  futures: {
    symbol: string;
    label: string;
    sublabel: string;
    price: number;
    change: number;
    changePercent: number;
  } | null;
  updatedAt: string;
}

export function KospiFuturesCard() {
  const [data, setData] = useState<KospiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 이펙트 안에서만 쓰이는 로더이므로 이펙트 내부에 선언
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stocks/kospi-futures', { cache: 'no-store' });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-4">
        <div className="mb-2 h-4 w-28 rounded bg-zinc-700" />
        <div className="mb-1 h-7 w-20 rounded bg-zinc-700" />
        <div className="h-3 w-16 rounded bg-zinc-700" />
      </div>
    );
  }

  if (!data) return null;

  const isUp = data.changePercent >= 0;
  const sign = isUp ? '+' : '';
  const colorClass = isUp ? 'text-rose-400' : 'text-sky-400';
  const futures = data.futures;
  const futuresIsUp = futures ? futures.changePercent >= 0 : false;
  const futuresSign = futuresIsUp ? '+' : '';
  const futuresColorClass = futuresIsUp ? 'text-rose-400' : 'text-sky-400';

  return (
    <div className="space-y-3 rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{data.label}</p>
          <p className="text-[11px] text-zinc-500">{data.sublabel}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-zinc-100">
            {data.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs font-medium tabular-nums ${colorClass}`}>
            {sign}
            {data.change.toFixed(2)} ({sign}
            {data.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-700/50 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-zinc-300">
              {futures?.label ?? '야간 선물 지수'}
            </p>
            <p className="text-[10px] text-zinc-500">{futures?.sublabel ?? '데이터 소스 없음'}</p>
          </div>
          <div className="text-right">
            {futures ? (
              <>
                <p className="text-sm font-semibold tabular-nums text-zinc-100">
                  {futures.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className={`text-[11px] font-medium tabular-nums ${futuresColorClass}`}>
                  {futuresSign}
                  {futures.change.toFixed(2)} ({futuresSign}
                  {futures.changePercent.toFixed(2)}%)
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold tabular-nums text-zinc-400">—</p>
                <p className="text-[11px] font-medium text-zinc-500">데이터 없음</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
