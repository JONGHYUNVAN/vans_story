'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MacroIndicator, MacroData, StocksApiResponse } from '@/types/stocks';
import { symbolToSlug } from '@/utils/stockSymbol';
import { API_URLS } from '@/constants/apiUrl';

interface MacroRelatedSectionProps {
  symbols: string[];
}

function formatMacroPrice(indicator: MacroIndicator): string {
  if (indicator.symbol === 'USDKRW=X') {
    return indicator.price.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '원';
  }
  if (indicator.symbol === '^TNX') {
    return indicator.price.toFixed(3) + '%';
  }
  return indicator.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatPct(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
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
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-3">
        영향 거시지표
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {isLoading
          ? symbols.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 animate-pulse h-20"
              />
            ))
          : indicators.map((ind) => {
              const isUp = ind.changePercent > 0;
              const isDown = ind.changePercent < 0;
              const pctColor = isUp
                ? 'text-rose-400'
                : isDown
                  ? 'text-sky-400'
                  : 'text-zinc-500';

              return (
                <Link
                  key={ind.symbol}
                  href={`/stocks/${symbolToSlug(ind.symbol)}`}
                  className="block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 hover:bg-zinc-800/60 transition-colors no-underline"
                >
                  <p className="text-sm font-bold text-white truncate">{ind.displayName}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mb-2">{ind.symbol}</p>
                  <p className="text-sm font-bold font-mono tabular-nums text-zinc-200">
                    {formatMacroPrice(ind)}
                  </p>
                  <p className={`text-xs font-mono ${pctColor}`}>{formatPct(ind.changePercent)}</p>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
