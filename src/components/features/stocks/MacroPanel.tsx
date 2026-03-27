import type { MacroData, MacroIndicator } from '@/types/stocks';

interface MacroPanelProps {
  macro: MacroData | null;
  isLoading: boolean;
}

function getPriceColorClass(change: number): string {
  if (change > 0) return 'text-red-400';
  if (change < 0) return 'text-blue-400';
  return 'text-gray-400';
}

function getArrow(change: number): string {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '—';
}

function formatPrice(indicator: MacroIndicator): string {
  if (indicator.symbol === 'USDKRW=X') {
    return indicator.price.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '원';
  }
  if (indicator.symbol === '^TNX') {
    return indicator.price.toFixed(3) + '%';
  }
  return indicator.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatPercent(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'currency': return '환율';
    case 'bond': return '채권';
    case 'index': return '지수';
    default: return category;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'currency': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'bond': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'index': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-gray-700 text-gray-400';
  }
}

function SkeletonItem() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-2/3 mb-2" />
      <div className="h-5 bg-gray-800 rounded w-1/2 mb-1.5" />
      <div className="h-3 bg-gray-800 rounded w-1/3" />
    </div>
  );
}

function MacroItem({ indicator }: { indicator: MacroIndicator }) {
  const colorClass = getPriceColorClass(indicator.change);
  const arrow = getArrow(indicator.change);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-300 text-xs font-medium truncate">{indicator.displayName}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded border text-[10px] shrink-0 ml-1 ${getCategoryColor(indicator.category)}`}>
          {getCategoryLabel(indicator.category)}
        </span>
      </div>
      <p className="text-white font-bold text-base">{formatPrice(indicator)}</p>
      <p className={`text-xs mt-0.5 ${colorClass}`}>
        {arrow} {formatPercent(indicator.changePercent)}
      </p>
    </div>
  );
}

export default function MacroPanel({ macro, isLoading }: MacroPanelProps) {
  const allIndicators = macro
    ? [...macro.currency, ...macro.bond, ...macro.index]
    : [];

  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-yellow-400 rounded-full inline-block" />
        거시지표
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonItem key={i} />)
          : allIndicators.map((indicator) => (
              <MacroItem key={indicator.symbol} indicator={indicator} />
            ))}
      </div>
    </div>
  );
}
