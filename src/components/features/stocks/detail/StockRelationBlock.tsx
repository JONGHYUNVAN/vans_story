'use client';

import Link from 'next/link';
import { STOCK_DISPLAY_NAME } from '@/types/stocks';
import { symbolToSlug } from '@/utils/stockSymbol';

interface StockRelationBlockProps {
  description: string;
  relatedKrSymbols: string[];
}

export default function StockRelationBlock({
  description,
  relatedKrSymbols,
}: StockRelationBlockProps) {
  if (!description && relatedKrSymbols.length === 0) return null;

  return (
    <section className="mb-6">
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-3">
        한국 시장과의 연관성
      </h3>
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        {description && (
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{description}</p>
        )}
        {relatedKrSymbols.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-zinc-500 self-center">연관 국장 종목:</span>
            {relatedKrSymbols.map((sym) => (
              <Link
                key={sym}
                href={`/stocks/${symbolToSlug(sym)}`}
                className="px-2.5 py-1 rounded-md border border-sky-800/50 bg-sky-900/30 text-xs text-sky-300 hover:bg-sky-800/40 transition-colors no-underline"
              >
                {STOCK_DISPLAY_NAME[sym] ?? sym}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
