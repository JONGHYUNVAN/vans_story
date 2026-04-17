'use client';

import { useState, useCallback, useRef } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useGameTimer } from '@/hooks/useGameTimer';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

type GameStatus = 'idle' | 'playing' | 'won' | 'gameover';

const NEIGHBOR_COLORS: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-green-400',
  3: 'text-red-400',
  4: 'text-indigo-400',
  5: 'text-red-600',
  6: 'text-cyan-400',
  7: 'text-purple-400',
  8: 'text-zinc-400',
};

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  );
}

function placeMines(board: Cell[][], safeRow: number, safeCol: number): Cell[][] {
  const next = board.map(row => row.map(cell => ({ ...cell })));
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!next[r][c].isMine && !(r === safeRow && c === safeCol)) {
      next[r][c].isMine = true;
      placed++;
    }
  }
  // compute neighbor counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && next[nr][nc].isMine) count++;
        }
      }
      next[r][c].neighborCount = count;
    }
  }
  return next;
}

function revealBFS(board: Cell[][], startRow: number, startCol: number): Cell[][] {
  const next = board.map(row => row.map(cell => ({ ...cell })));
  const queue: [number, number][] = [[startRow, startCol]];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (next[r][c].isRevealed || next[r][c].isFlagged) continue;
    next[r][c].isRevealed = true;
    if (next[r][c].neighborCount === 0 && !next[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          queue.push([r + dr, c + dc]);
        }
      }
    }
  }
  return next;
}

export default function MinesweeperGame({ onGameEnd, onScoreChange, onAction, onCombo }: GameComponentProps) {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [flagCount, setFlagCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const { shakeStyle, triggerShake } = useScreenShake();
  const [flashActive, setFlashActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  const { playSelect, playMoveTick } = useSound();
  const combo = useCombo();

  useGameTimer(() => setTime(t => t + 1), gameStatus === 'playing' ? 1000 : null);

  const resetGame = useCallback(() => {
    combo.reset();
    setBoard(createEmptyBoard());
    setGameStatus('idle');
    setFlagCount(0);
    setRevealedCount(0);
    setTime(0);
    setFirstClick(true);
    onScoreChange(0);
  }, [onScoreChange, combo]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (gameStatus === 'won' || gameStatus === 'gameover') return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    let currentBoard = board;

    if (firstClick) {
      currentBoard = placeMines(board, r, c);
      setFirstClick(false);
      setGameStatus('playing');
    }

    if (currentBoard[r][c].isMine) {
      // reveal all mines
      const revealed = currentBoard.map(row =>
        row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed,
        }))
      );
      setBoard(revealed);
      setGameStatus('gameover');
      combo.reset();
      onGameEnd(0, '지뢰 폭발!');
      triggerShake(12, 600);
      setFlashActive(true);
      return;
    }

    // 안전 셀 공개 - 즉시 클릭 피드백
    onAction?.();
    playSelect();

    const nextBoard = revealBFS(currentBoard, r, c);
    let newRevealedCount = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (nextBoard[row][col].isRevealed && !nextBoard[row][col].isMine) newRevealedCount++;
      }
    }
    setBoard(nextBoard);
    setRevealedCount(newRevealedCount);

    // 콤보 추적
    const prevLevel = combo.comboLevel;
    const newLevel = combo.increment();
    if (newLevel > 0 && newLevel > prevLevel) {
      onCombo?.(newLevel);
    }

    const clearableCells = ROWS * COLS - MINE_COUNT;
    if (newRevealedCount >= clearableCells) {
      setGameStatus('won');
      const score = Math.max(0, clearableCells * 10 - time);
      onScoreChange(score);
      onGameEnd(score, `${time}초 클리어`);
      setConfettiActive(true);
    }
  }, [board, gameStatus, firstClick, time, onGameEnd, onScoreChange, triggerShake, onAction, onCombo, playSelect, combo]);

  const handleRightClick = useCallback((e: React.MouseEvent | React.PointerEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameStatus !== 'playing' && gameStatus !== 'idle') return;
    if (board[r][c].isRevealed) return;

    playMoveTick();

    const next = board.map(row => row.map(cell => ({ ...cell })));
    if (next[r][c].isFlagged) {
      next[r][c].isFlagged = false;
      setFlagCount(f => f - 1);
    } else {
      next[r][c].isFlagged = true;
      setFlagCount(f => f + 1);
    }
    setBoard(next);
  }, [board, gameStatus, playMoveTick]);

  return (
    <div className="flex flex-col items-center gap-4 p-4" style={shakeStyle}>
      <ConfettiEffect active={confettiActive} duration={3000} />
      <FlashOverlay
        active={flashActive}
        color="rgba(239,68,68,0.35)"
        duration={500}
        onDone={() => setFlashActive(false)}
      />
      {/* Header */}
      <div className="flex items-center gap-6 bg-gray-900 border border-gray-700 rounded-xl px-6 py-3">
        <span className="text-white font-mono text-lg">
          🚩 {MINE_COUNT - flagCount}
        </span>
        <button
          onClick={resetGame}
          className="text-2xl hover:scale-110 transition-transform"
          title="리셋"
        >
          {gameStatus === 'gameover' ? '😵' : gameStatus === 'won' ? '😎' : '😊'}
        </button>
        <span className="text-white font-mono text-lg">
          ⏱ {time}s
        </span>
      </div>

      {/* Status message */}
      {gameStatus === 'won' && (
        <div className="text-emerald-400 font-bold text-lg">클리어! 점수: {Math.max(0, (ROWS * COLS - MINE_COUNT) * 10 - time)}</div>
      )}
      {gameStatus === 'gameover' && (
        <div className="text-red-400 font-bold text-lg">게임 오버! 지뢰를 밟았습니다.</div>
      )}

      {/* Board */}
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-3 select-none"
        onContextMenu={e => e.preventDefault()}
      >
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              let cellClass =
                'w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs font-bold border border-zinc-600 cursor-pointer ';
              if (cell.isRevealed) {
                if (cell.isMine) {
                  cellClass += 'bg-red-900';
                } else {
                  cellClass += 'bg-zinc-900';
                }
              } else {
                cellClass += 'bg-zinc-700 hover:bg-zinc-600';
              }

              return (
                <div
                  key={c}
                  className={cellClass}
                  onContextMenu={e => handleRightClick(e, r, c)}
                  onPointerDown={e => {
                    longPressTriggeredRef.current = false;
                    longPressRef.current = setTimeout(() => {
                      longPressTriggeredRef.current = true;
                      handleRightClick(e, r, c);
                      longPressRef.current = null;
                    }, 500);
                  }}
                  onPointerUp={() => {
                    if (longPressRef.current) {
                      clearTimeout(longPressRef.current);
                      longPressRef.current = null;
                    }
                    if (!longPressTriggeredRef.current) {
                      handleCellClick(r, c);
                    }
                  }}
                  onPointerLeave={() => {
                    if (longPressRef.current) {
                      clearTimeout(longPressRef.current);
                      longPressRef.current = null;
                    }
                  }}
                >
                  {cell.isRevealed && cell.isMine && '💣'}
                  {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && (
                    <span className={NEIGHBOR_COLORS[cell.neighborCount]}>
                      {cell.neighborCount}
                    </span>
                  )}
                  {!cell.isRevealed && cell.isFlagged && '🚩'}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-zinc-500 text-sm">클릭: 열기 / 우클릭 또는 길게 누르기: 깃발</p>
    </div>
  );
}
