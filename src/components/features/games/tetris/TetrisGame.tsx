'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useGameSize } from '@/hooks/useGameSize';
import { useGameLoop } from '@/hooks/useGameLoop';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController, { Direction, ActionBtn } from '@/components/features/games/GameOverlayController';

const BOARD_COLS = 10;
const BOARD_ROWS = 20;

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

function spawnAt(piece: Piece): Piece {
  return {
    ...piece,
    shape: piece.shape.map(r => [...r]),
    x: Math.floor(BOARD_COLS / 2) - Math.floor(piece.shape[0].length / 2),
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
const LOCK_DELAY = 500;

export default function TetrisGame({ onGameEnd, onScoreChange, onAction, onMove, onCombo }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const holdCanvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<BoardRow[]>(createBoard());
  const currentPieceRef = useRef<Piece>(randomPiece());
  const nextPieceRef = useRef<Piece>(randomPiece());
  const holdPieceRef = useRef<Piece | null>(null);
  const canHoldRef = useRef(true);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const gameStatusRef = useRef<GameStatus>('idle');
  const lastDropRef = useRef<number>(0);
  const lockStartRef = useRef<number | null>(null);
  const lockBarRef = useRef<HTMLDivElement>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [displayLines, setDisplayLines] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const { shakeStyle, triggerShake } = useScreenShake();
  const [flashActive, setFlashActive] = useState(false);
  const [flashColor, setFlashColor] = useState('rgba(99,102,241,0.3)');
  const [confettiActive, setConfettiActive] = useState(false);
  const triggerShakeRef = useRef(triggerShake);
  triggerShakeRef.current = triggerShake;
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;
  const onComboRef = useRef(onCombo);
  onComboRef.current = onCombo;

  const combo = useCombo();

  const size = useGameSize({
    aspectRatio: BOARD_COLS / BOARD_ROWS,
    maxWidth: 360,
    maxHeight: 720,
    gridCols: BOARD_COLS,
  });
  const cellSize = size.ready ? size.cellSize : Math.floor(320 / BOARD_COLS);

  const getDropInterval = useCallback(() => {
    return Math.max(100, 1000 - (levelRef.current - 1) * 80);
  }, []);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cs = cellSize;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const board = boardRef.current;
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const x = c * cs;
        const y = r * cs;
        if (board[r][c] !== 0) {
          const color = board[r][c] as string;
          ctx.fillStyle = color;
          ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(x + 1, y + 1, cs - 2, 4);
          ctx.fillRect(x + 1, y + 1, 4, cs - 2);
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(x + 1, y + cs - 5, cs - 2, 4);
          ctx.fillRect(x + cs - 5, y + 1, 4, cs - 2);
        } else {
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
          ctx.strokeStyle = '#374151';
          ctx.strokeRect(x, y, cs, cs);
        }
      }
    }

    const piece = currentPieceRef.current;

    const ghostY = getGhostY(board, piece);
    if (ghostY !== piece.y) {
      ctx.globalAlpha = 0.3;
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue;
          const x = (piece.x + c) * cs;
          const y = (ghostY + r) * cs;
          ctx.fillStyle = piece.color;
          ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const x = (piece.x + c) * cs;
        const y = (piece.y + r) * cs;
        ctx.fillStyle = piece.color;
        ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(x + 1, y + 1, cs - 2, 4);
        ctx.fillRect(x + 1, y + 1, 4, cs - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 1, y + cs - 5, cs - 2, 4);
        ctx.fillRect(x + cs - 5, y + 1, 4, cs - 2);
      }
    }
  }, [cellSize]);

  const drawPreview = useCallback((canvas: HTMLCanvasElement | null, piece: Piece | null, dimmed = false) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!piece) return;
    const offsetX = Math.floor((4 - piece.shape[0].length) / 2);
    const offsetY = Math.floor((4 - piece.shape.length) / 2);
    ctx.globalAlpha = dimmed ? 0.35 : 1;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        ctx.fillStyle = piece.color;
        ctx.fillRect((offsetX + c) * 24 + 1, (offsetY + r) * 24 + 1, 22, 22);
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawNext = useCallback(() => {
    drawPreview(nextCanvasRef.current, nextPieceRef.current);
  }, [drawPreview]);

  const drawHold = useCallback(() => {
    drawPreview(holdCanvasRef.current, holdPieceRef.current, !canHoldRef.current);
  }, [drawPreview]);

  const updateLockBar = useCallback((progress: number) => {
    const bar = lockBarRef.current;
    if (!bar) return;
    if (progress <= 0) {
      bar.style.opacity = '0';
      bar.style.transform = 'scaleX(0)';
    } else {
      bar.style.opacity = '1';
      bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    }
  }, []);

  const lockAndSpawn = useCallback(() => {
    const piece = currentPieceRef.current;
    boardRef.current = lockPiece(boardRef.current, piece);
    const { board: clearedBoard, linesCleared } = clearLines(boardRef.current);
    boardRef.current = clearedBoard;
    canHoldRef.current = true;
    lockStartRef.current = null;
    updateLockBar(0);

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
      onActionRef.current?.();

      const prevLevel = combo.comboLevel;
      const newComboLevel = combo.increment();
      if (newComboLevel > 0 && newComboLevel > prevLevel) {
        onComboRef.current?.(newComboLevel);
      }

      if (linesCleared >= 4) {
        triggerShakeRef.current(10, 500);
        setConfettiActive(true);
      } else if (linesCleared >= 2) {
        triggerShakeRef.current(6, 300);
      }
      setFlashColor('rgba(99,102,241,0.3)');
      setFlashActive(true);
    } else {
      combo.reset();
    }

    const newPiece = nextPieceRef.current;
    nextPieceRef.current = randomPiece();
    if (!isValid(boardRef.current, newPiece)) {
      gameStatusRef.current = 'gameover';
      setGameStatus('gameover');
      onGameEnd(scoreRef.current, `레벨: ${levelRef.current}, 줄: ${linesRef.current}`);
      triggerShakeRef.current(10, 600);
      setFlashColor('rgba(239,68,68,0.35)');
      setFlashActive(true);
      drawBoard();
      drawNext();
      drawHold();
      return;
    }
    currentPieceRef.current = newPiece;
    lastDropRef.current = 0;
    drawNext();
    drawHold();
  }, [drawBoard, drawNext, drawHold, onGameEnd, onScoreChange, combo, updateLockBar]);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatusRef.current !== 'playing') return;

    const piece = currentPieceRef.current;
    const canFall = isValid(boardRef.current, { ...piece, y: piece.y + 1 });

    if (!canFall) {
      // Lock delay phase
      if (lockStartRef.current === null) lockStartRef.current = timestamp;
      const elapsed = timestamp - lockStartRef.current;
      updateLockBar(elapsed / LOCK_DELAY);
      if (elapsed >= LOCK_DELAY) {
        lockAndSpawn();
      }
    } else {
      // Falling phase — cancel any lock progress
      if (lockStartRef.current !== null) {
        lockStartRef.current = null;
        updateLockBar(0);
      }
      if (timestamp - lastDropRef.current > getDropInterval()) {
        lastDropRef.current = timestamp;
        currentPieceRef.current = { ...piece, y: piece.y + 1 };
      }
    }

    drawBoard();
  }, [getDropInterval, drawBoard, lockAndSpawn, updateLockBar]);

  useGameLoop(gameLoop, gameStatus === 'playing');

  // 락 딜레이 중 움직이면 타이머 리셋 (classic 테트리스 lock-delay reset)
  const resetLockIfGrounded = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!isValid(boardRef.current, { ...piece, y: piece.y + 1 })) {
      lockStartRef.current = null;
      updateLockBar(0);
    }
  }, [updateLockBar]);

  const movePieceLeft = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const piece = currentPieceRef.current;
    const moved = { ...piece, x: piece.x - 1 };
    if (isValid(boardRef.current, moved)) {
      currentPieceRef.current = moved;
      resetLockIfGrounded();
      onMove?.();
    }
  }, [onMove, resetLockIfGrounded]);

  const movePieceRight = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const piece = currentPieceRef.current;
    const moved = { ...piece, x: piece.x + 1 };
    if (isValid(boardRef.current, moved)) {
      currentPieceRef.current = moved;
      resetLockIfGrounded();
      onMove?.();
    }
  }, [onMove, resetLockIfGrounded]);

  const softDrop = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const piece = currentPieceRef.current;
    const moved = { ...piece, y: piece.y + 1 };
    if (isValid(boardRef.current, moved)) {
      currentPieceRef.current = moved;
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
      onMove?.();
    }
  }, [onMove]);

  const rotatePiece = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const piece = currentPieceRef.current;
    const rotated = { ...piece, shape: rotate(piece.shape) };
    if (isValid(boardRef.current, rotated)) {
      currentPieceRef.current = rotated;
      resetLockIfGrounded();
      onMove?.();
    }
  }, [onMove, resetLockIfGrounded]);

  const hardDrop = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const piece = currentPieceRef.current;
    let ghostY = piece.y;
    while (isValid(boardRef.current, { ...piece, y: ghostY + 1 })) ghostY++;
    const dist = ghostY - piece.y;
    currentPieceRef.current = { ...piece, y: ghostY };
    scoreRef.current += dist * 2;
    setDisplayScore(scoreRef.current);
    onMove?.();
    lockAndSpawn();
  }, [onMove, lockAndSpawn]);

  const holdPiece = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    if (!canHoldRef.current) return;
    const current = currentPieceRef.current;
    const storedShape: Piece = {
      ...current,
      shape: current.shape.map(r => [...r]),
    };
    if (holdPieceRef.current === null) {
      holdPieceRef.current = storedShape;
      currentPieceRef.current = nextPieceRef.current;
      nextPieceRef.current = randomPiece();
    } else {
      const prevHeld = holdPieceRef.current;
      holdPieceRef.current = storedShape;
      currentPieceRef.current = spawnAt(prevHeld);
    }
    canHoldRef.current = false;
    lockStartRef.current = null;
    lastDropRef.current = 0;
    updateLockBar(0);
    onMove?.();
    drawHold();
    drawNext();
    drawBoard();
  }, [onMove, drawHold, drawNext, drawBoard, updateLockBar]);

  // D-패드 핸들러: UP=회전, DOWN=소프트드롭, LEFT/RIGHT=이동
  const handleOverlayDirection = useCallback(
    (dir: Direction) => {
      if (dir === 'UP') rotatePiece();
      else if (dir === 'DOWN') softDrop();
      else if (dir === 'LEFT') movePieceLeft();
      else if (dir === 'RIGHT') movePieceRight();
    },
    [rotatePiece, softDrop, movePieceLeft, movePieceRight]
  );

  // 액션 버튼 핸들러: A=회전, B=하드드롭, Y=홀드
  const handleActionBtn = useCallback((btn: ActionBtn) => {
    if (btn === 'A') rotatePiece();
    else if (btn === 'B') hardDrop();
    else if (btn === 'Y') holdPiece();
  }, [rotatePiece, hardDrop, holdPiece]);

  const startGame = useCallback(() => {
    boardRef.current = createBoard();
    currentPieceRef.current = randomPiece();
    nextPieceRef.current = randomPiece();
    holdPieceRef.current = null;
    canHoldRef.current = true;
    lockStartRef.current = null;
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    lastDropRef.current = 0;
    combo.reset();
    setDisplayScore(0);
    setDisplayLevel(1);
    setDisplayLines(0);
    gameStatusRef.current = 'playing';
    setGameStatus('playing');
    onScoreChange(0);
    updateLockBar(0);
    drawHold();
  }, [onScoreChange, combo, updateLockBar, drawHold]);

  useEffect(() => {
    drawBoard();
    drawNext();
    drawHold();
  }, [drawBoard, drawNext, drawHold]);

  // cellSize 변경 시 재그리기
  useEffect(() => {
    drawBoard();
  }, [drawBoard, cellSize]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStatusRef.current !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        movePieceLeft();
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        movePieceRight();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        softDrop();
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        rotatePiece();
        e.preventDefault();
      } else if (e.key === ' ') {
        hardDrop();
        e.preventDefault();
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') {
        holdPiece();
        e.preventDefault();
      } else if (e.key === 'p' || e.key === 'P') {
        if (gameStatusRef.current === 'playing') {
          gameStatusRef.current = 'paused';
          setGameStatus('paused');
        } else if (gameStatusRef.current === 'paused') {
          gameStatusRef.current = 'playing';
          setGameStatus('playing');
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [movePieceLeft, movePieceRight, softDrop, rotatePiece, hardDrop, holdPiece]);

  const canvasWidth = cellSize * BOARD_COLS;
  const canvasHeight = cellSize * BOARD_ROWS;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ConfettiEffect active={confettiActive} duration={2000} />
      <div className="flex gap-6 items-start">
        {/* Board Canvas */}
        <div className="relative" style={shakeStyle}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              width: size.ready ? size.width : canvasWidth,
              height: size.ready ? size.height : canvasHeight,
              display: 'block',
            }}
            className="bg-gray-900 border border-gray-700 rounded-xl"
          />
          {/* Lock delay progress bar */}
          <div className="absolute left-0 right-0 bottom-0 h-1.5 pointer-events-none overflow-hidden rounded-b-xl">
            <div
              ref={lockBarRef}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 origin-left transition-opacity duration-100"
              style={{ opacity: 0, transform: 'scaleX(0)' }}
            />
          </div>
          <FlashOverlay
            active={flashActive}
            color={flashColor}
            duration={250}
            onDone={() => setFlashActive(false)}
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
            <p className="text-zinc-400 text-xs mb-1">HOLD</p>
            <canvas
              ref={holdCanvasRef}
              width={96}
              height={96}
              className="bg-gray-900 rounded"
            />
          </div>
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
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1 text-sm"
            >
              계속하기 (P)
            </button>
          )}
        </div>
      </div>

      <GameOverlayController
        type="dpad"
        onDirection={handleOverlayDirection}
        onActionBtn={handleActionBtn}
        hiddenActions={['X']}
        disabled={gameStatus !== 'playing'}
      />

      <p className="text-zinc-500 text-sm">방향키: 이동/회전 | Space: 하드드롭 | C/Shift: 홀드 | P: 일시정지</p>
      <p className="text-zinc-600 text-xs">모바일 D-패드: ▲회전 ▼소프트드롭 ◀▶이동 | A=회전 B=하드드롭 Y=홀드</p>
    </div>
  );
}
