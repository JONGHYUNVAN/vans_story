interface MarketStatusBadgeProps {
  isOpen: boolean;
}

export default function MarketStatusBadge({ isOpen }: MarketStatusBadgeProps) {
  if (isOpen) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600/30 text-gray-400 text-xs font-semibold">
      <span className="w-2 h-2 rounded-full bg-gray-500" />
      장마감
    </span>
  );
}
