'use client';

import type { MarketState } from '@/types/stocks';

interface MarketHoursSectionProps {
  marketState: MarketState;
  preMarketPrice?: number | null;
  postMarketPrice?: number | null;
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
  postMarketPrice,
  regularPrice,
  currency,
}: MarketHoursSectionProps) {
  const showPre = marketState === 'PRE' && preMarketPrice != null;
  const showPost =
    (marketState === 'POST' || marketState === 'POSTPOST') && postMarketPrice != null;

  if (!showPre && !showPost) return null;

  const extPrice = showPre ? preMarketPrice! : postMarketPrice!;
  const diff = extPrice - regularPrice;
  const diffPct = regularPrice !== 0 ? (diff / regularPrice) * 100 : 0;
  const isUp = diff >= 0;
  const label = showPre ? '프리마켓' : '애프터마켓';
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
            {formatP(diff, currency)} ({isUp ? '+' : ''}
            {diffPct.toFixed(2)}%)
          </p>
        </div>
      </div>
    </section>
  );
}
