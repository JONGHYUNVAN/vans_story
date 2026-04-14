'use client';

import Link from 'next/link';
import { GameMeta } from '@/constants/games';

interface GameCardProps {
  game: GameMeta;
  bestScore: number;
  bestDetail?: string;
}

export default function GameCard({ game, bestScore, bestDetail }: GameCardProps) {
  return (
    <div className="group relative bg-[#0f0f12] border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/games/${game.id}`} className="block p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{game.icon}</span>
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
        </div>

        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{game.description}</p>

        <p className="text-xs text-zinc-500 mb-4">{game.controlInfo}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">최고 점수</p>
            {bestScore > 0 ? (
              <div>
                <p className="text-lg font-bold text-indigo-400">{bestScore.toLocaleString()}</p>
                {bestDetail && (
                  <p className="text-xs text-zinc-500 mt-0.5">{bestDetail}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">아직 기록 없음</p>
            )}
          </div>
          <div className={`w-10 h-10 ${game.color} rounded-xl flex items-center justify-center opacity-80`}>
            <span className="text-xl">{game.icon}</span>
          </div>
        </div>
      </Link>

      <div className="h-0 group-hover:h-8 overflow-hidden bg-white/5 flex items-center justify-center transition-all duration-300">
        <span className="text-xs text-zinc-400 font-medium">플레이하기</span>
      </div>
    </div>
  );
}
