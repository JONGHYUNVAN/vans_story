import { KR_STOCKS, US_STOCKS, MACRO_SYMBOLS } from '@/types/stocks';

/**
 * Yahoo Finance 심볼 → URL-safe slug
 * - 선행 `^` 제거
 * - `.` → `-`
 * - `=` → `-`
 */
export function symbolToSlug(symbol: string): string {
  return symbol.replace(/^\^/, '').replace(/\./g, '-').replace(/=/g, '-');
}

// 빌드 타임에 slug → symbol 역매핑 생성
const ALL_SYMBOLS: string[] = [
  ...KR_STOCKS.map((s) => s.symbol as string),
  ...US_STOCKS.map((s) => s.symbol as string),
  ...MACRO_SYMBOLS.map((s) => s.symbol as string),
];

const SLUG_TO_SYMBOL_MAP = new Map<string, string>(
  ALL_SYMBOLS.map((sym) => [symbolToSlug(sym), sym]),
);

/**
 * URL slug → Yahoo Finance 심볼
 * 알 수 없는 slug면 null 반환
 */
export function slugToSymbol(slug: string): string | null {
  return SLUG_TO_SYMBOL_MAP.get(slug) ?? null;
}

export type SymbolType = 'kr' | 'us' | 'macro';

/**
 * 심볼 타입 판별
 */
export function getSymbolType(symbol: string): SymbolType {
  if (symbol.endsWith('.KS') || symbol.endsWith('.KQ')) return 'kr';
  if (MACRO_SYMBOLS.some((m) => m.symbol === symbol)) return 'macro';
  return 'us';
}
