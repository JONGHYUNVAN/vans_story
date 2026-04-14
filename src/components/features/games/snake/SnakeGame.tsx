'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useScreenShake } from '@/hooks/useScreenShake';
import ParticleEffect from '@/components/features/games/effects/ParticleEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 400
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

export default function SnakeGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SnakeState>(initialState());
  const stateRef = useRef<SnakeState>(state);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { shakeStyle, triggerShake } = useScreenShake();
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const particleIdRef = useRef(0);
  const prevScoreRef = useRef(0);
  const prevFoodRef = useRef<Point | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 이펙트 감지
  useEffect(() => {
    // 게임오버 → 흔들림 + 플래시
    if (state.gameStatus === 'gameover') {
      triggerShake(10, 500);
      setFlashActive(true);
    }
    // 먹이 획득 → 파티클 (점수 증가로 감지)
    if (state.score > prevScoreRef.current && state.gameStatus === 'playing') {
      const prevFood = prevFoodRef.current;
      if (prevFood) {
        const px = prevFood.x * CELL_SIZE + CELL_SIZE / 2;
        const py = prevFood.y * CELL_SIZE + CELL_SIZE / 2;
        const id = ++particleIdRef.current;
        setParticles(prev => [...prev, { id, x: px, y: py }]);
      }
    }
    prevScoreRef.current = state.score;
    prevFoodRef.current = state.food;
  }, [state.score, state.gameStatus, state.food, triggerShake]);

  const drawCanvas = useCallback((s: SnakeState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 배경
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 그리드 선
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // 먹이 (원형)
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    const fx = s.food.x * CELL_SIZE + CELL_SIZE / 2;
    const fy = s.food.y * CELL_SIZE + CELL_SIZE / 2;
    ctx.arc(fx, fy, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 뱀 body
    s.snake.forEach((seg, index) => {
      const x = seg.x * CELL_SIZE;
      const y = seg.y * CELL_SIZE;
      if (index === 0) {
        // head - 둥근 사각형
        ctx.fillStyle = '#34d399';
        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + CELL_SIZE - radius, y);
        ctx.quadraticCurveTo(x + CELL_SIZE, y, x + CELL_SIZE, y + radius);
        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE - radius);
        ctx.quadraticCurveTo(x + CELL_SIZE, y + CELL_SIZE, x + CELL_SIZE - radius, y + CELL_SIZE);
        ctx.lineTo(x + radius, y + CELL_SIZE);
        ctx.quadraticCurveTo(x, y + CELL_SIZE, x, y + CELL_SIZE - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      } else {
        // body
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    });

    // 게임오버 오버레이
    if (s.gameStatus === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 16);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '18px monospace';
      ctx.fillText(`점수: ${s.score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    }

    // idle 오버레이
    if (s.gameStatus === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('시작 버튼을 누르세요', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

    // paused 오버레이
    if (s.gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('일시정지', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
  }, []);

  // 캔버스 그리기 — state 변경 시
  useEffect(() => {
    drawCanvas(state);
  }, [state, drawCanvas]);

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
        setState(prev => {
          if (prev.gameStatus !== 'playing') return prev;

          const dir = prev.nextDirection;
          const delta = DELTA[dir];
          const head: Point = {
            x: prev.snake[0].x + delta.x,
            y: prev.snake[0].y + delta.y,
          };

          // 벽 충돌
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            onGameEnd(prev.score);
            return { ...prev, gameStatus: 'gameover', direction: dir };
          }

          // 자기 몸 충돌
          if (prev.snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
            onGameEnd(prev.score);
            return { ...prev, gameStatus: 'gameover', direction: dir };
          }

          const ateFood = head.x === prev.food.x && head.y === prev.food.y;
          const newSnake = ateFood
            ? [head, ...prev.snake]
            : [head, ...prev.snake.slice(0, -1)];

          const newScore = ateFood ? prev.score + SCORE_PER_FOOD : prev.score;
          if (ateFood) onScoreChange(newScore);

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
      }, speed);
    },
    [stopLoop, onGameEnd, onScoreChange]
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
  }, []);

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

      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        if (OPPOSITE[newDir] === prev.direction) return prev;
        return { ...prev, nextDirection: newDir };
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleStart]);

  // 터치 스와이프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

      let newDir: Direction;
      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        newDir = dy > 0 ? 'DOWN' : 'UP';
      }

      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        if (OPPOSITE[newDir] === prev.direction) return prev;
        return { ...prev, nextDirection: newDir };
      });
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

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
      <div className="flex items-center gap-6 w-full max-w-[400px]">
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

      <div className="relative max-w-[400px] w-full" style={shakeStyle}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full aspect-square mx-auto rounded-lg border border-gray-700"
          style={{ imageRendering: 'pixelated' }}
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

      <button
        onClick={handleStart}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
      >
        {buttonLabel()}
      </button>

      <p className="text-xs text-zinc-600">방향키로 이동 · Space로 일시정지</p>
    </div>
  );
}
