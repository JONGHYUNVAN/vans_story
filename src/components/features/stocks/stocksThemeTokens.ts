export type StocksTheme = 'light' | 'dark';

/** 라이트/다크에 공통으로 쓰는 시맨틱 슬롯 */
export interface StocksThemeTokens {
  layout: {
    page: string;
    toolbar: string;
    toolbarTitle: string;
    toolbarSubtitle: string;
    toolbarActions: string;
    workspace: string;
    sectionBlock: string;
    krMarketShell: string;
    usMarketShell: string;
    sectionHeadRow: string;
    sectionAccentKr: string;
    sectionAccentUs: string;
    sectionTitle: string;
    sectionMeta: string;
    errorBanner: string;
    errorTitle: string;
    errorDetail: string;
    errorRetry: string;
    footer: string;
  };
  toggle: string;
  detail: {
    card: string;
    cardHead: string;
    cardTitle: string;
    cardMeta: string;
    divider: string;
    rowLabel: string;
    rowValue: string;
    barTrack: string;
    barCenterLine: string;
    posBar: string;
    negBar: string;
    tooltipBg: string;
    tooltipText: string;
    tooltipMuted: string;
    controlWrap: string;
    controlActive: string;
    controlInactive: string;
    indicatorWrap: string;
    indicatorOn: string;
    indicatorOff: string;
    subPanel: string;
    subPanelLabel: string;
    recommPin: string;
  };
  stockCard: {
    wrap: string;
    headerRow: string;
    title: string;
    symbol: string;
    badgeKr: string;
    badgeUs: string;
    quoteShell: string;
    price: string;
    changeLine: string;
    statsWrap: string;
    statRow: string;
    statRowAlt: string;
    label: string;
    value: string;
    high: string;
    low: string;
    session: string;
    errorBox: string;
    errorText: string;
    skeleton: string;
    skeletonBar: string;
  };
  macro: {
    shell: string;
    sectionHeadRow: string;
    sectionTitle: string;
    sectionMeta: string;
    rail: string;
    card: string;
    label: string;
    price: string;
    changeLine: string;
    skeleton: string;
    skeletonBar: string;
    categoryCurrency: string;
    categoryBond: string;
    categoryIndex: string;
    categoryCommodity: string;
    categoryDefault: string;
  };
  marketBadge: {
    live: string;
    liveDot: string;
    closed: string;
    closedDot: string;
  };
  refresh: {
    meta: string;
    button: string;
  };
  news: {
    panel: string;
    headerRule: string;
    title: string;
    meta: string;
    chipRowRule: string;
    chipOn: string;
    chipOff: string;
    empty: string;
    retry: string;
    itemTitle: string;
    itemTitleHover: string;
    itemMeta: string;
    itemSource: string;
    divide: string;
    skeletonRow: string;
    skeletonBar: string;
  };
  dart: {
    panel: string;
    headerRule: string;
    title: string;
    titleMuted: string;
    meta: string;
    chipRowRule: string;
    chipOn: string;
    chipOff: string;
    empty: string;
    retry: string;
    itemTitle: string;
    itemTitleHover: string;
    itemMeta: string;
    itemSource: string;
    remark: string;
    link: string;
    linkHover: string;
    divide: string;
    skeletonRow: string;
    skeletonBar: string;
  };
  quote: {
    up: string;
    down: string;
    neutral: string;
  };
}

