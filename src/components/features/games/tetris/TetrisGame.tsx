'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';

const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const CELL_SIZE = 30;

const TETROMINOES: Record<string, { shape: number[][]; color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: '#22d3ee' },
  O: { shape: [[1, 1], [1, 1]], color: '#facc15' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#c084fc' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#4ade80' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f87171' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#60a5fa' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#fb923c' },
};

const TETROMINO_KEYS = Object.keys(TETROMINOES);

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

type BoardRow = (string | 0)[];

function createBoard(): BoardRow[] {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0) as BoardRow);
}

function randomPiece(): Piece {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  const t = TETROMINOES[key];
  return {
    shape: t.shape.map(r => [...r]),
    color: t.color,
    x: Math.floor(BOARD_COLS / 2) - Math.floor(t.shape[0].length / 2),
    y: 0,
  };
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function isValid(board: BoardRow[], piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c;
      const ny = piece.y + r;
      if (nx < 0 || nx >= BOARD_COLS || ny >= BOARD_ROWS) return false;
      if (ny >= 0 && board[ny][nx] !== 0) return false;
    }
  }
  return true;
}

function lockPiece(board: BoardRow[], piece: Piece): BoardRow[] {
  const next = board.map(row => [...row]) as BoardRow[];
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0) next[ny][nx] = piece.color;
    }
  }
  return next;
}

function clearLines(board: BoardRow[]): { board: BoardRow[]; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_ROWS - newBoard.length;
  const emptyRows = Array.from({ length: linesCleared }, () => Array(BOARD_COLS).fill(0) as BoardRow);
  return { board: [...emptyRows, ...newBoard], linesCleared };
}

function getGhostY(board: BoardRow[], piece: Piece): number {
  let ghostY = piece.y;
  while (isValid(board, { ...piece, y: ghostY + 1 })) ghostY++;
  return ghostY;
}

const LINE_SCORES = [0, 100, 300, 500, 800];

