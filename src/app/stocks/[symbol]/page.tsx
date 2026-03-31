import type { Metadata } from 'next';
import { slugToSymbol, symbolToSlug } from '@/utils/stockSymbol';
import { KR_STOCKS, US_STOCKS, MACRO_SYMBOLS, STOCK_DISPLAY_NAME, SECTOR_HEATMAP_STOCKS } from '@/types/stocks';
import { getStockRelation } from '@/constants/stockRelations';
import StockDetailClient from './StockDetailClient';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  if (!symbol) {
    return { title: '종목을 찾을 수 없습니다 | Vans Story' };
  }

  const macro = MACRO_SYMBOLS.find((m) => m.symbol === symbol);
  const name = STOCK_DISPLAY_NAME[symbol] ?? macro?.displayName ?? symbol;

  const meta = getStockRelation(symbol);
  const desc = meta.description ?? `${name} 실시간 시세 및 차트`;

  return {
    title: `${name} | 주가 대시보드 · Vans Story`,
    description: desc,
  };
}

export function generateStaticParams() {
  const allSymbols: string[] = [
    ...KR_STOCKS.map((s) => s.symbol as string),
    ...US_STOCKS.map((s) => s.symbol as string),
    ...MACRO_SYMBOLS.map((s) => s.symbol as string),
    ...SECTOR_HEATMAP_STOCKS.map((s) => s.symbol as string),
  ];
  // 중복 제거
  const unique = [...new Set(allSymbols)];
  return unique.map((sym) => ({ symbol: symbolToSlug(sym) }));
}

export default async function StockDetailPage({ params }: PageProps) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);

  if (!symbol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">종목을 찾을 수 없습니다</h1>
          <p className="text-zinc-400 text-sm">잘못된 심볼: {slug}</p>
        </div>
      </div>
    );
  }

  return <StockDetailClient symbol={symbol} />;
}
