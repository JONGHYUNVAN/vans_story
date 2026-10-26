'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { StockPrice } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { symbolToSlug } from '@/lib/stocks/stockSymbol';
import {
  finite,
  formatPriceSimple,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from '@/lib/stocks/stockFormatting';
import { useStocksTheme } from './StocksThemeContext';

interface StockCardProps {
  stock?: StockPrice;
  isLoading?: boolean;
  isError?: boolean;
}

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol));

function getArrow(change: number | null | undefined): string {
  const c = finite(change);
  if (c > 0) return '▲';
  if (c < 0) return '▼';
  return '—';
}

// 통계 행 (컴포넌트 내부 정의 시 매 렌더마다 재생성되므로 모듈 스코프로 분리)
function Row({ className, children }: { className: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
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
        <div className={`h-4 ${c.skeletonBar} mb-3 w-2/3`} />
        <div className={`h-8 ${c.skeletonBar} mb-4 w-1/2`} />
        <div className={`h-3 ${c.skeletonBar} mb-2 w-full`} />
        <div className={`h-3 ${c.skeletonBar} mb-2 w-full`} />
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
  const accentLeft =
    stock.market === 'kr'
      ? 'border-l-[3px] border-l-sky-500'
      : 'border-l-[3px] border-l-violet-500';
  const accentHoverFull =
    stock.market === 'kr'
      ? 'hover:border-[3px] hover:border-sky-500'
      : 'hover:border-[3px] hover:border-violet-500';

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
        <p className={c.price}>{formatPriceSimple(stock.price, stock.currency)}</p>
        <p className={`${c.changeLine} ${ch}`}>
          {arrow} {formatChange(stock.change, stock.currency)} ·{' '}
          {formatPercent(stock.changePercent)}
        </p>
      </div>

      <div className={c.statsWrap}>
        <Row className={c.statRow}>
          <span className={c.label}>거래량</span>
          <span className={c.value}>{formatVolume(stock.volume, stock.currency)}</span>
        </Row>
        <Row className={c.statRowAlt}>
          <span className={c.label}>시총</span>
          <span className={c.value}>{formatMarketCap(stock.marketCap, stock.currency)}</span>
        </Row>
        <Row className={c.statRow}>
          <span className={c.label}>고가</span>
          <span className={c.high}>{formatPriceSimple(stock.high, stock.currency)}</span>
        </Row>
        <Row className={c.statRowAlt}>
          <span className={c.label}>저가</span>
          <span className={c.low}>{formatPriceSimple(stock.low, stock.currency)}</span>
        </Row>
        <Row className={c.statRow}>
          <span className={c.label}>전일 종가</span>
          <span className={c.value}>{formatPriceSimple(stock.previousClose, stock.currency)}</span>
        </Row>
        {isKrx && (
          <Row className={c.statRowAlt}>
            <span className={c.label}>세션</span>
            <span className={c.session}>{stock.marketState}</span>
          </Row>
        )}
      </div>
    </Link>
  );
}
