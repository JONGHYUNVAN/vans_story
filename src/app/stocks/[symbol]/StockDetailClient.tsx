'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StocksThemeProvider, useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import StocksThemeToggle from '@/components/features/stocks/StocksThemeToggle';
import RefreshButton from '@/components/features/stocks/RefreshButton';
import NewsSection from '@/components/features/stocks/NewsSection';
import DartSection from '@/components/features/stocks/DartSection';
import PriceChart from '@/components/features/stocks/detail/PriceChart';
import KeyMetricsGrid from '@/components/features/stocks/detail/KeyMetricsGrid';
import RelatedStocksSection from '@/components/features/stocks/detail/RelatedStocksSection';
import MacroRelatedSection from '@/components/features/stocks/detail/MacroRelatedSection';
import MarketHoursSection from '@/components/features/stocks/detail/MarketHoursSection';
import StockRelationBlock from '@/components/features/stocks/detail/StockRelationBlock';
import IndicatorExplainBlock from '@/components/features/stocks/detail/IndicatorExplainBlock';
import InvestorTrendBlock from '@/components/features/stocks/detail/InvestorTrendBlock';
import FundamentalsBlock from '@/components/features/stocks/detail/FundamentalsBlock';
import KisRealtimePrice from '@/components/features/stocks/detail/KisRealtimePrice';
import KisOrderbook from '@/components/features/stocks/detail/KisOrderbook';
import { useKisRealtime } from '@/hooks/useKisRealtime';
import { useUsRealtime } from '@/hooks/useUsRealtime';
import { useStockDetail } from '@/hooks/useStockDetail';
import { MACRO_SYMBOLS, STOCK_DISPLAY_NAME } from '@/types/stocks';
import { getStockRelation } from '@/constants/stockRelations';
import { getSymbolType } from '@/utils/stockSymbol';
import {
  formatPriceDetailed,
  formatVolume,
  formatMarketCap,
} from '@/utils/stockFormatting';

interface Props {
  symbol: string;
}

export default function StockDetailClient({ symbol }: Props) {
  return (
    <StocksThemeProvider>
      <StockDetailInner symbol={symbol} />
    </StocksThemeProvider>
  );
}

function getTypeBadge(symbol: string, type: string): string {
  if (type === 'kr') return '국장';
  if (type === 'us') return '미장';
  if (symbol === 'USDKRW=X') return '환율';
  if (symbol === '^TNX') return '채권';
  return '지수';
}

