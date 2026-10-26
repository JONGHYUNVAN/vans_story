'use client';

import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

interface KeyMetric {
  label: string;
  value: string;
  color?: string;
}

interface KeyMetricsGridProps {
  metrics: KeyMetric[];
}

export default function KeyMetricsGrid({ metrics }: KeyMetricsGridProps) {
  const { tokens } = useStocksTheme();
  const d = tokens.detail;

  return (
    <section className={d.card}>
      <div className={d.cardHead}>
        <h3 className={d.cardTitle}>핵심 지표</h3>
      </div>
      <div className="grid grid-cols-3">
        {metrics.map((m, i) => (
          <div key={i} className={`px-4 py-3 ${d.divider} ${i < 3 ? '' : ''}`}>
            <p className={`mb-1 text-[10px] uppercase tracking-wide ${d.rowLabel}`}>{m.label}</p>
            <p className={`font-mono text-sm font-bold tabular-nums ${m.color ?? d.rowValue}`}>
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
