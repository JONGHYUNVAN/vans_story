'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import { useGameSize } from '@/hooks/useGameSize';
import ParticleEffect from '@/components/features/games/effects/ParticleEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController, { Direction as OverlayDirection } from '@/components/features/games/GameOverlayController';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 10;
const MIN_SPEED = 60;
const SCORE_PER_FOOD = 10;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

interface Point {
  x: number;
  y: number;
}

interface SnakeState {
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  gameStatus: GameStatus;
  speed: number;
}

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initialState(): SnakeState {
  const snake: Point[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    food: randomFood(snake),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    gameStatus: 'idle',
    speed: INITIAL_SPEED,
  };
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const DELTA: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

interface ParticleItem {
  id: number;
  x: number;
  y: number;
}

export default function SnakeGame({ onGameEnd, onScoreChange, onMove, onCombo }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SnakeState>(initialState());
  const stateRef = useRef<SnakeState>(state);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { shakeStyle, triggerShake } = useScreenShake();
  const { playMoveTick, playCombo, playScore } = useSound();
  const combo = useCombo();
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const particleIdRef = useRef(0);
  const prevScoreRef = useRef(0);
  const prevFoodRef = useRef<Point | null>(null);
  const foodComboRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = useGameSize({ aspectRatio: 1, maxWidth: 520, maxHeight: 520, gridCols: GRID_SIZE });
  // CELL_SIZE는 size.cellSize를 사용 (ready 전에는 기본값 사용)
  const cellSize = size.ready ? size.cellSize : Math.floor(420 / GRID_SIZE);
  const canvasSize = cellSize * GRID_SIZE;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 이펙트 감지
  useEffect(() => {
    if (state.gameStatus === 'gameover') {
      triggerShake(10, 500);
      setFlashActive(true);
    }
    if (state.score > prevScoreRef.current && state.gameStatus === 'playing') {
      const prevFood = prevFoodRef.current;
      if (prevFood) {
        const px = prevFood.x * cellSize + cellSize / 2;
        const py = prevFood.y * cellSize + cellSize / 2;
        const id = ++particleIdRef.current;
        setParticles(prev => [...prev, { id, x: px, y: py }]);
      }
    }
    prevScoreRef.current = state.score;
    prevFoodRef.current = state.food;
  }, [state.score, state.gameStatus, state.food, triggerShake, cellSize]);

  const drawCanvas = useCallback((s: SnakeState, cs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalSize = cs * GRID_SIZE;

    // 배경
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, totalSize, totalSize);

    // 그리드 선
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cs, 0);
      ctx.lineTo(i * cs, totalSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cs);
      ctx.lineTo(totalSize, i * cs);
      ctx.stroke();
    }

    // 먹이 (원형)
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    const fx = s.food.x * cs + cs / 2;
    const fy = s.food.y * cs + cs / 2;
    ctx.arc(fx, fy, cs / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 뱀 body
    s.snake.forEach((seg, index) => {
      const x = seg.x * cs;
      const y = seg.y * cs;
      if (index === 0) {
        ctx.fillStyle = '#34d399';
        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + cs - radius, y);
        ctx.quadraticCurveTo(x + cs, y, x + cs, y + radius);
        ctx.lineTo(x + cs, y + cs - radius);
        ctx.quadraticCurveTo(x + cs, y + cs, x + cs - radius, y + cs);
        ctx.lineTo(x + radius, y + cs);
        ctx.quadraticCurveTo(x, y + cs, x, y + cs - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      }
    });

    // 게임오버 오버레이
    if (s.gameStatus === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, totalSize, totalSize);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', totalSize / 2, totalSize / 2 - 16);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '18px monospace';
      ctx.fillText(`점수: ${s.score}`, totalSize / 2, totalSize / 2 + 20);
    }

    // idle 오버레이
    if (s.gameStatus === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, totalSize, totalSize);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('시작 버튼을 누르세요', totalSize / 2, totalSize / 2);
    }

    // paused 오버레이
    if (s.gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, totalSize, totalSize);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('일시정지', totalSize / 2, totalSize / 2);
    }
  }, []);

  // 캔버스 그리기 — state 또는 cellSize 변경 시
  useEffect(() => {
    drawCanvas(state, cellSize);
  }, [state, drawCanvas, cellSize]);

  const stopLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startLoop = useCallback(
    (speed: number) => {
      stopLoop();
      intervalRef.current = setInterval(() => {
        let gameEndScore: number | null = null;
        let ateFoodScore: number | null = null;
        let moved = false;
        setState(prev => {
          if (prev.gameStatus !== 'playing') return prev;
          moved = true;

          const dir = prev.nextDirection;
          const delta = DELTA[dir];
          const head: Point = {
            x: prev.snake[0].x + delta.x,
            y: prev.snake[0].y + delta.y,
          };

          // 벽 충돌
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            gameEndScore = prev.score;
            return { ...prev, gameStatus: 'gameover', direction: dir };
          }

          // 자기 몸 충돌
          if (prev.snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
            gameEndScore = prev.score;
            return { ...prev, gameStatus: 'gameover', direction: dir };
          }

          const ateFood = head.x === prev.food.x && head.y === prev.food.y;
          const newSnake = ateFood
            ? [head, ...prev.snake]
            : [head, ...prev.snake.slice(0, -1)];

          const newScore = ateFood ? prev.score + SCORE_PER_FOOD : prev.score;
          if (ateFood) ateFoodScore = newScore;

          const newFood = ateFood ? randomFood(newSnake) : prev.food;
          const newSpeed = Math.max(
            MIN_SPEED,
            INITIAL_SPEED - Math.floor(newScore / SCORE_PER_FOOD) * SPEED_INCREMENT
          );

          return {
            ...prev,
            snake: newSnake,
            food: newFood,
            direction: dir,
            score: newScore,
            speed: newSpeed,
          };
        });

        // Side effects (outside updater — runs once per tick, safe for parent setState)
        if (gameEndScore !== null) {
          foodComboRef.current = 0;
          combo.reset();
          onGameEnd(gameEndScore);
        } else if (ateFoodScore !== null) {
          playMoveTick();
          onScoreChange(ateFoodScore);
          foodComboRef.current += 1;
          onCombo?.(Math.min(foodComboRef.current, 5));

          const prevLevel = combo.comboLevel;
          const newLevel = combo.increment();
          if (newLevel === 0) {
            playScore();
          } else if (newLevel > prevLevel) {
            playCombo(newLevel);
          } else {
            playScore();
          }
        } else if (moved) {
          playMoveTick();
        }
      }, speed);
    },
    [stopLoop, onGameEnd, onScoreChange, onCombo, playMoveTick, playCombo, playScore, combo]
  );

  // 속도 변경 시 루프 재시작
  useEffect(() => {
    if (state.gameStatus === 'playing') {
      startLoop(state.speed);
    }
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.speed, state.gameStatus]);

  const handleStart = useCallback(() => {
    setState(s => {
      if (s.gameStatus === 'idle' || s.gameStatus === 'gameover') {
        foodComboRef.current = 0;
        combo.reset();
        const fresh = initialState();
        return { ...fresh, gameStatus: 'playing' };
      }
      if (s.gameStatus === 'playing') {
        return { ...s, gameStatus: 'paused' };
      }
      if (s.gameStatus === 'paused') {
        return { ...s, gameStatus: 'playing' };
      }
      return s;
    });
  }, [combo]);

  const changeDirection = useCallback(
    (newDir: Direction) => {
      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        if (OPPOSITE[newDir] === prev.direction) return prev;
        onMove?.();
        return { ...prev, nextDirection: newDir };
      });
    },
    [onMove]
  );

  const handleOverlayDirection = useCallback(
    (dir: OverlayDirection) => {
      changeDirection(dir as Direction);
    },
    [changeDirection]
  );

  // 키보드 핸들러
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const dirMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (e.key === ' ') {
        e.preventDefault();
        handleStart();
        return;
      }

      const newDir = dirMap[e.key];
      if (!newDir) return;
      e.preventDefault();

      changeDirection(newDir);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleStart, changeDirection]);

  // 터치 스와이프 (컨테이너 전체)
  useEffect(() => {
    const el = containerRef.current;
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

      let newDir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        newDir = dy > 0 ? 'DOWN' : 'UP';
      }

      changeDirection(newDir);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [changeDirection]);

  const buttonLabel = () => {
    switch (state.gameStatus) {
      case 'idle': return '시작';
      case 'playing': return '일시정지';
      case 'paused': return '계속하기';
      case 'gameover': return '다시 시작';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6" style={{ width: size.ready ? size.width : undefined, maxWidth: 520 }}>
        <div className="text-center">
          <p className="text-xs text-zinc-500">점수</p>
          <p className="text-2xl font-black text-white">{state.score}</p>
        </div>
        <div className="flex-1" />
        <div className="text-center">
          <p className="text-xs text-zinc-500">상태</p>
          <p className="text-sm font-semibold text-zinc-400">
            {state.gameStatus === 'idle' && '대기 중'}
            {state.gameStatus === 'playing' && '플레이 중'}
            {state.gameStatus === 'paused' && '일시정지'}
            {state.gameStatus === 'gameover' && '게임 오버'}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full" style={{ maxWidth: 520 }}>
        <div className="relative" style={shakeStyle}>
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            style={{
              width: size.ready ? size.width : undefined,
              height: size.ready ? size.height : undefined,
              imageRendering: 'pixelated',
              display: 'block',
            }}
            className="mx-auto rounded-lg border border-gray-700"
          />
          <FlashOverlay
            active={flashActive}
            color="rgba(239,68,68,0.35)"
            duration={400}
            onDone={() => setFlashActive(false)}
          />
          {particles.map(p => (
            <ParticleEffect
              key={p.id}
              x={p.x}
              y={p.y}
              color="#34d399"
              count={8}
              onDone={() => setParticles(prev => prev.filter(pt => pt.id !== p.id))}
            />
          ))}
        </div>
      </div>

      <GameOverlayController
        type="dpad"
        onDirection={handleOverlayDirection}
        hiddenActions={['A', 'B', 'X', 'Y']}
        disabled={state.gameStatus !== 'playing'}
      />

      <button
        onClick={handleStart}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
      >
        {buttonLabel()}
      </button>

      <p className="text-xs text-zinc-600">방향키로 이동 · Space로 일시정지 · 모바일: 스와이프 또는 D-패드</p>
    </div>
  );
}
