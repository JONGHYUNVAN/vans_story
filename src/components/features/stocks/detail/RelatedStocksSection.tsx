'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { StockPrice, StocksApiResponse, StockPricesData } from '@/types/stocks';
import { STOCK_DISPLAY_NAME, MACRO_SYMBOLS } from '@/types/stocks';
import { symbolToSlug } from '@/utils/stockSymbol';
import { API_URLS } from '@/constants/apiUrl';

interface RelatedStock {
  symbol: string;
  reason?: string;
}

interface RelatedStocksSectionProps {
  title: string;
  stocks: RelatedStock[];
}

function getDisplayName(symbol: string): string {
  if (STOCK_DISPLAY_NAME[symbol]) return STOCK_DISPLAY_NAME[symbol];
  const macro = MACRO_SYMBOLS.find((m) => m.symbol === symbol);
  if (macro) return macro.displayName;
  return symbol;
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'KRW') return price.toLocaleString('ko-KR') + '원';
  return '$' + price.toFixed(2);
}

function formatPct(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

export default function RelatedStocksSection({ title, stocks }: RelatedStocksSectionProps) {
  const [priceMap, setPriceMap] = useState<Map<string, StockPrice>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (stocks.length === 0) {
      setIsLoading(false);
      return;
    }
    const symbols = stocks.map((s) => s.symbol).join(',');
    fetch(`${API_URLS.STOCKS.PRICES}?symbols=${encodeURIComponent(symbols)}`)
      .then((r) => r.json())
      .then((json: StocksApiResponse<StockPricesData>) => {
        if (json.success) {
          const map = new Map<string, StockPrice>();
          json.data.stocks.forEach((s) => map.set(s.symbol, s));
          setPriceMap(map);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [stocks]);

  if (stocks.length === 0) return null;

  return (
    <section className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stocks.map(({ symbol, reason }) => {
          const sp = priceMap.get(symbol);
          const isUp = sp ? sp.changePercent > 0 : null;
          const pctColor =
            isUp === true
              ? 'text-rose-400'
              : isUp === false
                ? 'text-sky-400'
                : 'text-zinc-500';

          return (
            <Link
              key={symbol}
              href={`/stocks/${symbolToSlug(symbol)}`}
              className="block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 hover:bg-zinc-800/60 transition-colors no-underline"
            >
              <p className="text-sm font-bold text-white truncate">{getDisplayName(symbol)}</p>
              <p className="text-[10px] text-zinc-500 font-mono mb-2">{symbol}</p>
              {isLoading ? (
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
              ) : sp ? (
                <>
                  <p className="text-sm font-bold font-mono tabular-nums text-zinc-200">
                    {formatPrice(sp.price, sp.currency)}
                  </p>
                  <p className={`text-xs font-mono ${pctColor}`}>{formatPct(sp.changePercent)}</p>
                </>
              ) : (
                <p className="text-xs text-zinc-600">데이터 없음</p>
              )}
              {reason && (
                <p className="text-[10px] text-zinc-600 mt-1 truncate">{reason}</p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
