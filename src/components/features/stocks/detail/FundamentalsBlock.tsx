'use client';

import type { StockFundamentals, StockConsensus, StockPeer } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import TermTooltip from '@/components/features/stocks/detail/TermTooltip';

interface Props {
  fundamentals: StockFundamentals;
  consensus: StockConsensus | null;
  consensusBySource?: StockConsensus[];
  peers: StockPeer[] | null;
  currentPrice: number;
}

const TERM_TIPS: Record<string, string> = {
  'PER (실적)':  'Price-Earnings Ratio (주가수익비율)\n주가 ÷ EPS.\n높을수록 이익 대비 주가가 비싸다.\n업종 평균과 비교해야 의미 있음.',
  'PER (추정)':  '선행 PER (Forward PER)\n애널리스트 추정 EPS 기준.\n향후 실적 개선 기대치가 반영된 선행 지표.',
  'PBR':        'Price-Book Ratio (주가순자산비율)\n주가 ÷ BPS.\n1 미만이면 청산가치보다 싸다는 의미.',
  'EPS':        'Earnings Per Share (주당순이익)\n당기순이익 ÷ 발행주가 수.\n실질 수익 창출 능력 지표.',
  'BPS':        'Book-value Per Share (주당순자산)\n순자산 ÷ 발행주가 수.\n이론적 청산 가치.',
  '배당수익률': '배당금 ÷ 현재 주가 × 100.\n높을수록 배당 매력이 크지만,\n주가 하락으로 수치가 높아지는 경우도 있음.',
  '외인소진율': '외국인 보유 가능 한도 대비 실제 보유 비율.\n한도에 가까울수록 추가 매수 여력이 줄어듦.',
  '시가총액':   '현재 주가 × 발행 주가 수.\n기업의 시장 가치.',
  '거래대금':   '당일 거래된 주가 금액 합계 (거래량 × 체결가).\n유동성 지표.',
  '투자의견':   '애널리스트 평균 투자의견\n1=강매도 ~ 5=강매수.\n4 이상이면 대체로 매수 의견.',
};

type DetailType = ReturnType<typeof useStocksTheme>['tokens']['detail'];

function Row({ label, value, d }: { label: string; value: React.ReactNode; d: DetailType }) {
  const tip = TERM_TIPS[label];
  return (
    <div className={`flex items-start justify-between gap-3 ${d.divider} px-4 py-2.5 last:border-0`}>
      {tip ? (
        <TermTooltip text={tip} width={220}>
          <span className={`${d.rowLabel} underline decoration-dotted decoration-1 underline-offset-2`}>
            {label}
          </span>
        </TermTooltip>
      ) : (
        <span className={d.rowLabel}>{label}</span>
      )}
      <span className={`text-right ${d.rowValue}`}>{value}</span>
    </div>
  );
}

function fmt(n: number | null, suffix = ''): string {
  if (n === null) return '—';
  return n.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + suffix;
}

function sourceBadgeClass(src: string): string {
  if (src === 'Yahoo Finance') return 'border-violet-500/40 text-violet-400';
  if (src === '합산평균')      return 'border-amber-500/40 text-amber-400';
  return 'border-sky-500/40 text-sky-400';
}

