'use client';

import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

interface MarketStatusBadgeProps {
  isOpen: boolean;
}

export default function MarketStatusBadge({ isOpen }: MarketStatusBadgeProps) {
  const { tokens } = useStocksTheme();
  const b = tokens.marketBadge;

  if (isOpen) {
    return (
      <span className={b.live}>
        <span className={b.liveDot} />
        Live
      </span>
    );
  }

  return (
    <span className={b.closed}>
      <span className={b.closedDot} />
      장마감
    </span>
  );
}
