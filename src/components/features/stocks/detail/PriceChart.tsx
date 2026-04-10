'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { ChartDataPoint } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';
import { API_URLS } from '@/constants/apiUrl';
import TermTooltip from '@/components/features/stocks/detail/TermTooltip';

// ───────────────────────────── types ─────────────────────────────
type ChartRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
type ChartType  = 'line' | 'candle';
type Indicator  = 'MA5' | 'MA20' | 'MA60' | 'BB' | 'Volume' | 'RSI';

// ────────────────────────── indicators ───────────────────────────
function calcMA(data: ChartDataPoint[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    return data.slice(i - period + 1, i + 1).reduce((s, d) => s + d.close, 0) / period;
  });
}

function calcBB(data: ChartDataPoint[], period = 20, k = 2) {
  const mid = calcMA(data, period);
  return mid.map((m, i) => {
    if (m === null) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const std = Math.sqrt(slice.reduce((s, d) => s + (d.close - m) ** 2, 0) / period);
    return { upper: m + k * std, mid: m, lower: m - k * std };
  });
}

function calcRSI(data: ChartDataPoint[], period = 14): (number | null)[] {
  if (data.length < period + 1) return data.map(() => null);
  const result: (number | null)[] = [null];
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }
  let ag = gains.slice(0, period).reduce((s, v) => s + v, 0) / period;
  let al = losses.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = 0; i < period - 1; i++) result.push(null);
  result.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al));
  for (let i = period; i < gains.length; i++) {
    ag = (ag * (period - 1) + gains[i]) / period;
    al = (al * (period - 1) + losses[i]) / period;
    result.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al));
  }
  return result;
}

// ──────────────────────── layout constants ────────────────────────
const W       = 640;
const PAD     = { top: 14, bottom: 20, left: 60, right: 38 };
const MAIN_H  = 220;
const VOL_H   = 46;
const RSI_H   = 64;
const GAP     = 12;
const CHART_W = W - PAD.left - PAD.right;

// ─────────────────────── svg helpers ────────────────────────────
function linePath(xs: number[], ys: (number | null)[]): string {
  let d = '';
  let pen = false;
  for (let i = 0; i < xs.length; i++) {
    if (ys[i] === null) { pen = false; continue; }
    d += pen ? ` L ${xs[i].toFixed(2)},${(ys[i] as number).toFixed(2)}`
             : `M ${xs[i].toFixed(2)},${(ys[i] as number).toFixed(2)}`;
    pen = true;
  }
  return d;
}

function areaPath(xs: number[], ys: number[], yBase: number): string {
  if (xs.length < 2) return '';
  let d = `M ${xs[0].toFixed(2)},${ys[0].toFixed(2)}`;
  for (let i = 1; i < xs.length; i++) d += ` L ${xs[i].toFixed(2)},${ys[i].toFixed(2)}`;
  d += ` L ${xs[xs.length - 1].toFixed(2)},${yBase} L ${xs[0].toFixed(2)},${yBase} Z`;
  return d;
}

function fmtDate(ts: number, range: ChartRange): string {
  const d = new Date(ts * 1000);
  if (range === '1D') {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
  if (range === '1W') return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}h`;
  if (range === '1Y') return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}`;
  return `${d.getMonth()+1}. ${d.getDate()}`;
}

