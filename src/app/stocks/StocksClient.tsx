'use client';

import { useStocksData } from '@/hooks/useStocksData';
import MarketStatusBadge from '@/components/features/stocks/MarketStatusBadge';
import RefreshButton from '@/components/features/stocks/RefreshButton';
import StockCard from '@/components/features/stocks/StockCard';
import MacroPanel from '@/components/features/stocks/MacroPanel';
import NewsSection from '@/components/features/stocks/NewsSection';
import DartSection from '@/components/features/stocks/DartSection';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';

export default function StocksClient() {
  const { prices, macro, isLoading, isError, errorMessage, refetch, marketOpen } = useStocksData();

  const krStocks = KR_STOCKS.map((s) =>
    prices?.stocks.find((p) => p.symbol === s.symbol)
  );
  const usStocks = US_STOCKS.map((s) =>
    prices?.stocks.find((p) => p.symbol === s.symbol)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">주식 대시보드</h1>
            <MarketStatusBadge isOpen={marketOpen} />
          </div>
          <RefreshButton onClick={refetch} isLoading={isLoading} />
        </div>

        {/* 전역 에러 */}
        {isError && !isLoading && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/40 rounded-lg flex items-center justify-between gap-4">
            <div>
              <p className="text-red-400 font-medium text-sm">데이터 로드 실패</p>
              <p className="text-red-500/80 text-xs mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={refetch}
              className="shrink-0 px-3 py-1.5 bg-red-800/50 text-red-300 text-xs rounded-lg border border-red-700/50
                         hover:bg-red-700/50 hover:text-red-200 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 거시지표 */}
        <MacroPanel macro={macro} isLoading={isLoading} />

        {/* 한국 / 미국 종목 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* 한국 종목 */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-400 rounded-full inline-block" />
              한국 종목
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {isLoading
                ? Array.from({ length: KR_STOCKS.length }).map((_, i) => (
                    <StockCard key={i} isLoading />
                  ))
                : krStocks.map((stock, i) => (
                    <StockCard
                      key={KR_STOCKS[i].symbol}
                      stock={stock}
                      isLoading={false}
                      isError={isError && !stock}
                    />
                  ))}
            </div>
          </div>

          {/* 미국 종목 */}
          <div>
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-400 rounded-full inline-block" />
              미국 종목
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isLoading
                ? Array.from({ length: US_STOCKS.length }).map((_, i) => (
                    <StockCard key={i} isLoading />
                  ))
                : usStocks.map((stock, i) => (
                    <StockCard
                      key={US_STOCKS[i].symbol}
                      stock={stock}
                      isLoading={false}
                      isError={isError && !stock}
                    />
                  ))}
            </div>
          </div>
        </div>

        {/* 뉴스 + DART 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsSection />
          <DartSection />
        </div>

        {/* 하단 업데이트 시각 */}
        {prices?.fetchedAt && (
          <p className="text-center text-gray-600 text-xs mt-6">
            데이터 기준: {new Date(prices.fetchedAt).toLocaleString('ko-KR')} · 출처: Yahoo Finance, DART
          </p>
        )}
      </div>
    </div>
  );
}