export default function TetrisGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<BoardRow[]>(createBoard());
  const currentPieceRef = useRef<Piece>(randomPiece());
  const nextPieceRef = useRef<Piece>(randomPiece());
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const gameStatusRef = useRef<GameStatus>('idle');
  const animFrameRef = useRef<number>(0);
  const lastDropRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [displayLines, setDisplayLines] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  const getDropInterval = useCallback(() => {
    return Math.max(100, 1000 - (levelRef.current - 1) * 80);
  }, []);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid cells
    const board = boardRef.current;
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        if (board[r][c] !== 0) {
          const color = board[r][c] as string;
          ctx.fillStyle = color;
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          // Highlight
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, 4);
          ctx.fillRect(x + 1, y + 1, 4, CELL_SIZE - 2);
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(x + 1, y + CELL_SIZE - 5, CELL_SIZE - 2, 4);
          ctx.fillRect(x + CELL_SIZE - 5, y + 1, 4, CELL_SIZE - 2);
        } else {
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          ctx.strokeStyle = '#374151';
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    const piece = currentPieceRef.current;

    // Ghost piece
    const ghostY = getGhostY(board, piece);
    if (ghostY !== piece.y) {
      ctx.globalAlpha = 0.3;
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue;
          const x = (piece.x + c) * CELL_SIZE;
          const y = (ghostY + r) * CELL_SIZE;
          ctx.fillStyle = piece.color;
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    // Current piece
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const x = (piece.x + c) * CELL_SIZE;
        const y = (piece.y + r) * CELL_SIZE;
        ctx.fillStyle = piece.color;
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, 4);
        ctx.fillRect(x + 1, y + 1, 4, CELL_SIZE - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 1, y + CELL_SIZE - 5, CELL_SIZE - 2, 4);
        ctx.fillRect(x + CELL_SIZE - 5, y + 1, 4, CELL_SIZE - 2);
      }
    }
  }, []);

  const drawNext = useCallback(() => {
    const canvas = nextCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const next = nextPieceRef.current;
    const offsetX = Math.floor((4 - next.shape[0].length) / 2);
    const offsetY = Math.floor((4 - next.shape.length) / 2);
    for (let r = 0; r < next.shape.length; r++) {
      for (let c = 0; c < next.shape[r].length; c++) {
        if (!next.shape[r][c]) continue;
        ctx.fillStyle = next.color;
        ctx.fillRect((offsetX + c) * 24 + 1, (offsetY + r) * 24 + 1, 22, 22);
      }
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatusRef.current !== 'playing') return;

    if (timestamp - lastDropRef.current > getDropInterval()) {
      lastDropRef.current = timestamp;
      const piece = currentPieceRef.current;
      const moved = { ...piece, y: piece.y + 1 };
      if (isValid(boardRef.current, moved)) {
        currentPieceRef.current = moved;
      } else {
        // Lock
        boardRef.current = lockPiece(boardRef.current, piece);
        const { board: clearedBoard, linesCleared } = clearLines(boardRef.current);
        boardRef.current = clearedBoard;

        if (linesCleared > 0) {
          linesRef.current += linesCleared;
          const newLevel = Math.floor(linesRef.current / 10) + 1;
          const pts = (LINE_SCORES[linesCleared] ?? 0) * levelRef.current;
          scoreRef.current += pts;
          levelRef.current = newLevel;
          setDisplayScore(scoreRef.current);
          setDisplayLevel(levelRef.current);
          setDisplayLines(linesRef.current);
          onScoreChange(scoreRef.current);
        }

        // New piece
        const newPiece = nextPieceRef.current;
        nextPieceRef.current = randomPiece();
        if (!isValid(boardRef.current, newPiece)) {
          gameStatusRef.current = 'gameover';
          setGameStatus('gameover');
          onGameEnd(scoreRef.current, `레벨: ${levelRef.current}, 줄: ${linesRef.current}`);
          drawBoard();
          drawNext();
          return;
        }
        currentPieceRef.current = newPiece;
        drawNext();
      }
    }

    drawBoard();
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [getDropInterval, drawBoard, drawNext, onGameEnd, onScoreChange]);

  const startGame = useCallback(() => {
    boardRef.current = createBoard();
    currentPieceRef.current = randomPiece();
    nextPieceRef.current = randomPiece();
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    lastDropRef.current = 0;
    setDisplayScore(0);
    setDisplayLevel(1);
    setDisplayLines(0);
    gameStatusRef.current = 'playing';
    setGameStatus('playing');
    onScoreChange(0);
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop, onScoreChange]);

  useEffect(() => {
    drawBoard();
    drawNext();
  }, [drawBoard, drawNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStatusRef.current !== 'playing') return;
      const piece = currentPieceRef.current;
      const board = boardRef.current;

      if (e.key === 'ArrowLeft') {
        const moved = { ...piece, x: piece.x - 1 };
        if (isValid(board, moved)) currentPieceRef.current = moved;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        const moved = { ...piece, x: piece.x + 1 };
        if (isValid(board, moved)) currentPieceRef.current = moved;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        const moved = { ...piece, y: piece.y + 1 };
        if (isValid(board, moved)) {
          currentPieceRef.current = moved;
          scoreRef.current += 1;
          setDisplayScore(scoreRef.current);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const rotated = { ...piece, shape: rotate(piece.shape) };
        if (isValid(board, rotated)) currentPieceRef.current = rotated;
        e.preventDefault();
      } else if (e.key === ' ') {
        let ghostY = piece.y;
        while (isValid(board, { ...piece, y: ghostY + 1 })) ghostY++;
        const dist = ghostY - piece.y;
        currentPieceRef.current = { ...piece, y: ghostY };
        scoreRef.current += dist * 2;
        setDisplayScore(scoreRef.current);
        e.preventDefault();
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameStatusRef.current === 'playing') {
          gameStatusRef.current = 'paused';
          setGameStatus('paused');
          cancelAnimationFrame(animFrameRef.current);
        } else if (gameStatusRef.current === 'paused') {
          gameStatusRef.current = 'playing';
          setGameStatus('playing');
          animFrameRef.current = requestAnimationFrame(gameLoop);
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [gameLoop]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-6 items-start">
        {/* Board Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={BOARD_COLS * CELL_SIZE}
            height={BOARD_ROWS * CELL_SIZE}
            className="bg-gray-900 border border-gray-700 rounded-xl"
          />
          {gameStatus === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-bold text-lg"
              >
                게임 시작
              </button>
            </div>
          )}
          {gameStatus === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <p className="text-white text-2xl font-bold">일시정지</p>
            </div>
          )}
          {gameStatus === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <p className="text-red-400 text-2xl font-bold">게임 오버</p>
              <p className="text-white">점수: {displayScore}</p>
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
              >
                다시 시작
              </button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 min-w-[120px]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
            <p className="text-zinc-400 text-xs mb-1">NEXT</p>
            <canvas
              ref={nextCanvasRef}
              width={96}
              height={96}
              className="bg-gray-900 rounded"
            />
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-2">
            <div>
              <p className="text-zinc-400 text-xs">점수</p>
              <p className="text-white font-mono font-bold text-lg">{displayScore}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">레벨</p>
              <p className="text-white font-mono font-bold text-lg">{displayLevel}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">줄</p>
              <p className="text-white font-mono font-bold text-lg">{displayLines}</p>
            </div>
          </div>
          {gameStatus === 'playing' && (
            <button
              onClick={() => {
                gameStatusRef.current = 'paused';
                setGameStatus('paused');
                cancelAnimationFrame(animFrameRef.current);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1 text-sm"
            >
              일시정지 (P)
            </button>
          )}
          {gameStatus === 'paused' && (
            <button
              onClick={() => {
                gameStatusRef.current = 'playing';
                setGameStatus('playing');
                animFrameRef.current = requestAnimationFrame(gameLoop);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1 text-sm"
            >
              계속하기 (P)
            </button>
          )}
        </div>
      </div>
      <p className="text-zinc-500 text-sm">방향키: 이동/회전 | Space: 하드드롭 | P: 일시정지</p>
    </div>
  );
}
