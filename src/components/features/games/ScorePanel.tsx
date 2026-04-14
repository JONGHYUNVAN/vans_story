'use client';

import { ScoreRecord } from '@/hooks/useGameScores';

interface ScorePanelProps {
  currentScore: number;
  bestScore: number;
  bestDetail?: string;
  history: ScoreRecord[];
}

function getRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return '방금 전';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function ScorePanel({ currentScore, bestScore, bestDetail, history }: ScorePanelProps) {
  const recentHistory = history.slice(0, 5);

  return (
    <div className="bg-[#0f0f12] border border-white/8 rounded-2xl p-5 space-y-6">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">현재 점수</p>
        <p className="text-3xl font-black text-white">{currentScore.toLocaleString()}</p>
      </div>

      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">최고 점수</p>
        <p className="text-xl font-bold text-indigo-400">{bestScore.toLocaleString()}</p>
        {bestDetail && (
          <p className="text-xs text-zinc-500 mt-1">{bestDetail}</p>
        )}
      </div>

      {recentHistory.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">최근 기록</p>
          <div className="space-y-2">
            {recentHistory.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-300">
                    {record.score.toLocaleString()}
                  </p>
                  {record.detail && (
                    <p className="text-xs text-zinc-600">{record.detail}</p>
                  )}
                </div>
                <p className="text-xs text-zinc-600">{getRelativeTime(record.playedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentHistory.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-zinc-600">아직 기록이 없습니다</p>
          <p className="text-xs text-zinc-700 mt-1">게임을 플레이하면 기록이 쌓여요</p>
        </div>
      )}
    </div>
  );
}
