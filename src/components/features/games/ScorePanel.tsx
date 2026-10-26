'use client';

import { useEffect, useRef, useState } from 'react';
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

export default function ScorePanel({
  currentScore,
  bestScore,
  bestDetail,
  history,
}: ScorePanelProps) {
  const recentHistory = history.slice(0, 5);
  const [displayScore, setDisplayScore] = useState(currentScore);
  const animFrameRef = useRef<number | undefined>(undefined);
  const prevScoreRef = useRef(currentScore);
  const isNewRecord = currentScore > 0 && currentScore >= bestScore;

  useEffect(() => {
    const start = prevScoreRef.current;
    const end = currentScore;
    if (start === end) return;

    const duration = 400;
    const startTime = performance.now();

    if (animFrameRef.current !== undefined) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayScore(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevScoreRef.current = end;
        animFrameRef.current = undefined;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== undefined) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentScore]);

  return (
    <div className="border-white/8 space-y-6 rounded-2xl border bg-[#0f0f12] p-5">
      {/* Current score */}
      <div>
        <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">현재 점수</p>
        <p className="text-3xl font-black tabular-nums text-white">
          {displayScore.toLocaleString()}
        </p>
        {isNewRecord && (
          <span className="mt-1 inline-flex animate-pulse items-center gap-1 text-xs font-bold text-yellow-400">
            ★ 신기록!
          </span>
        )}
      </div>

      {/* Best score */}
      <div>
        <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">최고 점수</p>
        <p
          className={`text-xl font-bold tabular-nums ${isNewRecord ? 'text-yellow-400' : 'text-indigo-400'}`}
        >
          {bestScore.toLocaleString()}
        </p>
        {bestDetail && <p className="mt-1 text-xs text-zinc-500">{bestDetail}</p>}
      </div>

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">최근 기록</p>
          <div className="space-y-2">
            {recentHistory.map((record, index) => (
              <div
                key={index}
                className={`flex items-center justify-between border-b border-white/5 py-2 last:border-0 ${index === 0 ? 'opacity-100' : 'opacity-60'}`}
              >
                <div>
                  <p
                    className={`text-sm font-semibold tabular-nums ${index === 0 ? 'text-zinc-200' : 'text-zinc-400'}`}
                  >
                    {record.score.toLocaleString()}
                  </p>
                  {record.detail && <p className="text-xs text-zinc-600">{record.detail}</p>}
                </div>
                <p className="text-xs text-zinc-600">{getRelativeTime(record.playedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentHistory.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-xs text-zinc-600">아직 기록이 없습니다</p>
          <p className="mt-1 text-xs text-zinc-700">게임을 플레이하면 기록이 쌓여요</p>
        </div>
      )}
    </div>
  );
}
