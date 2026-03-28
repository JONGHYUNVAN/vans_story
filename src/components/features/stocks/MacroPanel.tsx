'use client';

import Link from 'next/link';
import type { MacroData, MacroIndicator } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { symbolToSlug } from '@/utils/stockSymbol';

interface MacroPanelProps {
  macro: MacroData | null;
  isLoading: boolean;
}

function formatPercent(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'currency':  return '환율';
    case 'bond':      return '채권';
    case 'index':     return '지수';
    case 'commodity': return '원자재';
    default:          return category;
  }
}

function formatPrice(indicator: MacroIndicator): string {
  if (indicator.symbol === 'USDKRW=X') {
    return indicator.price.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '원';
  }
  if (indicator.symbol === '^TNX') {
    return indicator.price.toFixed(3) + '%';
  }
  if (indicator.category === 'commodity') {
    return '$' + indicator.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return indicator.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function getArrow(change: number): string {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '—';
}

export default function MacroPanel({ macro, isLoading }: MacroPanelProps) {
  const { tokens } = useStocksTheme();
  const m = tokens.macro;
  const allIndicators = macro ? [...macro.currency, ...macro.bond, ...macro.index, ...(macro.commodity ?? [])] : [];

  function categoryClass(cat: string): string {
    switch (cat) {
      case 'currency':  return m.categoryCurrency;
      case 'bond':      return m.categoryBond;
      case 'index':     return m.categoryIndex;
      case 'commodity': return m.categoryCommodity;
      default:          return m.categoryDefault;
    }
  }

  function changeClass(change: number): string {
    if (change > 0) return tokens.quote.up;
    if (change < 0) return tokens.quote.down;
    return tokens.quote.neutral;
  }

  return (
    <section className={m.shell}>
      <div className={m.sectionHeadRow}>
        <h2 className={m.sectionTitle}>거시 지표</h2>
        <span className={m.sectionMeta}>Macro</span>
      </div>
      <div className={m.rail}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={m.skeleton}>
                <div className={`h-2.5 ${m.skeletonBar} w-2/3 mb-2`} />
                <div className={`h-5 ${m.skeletonBar} w-1/2 mb-1.5`} />
                <div className={`h-2.5 ${m.skeletonBar} w-1/3`} />
              </div>
            ))
          : allIndicators.map((indicator) => {
              const colorClass = changeClass(indicator.change);
              const arrow = getArrow(indicator.change);
              return (
                <Link
                  key={indicator.symbol}
                  href={`/stocks/${symbolToSlug(indicator.symbol)}`}
                  className={`${m.card} block no-underline`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <p className={m.label}>{indicator.displayName}</p>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${categoryClass(indicator.category)}`}
                    >
                      {getCategoryLabel(indicator.category)}
                    </span>
                  </div>
                  <p className={m.price}>{formatPrice(indicator)}</p>
                  <p className={`${m.changeLine} ${colorClass}`}>
                    {arrow} {formatPercent(indicator.changePercent)}
                  </p>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
