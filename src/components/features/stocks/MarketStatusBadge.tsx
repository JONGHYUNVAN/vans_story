'use client';

import type { MarketState } from '@/utils/marketHours';

interface MarketStatusBadgeProps {
  state: MarketState;
  market: 'kr' | 'us';
}

interface BadgeConfig {
  label: string;
  dotClass: string;
  badgeClass: string;
  showPulse: boolean;
}

function getBadgeConfig(state: MarketState, market: 'kr' | 'us'): BadgeConfig {
  if (market === 'kr') {
    switch (state) {
      case 'PRE':
        return {
          label: '장전',
          dotClass: 'bg-amber-400',
          badgeClass: 'text-amber-400 bg-amber-400/10 border border-amber-400/30',
          showPulse: false,
        };
      case 'REGULAR':
        return {
          label: '장중',
          dotClass: 'bg-emerald-400',
          badgeClass: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/30',
          showPulse: true,
        };
      case 'POST':
        return {
          label: '장후',
          dotClass: 'bg-sky-400',
          badgeClass: 'text-sky-400 bg-sky-400/10 border border-sky-400/30',
          showPulse: false,
        };
      default:
        return {
          label: '장마감',
          dotClass: 'bg-zinc-500',
          badgeClass: 'text-zinc-400 bg-zinc-800 border border-zinc-700',
          showPulse: false,
        };
    }
  } else {
    switch (state) {
      case 'PRE':
        return {
          label: 'Pre-market',
          dotClass: 'bg-amber-400',
          badgeClass: 'text-amber-400 bg-amber-400/10 border border-amber-400/30',
          showPulse: false,
        };
      case 'REGULAR':
        return {
          label: 'Open',
          dotClass: 'bg-emerald-400',
          badgeClass: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/30',
          showPulse: true,
        };
      case 'POST':
        return {
          label: 'After-hours',
          dotClass: 'bg-violet-400',
          badgeClass: 'text-violet-400 bg-violet-400/10 border border-violet-400/30',
          showPulse: false,
        };
      default:
        return {
          label: 'Closed',
          dotClass: 'bg-zinc-500',
          badgeClass: 'text-zinc-400 bg-zinc-800 border border-zinc-700',
          showPulse: false,
        };
    }
  }
}

export default function MarketStatusBadge({ state, market }: MarketStatusBadgeProps) {
  const cfg = getBadgeConfig(state, market);
  const flag = market === 'kr' ? '🇰🇷' : '🇺🇸';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass} ${cfg.showPulse ? 'animate-pulse' : ''}`}
      />
      <span
        aria-hidden
        style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
      >
        {flag}
      </span>
      {cfg.label}
    </span>
  );
}
