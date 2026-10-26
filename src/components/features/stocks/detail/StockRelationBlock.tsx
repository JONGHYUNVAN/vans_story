'use client';

import Link from 'next/link';
import { STOCK_DISPLAY_NAME } from '@/types/stocks';
import { symbolToSlug } from '@/lib/stocks/stockSymbol';

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
      <h3 className="mb-3 text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
        한국 시장과의 연관성
      </h3>
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        {description && <p className="mb-4 text-sm leading-relaxed text-zinc-300">{description}</p>}
        {relatedKrSymbols.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-[11px] text-zinc-500">연관 국장 종목:</span>
            {relatedKrSymbols.map((sym) => (
              <Link
                key={sym}
                href={`/stocks/${symbolToSlug(sym)}`}
                className="rounded-md border border-sky-800/50 bg-sky-900/30 px-2.5 py-1 text-xs text-sky-300 no-underline transition-colors hover:bg-sky-800/40"
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
