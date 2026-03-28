'use client';

import { useState, useEffect } from 'react';
import type { KisOrderbookData } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { isKrxRegularSession } from '@/utils/marketHours';

interface KisOrderbookProps {
  orderbook: KisOrderbookData | null;
  currentPrice?: number;
  prevClose?: number;
  isLoading: boolean;
}

function getPriceColor(price: number, prevClose?: number): string {
  if (!prevClose) return 'text-zinc-200';
  if (price > prevClose) return 'text-rose-400';
  if (price < prevClose) return 'text-sky-400';
  return 'text-zinc-400';
}

export default function KisOrderbook({
  orderbook,
  currentPrice,
  prevClose,
  isLoading,
}: KisOrderbookProps) {
  const { tokens: t } = useStocksTheme();
  const [isMarketOpen, setIsMarketOpen] = useState(() => isKrxRegularSession());

  useEffect(() => {
    const id = setInterval(() => setIsMarketOpen(isKrxRegularSession()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 로딩 스켈레톤
  if (isLoading && !orderbook) {
    return (
      <section className={t.detail.card}>
        <div className={t.detail.cardHead}>
          <h3 className={t.detail.cardTitle}>호가창 (10호가)</h3>
        </div>
        <div className="animate-pulse space-y-1 px-2 py-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-6 bg-zinc-800 rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (!orderbook) return null;

  // 매도: askPrices[0]=매도1(최저)~askPrices[9]=매도10(최고)
  // 화면: 위=높은가(매도10), 아래=낮은가(매도1) → index 9→0 순
  const askRows = [...orderbook.askPrices]
    .map((price, i) => ({ price, volume: orderbook.askVolumes[i] }))
    .reverse(); // [9→0]: 위가 높은 가격

  // 매수: bidPrices[0]=매수1(최고)~bidPrices[9]=매수10(최저)
  // 화면: 위=높은가(매수1), 아래=낮은가(매수10) → index 0→9 순 (그대로)
  const bidRows = orderbook.bidPrices.map((price, i) => ({
    price,
    volume: orderbook.bidVolumes[i],
  }));

  const maxAskVol = Math.max(...orderbook.askVolumes, 1);
  const maxBidVol = Math.max(...orderbook.bidVolumes, 1);

  return (
    <section className={t.detail.card}>
      {/* 헤더 */}
      <div className={t.detail.cardHead}>
        <h3 className={t.detail.cardTitle}>호가창 (10호가)</h3>
        <div className="flex items-center gap-2">
          {!isMarketOpen && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-600/30 bg-zinc-700/20 text-zinc-400">
              장 마감
            </span>
          )}
          {orderbook.time && (
            <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
              {orderbook.time.slice(0, 2)}:{orderbook.time.slice(2, 4)}:{orderbook.time.slice(4, 6)}
            </span>
          )}
        </div>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-[1fr_auto_1fr] text-[9px] font-bold uppercase tracking-wider border-b border-zinc-800/60">
        <div className="px-3 py-1.5 text-sky-400 text-right">잔량</div>
        <div className="px-3 py-1.5 text-zinc-400 text-center min-w-[80px]">호가</div>
        <div className="px-3 py-1.5 text-rose-400 text-left">잔량</div>
      </div>

      {/* 매도 호가 (위=높은가, 아래=낮은가) */}
      {askRows.map(({ price, volume }, idx) => {
        const barWidth = Math.round((volume / maxAskVol) * 100);
        const isCurrentPriceLine =
          currentPrice !== undefined && price === currentPrice;
        return (
          <div
            key={`ask-${idx}`}
            className={`grid grid-cols-[1fr_auto_1fr] items-center border-b border-zinc-800/30 bg-sky-500/5 ${isCurrentPriceLine ? 'border-l-2 border-l-amber-400' : ''}`}
          >
            {/* 매도 잔량 막대 — 오른쪽 정렬 */}
            <div className="flex flex-row-reverse items-center px-1 py-1 gap-1">
              <span className={`text-[11px] font-mono tabular-nums text-right text-sky-300/80 min-w-[48px]`}>
                {volume.toLocaleString('ko-KR')}
              </span>
              <div className="flex-1 flex justify-end overflow-hidden">
                <div
                  className="h-3 bg-sky-500/30 rounded-sm"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
            {/* 매도 호가 가격 */}
            <div className={`px-3 py-1 text-center min-w-[80px] text-[12px] font-mono tabular-nums font-semibold ${getPriceColor(price, prevClose)}`}>
              {price.toLocaleString('ko-KR')}
            </div>
            {/* 매수 쪽 빈 공간 */}
            <div className="px-1 py-1" />
          </div>
        );
      })}

      {/* 매수 호가 (위=높은가, 아래=낮은가) */}
      {bidRows.map(({ price, volume }, idx) => {
        const barWidth = Math.round((volume / maxBidVol) * 100);
        const isCurrentPriceLine =
          currentPrice !== undefined && price === currentPrice;
        return (
          <div
            key={`bid-${idx}`}
            className={`grid grid-cols-[1fr_auto_1fr] items-center border-b border-zinc-800/30 bg-rose-500/5 ${isCurrentPriceLine ? 'border-l-2 border-l-amber-400' : ''}`}
          >
            {/* 매도 쪽 빈 공간 */}
            <div className="px-1 py-1" />
            {/* 매수 호가 가격 */}
            <div className={`px-3 py-1 text-center min-w-[80px] text-[12px] font-mono tabular-nums font-semibold ${getPriceColor(price, prevClose)}`}>
              {price.toLocaleString('ko-KR')}
            </div>
            {/* 매수 잔량 막대 — 왼쪽 정렬 */}
            <div className="flex items-center px-1 py-1 gap-1">
              <div className="flex-1 overflow-hidden">
                <div
                  className="h-3 bg-rose-500/30 rounded-sm"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className={`text-[11px] font-mono tabular-nums text-left text-rose-300/80 min-w-[48px]`}>
                {volume.toLocaleString('ko-KR')}
              </span>
            </div>
          </div>
        );
      })}

      {/* 총 잔량 푸터 */}
      <div className="grid grid-cols-[1fr_auto_1fr] border-t border-zinc-700/50 bg-zinc-900/60">
        <div className="px-3 py-2 text-right">
          <p className="text-[9px] uppercase tracking-wide text-zinc-500 mb-0.5">총매도잔량</p>
          <p className="text-[11px] font-mono font-semibold tabular-nums text-sky-400">
            {orderbook.totalAskVolume.toLocaleString('ko-KR')}
          </p>
        </div>
        <div className="px-3 py-2 flex items-center">
          <div className="w-px h-full bg-zinc-700/50" />
        </div>
        <div className="px-3 py-2 text-left">
          <p className="text-[9px] uppercase tracking-wide text-zinc-500 mb-0.5">총매수잔량</p>
          <p className="text-[11px] font-mono font-semibold tabular-nums text-rose-400">
            {orderbook.totalBidVolume.toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
    </section>
  );
}
