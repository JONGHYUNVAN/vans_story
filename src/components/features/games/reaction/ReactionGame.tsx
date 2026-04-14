'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';

const TOTAL_ROUNDS = 5;

type GameStatus = 'idle' | 'waiting' | 'ready' | 'clicked' | 'tooearly' | 'finished';

interface ReactionState {
  gameStatus: GameStatus;
  round: number;
  results: number[];
  startTime: number | null;
  averageMs: number;
}

function getGrade(avg: number): string {
  if (avg < 150) return '초인적인 반응속도!';
  if (avg < 200) return '매우 빠름';
  if (avg < 250) return '평균 이상';
  if (avg < 350) return '평균';
  return '조금 느림';
}

function getGradePrefix(avg: number): string {
  if (avg < 150) return '🏆';
  if (avg < 200) return '⚡';
  if (avg < 250) return '😊';
  if (avg < 350) return '😐';
  return '😴';
}

export default function ReactionGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const [state, setState] = useState<ReactionState>({
    gameStatus: 'idle',
    round: 0,
    results: [],
    startTime: null,
    averageMs: 0,
  });
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooEarlyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    if (tooEarlyTimerRef.current) clearTimeout(tooEarlyTimerRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const startWaiting = useCallback(() => {
    clearTimers();
    setState(prev => ({ ...prev, gameStatus: 'waiting', startTime: null }));
    const delay = 1000 + Math.random() * 3000;
    waitTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, gameStatus: 'ready', startTime: Date.now() }));
    }, delay);
  }, [clearTimers]);

  const startGame = useCallback(() => {
    clearTimers();
    setState({
      gameStatus: 'waiting',
      round: 1,
      results: [],
      startTime: null,
      averageMs: 0,
    });
    const delay = 1000 + Math.random() * 3000;
    waitTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, gameStatus: 'ready', startTime: Date.now() }));
    }, delay);
  }, [clearTimers]);

  const handleClick = useCallback(() => {
    const { gameStatus, round, results, startTime } = state;

    if (gameStatus === 'idle' || gameStatus === 'finished') return;

    if (gameStatus === 'waiting') {
      // Too early
      clearTimers();
      setState(prev => ({ ...prev, gameStatus: 'tooearly' }));
      tooEarlyTimerRef.current = setTimeout(() => {
        // Record 1000ms penalty and continue
        const newResults = [...results, 1000];
        const newRound = round + 1;
        if (newRound > TOTAL_ROUNDS) {
          const avg = Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length);
          const score = Math.max(0, 1000 - avg);
          setState(prev => ({
            ...prev,
            gameStatus: 'finished',
            results: newResults,
            averageMs: avg,
          }));
          onScoreChange(score);
          onGameEnd(score, `평균 ${avg}ms`);
        } else {
          setState(prev => ({ ...prev, results: newResults, round: newRound }));
          startWaiting();
        }
      }, 1000);
      return;
    }

    if (gameStatus === 'ready' && startTime !== null) {
      const reactionMs = Date.now() - startTime;
      clearTimers();
      const newResults = [...results, reactionMs];
      const newRound = round + 1;

      setState(prev => ({
        ...prev,
        gameStatus: 'clicked',
        results: newResults,
      }));

      if (newRound > TOTAL_ROUNDS) {
        const avg = Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length);
        const score = Math.max(0, 1000 - avg);
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            gameStatus: 'finished',
            averageMs: avg,
          }));
          onScoreChange(score);
          onGameEnd(score, `평균 ${avg}ms`);
        }, 800);
      } else {
        setTimeout(() => {
          setState(prev => ({ ...prev, round: newRound }));
          startWaiting();
        }, 800);
      }
      return;
    }

    if (gameStatus === 'clicked' || gameStatus === 'tooearly') return;
  }, [state, clearTimers, startWaiting, onGameEnd, onScoreChange]);

  const { gameStatus, round, results, averageMs } = state;
  const lastResult = results[results.length - 1];

  const getBgClass = () => {
    switch (gameStatus) {
      case 'ready': return 'bg-emerald-700';
      case 'tooearly': return 'bg-red-800';
      case 'clicked': return 'bg-blue-900';
      default: return 'bg-zinc-800';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Progress */}
      {gameStatus !== 'idle' && gameStatus !== 'finished' && (
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <div
              key={i}
              className={[
                'w-8 h-2 rounded-full',
                i < results.length ? 'bg-emerald-500' : i === results.length ? 'bg-indigo-400' : 'bg-zinc-600',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {/* Main click area */}
      <div
        className={[
          'w-full max-w-sm min-h-[300px] rounded-xl border border-gray-700 flex flex-col items-center justify-center cursor-pointer select-none transition-colors duration-100',
          getBgClass(),
        ].join(' ')}
        onClick={handleClick}
      >
        {gameStatus === 'idle' && (
          <div className="text-center">
            <p className="text-white text-xl font-bold mb-2">반응속도 테스트</p>
            <p className="text-zinc-400 text-sm">화면이 초록색으로 변하면 클릭하세요</p>
          </div>
        )}
        {gameStatus === 'waiting' && (
          <div className="text-center">
            <p className="text-zinc-300 text-lg">잠시 기다리세요...</p>
            <p className="text-zinc-500 text-sm mt-2">{round} / {TOTAL_ROUNDS} 라운드</p>
          </div>
        )}
        {gameStatus === 'ready' && (
          <p className="text-white text-4xl font-black">지금 클릭!</p>
        )}
        {gameStatus === 'tooearly' && (
          <div className="text-center">
            <p className="text-white text-2xl font-bold">너무 빨라요!</p>
            <p className="text-zinc-300 text-sm mt-1">페널티: 1000ms</p>
          </div>
        )}
        {gameStatus === 'clicked' && lastResult !== undefined && (
          <div className="text-center">
            <p className="text-white text-4xl font-black">{lastResult}ms</p>
            <p className="text-zinc-300 text-sm mt-1">{round} / {TOTAL_ROUNDS} 라운드</p>
          </div>
        )}
        {gameStatus === 'finished' && (
          <div className="text-center">
            <p className="text-zinc-400 text-sm">완료</p>
          </div>
        )}
      </div>

      {/* Results */}
      {gameStatus === 'finished' && (
        <div className="flex flex-col items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-sm">
          <p className="text-white text-2xl font-black">
            {getGradePrefix(averageMs)} {getGrade(averageMs)}
          </p>
          <p className="text-zinc-300 text-lg">평균: <span className="font-bold text-white">{averageMs}ms</span></p>
          <div className="w-full">
            {results.map((ms, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-zinc-700">
                <span className="text-zinc-400">{i + 1}라운드</span>
                <span className={ms >= 1000 ? 'text-red-400' : 'text-white'}>{ms}ms{ms >= 1000 ? ' (페널티)' : ''}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm">점수: {Math.max(0, 1000 - averageMs)}</p>
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 w-full"
          >
            다시 시작
          </button>
        </div>
      )}

      {gameStatus === 'idle' && (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-bold"
        >
          게임 시작
        </button>
      )}
    </div>
  );
}
