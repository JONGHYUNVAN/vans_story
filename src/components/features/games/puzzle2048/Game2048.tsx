'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

type GameStatus = 'idle' | 'playing' | 'won' | 'gameover';

interface Game2048State {
  board: number[][];
  score: number;
  bestTile: number;
  gameStatus: GameStatus;
}

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: 'bg-zinc-800/50', text: '' },
  2:    { bg: 'bg-zinc-700', text: 'text-zinc-200' },
  4:    { bg: 'bg-zinc-600', text: 'text-zinc-100' },
  8:    { bg: 'bg-amber-700', text: 'text-white' },
  16:   { bg: 'bg-amber-600', text: 'text-white' },
  32:   { bg: 'bg-orange-600', text: 'text-white' },
  64:   { bg: 'bg-orange-500', text: 'text-white' },
  128:  { bg: 'bg-yellow-500', text: 'text-white' },
  256:  { bg: 'bg-yellow-400', text: 'text-gray-900' },
  512:  { bg: 'bg-yellow-300', text: 'text-gray-900' },
  1024: { bg: 'bg-yellow-200', text: 'text-gray-900' },
  2048: { bg: 'bg-emerald-400', text: 'text-gray-900' },
};

function getTileColor(value: number): { bg: string; text: string } {
  return TILE_COLORS[value] ?? { bg: 'bg-emerald-300', text: 'text-gray-900' };
}

function getTileFontSize(value: number): string {
  const digits = value.toString().length;
  if (digits <= 1) return 'text-3xl font-black';
  if (digits === 2) return 'text-2xl font-black';
  if (digits === 3) return 'text-xl font-bold';
  return 'text-lg font-bold';
}

