import type { StockPrice } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';

interface StockCardProps {
  stock?: StockPrice;
  isLoading?: boolean;
  isError?: boolean;
}

const KR_SYMBOL_SET = new Set<string>(KR_STOCKS.map((s) => s.symbol));

function formatPrice(price: number, currency: string): string {
  if (currency === 'KRW') {
    return price.toLocaleString('ko-KR') + '원';
  }
  return '$' + price.toFixed(2);
}

function formatChange(change: number, currency: string): string {
  const sign = change >= 0 ? '+' : '';
  if (currency === 'KRW') {
    return sign + change.toLocaleString('ko-KR') + '원';
  }
  return sign + '$' + Math.abs(change).toFixed(2) + (change < 0 ? '' : '');
}

function formatPercent(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

function formatVolume(volume: number, currency: string): string {
  if (currency === 'KRW') {
    if (volume >= 100_000_000) return (volume / 100_000_000).toFixed(1) + '억';
    if (volume >= 10_000) return (volume / 10_000).toFixed(0) + '만';
    return volume.toLocaleString('ko-KR');
  }
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(1) + 'M';
  return volume.toLocaleString('en-US');
}

function formatMarketCap(cap: number | null, currency: string): string {
  if (cap === null) return '-';
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

// Skeleton
function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-3/4 mb-3" />
      <div className="h-7 bg-gray-800 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-800 rounded w-2/3 mb-4" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-3 bg-gray-800 rounded" />
        <div className="h-3 bg-gray-800 rounded" />
        <div className="h-3 bg-gray-800 rounded" />
        <div className="h-3 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

export default function StockCard({ stock, isLoading, isError }: StockCardProps) {
  if (isLoading) return <SkeletonCard />;

  if (isError || !stock) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[140px]">
        <p className="text-gray-500 text-sm">데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const colorClass = getPriceColorClass(stock.change);
  const arrow = getArrow(stock.change);
  const isKrx = KR_SYMBOL_SET.has(stock.symbol);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors duration-200">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{stock.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{stock.symbol}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          stock.market === 'kr'
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
        }`}>
          {stock.market === 'kr' ? 'KRX' : 'US'}
        </span>
      </div>

      {/* 가격 */}
      <div className="mt-3 mb-1">
        <p className="text-white text-xl font-bold">{formatPrice(stock.price, stock.currency)}</p>
        <p className={`text-sm font-medium mt-0.5 ${colorClass}`}>
          {arrow} {formatChange(stock.change, stock.currency)} ({formatPercent(stock.changePercent)})
        </p>
      </div>

      {/* 세부 정보 */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">거래량</span>
          <span className="text-gray-300">{formatVolume(stock.volume, stock.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">시총</span>
          <span className="text-gray-300">{formatMarketCap(stock.marketCap, stock.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">고가</span>
          <span className="text-red-400">{formatPrice(stock.high, stock.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">저가</span>
          <span className="text-blue-400">{formatPrice(stock.low, stock.currency)}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-500">전일 종가</span>
          <span className="text-gray-300">{formatPrice(stock.previousClose, stock.currency)}</span>
        </div>
        {isKrx && (
          <div className="flex justify-between col-span-2">
            <span className="text-gray-500">시장</span>
            <span className="text-gray-400 text-xs">{stock.marketState}</span>
          </div>
        )}
      </div>
    </div>
  );
}
