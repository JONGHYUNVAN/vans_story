'use client';

interface IndicatorExplainBlockProps {
  description: string;
  sector: string;
}

export default function IndicatorExplainBlock({ description, sector }: IndicatorExplainBlockProps) {
  if (!description) return null;

  return (
    <section className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-3">
        지표 설명
      </h3>
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-mono">{sector}</span>
        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
