'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSectorHeatmap } from '@/hooks/useSectorHeatmap';
import { symbolToSlug } from '@/utils/stockSymbol';
import { SectorHeatmapItem } from '@/types/stocks';

// ---------------------------------------------------------------------------
// Color helper
// ---------------------------------------------------------------------------

function heatmapBgColor(pct: number | null): string {
  if (pct === null) return '#27272a';
  if (pct > 3) return '#dc2626';
  if (pct > 1) return 'rgba(239,68,68,0.6)';
  if (pct > 0) return 'rgba(239,68,68,0.25)';
  if (pct > -1) return 'rgba(59,130,246,0.25)';
  if (pct > -3) return 'rgba(59,130,246,0.6)';
  return '#2563eb';
}

function formatMarketCap(value: number | null, market: 'kr' | 'us', fallbackWeight: number): string {
  if (value === null || !isFinite(value) || value <= 0) return `비중 ${fallbackWeight}`;
  const locale = market === 'kr' ? 'ko-KR' : 'en-US';
  const compact = new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
  return `시총 ${compact}`;
}

// ---------------------------------------------------------------------------
// Market state helpers
// ---------------------------------------------------------------------------

/** items 중 가장 많이 등장하는 marketState 반환 */
function detectMarketState(items: SectorHeatmapItem[]): string {
  const states = items.map(i => i.marketState).filter(Boolean) as string[];
  if (states.length === 0) return 'CLOSED';
  const counts = new Map<string, number>();
  for (const s of states) counts.set(s, (counts.get(s) ?? 0) + 1);
  let max = 0;
  let dominant = 'CLOSED';
  for (const [s, c] of counts) {
    if (c > max) { max = c; dominant = s; }
  }
  return dominant;
}

interface BadgeInfo { label: string; cls: string; }

