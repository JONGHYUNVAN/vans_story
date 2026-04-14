'use client';

import Link from 'next/link';
import { getGameById } from '@/constants/games';

interface GameLayoutProps {
  gameId: string;
  children: React.ReactNode;
  scorePanel: React.ReactNode;
  currentScore: number;
}

export default function GameLayout({ gameId, children, scorePanel }: GameLayoutProps) {
  const game = getGameById(gameId);

  return (
    <div
      className="min-h-screen bg-[#08080b] py-8"
      style={{
        backgroundImage: 'radial-gradient(circle, #1c1c22 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-4"
          >
            <span>←</span>
            <span>게임 목록</span>
          </Link>

          {game && (
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{game.icon}</span>
                <h1 className="text-3xl font-black text-white">{game.title}</h1>
              </div>
              <p className="text-zinc-400 text-sm ml-12">{game.description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">{children}</div>
          <div className="lg:w-72">{scorePanel}</div>
        </div>
      </div>
    </div>
  );
}
