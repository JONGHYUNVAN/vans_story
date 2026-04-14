'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';

const SIZE = 4;
const GOAL = [...Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1), 0];

type GameStatus = 'idle' | 'playing' | 'won';

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  const flat = tiles.filter(x => x !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  const emptyRow = Math.floor(tiles.indexOf(0) / SIZE);
  return (inversions + emptyRow) % 2 === 0;
}

function createShuffled(): number[] {
  let tiles: number[];
  do {
    tiles = [...GOAL].sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles) || tiles.join(',') === GOAL.join(','));
  return tiles;
}

export default function SlidingPuzzleGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const [tiles, setTiles] = useState<number[]>(GOAL);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const startGame = useCallback(() => {
    stopTimer();
    const shuffled = createShuffled();
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setWon(false);
    setGameStatus('playing');
    onScoreChange(0);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, [stopTimer, onScoreChange]);

  const moveTile = useCallback((idx: number) => {
    if (gameStatus !== 'playing') return;
    setTiles(prev => {
      const emptyIdx = prev.indexOf(0);
      const row = Math.floor(idx / SIZE);
      const col = idx % SIZE;
      const emptyRow = Math.floor(emptyIdx / SIZE);
      const emptyCol = emptyIdx % SIZE;
      const isAdjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);
      if (!isAdjacent) return prev;

      const next = [...prev];
      [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
      setMoves(m => m + 1);

      if (next.join(',') === GOAL.join(',')) {
        setWon(true);
        setGameStatus('won');
        stopTimer();
        setTime(t => {
          const finalTime = t;
          setMoves(m => {
            const score = Math.max(100, 1000 - m * 5 - finalTime * 2);
            onScoreChange(score);
            onGameEnd(score, `${m}번 이동, ${finalTime}초`);
            return m;
          });
          return finalTime;
        });
      }

      return next;
    });
  }, [gameStatus, stopTimer, onGameEnd, onScoreChange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      setTiles(prev => {
        const emptyIdx = prev.indexOf(0);
        const emptyRow = Math.floor(emptyIdx / SIZE);
        const emptyCol = emptyIdx % SIZE;
        let targetIdx = -1;

        if (e.key === 'ArrowUp' && emptyRow < SIZE - 1) targetIdx = emptyIdx + SIZE;
        else if (e.key === 'ArrowDown' && emptyRow > 0) targetIdx = emptyIdx - SIZE;
        else if (e.key === 'ArrowLeft' && emptyCol < SIZE - 1) targetIdx = emptyIdx + 1;
        else if (e.key === 'ArrowRight' && emptyCol > 0) targetIdx = emptyIdx - 1;

        if (targetIdx === -1) return prev;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }

        const next = [...prev];
        [next[targetIdx], next[emptyIdx]] = [next[emptyIdx], next[targetIdx]];
        setMoves(m => m + 1);

        if (next.join(',') === GOAL.join(',')) {
          setWon(true);
          setGameStatus('won');
          stopTimer();
          setTime(t => {
            const finalTime = t;
            setMoves(m => {
              const score = Math.max(100, 1000 - m * 5 - finalTime * 2);
              onScoreChange(score);
              onGameEnd(score, `${m}번 이동, ${finalTime}초`);
              return m;
            });
            return finalTime;
          });
        }

        return next;
      });
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [gameStatus, stopTimer, onGameEnd, onScoreChange]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Stats */}
      <div className="flex gap-6 bg-gray-900 border border-gray-700 rounded-xl px-6 py-3">
        <span className="text-white">이동: <span className="font-mono font-bold">{moves}</span></span>
        <span className="text-white">시간: <span className="font-mono font-bold">{time}s</span></span>
      </div>

      {won && (
        <div className="text-emerald-400 font-bold text-lg">
          완성! 점수: {Math.max(100, 1000 - moves * 5 - time * 2)}
        </div>
      )}

      {/* Puzzle grid */}
      <div className="grid grid-cols-4 gap-1 bg-gray-900 border border-gray-700 rounded-xl p-3">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            onClick={() => moveTile(idx)}
            className={[
              'w-16 h-16 md:w-[72px] md:h-[72px] flex items-center justify-center rounded-lg font-bold text-xl transition-all duration-150 select-none',
              tile === 0
                ? 'bg-zinc-800/30 cursor-default'
                : won
                ? 'bg-emerald-900 border-2 border-emerald-500 text-white cursor-pointer hover:bg-emerald-800'
                : 'bg-indigo-900 border-2 border-indigo-500 text-white cursor-pointer hover:bg-indigo-800',
            ].join(' ')}
          >
            {tile !== 0 ? tile : ''}
          </div>
        ))}
      </div>

      {gameStatus === 'idle' && (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-bold"
        >
          게임 시작
        </button>
      )}
      {(gameStatus === 'playing' || gameStatus === 'won') && (
        <button
          onClick={startGame}
          className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-6 py-2 text-sm"
        >
          새 게임
        </button>
      )}
      <p className="text-zinc-500 text-sm">타일 클릭 또는 방향키로 이동</p>
    </div>
  );
}