function getMarketBadge(state: string, market: 'kr' | 'us'): BadgeInfo {
  if (market === 'kr') {
    switch (state) {
      case 'PRE': case 'PREPRE':
        return { label: '장전', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
      case 'REGULAR':
        return { label: '장중', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' };
      case 'POST': case 'POSTPOST':
        return { label: '장후', cls: 'text-sky-400 bg-sky-400/10 border-sky-400/30' };
      default:
        return { label: '장마감', cls: 'text-zinc-500 bg-zinc-800 border-zinc-700' };
    }
  } else {
    switch (state) {
      case 'PRE': case 'PREPRE':
        return { label: '프리마켓', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
      case 'REGULAR':
        return { label: '장중', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' };
      case 'POST': case 'POSTPOST':
        return { label: '애프터', cls: 'text-violet-400 bg-violet-400/10 border-violet-400/30' };
      default:
        return { label: '장마감', cls: 'text-zinc-500 bg-zinc-800 border-zinc-700' };
    }
  }
}

// ---------------------------------------------------------------------------
// Squarified treemap
// ---------------------------------------------------------------------------

interface TreemapRect {
  symbol: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage
  height: number; // percentage
}

function worstAspectRatio(
  row: Array<{ weight: number }>,
  shortSide: number,
): number {
  if (row.length === 0 || shortSide <= 0) return Number.POSITIVE_INFINITY;

  const sum = row.reduce((acc, item) => acc + item.weight, 0);
  const max = Math.max(...row.map(item => item.weight));
  const min = Math.min(...row.map(item => item.weight));
  const sideSq = shortSide * shortSide;

  // Bruls et al. squarified treemap의 worst ratio 기준식
  const r1 = (sideSq * max) / (sum * sum);
  const r2 = (sum * sum) / (sideSq * min);
  return Math.max(r1, r2);
}

function computeTreemap(
  items: Array<{ symbol: string; weight: number }>,
  containerWidth: number,
  containerHeight: number,
): TreemapRect[] {
  if (items.length === 0 || containerWidth <= 0 || containerHeight <= 0) return [];

  const totalWeight = items.reduce((s, it) => s + it.weight, 0);
  if (totalWeight === 0) return [];

  const area = containerWidth * containerHeight;
  const normalized = items
    .map(it => ({
      symbol: it.symbol,
      weight: (it.weight / totalWeight) * area,
    }))
    .sort((a, b) => b.weight - a.weight);

  const rects: TreemapRect[] = [];
  let x = 0;
  let y = 0;
  let w = containerWidth;
  let h = containerHeight;
  let idx = 0;

  const placeRow = (row: Array<{ symbol: string; weight: number }>) => {
    if (row.length === 0 || w <= 0 || h <= 0) return;
    const rowSum = row.reduce((acc, it) => acc + it.weight, 0);

    // 남은 공간의 짧은 변 기준으로 배치 방향 선택
    if (w >= h) {
      // 가로가 더 길면 세로 스트립(왼->오)으로 배치
      const rowWidth = rowSum / h;
      let yOffset = y;
      for (const it of row) {
        const itemHeight = it.weight / rowWidth;
        rects.push({
          symbol: it.symbol,
          x: (x / containerWidth) * 100,
          y: (yOffset / containerHeight) * 100,
          width: (rowWidth / containerWidth) * 100,
          height: (itemHeight / containerHeight) * 100,
        });
        yOffset += itemHeight;
      }
      x += rowWidth;
      w -= rowWidth;
    } else {
      // 세로가 더 길면 가로 스트립(위->아래)으로 배치
      const rowHeight = rowSum / w;
      let xOffset = x;
      for (const it of row) {
        const itemWidth = it.weight / rowHeight;
        rects.push({
          symbol: it.symbol,
          x: (xOffset / containerWidth) * 100,
          y: (y / containerHeight) * 100,
          width: (itemWidth / containerWidth) * 100,
          height: (rowHeight / containerHeight) * 100,
        });
        xOffset += itemWidth;
      }
      y += rowHeight;
      h -= rowHeight;
    }
  };

  while (idx < normalized.length && w > 0 && h > 0) {
    const row: Array<{ symbol: string; weight: number }> = [];
    let shortSide = Math.min(w, h);

    while (idx < normalized.length) {
      const candidate = normalized[idx];
      if (row.length === 0) {
        row.push(candidate);
        idx += 1;
        continue;
      }

      const currentWorst = worstAspectRatio(row, shortSide);
      const nextWorst = worstAspectRatio([...row, candidate], shortSide);
      if (nextWorst <= currentWorst) {
        row.push(candidate);
        idx += 1;
      } else {
        break;
      }
      shortSide = Math.min(w, h);
    }

    placeRow(row);
  }

  return rects;
}

// ---------------------------------------------------------------------------
// HeatmapPanel
// ---------------------------------------------------------------------------

interface HeatmapPanelProps {
  label: string;
  items: SectorHeatmapItem[];
}

function HeatmapPanel({ label, items }: HeatmapPanelProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rects = size
    ? computeTreemap(
        items.map(it => ({
          symbol: it.symbol,
          // 시총이 있으면 시총 기준, 없으면 기존 수동 weight를 fallback으로 사용
          weight: it.marketCap ?? it.weight,
        })),
        size.width,
        size.height,
      )
    : [];

  const rectMap = new Map<string, TreemapRect>(rects.map(r => [r.symbol, r]));

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Panel label */}
      <div className="absolute top-0 left-0 z-10 flex items-center gap-1.5 p-1 leading-none pointer-events-none">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
      </div>

      {size &&
        items.map(item => {
          const rect = rectMap.get(item.symbol);
          if (!rect) return null;

          const sign = item.changePercent !== null && item.changePercent > 0 ? '+' : '';
          const pctText =
            item.changePercent !== null
              ? `${sign}${item.changePercent.toFixed(2)}%`
              : '—';

          const cellHeightPx = (rect.height / 100) * size.height;
          const cellWidthPx = (rect.width / 100) * size.width;
          const showName = cellWidthPx > 60 && cellHeightPx > 24;
          const showPct = cellWidthPx > 52 && cellHeightPx > 36;
          const showMarketCap = cellWidthPx > 88 && cellHeightPx > 52;
          const marketCapText = formatMarketCap(item.marketCap, item.market, item.weight);

          return (
            <div
              key={item.symbol}
              className="absolute overflow-hidden cursor-pointer rounded-sm hover:brightness-110 transition-[filter]"
              style={{
                left: `calc(${rect.x}% + 1px)`,
                top: `calc(${rect.y}% + 1px)`,
                width: `calc(${rect.width}% - 2px)`,
                height: `calc(${rect.height}% - 2px)`,
                backgroundColor: heatmapBgColor(item.changePercent),
              }}
              onClick={() => router.push(`/stocks/${symbolToSlug(item.symbol)}`)}
              title={`${item.name} (${item.symbol})`}
            >
              <div className="flex flex-col items-center justify-center w-full h-full p-0.5">
                {showName && (
                  <span className="text-white text-xs leading-tight truncate w-full text-center">
                    {item.name}
                  </span>
                )}
                {showPct && (
                  <span className="text-white text-xs font-bold leading-tight">
                    {pctText}
                  </span>
                )}
                {showMarketCap && (
                  <span className="text-[10px] text-zinc-100/80 leading-tight">
                    {marketCapText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function HeatmapSkeleton() {
  return (
    <div className="flex-1 min-h-0 p-2 flex flex-col gap-2">
      {/* KR skeleton (centered square) */}
      <div className="flex-[6] min-h-0 flex items-center justify-center">
        <div className="h-full max-w-full aspect-square p-1 flex flex-col gap-0.5 border border-zinc-700/40 rounded-md">
          <div className="flex gap-0.5 flex-1">
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 12 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 9 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 4 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 3 }} />
          </div>
          <div className="flex gap-0.5 flex-1">
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 4 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 3 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 4 }} />
            <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 2 }} />
          </div>
        </div>
      </div>
      {/* US skeleton (wide rectangle) */}
      <div className="flex-[4] min-h-0 p-1 flex flex-col gap-0.5 border border-zinc-700/40 rounded-md">
        <div className="flex gap-0.5 flex-1">
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 14 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 12 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 11 }} />
        </div>
        <div className="flex gap-0.5 flex-1">
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 10 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 9 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 9 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 8 }} />
        </div>
        <div className="flex gap-0.5 flex-1">
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 7 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 6 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 6 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 5 }} />
          <div className="bg-zinc-800 animate-pulse rounded-sm" style={{ flex: 4 }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectorHeatmap (main export)
// ---------------------------------------------------------------------------

export function SectorHeatmap() {
  const { data, isLoading } = useSectorHeatmap();

  const krStocks = data?.filter(s => s.market === 'kr') ?? [];
  const usStocks = data?.filter(s => s.market === 'us') ?? [];

  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 overflow-hidden aspect-square flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 py-2.5 border-b border-zinc-700/50 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-violet-500 inline-block" />
          <span className="text-sm font-semibold text-zinc-100">
            Tech · Semiconductor Sector
          </span>
        </div>
      </div>

      {isLoading ? (
        <HeatmapSkeleton />
      ) : (
        <div className="flex-1 min-h-0 p-2 flex flex-col gap-2">
          <div className="flex-[6] min-h-0 flex items-center justify-center">
            <div className="h-full max-w-full aspect-square border border-zinc-700/40 rounded-md overflow-hidden">
              <HeatmapPanel label="KR" items={krStocks} />
            </div>
          </div>
          <div className="flex-[4] min-h-0 border border-zinc-700/40 rounded-md overflow-hidden">
            <HeatmapPanel label="US" items={usStocks} />
          </div>
        </div>
      )}
    </div>
  );
}
