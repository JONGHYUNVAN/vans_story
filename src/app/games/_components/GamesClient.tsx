'use client';

import { GAMES } from '@/constants/games';
import { useGameScores } from '@/hooks/useGameScores';
import { useSound } from '@/hooks/useSound';
import GameCard from '@/components/features/games/GameCard';

interface CardWrapperProps {
  gameId: string;
  index: number;
  onHover: () => void;
  onSelect: () => void;
}

function GameCardWrapper({ gameId, index, onHover, onSelect }: CardWrapperProps) {
  const game = GAMES.find(g => g.id === gameId)!;
  const { bestScore, bestDetail } = useGameScores(gameId);
  return (
    <GameCard
      game={game}
      bestScore={bestScore}
      bestDetail={bestDetail}
      index={index}
      onHover={onHover}
      onSelect={onSelect}
    />
  );
}

export default function GamesClient() {
  const { playHover, playSelect, isMuted, toggleMute } = useSound();

  return (
    <div className="min-h-screen bg-[#08080b] py-16 relative overflow-hidden">
      {/* Floating orb backgrounds */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
          top: '-15%',
          left: '-10%',
          animation: 'floatOrb1 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
          top: '35%',
          right: '-8%',
          animation: 'floatOrb2 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '360px',
          height: '360px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)',
          bottom: '5%',
          left: '32%',
          animation: 'floatOrb3 12s ease-in-out infinite',
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
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            {/* ARCADE label */}
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-3"
              style={{
                background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ✦ ARCADE ✦
            </p>

            {/* Title */}
            <h1
              className="text-6xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Games
            </h1>

            {/* Subtitle with blinking cursor */}
            <p className="text-zinc-400 mt-3 flex items-center gap-1">
              막판의 막판, 진짜 마지막
              <span className="cursor-blink text-indigo-400 font-thin ml-0.5">|</span>
            </p>
          </div>

          {/* Sound toggle */}
          <button
            onClick={toggleMute}
            className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center text-base"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Game count badge */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-zinc-400 font-medium">{GAMES.length} Games Available</span>
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, index) => (
            <div
              key={game.id}
              className="game-card-enter"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <GameCardWrapper
                gameId={game.id}
                index={index}
                onHover={playHover}
                onSelect={playSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
