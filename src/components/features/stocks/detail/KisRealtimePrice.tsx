'use client';

import { useRef, useEffect, useState } from 'react';
import type { KisTradeData } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { isKrxRegularSession } from '@/lib/stocks/marketHours';
import { formatVolume } from '@/lib/stocks/stockFormatting';

interface KisRealtimePriceProps {
  trade: KisTradeData | null;
  isConnected: boolean;
  isLoading: boolean;
  error?: string | null;
}

function formatTime(hhmmss: string): string {
  if (hhmmss.length !== 6) return hhmmss;
  return `${hhmmss.slice(0, 2)}:${hhmmss.slice(2, 4)}:${hhmmss.slice(4, 6)}`;
}

function getChangeColor(changeSign: string): string {
  if (changeSign === '1' || changeSign === '2') return 'text-rose-400';
  if (changeSign === '4' || changeSign === '5') return 'text-sky-400';
  return 'text-zinc-400';
}

export default function KisRealtimePrice({
  trade,
  isConnected,
  isLoading,
  error,
}: KisRealtimePriceProps) {
  const { tokens: t } = useStocksTheme();
  const prevPriceRef = useRef<number | null>(null);
  const [flashClass, setFlashClass] = useState('');
  const [isMarketOpen, setIsMarketOpen] = useState(() => isKrxRegularSession());

  // 장 운영 여부 1분마다 갱신
  useEffect(() => {
    const id = setInterval(() => setIsMarketOpen(isKrxRegularSession()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 가격 변동 flash 효과
  useEffect(() => {
    if (!trade) return;
    const prev = prevPriceRef.current;
    if (prev !== null && prev !== trade.price) {
      const cls =
        trade.price > prev
          ? 'bg-rose-500/10 transition-colors duration-300'
          : 'bg-sky-500/10 transition-colors duration-300';
      setFlashClass(cls);
      const timer = setTimeout(() => setFlashClass(''), 400);
      prevPriceRef.current = trade.price;
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = trade.price;
  }, [trade?.price]); // eslint-disable-line react-hooks/exhaustive-deps

  // 로딩 스켈레톤
  if (isLoading && !trade) {
    return (
      <section className={`${t.detail.card} animate-pulse`}>
        <div className="space-y-3 px-4 py-4">
          <div className="h-8 w-40 rounded bg-zinc-800" />
          <div className="h-4 w-24 rounded bg-zinc-800" />
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-800" />
            <div className="h-4 w-16 rounded bg-zinc-800" />
          </div>
        </div>
      </section>
    );
  }

  // 에러
  if (error && !trade) {
    return (
      <section className={t.detail.card}>
        <div className="px-4 py-3 font-mono text-xs text-red-400">{error}</div>
      </section>
    );
  }

  if (!trade) return null;

  const changeColor = getChangeColor(trade.changeSign);
  const changePrefix =
    trade.changeSign === '1' || trade.changeSign === '2'
      ? '+'
      : trade.changeSign === '3'
        ? ''
        : '-';
  const absChange = Math.abs(trade.change);
  const absChangePercent = Math.abs(trade.changePercent);

  return (
    <section className={`${t.detail.card} ${flashClass}`}>
      <div className={t.detail.cardHead}>
        <h3 className={t.detail.cardTitle}>실시간 체결가</h3>
        <div className="flex items-center gap-2">
          {/* 장 마감 배지 */}
          {!isMarketOpen && (
            <span className="rounded border border-zinc-600/30 bg-zinc-700/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              장 마감
            </span>
          )}
          {/* LIVE 배지 */}
          {isConnected && isMarketOpen && (
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          )}
          {/* 체결 시각 */}
          {trade.time && (
            <span className="font-mono text-[10px] tabular-nums text-zinc-500">
              {formatTime(trade.time)}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* 현재가 + 전일대비 */}
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold tabular-nums text-white">
            {trade.price.toLocaleString('ko-KR')}원
          </span>
          <span className={`font-mono text-sm font-semibold ${changeColor}`}>
            {changePrefix}
            {absChange.toLocaleString('ko-KR')}원 ({changePrefix}
            {absChangePercent.toFixed(2)}%)
          </span>
        </div>

        {/* 시가 / 고가 / 저가 */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] uppercase tracking-wide ${t.detail.rowLabel}`}>시가</span>
            <span className="font-mono text-xs tabular-nums text-zinc-300">
              {trade.open.toLocaleString('ko-KR')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] uppercase tracking-wide ${t.detail.rowLabel}`}>고가</span>
            <span className={`font-mono text-xs tabular-nums ${t.quote.up}`}>
              {trade.high.toLocaleString('ko-KR')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] uppercase tracking-wide ${t.detail.rowLabel}`}>저가</span>
            <span className={`font-mono text-xs tabular-nums ${t.quote.down}`}>
              {trade.low.toLocaleString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 누적거래량 */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`text-[10px] uppercase tracking-wide ${t.detail.rowLabel}`}>
            누적거래량
          </span>
          <span className="font-mono text-xs tabular-nums text-zinc-300">
            {formatVolume(trade.volume)}주
          </span>
        </div>
      </div>
    </section>
  );
}
