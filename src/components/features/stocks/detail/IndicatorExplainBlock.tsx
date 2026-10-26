'use client';

interface IndicatorExplainBlockProps {
  description: string;
  sector: string;
}

export default function IndicatorExplainBlock({ description, sector }: IndicatorExplainBlockProps) {
  if (!description) return null;

  return (
    <section className="mb-6">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
        지표 설명
      </h3>
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">
          {sector}
        </span>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{description}</p>
      </div>
    </section>
  );
}
