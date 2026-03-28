'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { StockPrice } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { symbolToSlug } from '@/utils/stockSymbol';

interface StockCardProps {
  stock?: StockPrice;
  isLoading?: boolean;
  isError?: boolean;
}

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol));

function finite(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatPrice(price: number | null | undefined, currency: string): string {
  const p = finite(price);
  if (currency === 'KRW') {
    return p.toLocaleString('ko-KR') + '원';
  }
  return '$' + p.toFixed(2);
}

function formatChange(change: number | null | undefined, currency: string): string {
  const c = finite(change);
  const sign = c >= 0 ? '+' : '';
  if (currency === 'KRW') {
    return sign + c.toLocaleString('ko-KR') + '원';
  }
  return sign + '$' + Math.abs(c).toFixed(2) + (c < 0 ? '' : '');
}

function formatPercent(pct: number | null | undefined): string {
  const p = finite(pct);
  const sign = p >= 0 ? '+' : '';
  return sign + p.toFixed(2) + '%';
}

function formatVolume(volume: number | null | undefined, currency: string): string {
  const v = finite(volume);
  if (currency === 'KRW') {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억';
    if (v >= 10_000) return (v / 10_000).toFixed(0) + '만';
    return v.toLocaleString('ko-KR');
  }
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  return v.toLocaleString('en-US');
}

function formatMarketCap(cap: number | null, currency: string): string {
  if (cap === null) return '—';
  if (currency === 'KRW') {
    if (cap >= 1_000_000_000_000) return (cap / 1_000_000_000_000).toFixed(1) + '조';
    if (cap >= 100_000_000) return (cap / 100_000_000).toFixed(0) + '억';
    return cap.toLocaleString('ko-KR');
  }
  if (cap >= 1_000_000_000_000) return '$' + (cap / 1_000_000_000_000).toFixed(2) + 'T';
  if (cap >= 1_000_000_000) return '$' + (cap / 1_000_000_000).toFixed(1) + 'B';
  if (cap >= 1_000_000) return '$' + (cap / 1_000_000).toFixed(1) + 'M';
  return '$' + cap.toLocaleString('en-US');
}

function getArrow(change: number | null | undefined): string {
  const c = finite(change);
  if (c > 0) return '▲';
  if (c < 0) return '▼';
  return '—';
}

export default function StockCard({ stock, isLoading, isError }: StockCardProps) {
  const { tokens } = useStocksTheme();
  const c = tokens.stockCard;

  function colorClass(change: number | null | undefined): string {
    const x = finite(change);
    if (x > 0) return tokens.quote.up;
    if (x < 0) return tokens.quote.down;
    return tokens.quote.neutral;
  }

  if (isLoading) {
    return (
      <div className={c.skeleton}>
        <div className={`h-4 ${c.skeletonBar} w-2/3 mb-3`} />
        <div className={`h-8 ${c.skeletonBar} w-1/2 mb-4`} />
        <div className={`h-3 ${c.skeletonBar} w-full mb-2`} />
        <div className={`h-3 ${c.skeletonBar} w-full mb-2`} />
        <div className={`h-3 ${c.skeletonBar} w-full`} />
      </div>
    );
  }

  if (isError || !stock) {
    return (
      <div className={c.errorBox}>
        <p className={c.errorText}>데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const ch = colorClass(stock.change);
  const arrow = getArrow(stock.change);
  const isKrx = KR_SYMBOL_SET.has(stock.symbol);
  const accentLeft = stock.market === 'kr' ? 'border-l-[3px] border-l-sky-500' : 'border-l-[3px] border-l-violet-500';
  const accentHoverFull =
    stock.market === 'kr'
      ? 'hover:border-[3px] hover:border-sky-500'
      : 'hover:border-[3px] hover:border-violet-500';

  const Row = ({ alt, children }: { alt: boolean; children: ReactNode }) => (
    <div className={alt ? c.statRowAlt : c.statRow}>{children}</div>
  );

  return (
    <Link
      href={`/stocks/${symbolToSlug(stock.symbol)}`}
      className={`${c.wrap} ${accentLeft} ${accentHoverFull} block no-underline`}
    >
      <div className={c.headerRow}>
        <div className="min-w-0">
          <p className={c.title}>{stock.name}</p>
          <p className={c.symbol}>{stock.symbol}</p>
        </div>
        <span className={stock.market === 'kr' ? c.badgeKr : c.badgeUs}>
          {stock.market === 'kr' ? 'KRX' : 'US'}
        </span>
      </div>

      <div className={c.quoteShell}>
        <p className={c.price}>{formatPrice(stock.price, stock.currency)}</p>
        <p className={`${c.changeLine} ${ch}`}>
          {arrow} {formatChange(stock.change, stock.currency)} · {formatPercent(stock.changePercent)}
        </p>
      </div>

      <div className={c.statsWrap}>
        <Row alt={false}>
          <span className={c.label}>거래량</span>
          <span className={c.value}>{formatVolume(stock.volume, stock.currency)}</span>
        </Row>
        <Row alt={true}>
          <span className={c.label}>시총</span>
          <span className={c.value}>{formatMarketCap(stock.marketCap, stock.currency)}</span>
        </Row>
        <Row alt={false}>
          <span className={c.label}>고가</span>
          <span className={c.high}>{formatPrice(stock.high, stock.currency)}</span>
        </Row>
        <Row alt={true}>
          <span className={c.label}>저가</span>
          <span className={c.low}>{formatPrice(stock.low, stock.currency)}</span>
        </Row>
        <Row alt={false}>
          <span className={c.label}>전일 종가</span>
          <span className={c.value}>{formatPrice(stock.previousClose, stock.currency)}</span>
        </Row>
        {isKrx && (
          <Row alt={true}>
            <span className={c.label}>세션</span>
            <span className={c.session}>{stock.marketState}</span>
          </Row>
        )}
      </div>
    </Link>
  );
}
