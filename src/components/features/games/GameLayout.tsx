'use client';

import Link from 'next/link';
import { getGameById } from '@/constants/games';

interface GameLayoutProps {
  gameId: string;
  children: React.ReactNode;
  scorePanel: React.ReactNode;
  currentScore: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export default function GameLayout({ gameId, children, scorePanel, isMuted, onToggleMute }: GameLayoutProps) {
  const game = getGameById(gameId);

  return (
    <div className="min-h-screen bg-[#08080b] pt-14 pb-8 relative overflow-hidden">
      {/* Floating orb backgrounds */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: game
            ? `radial-gradient(circle, ${game.hexColor}1a 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          animation: 'floatOrb1 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          animation: 'floatOrb2 18s ease-in-out infinite',
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1c1c22 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.45,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: back button + mute toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/games"
            className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1 inline-block">
              ←
            </span>
            <span>게임 목록</span>
          </Link>

          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center text-sm"
              title={isMuted ? '소리 켜기' : '소리 끄기'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          )}
        </div>

        {/* Game title with color accent bar */}
        {game && (
          <div className="pl-4 border-l-4 mb-6" style={{ borderColor: game.hexColor }}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{game.icon}</span>
              <h1 className="text-3xl font-black text-white">{game.title}</h1>
            </div>
            <p className="text-zinc-400 text-sm ml-14">{game.description}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">{children}</div>
          <div className="lg:w-72">{scorePanel}</div>
        </div>
      </div>
    </div>
  );
}
