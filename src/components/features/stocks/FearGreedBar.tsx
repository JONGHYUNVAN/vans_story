'use client';

import { useState, useEffect } from 'react';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { API_URLS } from '@/constants/apiUrl';
import TermTooltip from '@/components/features/stocks/detail/TermTooltip';
import type { FearGreedData } from '@/app/api/stocks/fear-greed/route';

// ── 등급 설정 ──────────────────────────────────────────────
type RatingCfg = { label: string; color: string; bg: string; border: string };

function getRatingCfg(rating: string | null, score: number | null): RatingCfg {
  const r = rating?.toLowerCase() ?? '';
  if (r.includes('extreme fear') || (score !== null && score < 25))
    return { label: '극단적 공포', color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.30)' };
  if (r.includes('fear') || (score !== null && score < 45))
    return { label: '공포',       color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.30)' };
  if (r.includes('neutral') || (score !== null && score < 55))
    return { label: '중립',       color: '#a3a3a3', bg: 'rgba(163,163,163,0.10)', border: 'rgba(163,163,163,0.25)' };
  if (r.includes('extreme greed') || (score !== null && score >= 75))
    return { label: '극단적 탐욕', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' };
  if (r.includes('greed') || (score !== null && score >= 55))
    return { label: '탐욕',       color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.30)' };
  return   { label: '—',          color: '#71717a', bg: 'transparent',           border: 'rgba(113,113,122,0.20)' };
}

function getVixCfg(vix: number): RatingCfg {
  if (vix < 15)  return { label: '안정', color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)' };
  if (vix < 20)  return { label: '보통', color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)' };
  if (vix < 25)  return { label: '주의', color: '#eab308', bg: 'rgba(234,179,8,0.10)',   border: 'rgba(234,179,8,0.30)' };
  if (vix < 30)  return { label: '경계', color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)' };
  return          { label: '위험', color: '#ef4444', bg: 'rgba(239,68,68,0.10)',    border: 'rgba(239,68,68,0.30)' };
}

function getSkewCfg(skew: number): RatingCfg {
  if (skew < 115) return { label: '안정',     color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)' };
  if (skew < 125) return { label: '보통',     color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)' };
  if (skew < 135) return { label: '주의',     color: '#eab308', bg: 'rgba(234,179,8,0.10)',   border: 'rgba(234,179,8,0.30)' };
  if (skew < 145) return { label: '꼬리위험', color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)' };
  return          { label: '위험경보',        color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.30)' };
}

function getMa200Cfg(pct: number): RatingCfg {
  if (pct >= 10)  return { label: '과열', color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)' };
  if (pct >= 3)   return { label: '강세', color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)' };
  if (pct >= -3)  return { label: '중립', color: '#a3a3a3', bg: 'rgba(163,163,163,0.10)', border: 'rgba(163,163,163,0.25)' };
  if (pct >= -10) return { label: '약세', color: '#f97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)' };
  return          { label: '침체', color: '#ef4444', bg: 'rgba(239,68,68,0.10)',    border: 'rgba(239,68,68,0.30)' };
}

// ── 반원 게이지 ───────────────────────────────────────────
// score: 0–100 (호 채움 비율), label: 게이지 중앙에 표시할 텍스트 (없으면 score 숫자)
function Gauge({ score, color, label }: { score: number; color: string; label?: string }) {
  const R  = 38;
  const cx = 50, cy = 52;
  const circ = Math.PI * R;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circ;
  const displayLabel = label ?? String(Math.round(score));
  const fontSize = displayLabel.length <= 4 ? 26 : displayLabel.length <= 6 ? 20 : 16;

  return (
    <svg viewBox="0 0 100 58" className="w-full h-auto shrink-0">
      <path
        d={`M ${cx - R},${cy} A ${R},${R} 0 0 1 ${cx + R},${cy}`}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round"
      />
      <path
        d={`M ${cx - R},${cy} A ${R},${R} 0 0 1 ${cx + R},${cy}`}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${filled.toFixed(2)} ${circ.toFixed(2)}`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text
        x={cx} y={cy - 6}
        textAnchor="middle" fill="white"
        fontSize={fontSize} fontWeight="800" fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        {displayLabel}
      </text>
    </svg>
  );
}

// VIX 0–100 정규화: 10 → 0%, 50 → 100% (위험도 방향)
function vixToScore(vix: number) { return Math.min(100, Math.max(0, (vix - 10) / 40 * 100)); }
// SKEW 0–100 정규화: 100 → 0%, 170 → 100%
function skewToScore(skew: number) { return Math.min(100, Math.max(0, (skew - 100) / 70 * 100)); }
// S&P500 vs 200MA 0–100 정규화: -30% → 0%, 0% → 50%, +30% → 100%
function ma200ToScore(pct: number) { return Math.min(100, Math.max(0, (pct + 30) / 60 * 100)); }

// ── 미니 스파크라인 ───────────────────────────────────────
function Sparkline({ data, color }: { data: { x: number; y: number }[]; color: string }) {
  if (data.length < 2) return null;
  const W = 140, H = 58;
  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;
  const xStep = W / (data.length - 1);
  const pts = data
    .map((d, i) => `${(i * xStep).toFixed(1)},${(H - ((d.y - minY) / rangeY) * H).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ── 비교 뱃지 ─────────────────────────────────────────────
function CmpBadge({ label, val, current }: { label: string; val: number | null; current: number | null }) {
  if (val === null || current === null) return null;
  const diff = current - val;
  const color = diff > 0 ? '#22c55e' : diff < 0 ? '#f87171' : '#a3a3a3';
  return (
    <div className="text-center min-w-[52px]">
      <p className="text-[12px] text-zinc-500 mb-1">{label}</p>
      <p className="text-[18px] font-mono font-bold leading-none" style={{ color }}>
        {diff > 0 ? '+' : ''}{diff.toFixed(0)}
      </p>
      <p className="text-[12px] text-zinc-500 mt-1">{Math.round(val)}</p>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export function FearGreedBar() {
  const { tokens, theme } = useStocksTheme();
  const isDark = theme === 'dark';
  const [data, setData] = useState<FearGreedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(API_URLS.STOCKS.FEAR_GREED)
      .then((r) => r.json())
      .then((j) => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cardCls = isDark
    ? 'rounded-xl border border-zinc-800/80 bg-zinc-900/40'
    : 'rounded-xl border border-slate-200 bg-white shadow-sm';

  if (isLoading) {
    return <div className={`${cardCls} h-[280px] animate-pulse`} />;
  }
  if (!data) return null;

  const fgCfg    = getRatingCfg(data.rating, data.score);
  const vixCfg   = data.vix !== null ? getVixCfg(data.vix) : null;
  const skewCfg  = data.skew !== null ? getSkewCfg(data.skew) : null;
  const ma200Cfg = data.sp500VsMa200Pct !== null ? getMa200Cfg(data.sp500VsMa200Pct) : null;
  const cryptoCfg= getRatingCfg(data.cryptoRating, data.cryptoScore);
  const labelCls = `text-[12px] font-semibold tracking-[0.16em] uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`;
  const numCls   = `text-[30px] font-black font-mono leading-none ${isDark ? 'text-white' : 'text-slate-900'}`;
  const badgeCls = 'inline-block text-[13px] font-bold px-3 py-1 rounded-full border';

  // 공통 세로 카드 wrapper
  const cardItem = 'flex flex-col items-center gap-3';

  return (
    <div className={`${cardCls} relative px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8`}>

      {/* ── 1. 공포탐욕지수 (CNN) ── */}
      {data.score !== null && (
        <div className={cardItem}>
          <p className={labelCls}>공포탐욕지수 · CNN</p>
          <TermTooltip
            text={
              '공포탐욕지수 (Fear & Greed Index)\nCNN이 발표하는 미국 주식시장 심리 지수.\n0~100 사이 값으로, 낮을수록 투자자들이\n공포에 빠져 있음을 나타냅니다.\n\n' +
              '0–24  극단적 공포\n25–44  공포\n45–54  중립\n55–74  탐욕\n75–100  극단적 탐욕\n\n' +
              '7개 세부 지표(모멘텀·강도·폭·옵션·정크본드·안전자산 수요·시장 변동성)를 종합합니다.'
            }
            width={260}
          >
            <Gauge score={data.score} color={fgCfg.color} />
          </TermTooltip>
          <TermTooltip
            text={
              `현재 등급: ${fgCfg.label}\n\n` +
              '극단적 공포: 매도 심리 극대화 (반등 기회)\n' +
              '공포: 투자자 불안, 저가 매수 신호 가능\n' +
              '중립: 방향성 불확실\n' +
              '탐욕: 과열 주의, 고점 경계\n' +
              '극단적 탐욕: 버블 위험, 조정 가능성'
            }
            width={240}
          >
            <span className={badgeCls} style={{ color: fgCfg.color, background: fgCfg.bg, borderColor: fgCfg.border }}>
              {fgCfg.label}
            </span>
          </TermTooltip>
          {/* 전일·1주·1달 비교 */}
          <div className="flex gap-3 mt-0.5">
            <TermTooltip text={'전일 종가 기준 지수\n어제 마감 시점의 공포탐욕 점수.\n현재 값과의 차이(±)로 표시됩니다.'} width={200}>
              <CmpBadge label="전일"  val={data.previousClose}  current={data.score} />
            </TermTooltip>
            <TermTooltip text={'1주일 전 지수\n7일 전 공포탐욕 점수.\n단기 심리 변화 방향을 확인할 수 있습니다.'} width={200}>
              <CmpBadge label="1주전" val={data.previous1Week}  current={data.score} />
            </TermTooltip>
            <TermTooltip text={'1개월 전 지수\n30일 전 공포탐욕 점수.\n중기 추세 변화를 가늠하는 데 사용합니다.'} width={200}>
              <CmpBadge label="1달전" val={data.previous1Month} current={data.score} />
            </TermTooltip>
          </div>
          {data.history.length > 1 && (
            <TermTooltip text={'최근 30일 공포탐욕 추이\n선이 올라갈수록 탐욕,\n내려갈수록 공포 상태입니다.'} width={190}>
              <Sparkline data={data.history} color={fgCfg.color} />
            </TermTooltip>
          )}
        </div>
      )}

      {/* ── 2. VIX ── */}
      {data.vix !== null && vixCfg && (
        <div className={cardItem}>
          <p className={labelCls}>VIX · 변동성지수</p>
          <TermTooltip
            text={
              'VIX — CBOE 변동성 지수\nS&P 500 옵션 가격을 기반으로 산출하며\n향후 30일간 시장이 얼마나 출렁일지를 나타냅니다.\n"공포지수"라고도 불립니다.\n\n' +
              '< 15   안정 (저변동성)\n15–20  보통\n20–25  주의\n25–30  경계 (높은 불안)\n> 30   위험 (패닉 구간)'
            }
            width={240}
          >
            <Gauge score={vixToScore(data.vix)} color={vixCfg.color} label={data.vix.toFixed(1)} />
          </TermTooltip>
          <div className="flex items-baseline gap-1.5">
            <span className={numCls}>{data.vix.toFixed(2)}</span>
              {data.vixChange !== null && (
              <span className={`text-base font-mono ${data.vixChange >= 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                  {data.vixChange >= 0 ? '▲' : '▼'} {Math.abs(data.vixChange).toFixed(2)}%
                </span>
              )}
          </div>
          <TermTooltip
            text={`현재 VIX ${data.vix.toFixed(2)} → ${vixCfg.label} 구간\n\nVIX가 상승하면 시장 불안이 커지고 있다는\n신호로, 주가 하락과 함께 움직이는 경우가 많습니다.`}
            width={220}
          >
            <span className={badgeCls} style={{ color: vixCfg.color, background: vixCfg.bg, borderColor: vixCfg.border }}>
              {vixCfg.label}
            </span>
          </TermTooltip>
          {data.vixHistory.length > 1 && (
            <TermTooltip text={'VIX 최근 30일 추이\n선이 올라갈수록 시장 변동성(공포)이 커지고 있음을 나타냅니다.'} width={210}>
              <Sparkline data={data.vixHistory} color={vixCfg.color} />
            </TermTooltip>
          )}
        </div>
      )}

      {/* ── 3. CBOE SKEW ── */}
      {data.skew !== null && skewCfg && (
        <div className={cardItem}>
          <p className={labelCls}>SKEW · 꼬리위험</p>
          <TermTooltip
            text={
              'CBOE SKEW 지수\nS&P 500 옵션의 외가격(OTM) 풋 수요를 기반으로\n블랙스완 등 극단적 하락 위험을 측정합니다.\n\n' +
              '< 115   안정 (꼬리위험 낮음)\n' +
              '115–125  보통\n' +
              '125–135  주의 (꼬리위험 상승)\n' +
              '135–145  꼬리위험 고조\n' +
              '> 145   위험경보 (블랙스완 경계)\n\n' +
              '100이 기준값이며, 높을수록 투자자들이\n대형 하락에 대비한 풋옵션을 더 많이 매수 중임을 의미합니다.'
            }
            width={260}
          >
            <Gauge score={skewToScore(data.skew)} color={skewCfg.color} label={String(Math.round(data.skew))} />
          </TermTooltip>
          <div className="flex items-baseline gap-1.5">
            <span className={numCls}>{data.skew.toFixed(1)}</span>
              {data.skewChange !== null && (
              <span className={`text-base font-mono ${data.skewChange >= 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                  {data.skewChange >= 0 ? '▲' : '▼'} {Math.abs(data.skewChange).toFixed(2)}%
                </span>
              )}
          </div>
          <TermTooltip
            text={`현재 SKEW ${data.skew.toFixed(1)} → ${skewCfg.label}\n\nSKEW가 상승하면 시장 참여자들이\n예상치 못한 급락을 더 경계하고 있다는 신호입니다.`}
            width={230}
          >
            <span className={badgeCls} style={{ color: skewCfg.color, background: skewCfg.bg, borderColor: skewCfg.border }}>
              {skewCfg.label}
            </span>
          </TermTooltip>
          {data.skewHistory.length > 1 && (
            <TermTooltip text={'SKEW 최근 30일 추이\n선이 올라갈수록 블랙스완 등 극단적 하락에 대한\n시장의 경계심이 높아지고 있음을 나타냅니다.'} width={230}>
              <Sparkline data={data.skewHistory} color={skewCfg.color} />
            </TermTooltip>
          )}
        </div>
      )}

      {/* ── 4. S&P500 vs 200MA ── */}
      {data.sp500VsMa200Pct !== null && ma200Cfg && (
        <div className={cardItem}>
          <p className={labelCls}>S&P500 vs 200일선</p>
          <TermTooltip
            text={
              'S&P 500 vs 200일 이동평균\n현재 S&P 500 지수가 200일 이동평균 대비\n얼마나 위 또는 아래에 있는지를 나타냅니다.\n\n' +
              '> +10%  과열 (단기 조정 가능성)\n' +
              '+3~10%  강세 (건전한 상승)\n' +
              '-3~+3%  중립 (200일선 부근)\n' +
              '-3~-10% 약세 (하락 추세)\n' +
              '< -10%  침체 (약세장 가능성)\n\n' +
              '200일선은 강세장/약세장을 구분하는\n가장 널리 사용되는 장기 기준선입니다.'
            }
            width={260}
          >
            <Gauge
              score={ma200ToScore(data.sp500VsMa200Pct)}
              color={ma200Cfg.color}
              label={`${data.sp500VsMa200Pct >= 0 ? '+' : ''}${data.sp500VsMa200Pct.toFixed(1)}%`}
            />
          </TermTooltip>
          <span className={numCls}>
            {data.sp500VsMa200Pct >= 0 ? '+' : ''}{data.sp500VsMa200Pct.toFixed(1)}%
          </span>
          <TermTooltip
            text={
              `S&P500 ${data.sp500Price?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}\n` +
              `200MA  ${data.sp500Ma200?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '—'}\n\n` +
              `현재 200일선 ${data.sp500VsMa200Pct >= 0 ? '위' : '아래'} → ${ma200Cfg.label} 구간`
            }
            width={210}
          >
            <span className={badgeCls} style={{ color: ma200Cfg.color, background: ma200Cfg.bg, borderColor: ma200Cfg.border }}>
              {ma200Cfg.label}
            </span>
          </TermTooltip>
          {data.sp500History.length > 1 && (
            <TermTooltip text={'S&P500 최근 30일 가격 추이\n200일 이동평균과의 거리 변화를 추적하는 데 활용하세요.'} width={230}>
              <Sparkline data={data.sp500History} color={ma200Cfg.color} />
            </TermTooltip>
          )}
        </div>
      )}

      {/* ── 5. 크립토 공포탐욕 ── */}
      {data.cryptoScore !== null && (
        <div className={cardItem}>
          <p className={labelCls}>크립토 공포탐욕</p>
          <TermTooltip
            text={
              '크립토 공포탐욕지수 (Crypto Fear & Greed)\nalternative.me가 발표하는 암호화폐 시장 심리 지수.\n0~100 사이 값이며, CNN 지수와 동일한 구간을 사용합니다.\n\n' +
              '비트코인·알트코인 시장 심리를 반영하며,\n주식시장과 디커플링/커플링 여부를 확인하는 데 유용합니다.\n\n' +
              '가격 변동성·거래량·SNS 감성·설문·도미넌스·트렌드\n6개 지표를 종합합니다.'
            }
            width={260}
          >
            <Gauge score={data.cryptoScore} color={cryptoCfg.color} />
          </TermTooltip>
          <TermTooltip
            text={`현재 등급: ${cryptoCfg.label}\n\n주식시장 공포탐욕(${data.score !== null ? Math.round(data.score) : '—'})과 비교해\n두 시장의 심리 온도차를 확인하세요.`}
            width={220}
          >
            <span className={badgeCls} style={{ color: cryptoCfg.color, background: cryptoCfg.bg, borderColor: cryptoCfg.border }}>
              {cryptoCfg.label}
            </span>
          </TermTooltip>
          {data.cryptoHistory.length > 1 && (
            <TermTooltip text={'크립토 공포탐욕 최근 30일 추이\n주식시장 지수와 비교하면 시장 심리 디커플링 여부를 확인할 수 있습니다.'} width={250}>
              <Sparkline data={data.cryptoHistory} color={cryptoCfg.color} />
            </TermTooltip>
          )}
        </div>
      )}

      {/* ── 출처 ── */}
      <p className={`absolute bottom-2 right-4 text-[10px] hidden lg:block ${isDark ? 'text-zinc-700' : 'text-slate-300'}`}>
        CNN · Yahoo Finance · alternative.me
      </p>
    </div>
  );
}
