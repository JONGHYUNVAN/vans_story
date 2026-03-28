'use client';

import type { InvestorTrend } from '@/types/stocks';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

interface Props {
  investors: InvestorTrend[];
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 100_000_000) return (n / 100_000_000).toFixed(1) + '억주';
  if (abs >= 10_000) return (n / 10_000).toFixed(0) + '만주';
  return n.toLocaleString('ko-KR') + '주';
}

function fmtDate(s: string): string {
  if (s.length === 8) return s.slice(4, 6) + '/' + s.slice(6, 8);
  return s;
}

function BarRow({
  label,
  value,
  maxAbs,
  posBar,
  negBar,
  barTrack,
  barCenterLine,
  rowLabel,
}: {
  label: string;
  value: number;
  maxAbs: number;
  posBar: string;
  negBar: string;
  barTrack: string;
  barCenterLine: string;
  rowLabel: string;
}) {
  const pct = maxAbs === 0 ? 0 : Math.min((Math.abs(value) / maxAbs) * 100, 100);
  const isPos = value >= 0;
  const color = isPos ? posBar : negBar;
  const sign = isPos ? '+' : '';

  return (
    <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
      <span className={`w-14 shrink-0 text-right text-[10px] ${rowLabel}`}>{label}</span>
      <div className={`flex-1 relative h-3 rounded-full ${barTrack} overflow-hidden`}>
        <div
          className={`absolute top-0 h-full rounded-full transition-all duration-300 ${color}`}
          style={{
            left: isPos ? '50%' : `${50 - pct / 2}%`,
            width: `${pct / 2}%`,
          }}
        />
        <div className={`absolute top-0 left-1/2 -translate-x-px w-px h-full ${barCenterLine}`} />
      </div>
      <span className={`w-20 shrink-0 text-right ${isPos ? 'text-rose-500' : 'text-sky-500'}`}>
        {sign}{fmt(value)}
      </span>
    </div>
  );
}

export default function InvestorTrendBlock({ investors }: Props) {
  const { tokens } = useStocksTheme();
  const d = tokens.detail;

  if (!investors || investors.length === 0) return null;

  const allAbs = investors.flatMap((row) => [
    Math.abs(row.foreign),
    Math.abs(row.institution),
    Math.abs(row.individual),
  ]);
  const maxAbs = Math.max(...allAbs, 1);

  return (
    <section className={d.card}>
      <div className={d.cardHead}>
        <h3 className={d.cardTitle}>투자자별 순매수</h3>
        <span className={d.cardMeta}>최근 {investors.length}일 · NAVER 증권</span>
      </div>

      <div className="divide-y">
        {investors.map((row) => {
          const total = Math.max(Math.abs(row.foreign), Math.abs(row.institution), Math.abs(row.individual), 1);
          return (
            <div key={row.date} className={`px-4 py-3 space-y-1.5 ${d.divider}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[12px] font-semibold font-mono ${d.rowValue}`}>
                  {fmtDate(row.date)}
                </span>
                <span className={`text-[10px] font-mono ${d.cardMeta}`}>
                  {row.close.toLocaleString('ko-KR')}원 · 거래량 {fmt(row.volume)} · 외인 {row.foreignHoldRatio.toFixed(2)}%
                </span>
              </div>
              <BarRow label="외국인" value={row.foreign} maxAbs={total} posBar={d.posBar} negBar={d.negBar} barTrack={d.barTrack} barCenterLine={d.barCenterLine} rowLabel={d.rowLabel} />
              <BarRow label="기관" value={row.institution} maxAbs={total} posBar="bg-violet-500/60" negBar="bg-amber-500/60" barTrack={d.barTrack} barCenterLine={d.barCenterLine} rowLabel={d.rowLabel} />
              <BarRow label="개인" value={row.individual} maxAbs={total} posBar="bg-emerald-500/55" negBar="bg-slate-400/60" barTrack={d.barTrack} barCenterLine={d.barCenterLine} rowLabel={d.rowLabel} />
            </div>
          );
        })}
      </div>

      <div className={`flex flex-wrap items-center gap-4 px-4 py-3 ${d.subPanel} text-[10px] font-mono ${d.cardMeta}`}>
        <span><span className="inline-block w-2 h-2 rounded-full bg-rose-500/70 mr-1" />순매수</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-sky-500/70 mr-1" />순매도</span>
      </div>
    </section>
  );
}
