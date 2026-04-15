'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';

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

export default function SlidingPuzzleGame({ onGameEnd, onScoreChange, onMove, onCombo }: GameComponentProps) {
  const [tiles, setTiles] = useState<number[]>(GOAL);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { shakeStyle, triggerShake } = useScreenShake();
  const [confettiActive, setConfettiActive] = useState(false);

  const combo = useCombo();

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
    combo.reset();
    const shuffled = createShuffled();
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setWon(false);
    setGameStatus('playing');
    onScoreChange(0);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, [stopTimer, onScoreChange, combo]);

  // 공통 완성 체크 로직
  const checkWin = useCallback((next: number[], currentMoves: number, currentTime: number) => {
    if (next.join(',') === GOAL.join(',')) {
      setWon(true);
      setGameStatus('won');
      stopTimer();
      triggerShake(5, 300);
      setConfettiActive(true);
      const score = Math.max(100, 1000 - currentMoves * 5 - currentTime * 2);
      onScoreChange(score);
      onGameEnd(score, `${currentMoves}번 이동, ${currentTime}초`);
    }
  }, [stopTimer, triggerShake, onScoreChange, onGameEnd]);

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
      setMoves(m => {
        const newMoves = m + 1;
        onMove?.();

        // 콤보 추적
        const prevLevel = combo.comboLevel;
        const newLevel = combo.increment();
        if (newLevel > 0 && newLevel > prevLevel) {
          onCombo?.(newLevel);
        }

        setTime(t => {
          checkWin(next, newMoves, t);
          return t;
        });
        return newMoves;
      });

      return next;
    });
  }, [gameStatus, onMove, onCombo, combo, checkWin]);

  // moveByDir: D-pad 및 키보드 공통 사용
  const moveByDir = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameStatus !== 'playing') return;
    setTiles(prev => {
      const emptyIdx = prev.indexOf(0);
      const emptyRow = Math.floor(emptyIdx / SIZE);
      const emptyCol = emptyIdx % SIZE;
      let targetIdx = -1;

      if (dir === 'UP' && emptyRow < SIZE - 1) targetIdx = emptyIdx + SIZE;
      else if (dir === 'DOWN' && emptyRow > 0) targetIdx = emptyIdx - SIZE;
      else if (dir === 'LEFT' && emptyCol < SIZE - 1) targetIdx = emptyIdx + 1;
      else if (dir === 'RIGHT' && emptyCol > 0) targetIdx = emptyIdx - 1;

      if (targetIdx === -1) return prev;

      const next = [...prev];
      [next[targetIdx], next[emptyIdx]] = [next[emptyIdx], next[targetIdx]];

      setMoves(m => {
        const newMoves = m + 1;
        onMove?.();

        // 콤보 추적
        const prevLevel = combo.comboLevel;
        const newLevel = combo.increment();
        if (newLevel > 0 && newLevel > prevLevel) {
          onCombo?.(newLevel);
        }

        setTime(t => {
          checkWin(next, newMoves, t);
          return t;
        });
        return newMoves;
      });

      return next;
    });
  }, [gameStatus, onMove, onCombo, combo, checkWin]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      if (e.key === 'ArrowUp') { e.preventDefault(); moveByDir('UP'); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveByDir('DOWN'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); moveByDir('LEFT'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); moveByDir('RIGHT'); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [gameStatus, moveByDir]);

  return (
    <div className="flex flex-col items-center gap-4 p-4" style={shakeStyle}>
      <ConfettiEffect active={confettiActive} duration={2500} />
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

      {/* D-패드 모바일 컨트롤러 */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <div className="flex justify-center">
          <button
            onPointerDown={e => { e.preventDefault(); moveByDir('UP'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="위로 이동"
          >&#9650;</button>
        </div>
        <div className="flex gap-1">
          <button
            onPointerDown={e => { e.preventDefault(); moveByDir('LEFT'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="왼쪽 이동"
          >&#9664;</button>
          <div className="w-14 h-14" />
          <button
            onPointerDown={e => { e.preventDefault(); moveByDir('RIGHT'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="오른쪽 이동"
          >&#9654;</button>
        </div>
        <div className="flex justify-center">
          <button
            onPointerDown={e => { e.preventDefault(); moveByDir('DOWN'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="아래로 이동"
          >&#9660;</button>
        </div>
      </div>
    </div>
  );
}
