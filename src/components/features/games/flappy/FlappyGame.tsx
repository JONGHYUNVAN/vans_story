'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';

const CANVAS_W = 320;
const CANVAS_H = 480;
const GRAVITY = 0.4;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
const PIPE_SPEED = -3;
const GROUND_H = 30;
const BIRD_R = 15;
const BIRD_X = 80;
const PIPE_INTERVAL = 1800;

type GameStatus = 'idle' | 'playing' | 'gameover';

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

export default function FlappyGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdYRef = useRef(CANVAS_H / 2);
  const velocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const gameStatusRef = useRef<GameStatus>('idle');
  const animRef = useRef<number>(0);
  const lastPipeRef = useRef<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [displayScore, setDisplayScore] = useState(0);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D, y: number) => {
    // Body
    ctx.beginPath();
    ctx.arc(BIRD_X, y, BIRD_R, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    // Eye
    ctx.beginPath();
    ctx.arc(BIRD_X + 6, y - 5, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(BIRD_X + 7, y - 5, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    // Beak
    ctx.beginPath();
    ctx.moveTo(BIRD_X + BIRD_R, y);
    ctx.lineTo(BIRD_X + BIRD_R + 10, y - 3);
    ctx.lineTo(BIRD_X + BIRD_R + 10, y + 3);
    ctx.closePath();
    ctx.fillStyle = '#f97316';
    ctx.fill();
  }, []);

  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    ctx.fillStyle = '#16a34a';
    // Top pipe
    const topH = pipe.gapY - PIPE_GAP / 2;
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, topH);
    // Top cap
    ctx.fillStyle = '#15803d';
    ctx.fillRect(pipe.x - 4, topH - 20, PIPE_WIDTH + 8, 20);
    // Bottom pipe
    const botY = pipe.gapY + PIPE_GAP / 2;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(pipe.x, botY, PIPE_WIDTH, CANVAS_H - botY - GROUND_H);
    // Bottom cap
    ctx.fillStyle = '#15803d';
    ctx.fillRect(pipe.x - 4, botY, PIPE_WIDTH + 8, 20);
  }, []);

  const checkCollision = useCallback((birdY: number, pipes: Pipe[]): boolean => {
    // Ground / ceiling
    if (birdY - BIRD_R <= 0 || birdY + BIRD_R >= CANVAS_H - GROUND_H) return true;
    for (const pipe of pipes) {
      if (
        BIRD_X + BIRD_R > pipe.x + 4 &&
        BIRD_X - BIRD_R < pipe.x + PIPE_WIDTH - 4
      ) {
        const topH = pipe.gapY - PIPE_GAP / 2;
        const botY = pipe.gapY + PIPE_GAP / 2;
        if (birdY - BIRD_R < topH || birdY + BIRD_R > botY) return true;
      }
    }
    return false;
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Spawn pipes
    if (gameStatusRef.current === 'playing') {
      if (timestamp - lastPipeRef.current > PIPE_INTERVAL) {
        lastPipeRef.current = timestamp;
        const gapY = 80 + Math.random() * 200;
        pipesRef.current.push({ x: CANVAS_W + 10, gapY, passed: false });
      }

      // Update physics
      velocityRef.current += GRAVITY;
      birdYRef.current += velocityRef.current;

      // Update pipes
      pipesRef.current = pipesRef.current
        .map(p => ({ ...p, x: p.x + PIPE_SPEED }))
        .filter(p => p.x + PIPE_WIDTH > -10);

      // Score
      for (const pipe of pipesRef.current) {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X - BIRD_R) {
          pipe.passed = true;
          scoreRef.current++;
          setDisplayScore(scoreRef.current);
          onScoreChange(scoreRef.current * 10);
        }
      }

      // Collision
      if (checkCollision(birdYRef.current, pipesRef.current)) {
        gameStatusRef.current = 'gameover';
        setGameStatus('gameover');
        onGameEnd(scoreRef.current * 10);
        // Final draw
        for (const pipe of pipesRef.current) drawPipe(ctx, pipe);
        drawBird(ctx, birdYRef.current);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, GROUND_H);
        return;
      }
    }

    // Draw pipes
    for (const pipe of pipesRef.current) drawPipe(ctx, pipe);

    // Ground
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, GROUND_H);
    ctx.fillStyle = '#a16207';
    ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, 4);

    // Bird
    drawBird(ctx, birdYRef.current);

    // Score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(scoreRef.current), CANVAS_W / 2, 50);
    ctx.textAlign = 'start';

    // Idle overlay
    if (gameStatusRef.current === 'idle') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('탭 또는 Space로 시작', CANVAS_W / 2, CANVAS_H / 2);
      ctx.textAlign = 'start';
    }

    if (gameStatusRef.current === 'playing') {
      animRef.current = requestAnimationFrame(draw);
    }
  }, [drawBird, drawPipe, checkCollision, onGameEnd, onScoreChange]);

  const jump = useCallback(() => {
    if (gameStatusRef.current === 'idle') {
      gameStatusRef.current = 'playing';
      setGameStatus('playing');
      birdYRef.current = CANVAS_H / 2;
      velocityRef.current = JUMP_FORCE;
      pipesRef.current = [];
      scoreRef.current = 0;
      setDisplayScore(0);
      lastPipeRef.current = performance.now();
      animRef.current = requestAnimationFrame(draw);
    } else if (gameStatusRef.current === 'playing') {
      velocityRef.current = JUMP_FORCE;
    }
  }, [draw]);

  const restart = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    gameStatusRef.current = 'idle';
    setGameStatus('idle');
    birdYRef.current = CANVAS_H / 2;
    velocityRef.current = 0;
    pipesRef.current = [];
    scoreRef.current = 0;
    setDisplayScore(0);
    // redraw idle state
    const canvas = canvasRef.current;
    if (canvas) {
      requestAnimationFrame(draw);
    }
  }, [draw]);

  useEffect(() => {
    // Initial draw
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [jump]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border border-gray-700 cursor-pointer"
          onClick={jump}
        />
        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl gap-3">
            <p className="text-red-400 text-2xl font-bold">게임 오버</p>
            <p className="text-white text-lg">점수: {displayScore * 10}</p>
            <button
              onClick={restart}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
            >
              다시 시작
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-500 text-sm">Space / 탭 / 클릭: 날기</p>
    </div>
  );
}