function RecommDot({ score, keyLabel }: { score: number; keyLabel?: string | null }) {
  const labels = ['', '강매도', '매도', '중립', '매수', '강매수'];
  const colors  = ['', 'bg-sky-600', 'bg-sky-400', 'bg-slate-400', 'bg-rose-400', 'bg-rose-600'];
  const idx = Math.round(Math.min(Math.max(score, 1), 5));
  const keyMap: Record<string, string> = {
    strong_buy: '강매수', buy: '매수', hold: '중립',
    sell: '매도', strong_sell: '강매도', underperform: '매도', outperform: '매수',
  };
  const displayLabel = (keyLabel ? keyMap[keyLabel] : null) ?? labels[idx];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${colors[idx]}/15`}>
      <span className={`w-2 h-2 rounded-full ${colors[idx]}`} />
      {displayLabel} ({score.toFixed(2)})
    </span>
  );
}

function ConsensusVisual({
  current, target, targetHigh, targetLow, analystReports, d,
}: {
  current: number; target: number;
  targetHigh: number | null; targetLow: number | null;
  analystReports?: Array<{ broker: string; date: string; title: string; targetPrice?: number | null }>;
  d: DetailType;
}) {
  const diff     = ((target - current) / current) * 100;
  const isAbove  = target >= current;
  const absPct   = Math.abs(diff);
  const sign     = isAbove ? '+' : '';

  // 범위 바 계산
  const reportPrices = (analystReports ?? [])
    .map((r) => r.targetPrice)
    .filter((p): p is number => p !== null && p !== undefined && p > 0);
  const allPrices = [current, target, ...(targetHigh ? [targetHigh] : []), ...(targetLow ? [targetLow] : []), ...reportPrices];
  const barMax = Math.max(...allPrices) * 1.06;
  const barMin = Math.min(...allPrices) * 0.94;
  const barRange = barMax - barMin || 1;
  const pct = (v: number) => Math.min(Math.max(((v - barMin) / barRange) * 100, 1), 99);

  // 개별 리포트 테이블에 쓸 데이터 (목표가 있는 것만)
  const reportRows = (analystReports ?? []).filter((r) => r.targetPrice && r.targetPrice > 0);

  return (
    <div className="px-4 pb-4 pt-2 space-y-4">
      {/* ── 평균 목표가 요약 카드 ── */}
      <div className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 ${d.barTrack}`}>
        <div>
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5 ${d.rowLabel}`}>평균 목표주가</p>
          <p className={`text-xl font-bold tabular-nums ${isAbove ? 'text-rose-500' : 'text-sky-500'}`}>
            {target.toLocaleString('ko-KR')}원
          </p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5 ${d.rowLabel}`}>현재가 대비</p>
          <p className={`text-lg font-bold tabular-nums ${isAbove ? 'text-rose-500' : 'text-sky-500'}`}>
            {sign}{absPct.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* ── 목표가 범위 바 ── */}
      <div>
        <div className={`relative h-2 rounded-full ${d.barTrack}`}>
          {/* min~max 채우기 */}
          {(targetLow !== null || targetHigh !== null) && (
            <div className="absolute top-0 h-full rounded-full opacity-20"
                 style={{
                   left:       `${pct(targetLow ?? target)}%`,
                   width:      `${pct(targetHigh ?? target) - pct(targetLow ?? target)}%`,
                   background: '#94a3b8',
                 }} />
          )}
          {/* 현재가 ~ 평균 사이 강조 */}
          <div className="absolute top-0 h-full rounded-full opacity-30"
               style={{
                 left:       `${Math.min(pct(current), pct(target))}%`,
                 width:      `${Math.abs(pct(target) - pct(current))}%`,
                 background: isAbove ? '#f87171' : '#60a5fa',
               }} />
          {/* 개별 리포트 회색 점 (hover 툴팁 포함) */}
          {(analystReports ?? []).map((rpt, i) => {
            if (!rpt.targetPrice || rpt.targetPrice <= 0) return null;
            const tip = `${rpt.broker}\n${rpt.date}\n목표가 ${rpt.targetPrice.toLocaleString('ko-KR')}원`;
            return (
              <TermTooltip key={i} text={tip} width={160}>
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white/50 z-20 cursor-default"
                  style={{ left: `${pct(rpt.targetPrice)}%`, background: '#64748b' }}
                />
              </TermTooltip>
            );
          })}
          {/* 최저 마커 */}
          {targetLow !== null && (
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-4 rounded-sm opacity-50"
                 style={{ left: `${pct(targetLow)}%`, background: '#60a5fa' }} />
          )}
          {/* 최고 마커 */}
          {targetHigh !== null && (
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-4 rounded-sm opacity-50"
                 style={{ left: `${pct(targetHigh)}%`, background: '#f87171' }} />
          )}
          {/* 평균 목표가 — 빨간 원 */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md z-30"
               style={{ left: `${pct(target)}%`, background: '#ef4444' }} />
          {/* 현재가 — 흰 원 */}
          <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow z-20 ${d.barCenterLine}`}
               style={{ left: `${pct(current)}%` }} />
        </div>

        {/* 바 아래 레이블 */}
        <div className={`relative mt-5 text-[10px] font-mono ${d.cardMeta}`}>
          {/* 현재가 레이블 */}
          <div className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
               style={{ left: `${pct(current)}%` }}>
            <div className="w-px h-2 bg-current opacity-40" />
            <span className="whitespace-nowrap font-semibold">현재가</span>
            <span className="whitespace-nowrap">{current.toLocaleString('ko-KR')}</span>
          </div>
          {/* 최저 레이블 */}
          {targetLow !== null && (
            <div className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 text-sky-500"
                 style={{ left: `${pct(targetLow)}%` }}>
              <div className="w-px h-2 bg-current opacity-50" />
              <span className="whitespace-nowrap">최저</span>
              <span className="whitespace-nowrap">{targetLow.toLocaleString('ko-KR')}</span>
            </div>
          )}
          {/* 평균 레이블 */}
          <div className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 text-rose-500"
               style={{ left: `${pct(target)}%` }}>
            <div className="w-px h-2 bg-current opacity-50" />
            <span className="whitespace-nowrap font-bold">평균</span>
            <span className="whitespace-nowrap font-bold">{target.toLocaleString('ko-KR')}</span>
          </div>
          {/* 최고 레이블 */}
          {targetHigh !== null && (
            <div className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 text-rose-400"
                 style={{ left: `${pct(targetHigh)}%` }}>
              <div className="w-px h-2 bg-current opacity-50" />
              <span className="whitespace-nowrap">최고</span>
              <span className="whitespace-nowrap">{targetHigh.toLocaleString('ko-KR')}</span>
            </div>
          )}
        </div>
        {/* 레이블 공간 확보 */}
        <div className="h-8" />

        {/* 범례 */}
        <div className={`flex items-center gap-4 mt-1 text-[10px] ${d.cardMeta}`}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/60 inline-block" />
            평균 목표가
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full border-2 border-white/60 inline-block ${d.barCenterLine}`} />
            현재가
          </span>
          {reportPrices.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500 border border-white/50 inline-block" />
              개별 리포트
            </span>
          )}
        </div>
      </div>

      {/* ── 개별 리포트 목표가 테이블 ── */}
      {reportRows.length > 0 && (
        <div>
          <p className={`text-[10px] uppercase tracking-widest font-semibold mb-2 ${d.rowLabel}`}>개별 목표주가</p>
          <div className="space-y-1">
            {reportRows.map((rpt, i) => {
              const rDiff = rpt.targetPrice ? ((rpt.targetPrice - current) / current) * 100 : null;
              const rAbove = (rDiff ?? 0) >= 0;
              return (
                <div key={i}
                     className={`flex items-center justify-between gap-2 rounded px-3 py-1.5 text-[11px] ${d.barTrack}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: '#64748b' }}
                    />
                    <span className={`font-medium truncate ${d.rowValue}`}>{rpt.broker}</span>
                    <span className={`text-[10px] ${d.cardMeta}`}>{rpt.date}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 font-mono tabular-nums">
                    <span className={`font-semibold ${d.rowValue}`}>
                      {rpt.targetPrice!.toLocaleString('ko-KR')}원
                    </span>
                    {rDiff !== null && (
                      <span className={`text-[10px] ${rAbove ? 'text-rose-500' : 'text-sky-500'}`}>
                        {rAbove ? '+' : ''}{rDiff.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ConsensusSourceBlock({
  c, currentPrice, isAvg, d,
}: { c: StockConsensus; currentPrice: number; isAvg: boolean; d: DetailType }) {
  const hasData = c.targetPrice !== null || c.recommendation !== null;
  if (!hasData) return null;
  const srcName = c.sources[0] ?? '—';
  const reports = c.analystReports ?? [];

  return (
    <div className={isAvg ? `border-t-2 border-amber-500/20` : ''}>
      {/* 소스 헤더 행 */}
      <div className={`flex items-center justify-between gap-2 px-4 py-2 ${d.divider} ${isAvg ? 'bg-amber-500/5' : ''}`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 border ${sourceBadgeClass(srcName)}`}>
          {srcName}
        </span>
        {c.numberOfAnalysts !== null && (
          <span className={`${d.cardMeta} font-semibold`}>{c.numberOfAnalysts}명 참여</span>
        )}
      </div>

      {/* 투자의견 */}
      {c.recommendation !== null && (
        <div className={`flex items-center gap-3 px-4 py-2.5 ${d.divider}`}>
          <TermTooltip text={TERM_TIPS['투자의견']} width={220}>
            <span className={`${d.rowLabel} underline decoration-dotted decoration-1 underline-offset-2`}>투자의견</span>
          </TermTooltip>
          <RecommDot score={c.recommendation} keyLabel={c.recommendationKey} />
        </div>
      )}

      {/* 목표가 시각화 */}
      {c.targetPrice !== null && currentPrice > 0 && (
        <ConsensusVisual
          current={currentPrice} target={c.targetPrice}
          targetHigh={c.targetHigh} targetLow={c.targetLow}
          analystReports={reports}
          d={d}
        />
      )}

      {/* 목표가 없는 리포트만 뱃지로 표시 */}
      {reports.filter((r) => !r.targetPrice).length > 0 && (
        <div className={`px-4 py-2 ${d.divider}`}>
          <p className={`text-[10px] uppercase tracking-wide font-semibold mb-1.5 ${d.rowLabel}`}>기타 리포트</p>
          <div className="flex flex-wrap gap-1.5">
            {reports.filter((r) => !r.targetPrice).map((rpt, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 text-[10px] rounded px-2 py-0.5 border ${d.barTrack} ${d.cardMeta}`}>
                <span className={d.rowValue}>{rpt.broker}</span>
                <span>{rpt.date}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FundamentalsBlock({
  fundamentals: f, consensus, consensusBySource = [], peers, currentPrice,
}: Props) {
  const { tokens } = useStocksTheme();
  const d = tokens.detail;

  const hasBySource  = consensusBySource.length > 0;
  const showAvg      = consensusBySource.length > 1 && consensus !== null;
  const displayList  = hasBySource ? consensusBySource : (consensus ? [consensus] : []);
  const hasConsensus = displayList.length > 0;
  const hasValuation = f.per !== null || f.pbr !== null || f.eps !== null || f.dividendYield !== null;

  return (
    <div className="space-y-4">
      {/* 밸류에이션 */}
      {hasValuation && (
        <section className={d.card}>
          <div className={d.cardHead}>
            <h3 className={d.cardTitle}>밸류에이션 · 배당</h3>
            <span className={d.cardMeta}>NAVER 증권 · 항목에 마우스를 올리면 설명</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <Row label="PER (실적)"  value={fmt(f.per, '배')} d={d} />
            <Row label="PER (추정)"  value={fmt(f.forwardPer, '배')} d={d} />
            <Row label="PBR"         value={fmt(f.pbr, '배')} d={d} />
            <Row label="EPS"         value={f.eps !== null ? f.eps.toLocaleString('ko-KR') + '원' : '—'} d={d} />
            <Row label="BPS"         value={f.bps !== null ? f.bps.toLocaleString('ko-KR') + '원' : '—'} d={d} />
            <Row label="배당수익률"  value={fmt(f.dividendYield, '%')} d={d} />
            {f.foreignHoldRatio !== null && <Row label="외인소진율" value={fmt(f.foreignHoldRatio, '%')} d={d} />}
            {f.marketValueStr  && <Row label="시가총액"   value={f.marketValueStr}  d={d} />}
            {f.tradingValueStr && <Row label="거래대금"   value={f.tradingValueStr} d={d} />}
          </div>
        </section>
      )}

      {/* 애널리스트 컨센서스 */}
      {hasConsensus && (
        <section className={d.card}>
          <div className={d.cardHead}>
            <h3 className={d.cardTitle}>애널리스트 컨센서스</h3>
            <span className={d.cardMeta}>
              {displayList.length > 1
                ? `${displayList.length}개 소스 · 합산평균 포함`
                : displayList[0]?.sources[0] === 'NAVER 증권'
                  ? 'FnGuide 집계 (국내 모든 증권사 통합)'
                  : displayList[0]?.sources[0] ?? ''}
            </span>
          </div>

          {displayList.map((c, i) => (
            <ConsensusSourceBlock
              key={c.sources[0] ?? i}
              c={c}
              currentPrice={currentPrice}
              isAvg={false}
              d={d}
            />
          ))}

          {showAvg && consensus && (
            <ConsensusSourceBlock
              c={consensus}
              currentPrice={currentPrice}
              isAvg={true}
              d={d}
            />
          )}
        </section>
      )}

      {/* 동종업계 */}
      {peers && peers.length > 0 && (
        <section className={d.card}>
          <div className={d.cardHead}>
            <h3 className={d.cardTitle}>동종업계 비교</h3>
          </div>
          <div>
            {peers.map((p) => {
              const isPos = p.changePercent >= 0;
              return (
                <div key={p.symbol} className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] ${d.divider}`}>
                  <span className={`font-medium truncate ${d.rowValue}`}>{p.name}</span>
                  <div className="shrink-0 text-right font-mono tabular-nums">
                    <span className={d.rowValue}>{p.price.toLocaleString('ko-KR')}원</span>
                    <span className={`ml-2 text-[11px] ${isPos ? 'text-rose-500' : 'text-sky-500'}`}>
                      {isPos ? '+' : ''}{p.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