function StockDetailInner({ symbol }: Props) {
  const { tokens: t } = useStocksTheme();
  const {
    detail, isLoading, isRefreshing, isError, errorMessage,
    refetch: fetchDetail,
  } = useStockDetail(symbol);
  const [rangeStats, setRangeStats] = useState<{
    range: string; firstClose: number; lastClose: number;
  } | null>(null);

  const relation = getStockRelation(symbol);
  const symbolType = getSymbolType(symbol);

  // 국장 종목일 때만 KIS 실시간 훅 사용
  const kisRealtime = useKisRealtime(symbolType === 'kr' ? symbol : null);
  // 미장 종목일 때만 US 실시간 폴링 훅 사용
  const usRealtime = useUsRealtime(symbolType === 'us' ? symbol : null);

  const macroMeta = MACRO_SYMBOLS.find((m) => m.symbol === symbol);
  // 상세 API가 반환한 name을 최우선으로 사용해, watchlist 밖 심볼도 종목명이 보이도록 함
  const displayName = detail?.name ?? STOCK_DISPLAY_NAME[symbol] ?? macroMeta?.displayName ?? symbol;

  const typeBadge = detail
    ? getTypeBadge(symbol, detail.type)
    : getTypeBadge(symbol, symbolType);
  const badgeColor =
    symbolType === 'kr'
      ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
      : symbolType === 'us'
        ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
        : 'border-amber-500/30 bg-amber-500/10 text-amber-300';

  // 실시간 데이터 우선 사용: 국장 → KIS, 미장 → US polling
  const displayPrice =
    symbolType === 'kr'
      ? (kisRealtime.trade?.price ?? detail?.quote.price ?? 0)
      : symbolType === 'us'
        ? (usRealtime.price ?? detail?.quote.price ?? 0)
        : (detail?.quote.price ?? 0);

  const displayChange =
    symbolType === 'kr'
      ? (kisRealtime.trade?.change ?? detail?.quote.change ?? 0)
      : symbolType === 'us'
        ? (usRealtime.change ?? detail?.quote.change ?? 0)
        : (detail?.quote.change ?? 0);

  const rangeChangePercent = rangeStats && rangeStats.firstClose > 0
    ? ((rangeStats.lastClose - rangeStats.firstClose) / rangeStats.firstClose) * 100
    : null;

  const displayChangePercent =
    (rangeStats === null || rangeStats.range === '1D')
      ? (symbolType === 'kr'
          ? (kisRealtime.trade?.changePercent ?? detail?.quote.changePercent ?? 0)
          : symbolType === 'us'
            ? (usRealtime.changePercent ?? detail?.quote.changePercent ?? 0)
            : (detail?.quote.changePercent ?? 0))
      : (rangeChangePercent ?? detail?.quote.changePercent ?? 0);
  const displayCurrency = detail?.quote.currency ?? 'KRW';

  const priceColorClass =
    displayChange > 0
      ? 'text-rose-400'
      : displayChange < 0
        ? 'text-sky-400'
        : 'text-zinc-400';

  const keyMetrics = detail
    ? [
        {
          label: '시가',
          value: formatPriceDetailed(detail.quote.open, detail.quote.currency, symbol),
        },
        {
          label: '고가',
          value: formatPriceDetailed(detail.quote.high, detail.quote.currency, symbol),
          color: t.quote.up,
        },
        {
          label: '저가',
          value: formatPriceDetailed(detail.quote.low, detail.quote.currency, symbol),
          color: t.quote.down,
        },
        {
          label: '거래량',
          value: formatVolume(detail.quote.volume, detail.quote.currency),
        },
        {
          label: '시가총액',
          value: formatMarketCap(detail.quote.marketCap, detail.quote.currency),
        },
        {
          label: '52주 범위',
          value:
            detail.quote.fiftyTwoWeekLow != null && detail.quote.fiftyTwoWeekHigh != null
              ? `${formatPriceDetailed(detail.quote.fiftyTwoWeekLow, detail.quote.currency, symbol)} ~ ${formatPriceDetailed(detail.quote.fiftyTwoWeekHigh, detail.quote.currency, symbol)}`
              : '—',
        },
      ]
    : [];

  return (
    <div className={t.layout.page}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <header className={t.layout.toolbar}>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/stocks"
                className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1"
              >
                ← 대시보드
              </Link>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}
              >
                {typeBadge}
              </span>
            </div>
            <h1 className={t.layout.toolbarTitle}>{displayName}</h1>
            <p className={t.layout.toolbarSubtitle}>{symbol}</p>
            {(detail || kisRealtime.trade) && (
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold tabular-nums text-white">
                  {formatPriceDetailed(displayPrice, displayCurrency, symbol)}
                </span>
                <span className={`text-sm font-semibold font-mono ${priceColorClass}`}>
                  {displayChange >= 0 ? '+' : ''}
                  {formatPriceDetailed(displayChange, displayCurrency, symbol)}{' '}
                  ({displayChangePercent >= 0 ? '+' : ''}
                  {displayChangePercent.toFixed(2)}%)
                  {rangeStats && rangeStats.range !== '1D' && (
                    <span className="text-xs text-gray-400 ml-1">({rangeStats.range})</span>
                  )}
                </span>
              </div>
            )}
          </div>
          <div className={t.layout.toolbarActions}>
            <StocksThemeToggle />
            <RefreshButton onClick={fetchDetail} isLoading={isRefreshing} />
          </div>
        </header>

        {/* 에러 */}
        {isError && !isLoading && (
          <div className={t.layout.errorBanner}>
            <div>
              <p className={t.layout.errorTitle}>데이터 로드 실패</p>
              <p className={t.layout.errorDetail}>{errorMessage}</p>
            </div>
            <button type="button" onClick={fetchDetail} className={t.layout.errorRetry}>
              다시 시도
            </button>
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-[200px] bg-zinc-800 rounded-xl" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-800 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* 메인 콘텐츠: 최초 로드 후엔 새로고침 시에도 숨기지 않음 */}
        {detail && (
          <div className={`space-y-6 transition-opacity duration-150 ${isRefreshing ? 'opacity-70' : 'opacity-100'}`}>
            {/* 국장: KIS 실시간 현재가 */}
            {symbolType === 'kr' && (
              <KisRealtimePrice
                trade={kisRealtime.trade}
                isConnected={kisRealtime.isConnected}
                isLoading={kisRealtime.isLoading}
                error={kisRealtime.error}
              />
            )}

            {/* 차트 */}
            <PriceChart
              data={detail.chart}
              currency={detail.quote.currency}
              symbol={symbol}
              prevClose={kisRealtime.trade?.prevClose ?? detail.quote.previousClose}
              onRangeStats={(range, firstClose, lastClose) =>
                setRangeStats({ range, firstClose, lastClose })
              }
            />

            {/* 국장: KIS 호가창 */}
            {symbolType === 'kr' && (
              <KisOrderbook
                orderbook={kisRealtime.orderbook}
                currentPrice={kisRealtime.trade?.price ?? detail.quote.price}
                prevClose={kisRealtime.trade?.prevClose ?? detail.quote.previousClose}
                isLoading={kisRealtime.isLoading}
              />
            )}

            {/* 국장: 핵심 지표 + 투자자/펀더멘털 */}
            {symbolType === 'kr' && (
              <>
                <KeyMetricsGrid metrics={keyMetrics} />
                {detail.fundamentals && (
                  <FundamentalsBlock
                    fundamentals={detail.fundamentals}
                    consensus={detail.consensus ?? null}
                    consensusBySource={detail.consensusBySource}
                    peers={detail.peers ?? null}
                    currentPrice={detail.quote.price}
                  />
                )}
                {detail.investors && detail.investors.length > 0 && (
                  <InvestorTrendBlock investors={detail.investors} />
                )}
              </>
            )}

            {/* 미장: 핵심 지표 */}
            {symbolType === 'us' && (
              <KeyMetricsGrid metrics={keyMetrics} />
            )}

            {/* 미장: 컨센서스 */}
            {symbolType === 'us' && detail.consensusBySource.length > 0 && (
              <FundamentalsBlock
                fundamentals={{ per: null, forwardPer: null, pbr: null, eps: null, bps: null,
                                dividendYield: null, marketValueStr: null, tradingValueStr: null,
                                foreignHoldRatio: null, week52High: null, week52Low: null }}
                consensus={detail.consensus ?? null}
                consensusBySource={detail.consensusBySource}
                peers={null}
                currentPrice={detail.quote.price}
              />
            )}

            {/* 미장: 프리/애프터 마켓 */}
            {symbolType === 'us' && (
              <MarketHoursSection
                marketState={detail.quote.marketState}
                preMarketPrice={usRealtime.preMarketPrice ?? detail.quote.preMarketPrice}
                preMarketChange={usRealtime.preMarketChange ?? detail.quote.preMarketChange}
                preMarketChangePercent={usRealtime.preMarketChangePercent ?? detail.quote.preMarketChangePercent}
                postMarketPrice={usRealtime.postMarketPrice ?? detail.quote.postMarketPrice}
                postMarketChange={usRealtime.postMarketChange ?? detail.quote.postMarketChange}
                postMarketChangePercent={usRealtime.postMarketChangePercent ?? detail.quote.postMarketChangePercent}
                regularPrice={detail.quote.price}
                currency={detail.quote.currency}
              />
            )}

            {/* 국장: 연관 미장 종목 */}
            {symbolType === 'kr' &&
              relation.relatedUsWithReason &&
              relation.relatedUsWithReason.length > 0 && (
                <RelatedStocksSection
                  title="연관 미장 종목"
                  stocks={relation.relatedUsWithReason.map((r) => ({
                    symbol: r.symbol,
                    reason: r.reason,
                  }))}
                />
              )}

            {/* 국장: 영향 거시지표 */}
            {symbolType === 'kr' &&
              relation.relatedMacroSymbols &&
              relation.relatedMacroSymbols.length > 0 && (
                <MacroRelatedSection symbols={relation.relatedMacroSymbols} />
              )}

            {/* 미장: 연관성 설명 */}
            {symbolType === 'us' && (
              <StockRelationBlock
                description={relation.description}
                relatedKrSymbols={relation.relatedKrSymbols ?? []}
              />
            )}

            {/* 거시지표: 설명 */}
            {symbolType === 'macro' && (
              <IndicatorExplainBlock
                description={relation.description}
                sector={relation.sector}
              />
            )}

            {/* 거시지표: 연관 종목 */}
            {symbolType === 'macro' &&
              relation.relatedSymbols &&
              relation.relatedSymbols.length > 0 && (
                <RelatedStocksSection
                  title="연관 종목"
                  stocks={relation.relatedSymbols.map((s) => ({ symbol: s }))}
                />
              )}

            {/* 국장/미장/거시지표: 뉴스 */}
            <div className="mt-4">
              <NewsSection fixedSymbol={symbol} />
            </div>

            {/* 국장: DART 공시 */}
            {symbolType === 'kr' && (
              <div className="mt-4">
                <DartSection fixedSymbol={symbol} />
              </div>
            )}

            {/* 하단 업데이트 시각 */}
            <p className={t.layout.footer}>
              데이터 기준 · {new Date(detail.fetchedAt).toLocaleString('ko-KR')} · Yahoo Finance
              {detail.fundamentals ? ' · NAVER 증권' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
