'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { StockPrice } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { symbolToSlug } from '@/utils/stockSymbol';
import {
  finite,
  formatPriceSimple,
  formatChange,
  formatPercent,
  formatVolume,
  formatMarketCap,
} from '@/utils/stockFormatting';

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
        <p className={c.price}>{formatPriceSimple(stock.price, stock.currency)}</p>
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
          <span className={c.high}>{formatPriceSimple(stock.high, stock.currency)}</span>
        </Row>
        <Row alt={true}>
          <span className={c.label}>저가</span>
          <span className={c.low}>{formatPriceSimple(stock.low, stock.currency)}</span>
        </Row>
        <Row alt={false}>
          <span className={c.label}>전일 종가</span>
          <span className={c.value}>{formatPriceSimple(stock.previousClose, stock.currency)}</span>
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
