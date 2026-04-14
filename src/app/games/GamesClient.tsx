'use client';

import { GAMES } from '@/constants/games';
import { useGameScores } from '@/hooks/useGameScores';
import GameCard from '@/components/features/games/GameCard';

function GameCardWrapper({ gameId }: { gameId: string }) {
  const game = GAMES.find(g => g.id === gameId)!;
  const { bestScore, bestDetail } = useGameScores(gameId);
  return <GameCard game={game} bestScore={bestScore} bestDetail={bestDetail} />;
}

export default function GamesClient() {
  return (
    <div
      className="min-h-screen bg-[#08080b] py-16"
      style={{
        backgroundImage: 'radial-gradient(circle, #1c1c22 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-2">
            Mini Games
          </p>
          <h1 className="text-5xl font-black text-white tracking-tight">Games</h1>
          <p className="text-zinc-400 mt-2">코딩 쉬는 시간, 간단한 게임 한 판</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map(game => (
            <GameCardWrapper key={game.id} gameId={game.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