function fmtPrice(p: number, currency: string, symbol?: string): string {
  if (currency === 'KRW') return p.toLocaleString('ko-KR') + '원';
  if (symbol === '^TNX') return p.toFixed(3) + '%';
  return p.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function fmtVol(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
  return String(v);
}

// ── indicator meta ──
const IND_COLORS: Record<Indicator, string> = {
  MA5: '#fbbf24', MA20: '#60a5fa', MA60: '#a78bfa',
  BB: '#34d399', Volume: '#94a3b8', RSI: '#fb923c',
};
const IND_LABELS: Record<Indicator, string> = {
  MA5: 'MA5', MA20: 'MA20', MA60: 'MA60', BB: 'BB(20)', Volume: '거래량', RSI: 'RSI(14)',
};
const IND_TIPS: Record<Indicator, string> = {
  MA5:    '5일 단순이동평균(MA5)\n최근 5거래일 종가 평균.\n단기 추세 파악에 사용.',
  MA20:   '20일 이동평균(MA20)\n한 달간 종가 평균.\n중기 지지/저항선으로 활용.',
  MA60:   '60일 이동평균(MA60)\n세 달간 종가 평균.\n장기 추세 방향 확인에 사용.',
  BB:     '볼린저 밴드 BB(20)\nMA20 ± 2표준편차로 그린 채널.\n밴드가 좁아지면 변동성 축소,\n가격이 밴드 경계 근처면 과매수/과매도 신호.',
  Volume: '거래량\n해당 기간 체결된 총 주가 수.\n거래량 급증은 추세 전환 신호일 수 있음.',
  RSI:    'RSI(14) — 상대강도지수\n0~100 범위의 모멘텀 지표.\n70 이상: 과매수 (조정 가능)\n30 이하: 과매도 (반등 가능)',
};

const RANGE_OPTIONS: ChartRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
const ALL_INDICATORS: Indicator[] = ['MA5', 'MA20', 'MA60', 'BB', 'Volume', 'RSI'];

// ─────────────────────── main component ───────────────────────────
interface Props {
  data: ChartDataPoint[];
  currency: string;
  symbol?: string;
  prevClose?: number;
  onRangeStats?: (range: ChartRange, firstClose: number, lastClose: number) => void;
}

export default function PriceChart({ data: initialData, currency, symbol, prevClose, onRangeStats }: Props) {
  const { tokens, theme } = useStocksTheme();
  const d = tokens.detail;
  const isDark = theme === 'dark';

  // 지수·수익률 심볼(^)은 거래량이 없음
  const isIndex = symbol?.startsWith('^') ?? false;

  const [range,         setRange]         = useState<ChartRange>('1D');
  const [chartType,     setChartType]     = useState<ChartType>('line');
  const [indicators,    setIndicators]    = useState<Set<Indicator>>(
    new Set(isIndex ? ['MA20'] : ['MA20', 'Volume']),
  );
  const [showPrevClose, setShowPrevClose] = useState(false);
  const [chartData,  setChartData]  = useState<ChartDataPoint[]>(initialData);
  const [isFetching, setIsFetching] = useState(false);
  const [hoverIdx,   setHoverIdx]   = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!symbol) return;
    setIsFetching(true);
    setHoverIdx(null);
    fetch(`${API_URLS.STOCKS.CHART}?symbol=${encodeURIComponent(symbol)}&range=${range}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data.data.length > 0) {
          const d = j.data.data;
          setChartData(d);
          onRangeStats?.(range, d[0].close, d[d.length - 1].close);
        } else if (j.success) {
          setChartData(j.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, [range, symbol]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialData.length > 0) {
      onRangeStats?.('1D', initialData[0].close, initialData[initialData.length - 1].close);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 1회

  const toggleInd = (ind: Indicator) =>
    setIndicators((prev) => { const n = new Set(prev); n.has(ind) ? n.delete(ind) : n.add(ind); return n; });

  // 인덱스 심볼은 거래량 패널 강제 숨김
  const showVol = !isIndex && indicators.has('Volume');
  const showRSI = indicators.has('RSI');

  const ma5  = useMemo(() => indicators.has('MA5')  ? calcMA(chartData, 5)  : [], [chartData, indicators]);
  const ma20 = useMemo(() => (indicators.has('MA20') || indicators.has('BB')) ? calcMA(chartData, 20) : [], [chartData, indicators]);
  const ma60 = useMemo(() => indicators.has('MA60') ? calcMA(chartData, 60) : [], [chartData, indicators]);
  const bb   = useMemo(() => indicators.has('BB')   ? calcBB(chartData, 20) : [], [chartData, indicators]);
  const rsi  = useMemo(() => showRSI ? calcRSI(chartData, 14) : [],              [chartData, showRSI]);

  // ── layout ──
  const mainY1 = PAD.top;
  const mainY2 = PAD.top + MAIN_H;
  const volY1  = mainY2 + GAP;
  const volY2  = volY1 + VOL_H;
  const rsiY1  = (showVol ? volY2 : mainY2) + GAP;
  const rsiY2  = rsiY1 + RSI_H;
  const totalH = PAD.top + MAIN_H + PAD.bottom
               + (showVol ? GAP + VOL_H : 0)
               + (showRSI ? GAP + RSI_H : 0);

  // ── price extent ──
  const closes = chartData.map((p) => p.close);

  // 시/고/저/종가 계산
  // 라인 차트: close 기준(intraday 극값 제외 → Y스케일 왜곡 방지)
  // 캔들 차트: 실제 high/low 기준
  const keyOpen  = chartData[0]?.open  ?? 0;
  const keyClose = closes[closes.length - 1] ?? 0;
  const keyHigh  = chartData.length > 0
    ? (chartType === 'candle' ? Math.max(...chartData.map((p) => p.high)) : Math.max(...closes))
    : 0;
  const keyLow   = chartData.length > 0
    ? (chartType === 'candle' ? Math.min(...chartData.map((p) => p.low))  : Math.min(...closes))
    : 0;

  const allPrices: number[] = [...closes];
  // 캔들 모드에서만 실제 고가/저가를 Y 범위에 포함
  if (chartType === 'candle') chartData.forEach((p) => { allPrices.push(p.high, p.low); });
  // 1D: 시가를 Y 범위에 포함 (시가 라인이 잘리지 않도록)
  if (range === '1D' && keyOpen > 0) allPrices.push(keyOpen);
  if (indicators.has('BB'))  bb.forEach((b) => { if (b) allPrices.push(b.upper, b.lower); });
  [ma5, ma20, ma60].forEach((arr) => arr.forEach((v) => { if (v !== null) allPrices.push(v); }));
  // 전일종가: 버튼 ON일 때만 Y 범위에 포함 (OFF시 스케일 왜곡 방지)
  if (showPrevClose && prevClose && prevClose > 0) allPrices.push(prevClose);

  const minP = Math.min(...allPrices.filter(Boolean));
  const maxP = Math.max(...allPrices.filter(Boolean));
  const pRange = maxP - minP || 1;
  const maxVol = Math.max(...chartData.map((p) => p.volume), 1);

  const xScale = (i: number) => PAD.left + (chartData.length <= 1 ? 0 : (i / (chartData.length - 1)) * CHART_W);
  const yMain  = (p: number) => mainY1 + (1 - (p - minP) / pRange) * MAIN_H;
  const yVol   = (v: number) => volY2 - (v / maxVol) * VOL_H;
  const yRsi   = (r: number) => rsiY1 + (1 - r / 100) * RSI_H;

  const xs = chartData.map((_, i) => xScale(i));

  const isUp      = closes.length > 1 ? closes[closes.length - 1] >= closes[0] : true;
  const lineColor = isUp ? '#f87171' : '#60a5fa';
  const gradId    = `cg_${(symbol ?? 'x').replace(/[^a-z0-9]/gi, '')}`;
  const candleW   = Math.max(1.5, Math.min(10, (CHART_W / (chartData.length || 1)) * 0.62));

  // ── x / y labels ──
  const maxXLabels = 7;
  const xStep = Math.max(1, Math.floor(chartData.length / maxXLabels));
  const xLabels = chartData
    .map((p, i) => ({ i, x: xs[i], label: fmtDate(p.timestamp, range) }))
    .filter((_, i) => i % xStep === 0);

  const yTicks = [minP, minP + pRange * 0.33, minP + pRange * 0.67, maxP];

  // ── key price lines: 근접 선 병합 (Y 12px 이내 → 라벨 합성) ──
  const mergedKeyLines = (() => {
    const raw = [
      { price: keyHigh,  label: '고가', color: 'rgba(248,113,113,0.65)', pri: 0 },
      { price: keyLow,   label: '저가', color: 'rgba(96,165,250,0.65)',  pri: 1 },
      ...(range === '1D' ? [
        { price: keyOpen,  label: '시가', color: 'rgba(148,163,184,0.60)', pri: 2 },
        { price: keyClose, label: '종가', color: 'rgba(200,200,200,0.60)', pri: 3 },
      ] : []),
    ].filter((l) => {
      if (!l.price || l.price <= 0) return false;
      const y = mainY1 + (1 - (l.price - minP) / pRange) * MAIN_H;
      return y >= mainY1 && y <= mainY2;
    });

    // 우선순위 순 정렬 후 Y 근접 선 병합
    raw.sort((a, b) => a.pri - b.pri);
    const merged: { price: number; label: string; color: string }[] = [];
    for (const line of raw) {
      const y = mainY1 + (1 - (line.price - minP) / pRange) * MAIN_H;
      const found = merged.find(
        (m) => Math.abs(mainY1 + (1 - (m.price - minP) / pRange) * MAIN_H - y) < 12,
      );
      if (found) {
        found.label = `${found.label}(${line.label})`;
      } else {
        merged.push({ price: line.price, label: line.label, color: line.color });
      }
    }
    return merged;
  })();

  // ── crosshair ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || chartData.length === 0) return;
      const rect  = svgRef.current.getBoundingClientRect();
      const mx    = (e.clientX - rect.left) * (W / rect.width);
      let best = 0, dist = Infinity;
      xs.forEach((x, i) => { const dd = Math.abs(x - mx); if (dd < dist) { dist = dd; best = i; } });
      setHoverIdx(best);
    },
    [chartData, xs],
  );

  // ── svg style constants ──
  const gridStroke   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)';
  const gridStrokeV  = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.04)';
  const textFill     = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.50)';
  const crossFill    = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.22)';

  const hoverPt = hoverIdx !== null && hoverIdx < chartData.length ? chartData[hoverIdx] : null;
  const infoPt  = hoverPt ?? (chartData.length > 0 ? chartData[chartData.length - 1] : null);

  if (chartData.length < 2) {
    return (
      <div className={`${d.card} p-4 h-[260px] flex items-center justify-center`}>
        <p className={d.cardMeta}>차트 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={d.card}>
      {/* ── controls ── */}
      <div className={`${d.cardHead} flex-wrap gap-2`}>
        <h3 className={d.cardTitle}>가격 차트</h3>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <div className={d.controlWrap}>
            {RANGE_OPTIONS.map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)}
                      className={range === r ? d.controlActive : d.controlInactive}>{r}</button>
            ))}
          </div>
          <div className={d.controlWrap}>
            {(['line', 'candle'] as ChartType[]).map((t) => (
              <button key={t} type="button" onClick={() => setChartType(t)}
                      className={chartType === t ? d.controlActive : d.controlInactive}>
                {t === 'line' ? '라인' : '캔들'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── indicator toggles ── */}
      <div className={`px-4 py-2 ${d.subPanel} border-b`}>
        <div className={d.indicatorWrap}>
          {ALL_INDICATORS
            .filter((ind) => !(isIndex && ind === 'Volume'))
            .map((ind) => {
              const on = indicators.has(ind);
              return (
                <TermTooltip key={ind} text={IND_TIPS[ind]} width={220}>
                  <button
                    type="button"
                    onClick={() => toggleInd(ind)}
                    className={on ? d.indicatorOn : d.indicatorOff}
                    style={on ? { borderColor: IND_COLORS[ind], color: IND_COLORS[ind], backgroundColor: IND_COLORS[ind] + '22' } : {}}
                  >
                    {IND_LABELS[ind]}
                  </button>
                </TermTooltip>
              );
            })}
          {prevClose && prevClose > 0 && (
            <TermTooltip
              text={'전일종가 기준선\n전 거래일 종가를 수평선으로 표시합니다.\n현재 가격이 기준선 위/아래인지 확인할 수 있습니다.\n※ 가격 차이가 클 때는 OFF 권장'}
              width={220}
            >
              <button
                type="button"
                onClick={() => setShowPrevClose((v) => !v)}
                className={showPrevClose ? d.indicatorOn : d.indicatorOff}
                style={showPrevClose ? { borderColor: 'rgba(250,204,21,0.8)', color: 'rgba(250,204,21,0.9)', backgroundColor: 'rgba(250,204,21,0.12)' } : {}}
              >
                전일종가
              </button>
            </TermTooltip>
          )}
        </div>
      </div>

      {/* ── 고정 OHLCV 정보바 ── */}
      <div className={`px-4 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-mono ${d.subPanel} border-b`}>
        {infoPt ? (
          <>
            <span className={d.cardMeta}>{fmtDate(infoPt.timestamp, range)}</span>
            <span className={d.cardMeta}>O: <span className={d.rowValue}>{fmtPrice(infoPt.open, currency, symbol)}</span></span>
            <span className={d.cardMeta}>H: <span className="text-rose-500 font-semibold">{fmtPrice(infoPt.high, currency, symbol)}</span></span>
            <span className={d.cardMeta}>L: <span className="text-sky-500 font-semibold">{fmtPrice(infoPt.low, currency, symbol)}</span></span>
            <span className={d.cardMeta}>C: <span className={d.rowValue}>{fmtPrice(infoPt.close, currency, symbol)}</span></span>
            <span className={d.cardMeta}>거래량: <span className={d.rowValue}>{fmtVol(infoPt.volume)}</span></span>
          </>
        ) : (
          <span className={d.cardMeta}>—</span>
        )}
        {isFetching && <span className={d.cardMeta}>불러오는 중…</span>}
      </div>

      {/* ── SVG chart ── */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${totalH}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
        style={{ cursor: 'crosshair', display: 'block' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={lineColor} stopOpacity="0.20" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
          </linearGradient>
          <clipPath id="mc">
            <rect x={PAD.left} y={mainY1} width={CHART_W} height={MAIN_H} />
          </clipPath>
        </defs>

        {/* ── grid ── */}
        {yTicks.map((v, i) => (
          <line key={`gy${i}`} x1={PAD.left} y1={yMain(v)} x2={W - PAD.right} y2={yMain(v)}
                stroke={gridStroke} strokeWidth="0.8" strokeDasharray="4 3" />
        ))}
        {xLabels.map(({ x }, i) => (
          <line key={`gx${i}`} x1={x} y1={mainY1} x2={x} y2={mainY2}
                stroke={gridStrokeV} strokeWidth="0.5" />
        ))}

        {/* ── y-axis labels ── */}
        {yTicks.map((v, i) => (
          <text key={`yl${i}`} x={PAD.left - 5} y={yMain(v) + 3}
                textAnchor="end" fill={textFill} fontSize="9" fontFamily="monospace">
            {currency === 'KRW' ? v.toLocaleString('ko-KR') : v.toFixed(2)}
          </text>
        ))}

        {/* ── x-axis labels ── */}
        {xLabels.map(({ x, label }, i) => (
          <text key={`xl${i}`} x={x} y={totalH - 4}
                textAnchor="middle" fill={textFill} fontSize="8.5" fontFamily="monospace">
            {label}
          </text>
        ))}

        {/* ── 시/고/저/종가 기준선 (근접값 병합) ── */}
        {mergedKeyLines.map(({ price, label, color }) => {
          const y = yMain(price);
          return (
            <g key={label}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke={color} strokeWidth="0.7" strokeDasharray="3 3"
                clipPath="url(#mc)"
              />
              <text
                x={W - PAD.right + 3} y={y + 3}
                fill={color} fontSize="8" fontFamily="monospace" fontWeight="600"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── 전일종가 기준선 (버튼 ON 시 표시) ── */}
        {showPrevClose && prevClose && prevClose > 0 && (() => {
          const baseY = yMain(prevClose);
          if (baseY < mainY1 || baseY > mainY2) return null;
          return (
            <g>
              <line
                x1={PAD.left} y1={baseY} x2={W - PAD.right} y2={baseY}
                stroke="rgba(250,204,21,0.65)" strokeWidth="1" strokeDasharray="5 4"
                clipPath="url(#mc)"
              />
              <text
                x={W - PAD.right + 3} y={baseY + 3}
                fill="rgba(250,204,21,0.85)" fontSize="8" fontFamily="monospace" fontWeight="700"
              >
                전일
              </text>
            </g>
          );
        })()}

        {/* ── BB bands ── */}
        {indicators.has('BB') && (() => {
          const ups = bb.map((b) => (b ? yMain(b.upper) : null));
          const los = bb.map((b) => (b ? yMain(b.lower) : null));
          return (
            <g clipPath="url(#mc)">
              <path d={linePath(xs, ups)} fill="none" stroke={IND_COLORS.BB} strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />
              <path d={linePath(xs, los)} fill="none" stroke={IND_COLORS.BB} strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />
            </g>
          );
        })()}

        {/* ── area fill (line) ── */}
        {chartType === 'line' && (
          <path d={areaPath(xs, closes.map(yMain), mainY2)}
                fill={`url(#${gradId})`} clipPath="url(#mc)" />
        )}

        {/* ── candlesticks ── */}
        {chartType === 'candle' && chartData.map((p, i) => {
          const up  = p.close >= p.open;
          const col = up ? '#f87171' : '#60a5fa';
          const oY  = yMain(p.open);
          const cY  = yMain(p.close);
          const hY  = yMain(p.high);
          const lY  = yMain(p.low);
          const top = Math.min(oY, cY);
          const bH  = Math.max(Math.abs(cY - oY), 1.5);
          return (
            <g key={i} clipPath="url(#mc)">
              <line x1={xs[i]} y1={hY} x2={xs[i]} y2={lY} stroke={col} strokeWidth="1" />
              <rect x={xs[i] - candleW / 2} y={top} width={candleW} height={bH}
                    fill={up ? col : 'none'} stroke={col} strokeWidth="0.9" />
            </g>
          );
        })}

        {/* ── line (close) ── */}
        {chartType === 'line' && (
          <path d={linePath(xs, closes.map(yMain))}
                fill="none" stroke={lineColor} strokeWidth="1.6"
                strokeLinejoin="round" clipPath="url(#mc)" />
        )}

        {/* ── MA lines ── */}
        {indicators.has('MA5') && ma5.length > 0 && (
          <path d={linePath(xs, ma5.map((v) => (v === null ? null : yMain(v))))}
                fill="none" stroke={IND_COLORS.MA5} strokeWidth="1.2" clipPath="url(#mc)" />
        )}
        {(indicators.has('MA20') || indicators.has('BB')) && ma20.length > 0 && (
          <path d={linePath(xs, ma20.map((v) => (v === null ? null : yMain(v))))}
                fill="none" stroke={IND_COLORS.MA20} strokeWidth="1.2" clipPath="url(#mc)" />
        )}
        {indicators.has('MA60') && ma60.length > 0 && (
          <path d={linePath(xs, ma60.map((v) => (v === null ? null : yMain(v))))}
                fill="none" stroke={IND_COLORS.MA60} strokeWidth="1.2" clipPath="url(#mc)" />
        )}

        {/* ── Volume sub-panel ── */}
        {showVol && (() => {
          const barW = Math.max(1.5, candleW);
          // hover된 막대의 볼륨 레이블 위치 계산
          const hovVol  = hoverIdx !== null ? chartData[hoverIdx] : null;
          const hovVolY = hovVol ? yVol(hovVol.volume) : 0;
          const hovVolX = hoverIdx !== null ? xs[hoverIdx] : 0;
          const hovUp   = hovVol ? hovVol.close >= hovVol.open : true;
          const volLabel = hovVol ? (hovUp ? '+' : '-') + fmtVol(hovVol.volume) : '';
          const volLabelColor = hovUp ? '#f87171' : '#60a5fa';
          // 레이블이 좌측/우측 경계를 벗어나지 않도록 clamp
          const labelX = Math.min(Math.max(hovVolX, PAD.left + 18), W - PAD.right - 18);
          const labelAnchor = hovVolX < PAD.left + 40 ? 'start'
                            : hovVolX > W - PAD.right - 40 ? 'end' : 'middle';

          return (
            <>
              <line x1={PAD.left} y1={volY1} x2={W - PAD.right} y2={volY1}
                    stroke={gridStroke} strokeWidth="0.8" />
              <text x={PAD.left - 5} y={volY1 + 10} textAnchor="end"
                    fill={textFill} fontSize="8" fontFamily="monospace">VOL</text>

              {chartData.map((p, i) => {
                const up       = p.close >= p.open;
                const barColor = up ? 'rgba(248,113,113,0.55)' : 'rgba(96,165,250,0.55)';
                const isHov    = hoverIdx === i;
                return (
                  <rect key={i}
                    x={xs[i] - barW / 2} y={yVol(p.volume)}
                    width={barW} height={volY2 - yVol(p.volume)}
                    fill={isHov ? (up ? 'rgba(248,113,113,0.90)' : 'rgba(96,165,250,0.90)') : barColor}
                  >
                    <title>{fmtVol(p.volume)}</title>
                  </rect>
                );
              })}

              {/* hover 시 막대 위 볼륨 레이블 */}
              {hoverIdx !== null && hovVol && (
                <g>
                  <rect
                    x={labelX - (labelAnchor === 'middle' ? 18 : labelAnchor === 'start' ? 0 : 36)}
                    y={hovVolY - 14}
                    width={36} height={13}
                    rx="2" fill={isDark ? 'rgba(24,24,27,0.88)' : 'rgba(255,255,255,0.88)'}
                    stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}
                    strokeWidth="0.8"
                  />
                  <text
                    x={labelX}
                    y={hovVolY - 4}
                    textAnchor={labelAnchor}
                    fill={volLabelColor}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="700"
                  >
                    {volLabel}
                  </text>
                </g>
              )}
            </>
          );
        })()}

        {/* ── RSI sub-panel ── */}
        {showRSI && (
          <>
            <line x1={PAD.left} y1={rsiY1} x2={W - PAD.right} y2={rsiY1}
                  stroke={gridStroke} strokeWidth="0.8" />
            <text x={PAD.left - 5} y={rsiY1 + 10} textAnchor="end"
                  fill={textFill} fontSize="8" fontFamily="monospace">RSI</text>
            {[30, 50, 70].map((v) => (
              <line key={v} x1={PAD.left} y1={yRsi(v)} x2={W - PAD.right} y2={yRsi(v)}
                    stroke={v === 50 ? gridStroke : 'rgba(251,146,60,0.30)'}
                    strokeWidth="0.8" strokeDasharray="4 3" />
            ))}
            <text x={W - PAD.right + 2} y={yRsi(70) + 3} fill="rgba(251,146,60,0.6)" fontSize="7.5" fontFamily="monospace">70</text>
            <text x={W - PAD.right + 2} y={yRsi(30) + 3} fill="rgba(251,146,60,0.6)" fontSize="7.5" fontFamily="monospace">30</text>
            <path d={linePath(xs, rsi.map((v) => (v === null ? null : yRsi(v))))}
                  fill="none" stroke={IND_COLORS.RSI} strokeWidth="1.3" />
          </>
        )}

        {/* ── crosshair ── */}
        {hoverIdx !== null && chartData[hoverIdx] !== undefined && (
          <>
            <line x1={xs[hoverIdx]} y1={mainY1}
                  x2={xs[hoverIdx]} y2={showRSI ? rsiY2 : showVol ? volY2 : mainY2}
                  stroke={crossFill} strokeWidth="1" />
            <circle cx={xs[hoverIdx]} cy={yMain(chartData[hoverIdx].close)}
                    r="3.5" fill={lineColor} stroke="white" strokeWidth="1.5" />
          </>
        )}
      </svg>

      {/* ── indicator legend ── */}
      <div className={`flex flex-wrap items-center gap-3 px-4 py-2 ${d.subPanel} border-t text-[10px] font-mono`}>
        {Array.from(indicators)
          .filter((i): i is Indicator => !['Volume', 'RSI'].includes(i))
          .map((ind) => (
            <span key={ind} style={{ color: IND_COLORS[ind] }}>—&nbsp;{IND_LABELS[ind]}</span>
          ))}
        <span className={`ml-auto ${d.cardMeta}`}>Yahoo Finance</span>
      </div>
    </div>
  );
}
