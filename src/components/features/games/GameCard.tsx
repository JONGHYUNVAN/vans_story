'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GameMeta } from '@/constants/games';

interface GameCardProps {
  game: GameMeta;
  bestScore: number;
  bestDetail?: string;
  index?: number;
  onHover?: () => void;
  onSelect?: () => void;
}

export default function GameCard({ game, bestScore, bestDetail, onHover, onSelect }: GameCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative bg-[#0f0f12] border border-white/8 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => {
        setHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 28px ${game.hexColor}38, 0 0 56px ${game.hexColor}18, 0 12px 40px rgba(0,0,0,0.5)`
          : '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, ${game.hexColor}, transparent)`,
          opacity: hovered ? 1 : 0.35,
        }}
      />

      <Link href={`/games/${game.id}`} className="block p-6 pt-7" onClick={() => onSelect?.()}>
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-3xl inline-block transition-transform duration-300"
            style={{
              transform: hovered ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            {game.icon}
          </span>
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{game.description}</p>

        {/* Control info */}
        <p className="text-xs text-zinc-600 mb-4">{game.controlInfo}</p>

        {/* Score + badge */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">최고 점수</p>
            {bestScore > 0 ? (
              <div>
                <p className="text-lg font-bold tabular-nums" style={{ color: game.hexColor }}>
                  {bestScore.toLocaleString()}
                </p>
                {bestDetail && <p className="text-xs text-zinc-500 mt-0.5">{bestDetail}</p>}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">아직 기록 없음</p>
            )}
          </div>

          {/* Icon badge */}
          <div
            className={`w-10 h-10 ${game.color} rounded-xl flex items-center justify-center transition-all duration-300`}
            style={{
              opacity: hovered ? 1 : 0.65,
              boxShadow: hovered ? `0 0 14px ${game.hexColor}70` : 'none',
            }}
          >
            <span className="text-xl">{game.icon}</span>
          </div>
        </div>
      </Link>

      {/* Play button strip */}
      <div
        className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(to right, ${game.hexColor}28, ${game.hexColor}0f)`,
        }}
      >
        <div className="h-10 flex items-center justify-center gap-2">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: game.hexColor }}
          >
            Play Now
          </span>
          <span className="text-xs text-zinc-500">→</span>
        </div>
      </div>
    </div>
  );
}
