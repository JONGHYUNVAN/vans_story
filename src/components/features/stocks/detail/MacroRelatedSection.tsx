'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MacroIndicator, MacroData, StocksApiResponse } from '@/types/stocks';
import { symbolToSlug } from '@/lib/stocks/stockSymbol';
import { API_URLS } from '@/constants/apiUrl';
import { formatMacroPrice, formatPercent as formatPct } from '@/lib/stocks/stockFormatting';

interface MacroRelatedSectionProps {
  symbols: string[];
}

export default function MacroRelatedSection({ symbols }: MacroRelatedSectionProps) {
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (symbols.length === 0) {
      setIsLoading(false);
      return;
    }
    fetch(API_URLS.STOCKS.MACRO)
      .then((r) => r.json())
      .then((json: StocksApiResponse<MacroData>) => {
        if (json.success) {
          const all = [...json.data.currency, ...json.data.bond, ...json.data.index];
          setIndicators(all.filter((ind) => symbols.includes(ind.symbol)));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [symbols]);

  if (symbols.length === 0) return null;

  return (
    <section className="mb-6">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
        영향 거시지표
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? symbols.map((s) => (
              <div
                key={s}
                className="h-20 animate-pulse rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3"
              />
            ))
          : indicators.map((ind) => {
              const isUp = ind.changePercent > 0;
              const isDown = ind.changePercent < 0;
              const pctColor = isUp ? 'text-rose-400' : isDown ? 'text-sky-400' : 'text-zinc-500';

              return (
                <Link
                  key={ind.symbol}
                  href={`/stocks/${symbolToSlug(ind.symbol)}`}
                  className="block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 no-underline transition-colors hover:bg-zinc-800/60"
                >
                  <p className="truncate text-sm font-bold text-white">{ind.displayName}</p>
                  <p className="mb-2 font-mono text-[10px] text-zinc-500">{ind.symbol}</p>
                  <p className="font-mono text-sm font-bold tabular-nums text-zinc-200">
                    {formatMacroPrice(ind)}
                  </p>
                  <p className={`font-mono text-xs ${pctColor}`}>{formatPct(ind.changePercent)}</p>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
