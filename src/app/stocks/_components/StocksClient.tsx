'use client';

import { useStocksData } from '@/hooks/useStocksData';
import { StocksThemeProvider, useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import StocksThemeToggle from '@/components/features/stocks/StocksThemeToggle';
import MarketStatusBadge from '@/components/features/stocks/MarketStatusBadge';
import RefreshButton from '@/components/features/stocks/RefreshButton';
import StockCard from '@/components/features/stocks/StockCard';
import MacroPanel from '@/components/features/stocks/MacroPanel';
import NewsSection from '@/components/features/stocks/NewsSection';
import DartSection from '@/components/features/stocks/DartSection';
import { KR_STOCKS, US_STOCKS } from '@/types/stocks';
import { SectorHeatmap } from '@/components/features/stocks/SectorHeatmap';
import { KospiFuturesCard } from '@/components/features/stocks/KospiFuturesCard';
import { FearGreedBar } from '@/components/features/stocks/FearGreedBar';

export default function StocksClient() {
  return (
    <StocksThemeProvider>
      <StocksDashboard />
    </StocksThemeProvider>
  );
}

function StocksDashboard() {
  const { prices, macro, isLoading, isRefreshing, isError, errorMessage, refetch, refetchPrices, marketOpen, krMarketState, usMarketState } = useStocksData();
  const { tokens: t } = useStocksTheme();

  const krStocks = KR_STOCKS.map((s) => prices?.stocks.find((p) => p.symbol === s.symbol));
  const usStocks = US_STOCKS.map((s) => prices?.stocks.find((p) => p.symbol === s.symbol));

  return (
    <div className={t.layout.page}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className={t.layout.toolbar}>
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className={t.layout.toolbarTitle}>주가 대시보드</h1>
              <div className="flex items-center gap-2">
                <MarketStatusBadge state={krMarketState} market="kr" />
                <MarketStatusBadge state={usMarketState} market="us" />
              </div>
            </div>
            <p className={t.layout.toolbarSubtitle}>Korea · US watchlist · Yahoo Finance</p>
          </div>
          <div className={t.layout.toolbarActions}>
            <StocksThemeToggle />
            <RefreshButton onClick={refetchPrices} isLoading={isRefreshing} />
          </div>
        </header>

        {/* Sector Heatmap + KOSPI Futures */}
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_260px]">
          <SectorHeatmap />
          <KospiFuturesCard />
        </div>

        {isError && !isLoading && (
          <div className={t.layout.errorBanner}>
            <div>
              <p className={t.layout.errorTitle}>데이터 로드 실패</p>
              <p className={t.layout.errorDetail}>{errorMessage}</p>
            </div>
            <button type="button" onClick={refetch} className={t.layout.errorRetry}>
              다시 시도
            </button>
          </div>
        )}

        <div className={t.layout.workspace}>
          <MacroPanel macro={macro} isLoading={isLoading} />

          {/* 시장 심리 (공포탐욕지수 + VIX) */}
          <FearGreedBar />

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <section className={t.layout.krMarketShell}>
              <div className={t.layout.sectionHeadRow}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={t.layout.sectionAccentKr} aria-hidden />
                  <h2 className={t.layout.sectionTitle}>한국 시장</h2>
                </div>
                <span className={t.layout.sectionMeta}>KRX</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading
                  ? KR_STOCKS.map((meta) => <StockCard key={meta.symbol} isLoading />)
                  : krStocks.map((stock, i) => (
                      <StockCard
                        key={KR_STOCKS[i].symbol}
                        stock={stock}
                        isLoading={false}
                        isError={isError && !stock}
                      />
                    ))}
              </div>
            </section>

            <section className={t.layout.usMarketShell}>
              <div className={t.layout.sectionHeadRow}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className={t.layout.sectionAccentUs} aria-hidden />
                  <h2 className={t.layout.sectionTitle}>미국 시장</h2>
                </div>
                <span className={t.layout.sectionMeta}>NYSE · NASDAQ</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading
                  ? US_STOCKS.map((meta) => <StockCard key={meta.symbol} isLoading />)
                  : usStocks.map((stock, i) => (
                      <StockCard
                        key={US_STOCKS[i].symbol}
                        stock={stock}
                        isLoading={false}
                        isError={isError && !stock}
                      />
                    ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <NewsSection />
          <DartSection />
        </div>

        {prices?.fetchedAt && (
          <p className={t.layout.footer}>
            데이터 기준 · {new Date(prices.fetchedAt).toLocaleString('ko-KR')} · Yahoo Finance, DART
          </p>
        )}
      </div>
    </div>
  );
}