function emptyBoard(): number[][] {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function addRandomTile(board: number[][]): number[][] {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function initBoard(): number[][] {
  let board = emptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function transpose(board: number[][]): number[][] {
  return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

function reverseRows(board: number[][]): number[][] {
  return board.map(row => [...row].reverse());
}

function slideLeft(row: number[]): { result: number[]; gained: number; merges: number } {
  const filtered = row.filter(v => v !== 0);
  let gained = 0;
  let merges = 0;
  const merged: number[] = [];
  let skip = false;

  for (let i = 0; i < filtered.length; i++) {
    if (skip) { skip = false; continue; }
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      gained += val;
      merges += 1;
      skip = true;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < 4) merged.push(0);
  return { result: merged, gained, merges };
}

function moveLeft(board: number[][]): { board: number[][]; gained: number; changed: boolean; merges: number } {
  let gained = 0;
  let changed = false;
  let merges = 0;
  const newBoard = board.map(row => {
    const { result, gained: g, merges: m } = slideLeft(row);
    gained += g;
    merges += m;
    if (result.some((v, i) => v !== row[i])) changed = true;
    return result;
  });
  return { board: newBoard, gained, changed, merges };
}

function moveRight(board: number[][]): { board: number[][]; gained: number; changed: boolean; merges: number } {
  const reversed = reverseRows(board);
  const { board: moved, gained, changed, merges } = moveLeft(reversed);
  return { board: reverseRows(moved), gained, changed, merges };
}

function moveUp(board: number[][]): { board: number[][]; gained: number; changed: boolean; merges: number } {
  const transposed = transpose(board);
  const { board: moved, gained, changed, merges } = moveLeft(transposed);
  return { board: transpose(moved), gained, changed, merges };
}

function moveDown(board: number[][]): { board: number[][]; gained: number; changed: boolean; merges: number } {
  const transposed = transpose(board);
  const { board: moved, gained, changed, merges } = moveRight(transposed);
  return { board: transpose(moved), gained, changed, merges };
}

function isGameOver(board: number[][]): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

function hasTile(board: number[][], value: number): boolean {
  return board.some(row => row.includes(value));
}

function getBestTile(board: number[][]): number {
  return Math.max(...board.flat());
}

export default function Game2048({ onGameEnd, onScoreChange, onMove, onCombo }: GameComponentProps) {
  const [state, setState] = useState<Game2048State>({
    board: emptyBoard(),
    score: 0,
    bestTile: 0,
    gameStatus: 'idle',
  });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { shakeStyle, triggerShake } = useScreenShake();
  const { playMoveTick, playCombo, playScore } = useSound();
  const combo = useCombo();
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiDuration, setConfettiDuration] = useState(3000);
  const [flashActive, setFlashActive] = useState(false);
  const prevScoreRef = useRef(0);
  const bestScoreRef = useRef(0);

  const startGame = useCallback(() => {
    combo.reset();
    setState({
      board: initBoard(),
      score: 0,
      bestTile: 0,
      gameStatus: 'playing',
    });
  }, [combo]);

  const applyMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;

        let result: { board: number[][]; gained: number; changed: boolean; merges: number };
        switch (direction) {
          case 'left':  result = moveLeft(prev.board); break;
          case 'right': result = moveRight(prev.board); break;
          case 'up':    result = moveUp(prev.board); break;
          case 'down':  result = moveDown(prev.board); break;
        }

        if (!result.changed) return prev;

        onMove?.();

        // 이동 틱 사운드
        playMoveTick();

        if (result.merges >= 2) {
          onCombo?.(Math.min(result.merges, 5));
        }

        // 병합 콤보 사운드
        if (result.merges === 0) {
          combo.reset();
        } else {
          const prevLevel = combo.comboLevel;
          const newLevel = combo.increment();
          if (newLevel === 0) {
            playScore();
          } else if (newLevel > prevLevel) {
            playCombo(newLevel);
          } else {
            playScore();
          }
        }

        let newBoard = addRandomTile(result.board);
        const newScore = prev.score + result.gained;
        const newBestTile = getBestTile(newBoard);

        onScoreChange(newScore);

        if (hasTile(newBoard, 2048) && !hasTile(prev.board, 2048)) {
          onGameEnd(newScore, `최대 타일: ${newBestTile}`);
          return { board: newBoard, score: newScore, bestTile: newBestTile, gameStatus: 'won' };
        }

        if (isGameOver(newBoard)) {
          onGameEnd(newScore, `최대 타일: ${newBestTile}`);
          return { board: newBoard, score: newScore, bestTile: newBestTile, gameStatus: 'gameover' };
        }

        return { board: newBoard, score: newScore, bestTile: newBestTile, gameStatus: 'playing' };
      });
    },
    [onGameEnd, onScoreChange, onMove, onCombo, playMoveTick, playCombo, playScore, combo]
  );

  // 이펙트 감지
  useEffect(() => {
    if (state.gameStatus === 'won') {
      triggerShake(8, 500);
      setConfettiDuration(3000);
      setConfettiActive(true);
    }
    if (state.gameStatus === 'gameover') {
      setFlashActive(true);
    }
    // 신기록 감지
    if (state.score > prevScoreRef.current && state.score > bestScoreRef.current && state.score > 0) {
      bestScoreRef.current = state.score;
      triggerShake(6, 400);
      setConfettiDuration(1500);
      setConfettiActive(true);
    }
    prevScoreRef.current = state.score;
  }, [state.score, state.gameStatus, triggerShake]);

  // 키보드 핸들러
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up', w: 'up',
        ArrowDown: 'down', s: 'down',
        ArrowLeft: 'left', a: 'left',
        ArrowRight: 'right', d: 'right',
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      applyMove(dir);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [applyMove]);

  // 터치 스와이프
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        applyMove(dx > 0 ? 'right' : 'left');
      } else {
        applyMove(dy > 0 ? 'down' : 'up');
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [applyMove]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ConfettiEffect
        active={confettiActive}
        duration={confettiDuration}
      />
      <div className="flex items-center gap-6 w-full max-w-[400px]">
        <div className="text-center">
          <p className="text-xs text-zinc-500">점수</p>
          <p className="text-2xl font-black text-white">{state.score.toLocaleString()}</p>
        </div>
        <div className="flex-1" />
        <div className="text-center">
          <p className="text-xs text-zinc-500">최대 타일</p>
          <p className="text-2xl font-black text-amber-400">{state.bestTile || '-'}</p>
        </div>
        <button
          onClick={startGame}
          className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          새 게임
        </button>
      </div>

      <div
        ref={boardRef}
        className="relative max-w-[400px] w-full mx-auto bg-zinc-900 rounded-xl p-3"
        style={shakeStyle}
      >
        <FlashOverlay
          active={flashActive}
          color="rgba(239,68,68,0.35)"
          duration={400}
          onDone={() => setFlashActive(false)}
        />
        <div className="grid grid-cols-4 grid-rows-4 gap-2 aspect-square">
          {state.board.flat().map((value, index) => {
            const colors = getTileColor(value);
            return (
              <div
                key={index}
                className={`${colors.bg} rounded-lg flex items-center justify-center transition-all duration-150`}
              >
                {value !== 0 && (
                  <span className={`${getTileFontSize(value)} ${colors.text}`}>
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 게임오버 오버레이 */}
        {state.gameStatus === 'gameover' && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-4">
            <p className="text-3xl font-black text-red-400">Game Over!</p>
            <p className="text-lg text-white">최종 점수: {state.score.toLocaleString()}</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
            >
              다시 시작
            </button>
          </div>
        )}

        {/* 승리 오버레이 */}
        {state.gameStatus === 'won' && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-4">
            <p className="text-3xl font-black text-emerald-400">2048 달성!</p>
            <p className="text-lg text-white">점수: {state.score.toLocaleString()}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setState(s => ({ ...s, gameStatus: 'playing' }))}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                계속 플레이
              </button>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                새 게임
              </button>
            </div>
          </div>
        )}

        {/* idle 오버레이 */}
        {state.gameStatus === 'idle' && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold text-zinc-300">2048</p>
            <p className="text-sm text-zinc-500">방향키로 타일을 이동하세요</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
            >
              시작
            </button>
          </div>
        )}
      </div>

      {/* D-패드 모바일 컨트롤러 */}
      <div className="flex flex-col items-center gap-1">
        {/* 위 버튼 */}
        <div className="flex justify-center">
          <button
            onPointerDown={e => { e.preventDefault(); applyMove('up'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="위로 이동"
          >
            ▲
          </button>
        </div>
        {/* 가운데 행 */}
        <div className="flex gap-1">
          <button
            onPointerDown={e => { e.preventDefault(); applyMove('left'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="왼쪽으로 이동"
          >
            ◀
          </button>
          {/* 중앙 스페이서 */}
          <div className="w-14 h-14" />
          <button
            onPointerDown={e => { e.preventDefault(); applyMove('right'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="오른쪽으로 이동"
          >
            ▶
          </button>
        </div>
        {/* 아래 버튼 */}
        <div className="flex justify-center">
          <button
            onPointerDown={e => { e.preventDefault(); applyMove('down'); }}
            className="w-14 h-14 bg-gray-700/80 hover:bg-gray-600/80 active:bg-gray-500/80 border border-gray-600 rounded-xl flex items-center justify-center text-gray-200 text-2xl select-none touch-none"
            aria-label="아래로 이동"
          >
            ▼
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-600">방향키 또는 WASD로 이동 · 모바일: 스와이프 또는 D-패드</p>
    </div>
  );
}
