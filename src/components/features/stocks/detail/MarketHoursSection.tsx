'use client';

import type { MarketState } from '@/types/stocks';

interface MarketHoursSectionProps {
  marketState: MarketState;
  preMarketPrice?: number | null;
  preMarketChange?: number | null;
  preMarketChangePercent?: number | null;
  postMarketPrice?: number | null;
  postMarketChange?: number | null;
  postMarketChangePercent?: number | null;
  regularPrice: number;
  currency: string;
}

function formatP(p: number, currency: string) {
  if (currency === 'KRW') return p.toLocaleString('ko-KR') + '원';
  return '$' + p.toFixed(2);
}


export default function MarketHoursSection({
  marketState,
  preMarketPrice,
  preMarketChange,
  preMarketChangePercent,
  postMarketPrice,
  postMarketChange,
  postMarketChangePercent,
  regularPrice,
  currency,
}: MarketHoursSectionProps) {
  const showPre = marketState === 'PRE' && preMarketPrice != null;
  const showPost =
    (marketState === 'POST' || marketState === 'POSTPOST') && postMarketPrice != null;

  if (!showPre && !showPost) return null;

  const extPrice = showPre ? preMarketPrice! : postMarketPrice!;
  const label = showPre ? '프리마켓' : '애프터마켓';

  // Use provided change values if available; otherwise fall back to calculation from regularPrice
  const rawDiff =
    showPre
      ? (preMarketChange != null ? preMarketChange : extPrice - regularPrice)
      : (postMarketChange != null ? postMarketChange : extPrice - regularPrice);

  const rawPct =
    showPre
      ? (preMarketChangePercent != null
          ? preMarketChangePercent
          : regularPrice !== 0 ? ((extPrice - regularPrice) / regularPrice) * 100 : 0)
      : (postMarketChangePercent != null
          ? postMarketChangePercent
          : regularPrice !== 0 ? ((extPrice - regularPrice) / regularPrice) * 100 : 0);

  const isUp = rawDiff >= 0;
  const colorClass = isUp ? 'text-rose-400' : 'text-sky-400';

  return (
    <section className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-3">
        {label} 시세
      </h3>
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-zinc-500 mb-1">{label} 현재가</p>
          <p className="text-2xl font-bold font-mono text-white">{formatP(extPrice, currency)}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">정규장 대비</p>
          <p className={`text-lg font-bold font-mono ${colorClass}`}>
            {isUp ? '+' : ''}
            {formatP(rawDiff, currency)}{' '}
            ({isUp ? '+' : ''}
            {rawPct.toFixed(2)}%)
          </p>
        </div>
      </div>
    </section>
  );
}