export const stocksThemeTokens: Record<StocksTheme, StocksThemeTokens> = {
  dark: {
    layout: {
      page:
        'min-h-screen text-zinc-200 antialiased pl-16 pt-16 pb-16 selection:bg-cyan-500/12 selection:text-cyan-100 bg-[repeating-linear-gradient(88deg,transparent,transparent_5px,rgba(255,255,255,0.016)_5px,rgba(255,255,255,0.016)_6px),repeating-linear-gradient(90deg,transparent,transparent_68px,rgba(226,232,240,0.028)_68px,rgba(226,232,240,0.028)_69px),linear-gradient(118deg,rgba(255,255,255,0.085),transparent_44%),linear-gradient(232deg,rgba(148,163,184,0.12),transparent_40%),linear-gradient(180deg,#1a1d24_0%,#12151c_42%,#0a0c10_100%),linear-gradient(90deg,#0d0f14,#10151e,#0d0f14)]',
      toolbar:
        'mb-6 flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 pl-5 pr-4 py-4 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] border-l-4 border-l-emerald-500/90 sm:flex-row sm:items-center sm:justify-between',
      toolbarTitle: 'text-xl sm:text-2xl font-bold tracking-tight text-white font-sans',
      toolbarSubtitle:
        'text-[10px] text-zinc-500 font-mono tracking-[0.12em] uppercase mt-1',
      toolbarActions: 'flex items-center gap-1.5 rounded-lg border border-zinc-800/90 bg-zinc-950/80 p-1',
      workspace:
        'flex flex-col gap-6 sm:gap-8 rounded-2xl border border-zinc-800/60 bg-zinc-950/15 p-3 sm:p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]',
      sectionBlock: 'min-w-0',
      krMarketShell:
        'min-w-0 rounded-xl border border-sky-800/45 bg-gradient-to-br from-sky-950/40 via-zinc-950/20 to-zinc-950/35 p-4 sm:p-5 ring-1 ring-sky-900/30 shadow-[inset_0_1px_0_0_rgba(125,211,252,0.06)]',
      usMarketShell:
        'min-w-0 rounded-xl border border-violet-900/40 bg-gradient-to-br from-violet-950/40 via-zinc-950/20 to-zinc-950/35 p-4 sm:p-5 ring-1 ring-violet-900/25 shadow-[inset_0_1px_0_0_rgba(196,181,253,0.06)]',
      sectionHeadRow:
        'mb-4 flex items-center justify-between gap-3 border-b border-zinc-800/90 pb-3',
      sectionAccentKr: 'flex h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 shadow-[0_0_12px_rgba(56,189,248,0.35)]',
      sectionAccentUs:
        'flex h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 shadow-[0_0_12px_rgba(167,139,250,0.3)]',
      sectionTitle:
        'text-xs font-bold uppercase tracking-[0.22em] text-zinc-300',
      sectionMeta: 'text-[10px] text-zinc-500 font-mono tabular-nums',
      errorBanner:
        'mb-6 flex flex-col gap-3 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
      errorTitle: 'text-red-300 text-sm font-semibold',
      errorDetail: 'text-red-400/85 text-xs mt-1 font-mono',
      errorRetry:
        'shrink-0 rounded-lg border border-red-800/70 bg-red-950/60 px-4 py-2 text-xs font-semibold text-red-100 hover:bg-red-900/50 transition-colors',
      footer: 'mt-12 text-center text-[10px] text-zinc-500 font-mono tracking-wide',
    },
    toggle:
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors',
    detail: {
      card: 'rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden',
      cardHead: 'flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3',
      cardTitle: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400',
      cardMeta: 'text-[10px] text-zinc-600 font-mono',
      divider: 'border-b border-zinc-800/50',
      rowLabel: 'text-[11px] text-zinc-500 uppercase tracking-wide shrink-0',
      rowValue: 'text-[13px] font-semibold text-zinc-100 font-mono tabular-nums',
      barTrack: 'bg-zinc-800/60',
      barCenterLine: 'bg-zinc-600',
      posBar: 'bg-rose-500/70',
      negBar: 'bg-sky-500/70',
      tooltipBg: 'bg-zinc-800 border border-zinc-700 shadow-lg',
      tooltipText: 'text-white',
      tooltipMuted: 'text-zinc-400',
      controlWrap: 'flex items-center gap-1 rounded-lg border border-zinc-800/90 bg-zinc-950/60 p-0.5',
      controlActive: 'rounded-md px-2.5 py-1 text-[11px] font-semibold bg-zinc-600 text-white',
      controlInactive: 'rounded-md px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white transition-colors',
      indicatorWrap: 'flex flex-wrap items-center gap-1.5',
      indicatorOn: 'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors',
      indicatorOff: 'rounded-full border border-zinc-700 bg-transparent text-zinc-500 px-2.5 py-0.5 text-[10px] font-semibold cursor-pointer hover:text-zinc-300 transition-colors',
      subPanel: 'border-t border-zinc-800/60 bg-zinc-950/30',
      subPanelLabel: 'fill-zinc-500',
      recommPin: 'bg-amber-400/80',
    },
    stockCard: {
      wrap:
        'group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 shadow-sm transition-[transform,border-width,border-color] duration-200 ease-out hover:z-10 hover:scale-[1.03] motion-reduce:hover:scale-100',
      headerRow:
        'flex items-start justify-between gap-2 border-b border-zinc-800/70 bg-zinc-950/40 px-3.5 py-2.5',
      title: 'text-[15px] font-bold leading-tight tracking-tight text-white truncate',
      symbol: 'text-[11px] text-zinc-500 font-mono tabular-nums mt-1',
      badgeKr:
        'shrink-0 rounded border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300',
      badgeUs:
        'shrink-0 rounded border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-200',
      quoteShell: 'bg-black/35 px-3.5 py-3 border-b border-zinc-800/60',
      price: 'text-2xl font-bold tabular-nums tracking-tight text-white leading-none',
      changeLine: 'text-sm font-semibold tabular-nums mt-2 font-mono',
      statsWrap: 'px-0 py-0 text-[11px] font-mono tabular-nums',
      statRow: 'flex justify-between gap-3 border-b border-zinc-800/50 px-3.5 py-2 bg-transparent',
      statRowAlt: 'flex justify-between gap-3 border-b border-zinc-800/50 px-3.5 py-2 bg-zinc-950/25',
      label: 'text-zinc-500 shrink-0 uppercase text-[10px] tracking-wide',
      value: 'text-zinc-200 truncate text-right font-medium',
      high: 'text-rose-400 truncate text-right font-medium',
      low: 'text-sky-400 truncate text-right font-medium',
      session:
        'text-[10px] text-zinc-500 font-sans tracking-widest uppercase text-right font-medium',
      errorBox:
        'rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 flex items-center justify-center min-h-[140px]',
      errorText: 'text-zinc-500 text-xs',
      skeleton:
        'rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 animate-pulse h-[220px]',
      skeletonBar: 'bg-zinc-800/80 rounded',
    },
    macro: {
      shell:
        'min-w-0 rounded-xl border border-amber-900/45 bg-gradient-to-br from-amber-950/35 via-zinc-950/25 to-emerald-950/20 p-4 sm:p-5 ring-1 ring-amber-900/25 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.07)]',
      sectionHeadRow:
        'mb-4 flex items-center justify-between gap-3 border-b border-zinc-800/90 pb-3',
      sectionTitle:
        'text-xs font-bold uppercase tracking-[0.22em] text-zinc-300',
      sectionMeta: 'text-[10px] text-zinc-500 font-mono',
      rail:
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-px rounded-xl border border-zinc-800/80 bg-zinc-800/60 p-px overflow-hidden shadow-inner',
      card: 'bg-zinc-900/95 p-3 sm:p-3.5 transition-colors hover:bg-zinc-900',
      label: 'text-zinc-500 text-[10px] font-semibold uppercase tracking-wide truncate',
      price: 'text-zinc-50 text-base font-bold tabular-nums tracking-tight mt-1',
      changeLine: 'text-[11px] mt-1.5 tabular-nums font-mono font-semibold',
      skeleton: 'bg-zinc-900 p-4 animate-pulse min-h-[88px]',
      skeletonBar: 'bg-zinc-800 rounded',
      categoryCurrency: 'border-amber-500/35 bg-amber-500/10 text-amber-400',
      categoryBond: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400',
      categoryIndex: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-400',
      categoryCommodity: 'border-orange-500/35 bg-orange-500/10 text-orange-400',
      categoryDefault: 'border-zinc-600 bg-zinc-800 text-zinc-400',
    },
    marketBadge: {
      live:
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/35 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold uppercase tracking-wide',
      liveDot:
        'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]',
      closed:
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-700 bg-zinc-800/50 text-zinc-500 text-[11px] font-semibold uppercase tracking-wide',
      closedDot: 'w-1.5 h-1.5 rounded-full bg-zinc-600',
    },
    refresh: {
      meta:
        'text-[10px] text-zinc-500 font-mono tabular-nums hidden sm:inline px-2',
      button:
        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-zinc-200 text-xs font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-45 disabled:pointer-events-none',
    },
    news: {
      panel:
        'rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)]',
      headerRule:
        'mb-4 flex items-end justify-between gap-2 border-b border-zinc-800/80 pb-3',
      title: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500',
      meta: 'text-[10px] text-zinc-600 font-mono',
      chipRowRule: 'flex flex-wrap gap-1.5 mb-4 border-b border-zinc-800/80 pb-3',
      chipOn: 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
      chipOff:
        'border border-transparent bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
      empty: 'text-zinc-500 text-xs text-center py-8',
      retry:
        'rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors',
      itemTitle: 'text-zinc-200 text-sm leading-snug transition-colors line-clamp-2 mb-1.5',
      itemTitleHover: 'group-hover:text-white',
      itemMeta: 'flex items-center gap-2 text-[11px] text-zinc-500 font-mono',
      itemSource: 'text-zinc-400',
      divide: 'divide-y divide-zinc-800/80',
      skeletonRow: 'animate-pulse border-b border-zinc-800/80 pb-3',
      skeletonBar: 'bg-zinc-800 rounded',
    },
    dart: {
      panel:
        'rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)]',
      headerRule:
        'mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-zinc-800/80 pb-3',
      title: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500',
      titleMuted: 'ml-2 text-[10px] font-normal normal-case tracking-normal text-zinc-600',
      meta: 'text-[10px] text-zinc-600 font-mono',
      chipRowRule: 'flex flex-wrap gap-1.5 mb-4 border-b border-zinc-800/80 pb-3',
      chipOn: 'border border-amber-500/35 bg-amber-500/10 text-amber-300',
      chipOff:
        'border border-transparent bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
      empty: 'text-zinc-500 text-xs text-center px-2',
      retry:
        'rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors',
      itemTitle: 'text-zinc-200 text-sm leading-snug transition-colors mb-1',
      itemTitleHover: 'group-hover:text-white',
      itemMeta: 'flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500 font-mono',
      itemSource: 'text-zinc-400',
      remark: 'text-amber-500/90',
      link: 'ml-auto text-cyan-400 transition-colors',
      linkHover: 'group-hover:text-cyan-300',
      divide: 'divide-y divide-zinc-800/80',
      skeletonRow: 'animate-pulse border-b border-zinc-800/80 py-3',
      skeletonBar: 'bg-zinc-800 rounded',
    },
    quote: {
      up: 'text-rose-400',
      down: 'text-sky-400',
      neutral: 'text-zinc-500',
    },
  },
  light: {
    layout: {
      page:
        'min-h-screen text-slate-800 antialiased pl-16 pt-16 pb-16 selection:bg-slate-900/12 selection:text-slate-900 bg-[repeating-linear-gradient(86deg,transparent,transparent_6px,rgba(255,255,255,0.28)_6px,rgba(255,255,255,0.28)_7px),repeating-linear-gradient(90deg,transparent,transparent_64px,rgba(148,163,184,0.11)_64px,rgba(148,163,184,0.11)_65px),linear-gradient(124deg,rgba(255,255,255,0.85)_0%,transparent_46%),linear-gradient(48deg,transparent_58%,rgba(71,85,105,0.09)_100%),linear-gradient(180deg,#f7f8fa_0%,#e8ecf2_38%,#dadfe8_100%),linear-gradient(90deg,#f3f5f7,#fdfdfd_50%,#f3f5f7)]',
      toolbar:
        'mb-6 flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white pl-5 pr-4 py-4 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)] border-l-4 border-l-slate-900 sm:flex-row sm:items-center sm:justify-between',
      toolbarTitle: 'text-xl sm:text-2xl font-bold tracking-tight text-slate-900',
      toolbarSubtitle:
        'text-[10px] text-slate-500 font-mono tracking-[0.12em] uppercase mt-1',
      toolbarActions:
        'flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/90 p-1',
      workspace:
        'flex flex-col gap-6 sm:gap-8 rounded-2xl border border-slate-300/80 bg-slate-200/70 p-3 sm:p-4 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]',
      sectionBlock: 'min-w-0',
      krMarketShell:
        'min-w-0 rounded-xl border-2 border-sky-300 bg-sky-100 p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(14,165,233,0.18)]',
      usMarketShell:
        'min-w-0 rounded-xl border-2 border-violet-300 bg-violet-100 p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(139,92,246,0.16)]',
      sectionHeadRow:
        'mb-4 flex items-center justify-between gap-3 border-b border-slate-300/80 pb-3',
      sectionAccentKr:
        'flex h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-sky-500 to-sky-700 shadow-[0_0_8px_rgba(14,165,233,0.5)]',
      sectionAccentUs:
        'flex h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-violet-500 to-violet-700 shadow-[0_0_8px_rgba(139,92,246,0.45)]',
      sectionTitle:
        'text-xs font-bold uppercase tracking-[0.22em] text-slate-700',
      sectionMeta: 'text-[10px] text-slate-500 font-mono tabular-nums',
      errorBanner:
        'mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
      errorTitle: 'text-red-900 text-sm font-semibold',
      errorDetail: 'text-red-800/90 text-xs mt-1 font-mono',
      errorRetry:
        'shrink-0 rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-900 shadow-sm hover:bg-red-50 transition-colors',
      footer: 'mt-12 text-center text-[10px] text-slate-400 font-mono tracking-wide',
    },
    toggle:
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900 transition-colors',
    detail: {
      card: 'rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden',
      cardHead: 'flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 bg-slate-50/80',
      cardTitle: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500',
      cardMeta: 'text-[10px] text-slate-400 font-mono',
      divider: 'border-b border-slate-100',
      rowLabel: 'text-[11px] text-slate-500 uppercase tracking-wide shrink-0',
      rowValue: 'text-[13px] font-semibold text-slate-900 font-mono tabular-nums',
      barTrack: 'bg-slate-200',
      barCenterLine: 'bg-slate-400',
      posBar: 'bg-rose-500/60',
      negBar: 'bg-sky-500/60',
      tooltipBg: 'bg-white border border-slate-200 shadow-lg',
      tooltipText: 'text-slate-900',
      tooltipMuted: 'text-slate-500',
      controlWrap: 'flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5',
      controlActive: 'rounded-md px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-900 shadow-sm',
      controlInactive: 'rounded-md px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-900 transition-colors',
      indicatorWrap: 'flex flex-wrap items-center gap-1.5',
      indicatorOn: 'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors',
      indicatorOff: 'rounded-full border border-slate-300 bg-transparent text-slate-400 px-2.5 py-0.5 text-[10px] font-semibold cursor-pointer hover:text-slate-700 transition-colors',
      subPanel: 'border-t border-slate-200 bg-slate-50/60',
      subPanelLabel: 'fill-slate-400',
      recommPin: 'bg-amber-500',
    },
    stockCard: {
      wrap:
        'group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] transition-[transform,border-width,border-color] duration-200 ease-out hover:z-10 hover:scale-[1.03] motion-reduce:hover:scale-100',
      headerRow:
        'flex items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-3.5 py-2.5',
      title: 'text-[15px] font-bold leading-tight text-slate-900 truncate',
      symbol: 'text-[11px] text-slate-500 font-mono tabular-nums mt-1',
      badgeKr:
        'shrink-0 rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-900',
      badgeUs:
        'shrink-0 rounded border border-violet-200 bg-violet-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-900',
      quoteShell: 'bg-slate-100/90 px-3.5 py-3 border-b border-slate-200/80',
      price: 'text-2xl font-bold tabular-nums tracking-tight text-slate-900 leading-none',
      changeLine: 'text-sm font-semibold tabular-nums mt-2 font-mono',
      statsWrap: 'text-[11px] font-mono tabular-nums',
      statRow: 'flex justify-between gap-3 border-b border-slate-100 px-3.5 py-2 bg-white',
      statRowAlt: 'flex justify-between gap-3 border-b border-slate-100 px-3.5 py-2 bg-slate-50/50',
      label: 'text-slate-500 shrink-0 uppercase text-[10px] tracking-wide',
      value: 'text-slate-800 truncate text-right font-medium',
      high: 'text-rose-700 truncate text-right font-medium',
      low: 'text-sky-800 truncate text-right font-medium',
      session:
        'text-[10px] text-slate-500 font-sans tracking-widest uppercase text-right font-medium',
      errorBox:
        'rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center min-h-[140px]',
      errorText: 'text-slate-500 text-xs',
      skeleton:
        'rounded-xl border border-slate-200 bg-white p-3.5 animate-pulse shadow-sm h-[220px]',
      skeletonBar: 'bg-slate-200 rounded',
    },
    macro: {
      shell:
        'min-w-0 rounded-xl border-2 border-amber-400 bg-amber-100 p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(245,158,11,0.18)]',
      sectionHeadRow:
        'mb-4 flex items-center justify-between gap-3 border-b border-amber-300 pb-3',
      sectionTitle:
        'text-xs font-bold uppercase tracking-[0.22em] text-amber-900',
      sectionMeta: 'text-[10px] text-amber-700 font-mono',
      rail:
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-px rounded-xl border border-amber-300 bg-amber-300 p-px overflow-hidden shadow-inner',
      card: 'bg-amber-50 p-3 sm:p-3.5 transition-colors hover:bg-white',
      label: 'text-amber-800 text-[10px] font-semibold uppercase tracking-wide truncate',
      price: 'text-slate-900 text-base font-bold tabular-nums tracking-tight mt-1',
      changeLine: 'text-[11px] mt-1.5 tabular-nums font-mono font-semibold',
      skeleton: 'bg-white p-4 animate-pulse min-h-[88px]',
      skeletonBar: 'bg-slate-200 rounded',
      categoryCurrency: 'border-amber-200 bg-amber-50 text-amber-900',
      categoryBond: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      categoryIndex: 'border-cyan-200 bg-cyan-50 text-cyan-900',
      categoryCommodity: 'border-orange-200 bg-orange-50 text-orange-900',
      categoryDefault: 'border-slate-200 bg-slate-100 text-slate-600',
    },
    marketBadge: {
      live:
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-semibold uppercase tracking-wide',
      liveDot: 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse',
      closed:
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300 bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wide',
      closedDot: 'w-1.5 h-1.5 rounded-full bg-slate-400',
    },
    refresh: {
      meta:
        'text-[10px] text-slate-500 font-mono tabular-nums hidden sm:inline px-2',
      button:
        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-slate-800 text-xs font-semibold hover:bg-white transition-colors disabled:opacity-45 disabled:pointer-events-none',
    },
    news: {
      panel:
        'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)]',
      headerRule:
        'mb-4 flex items-end justify-between gap-2 border-b border-slate-100 pb-3',
      title: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500',
      meta: 'text-[10px] text-slate-400 font-mono',
      chipRowRule: 'flex flex-wrap gap-1.5 mb-4 border-b border-slate-100 pb-3',
      chipOn: 'border border-cyan-300 bg-cyan-50 text-cyan-900',
      chipOff:
        'border border-transparent bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80',
      empty: 'text-slate-500 text-xs text-center py-8',
      retry:
        'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-slate-50 transition-colors',
      itemTitle: 'text-slate-800 text-sm leading-snug transition-colors line-clamp-2 mb-1.5',
      itemTitleHover: 'group-hover:text-slate-950',
      itemMeta: 'flex items-center gap-2 text-[11px] text-slate-500 font-mono',
      itemSource: 'text-slate-500',
      divide: 'divide-y divide-slate-100',
      skeletonRow: 'animate-pulse border-b border-slate-100 pb-3',
      skeletonBar: 'bg-slate-200 rounded',
    },
    dart: {
      panel:
        'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)]',
      headerRule:
        'mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-slate-100 pb-3',
      title: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500',
      titleMuted: 'ml-2 text-[10px] font-normal normal-case tracking-normal text-slate-400',
      meta: 'text-[10px] text-slate-400 font-mono',
      chipRowRule: 'flex flex-wrap gap-1.5 mb-4 border-b border-slate-100 pb-3',
      chipOn: 'border border-amber-300 bg-amber-50 text-amber-900',
      chipOff:
        'border border-transparent bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80',
      empty: 'text-slate-500 text-xs text-center px-2',
      retry:
        'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-slate-50 transition-colors',
      itemTitle: 'text-slate-800 text-sm leading-snug transition-colors mb-1',
      itemTitleHover: 'group-hover:text-slate-950',
      itemMeta: 'flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 font-mono',
      itemSource: 'text-slate-500',
      remark: 'text-amber-700',
      link: 'ml-auto text-cyan-700 transition-colors',
      linkHover: 'group-hover:text-cyan-900',
      divide: 'divide-y divide-slate-100',
      skeletonRow: 'animate-pulse border-b border-slate-100 py-3',
      skeletonBar: 'bg-slate-200 rounded',
    },
    quote: {
      up: 'text-rose-600',
      down: 'text-sky-700',
      neutral: 'text-slate-500',
    },
  },
};
