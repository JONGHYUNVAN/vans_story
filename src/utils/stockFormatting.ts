import type { MacroIndicator } from '@/types/stocks';

export function finite(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// 목록/카드용 단순 가격: "1,234원" 또는 "$12.34"
export function formatPriceSimple(price: number | null | undefined, currency: string): string {
  const p = finite(price);
  if (currency === 'KRW') return p.toLocaleString('ko-KR') + '원';
  return '$' + p.toFixed(2);
}

// 상세/차트용: ^TNX 수익률, 심볼 특례 반영. USD에 $ 접두사 없음.
export function formatPriceDetailed(price: number, currency: string, symbol?: string): string {
  if (currency === 'KRW') return price.toLocaleString('ko-KR') + '원';
  if (symbol === '^TNX') return price.toFixed(3) + '%';
  return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function formatPercent(pct: number | null | undefined): string {
  const p = finite(pct);
  const sign = p >= 0 ? '+' : '';
  return sign + p.toFixed(2) + '%';
}

export function formatChange(change: number | null | undefined, currency: string): string {
  const c = finite(change);
  const sign = c >= 0 ? '+' : '';
  if (currency === 'KRW') return sign + c.toLocaleString('ko-KR') + '원';
  return sign + '$' + Math.abs(c).toFixed(2);
}

export function formatVolume(volume: number | null | undefined, currency = 'KRW'): string {
  const v = finite(volume);
  if (currency === 'KRW') {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억';
    if (v >= 10_000) return (v / 10_000).toFixed(0) + '만';
    return v.toLocaleString('ko-KR');
  }
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  return v.toLocaleString('en-US');
}

// 차트축용 압축: 1.2M / 345K / 123
export function formatVolumeCompact(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(0) + 'K';
  return String(v);
}

export function formatMarketCap(cap: number | null, currency: string): string {
  if (cap === null) return '—';
  if (currency === 'KRW') {
    if (cap >= 1_000_000_000_000) return (cap / 1_000_000_000_000).toFixed(1) + '조';
    if (cap >= 100_000_000) return (cap / 100_000_000).toFixed(0) + '억';
    return cap.toLocaleString('ko-KR');
  }
  if (cap >= 1_000_000_000_000) return '$' + (cap / 1_000_000_000_000).toFixed(2) + 'T';
  if (cap >= 1_000_000_000) return '$' + (cap / 1_000_000_000).toFixed(1) + 'B';
  if (cap >= 1_000_000) return '$' + (cap / 1_000_000).toFixed(1) + 'M';
  return '$' + cap.toLocaleString('en-US');
}

// 매크로 지표 가격: USDKRW=X, ^TNX, 원자재 특례 포함
export function formatMacroPrice(indicator: MacroIndicator): string {
  if (indicator.symbol === 'USDKRW=X') {
    return indicator.price.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '원';
  }
  if (indicator.symbol === '^TNX') {
    return indicator.price.toFixed(3) + '%';
  }
  if (indicator.category === 'commodity') {
    return '$' + indicator.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return indicator.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
