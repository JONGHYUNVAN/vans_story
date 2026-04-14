'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useScreenShake } from '@/hooks/useScreenShake';
import ParticleEffect from '@/components/features/games/effects/ParticleEffect';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

const CANVAS_W = 480;
const CANVAS_H = 360;
const PADDLE_W = 80;
const PADDLE_H = 12;
const PADDLE_Y = 330;
const BALL_R = 8;
const BRICK_COLS = 8;
const BRICK_ROWS = 4;
const BRICK_W = 55;
const BRICK_H = 20;
const BRICK_GAP = 5;
const BRICK_OFFSET_X = (CANVAS_W - (BRICK_COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP)) / 2;
const BRICK_OFFSET_Y = 40;

const BRICK_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80'];
const BRICK_SCORES = [40, 30, 20, 10];

type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'won';

interface Brick {
  alive: boolean;
  row: number;
  col: number;
}

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({ alive: true, row: r, col: c });
    }
  }
  return bricks;
}

export default function BreakoutGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleXRef = useRef((CANVAS_W - PADDLE_W) / 2);
  const ballRef = useRef({ x: CANVAS_W / 2, y: PADDLE_Y - BALL_R - 2, vx: 3, vy: -4 });
  const bricksRef = useRef<Brick[]>(createBricks());
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(3);
  const gameStatusRef = useRef<GameStatus>('idle');
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [displayLives, setDisplayLives] = useState(3);
  const { shakeStyle, triggerShake } = useScreenShake();
  const [flashActive, setFlashActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const particleIdRef = useRef(0);
  const triggerShakeRef = useRef(triggerShake);
  triggerShakeRef.current = triggerShake;

  const resetBall = useCallback(() => {
    ballRef.current = {
      x: CANVAS_W / 2,
      y: PADDLE_Y - BALL_R - 2,
      vx: (Math.random() > 0.5 ? 1 : -1) * (3 + levelRef.current * 0.3),
      vy: -(4 + levelRef.current * 0.2),
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (gameStatusRef.current === 'playing') {
      // Paddle keyboard movement
      if (keysRef.current.has('ArrowLeft')) paddleXRef.current = Math.max(0, paddleXRef.current - 5);
      if (keysRef.current.has('ArrowRight')) paddleXRef.current = Math.min(CANVAS_W - PADDLE_W, paddleXRef.current + 5);

      const ball = ballRef.current;

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounce
      if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }
      if (ball.x + BALL_R > CANVAS_W) { ball.x = CANVAS_W - BALL_R; ball.vx = -Math.abs(ball.vx); }
      if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }

      // Paddle bounce
      if (
        ball.y + BALL_R >= PADDLE_Y &&
        ball.y + BALL_R <= PADDLE_Y + PADDLE_H &&
        ball.x >= paddleXRef.current &&
        ball.x <= paddleXRef.current + PADDLE_W &&
        ball.vy > 0
      ) {
        const relX = (ball.x - (paddleXRef.current + PADDLE_W / 2)) / (PADDLE_W / 2);
        ball.vx = relX * 5;
        ball.vy = -Math.abs(ball.vy);
      }

      // Bottom out
      if (ball.y + BALL_R > CANVAS_H) {
        livesRef.current--;
        setDisplayLives(livesRef.current);
        triggerShakeRef.current(8, 400);
        setFlashActive(true);
        if (livesRef.current <= 0) {
          gameStatusRef.current = 'gameover';
          setGameStatus('gameover');
          onGameEnd(scoreRef.current, `레벨: ${levelRef.current}`);
          return;
        }
        resetBall();
      }

      // Brick collision
      let aliveBricks = 0;
      for (const brick of bricksRef.current) {
        if (!brick.alive) continue;
        aliveBricks++;
        const bx = BRICK_OFFSET_X + brick.col * (BRICK_W + BRICK_GAP);
        const by = BRICK_OFFSET_Y + brick.row * (BRICK_H + BRICK_GAP);
        if (
          ball.x + BALL_R > bx &&
          ball.x - BALL_R < bx + BRICK_W &&
          ball.y + BALL_R > by &&
          ball.y - BALL_R < by + BRICK_H
        ) {
          brick.alive = false;
          aliveBricks--;
          const pts = BRICK_SCORES[brick.row] ?? 10;
          scoreRef.current += pts;
          setDisplayScore(scoreRef.current);
          onScoreChange(scoreRef.current);
          // 벽돌 파괴 파티클
          const brickCX = bx + BRICK_W / 2;
          const brickCY = by + BRICK_H / 2;
          const brickColor = BRICK_COLORS[brick.row];
          const pid = ++particleIdRef.current;
          setParticles(prev => [...prev, { id: pid, x: brickCX, y: brickCY, color: brickColor }]);

          // Determine bounce direction
          const overlapLeft = ball.x + BALL_R - bx;
          const overlapRight = bx + BRICK_W - (ball.x - BALL_R);
          const overlapTop = ball.y + BALL_R - by;
          const overlapBottom = by + BRICK_H - (ball.y - BALL_R);
          const minH = Math.min(overlapLeft, overlapRight);
          const minV = Math.min(overlapTop, overlapBottom);
          if (minH < minV) ball.vx = -ball.vx;
          else ball.vy = -ball.vy;
          break;
        }
      }

      if (aliveBricks === 0) {
        levelRef.current++;
        setDisplayLevel(levelRef.current);
        bricksRef.current = createBricks();
        resetBall();
        setConfettiActive(true);
      }
    }

    // Draw bricks
    for (const brick of bricksRef.current) {
      if (!brick.alive) continue;
      const bx = BRICK_OFFSET_X + brick.col * (BRICK_W + BRICK_GAP);
      const by = BRICK_OFFSET_Y + brick.row * (BRICK_H + BRICK_GAP);
      ctx.fillStyle = BRICK_COLORS[brick.row];
      ctx.fillRect(bx, by, BRICK_W, BRICK_H);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(bx, by, BRICK_W, 4);
    }

    // Draw paddle
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(paddleXRef.current, PADDLE_Y, PADDLE_W, PADDLE_H, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(paddleXRef.current + 4, PADDLE_Y + 2, PADDLE_W - 8, 3);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = '#a5f3fc';
    ctx.fill();

    // HUD
    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';
    ctx.fillText(`점수: ${scoreRef.current}`, 8, 20);
    ctx.fillText(`레벨: ${levelRef.current}`, CANVAS_W / 2 - 30, 20);
    const hearts = '💙'.repeat(livesRef.current) + '🖤'.repeat(3 - livesRef.current);
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(hearts, CANVAS_W - 8, 20);
    ctx.textAlign = 'start';

    if (gameStatusRef.current === 'playing') {
      animRef.current = requestAnimationFrame(draw);
    }
  }, [resetBall, onGameEnd, onScoreChange]);

  const startGame = useCallback(() => {
    bricksRef.current = createBricks();
    scoreRef.current = 0;
    levelRef.current = 1;
    livesRef.current = 3;
    paddleXRef.current = (CANVAS_W - PADDLE_W) / 2;
    setDisplayScore(0);
    setDisplayLevel(1);
    setDisplayLives(3);
    resetBall();
    gameStatusRef.current = 'playing';
    setGameStatus('playing');
    onScoreChange(0);
    animRef.current = requestAnimationFrame(draw);
  }, [draw, resetBall, onScoreChange]);

  useEffect(() => {
    // Initial render
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }
    }
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameStatusRef.current !== 'playing') return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddleXRef.current = Math.max(0, Math.min(CANVAS_W - PADDLE_W, mouseX - PADDLE_W / 2));
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    const canvas = canvasRef.current;
    canvas?.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <ConfettiEffect active={confettiActive} duration={2500} />
      <div className="relative" style={shakeStyle}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border border-gray-700"
        />
        <FlashOverlay
          active={flashActive}
          color="rgba(239,68,68,0.35)"
          duration={300}
          onDone={() => setFlashActive(false)}
        />
        {particles.map(p => (
          <ParticleEffect
            key={p.id}
            x={p.x}
            y={p.y}
            color={p.color}
            count={6}
            onDone={() => setParticles(prev => prev.filter(pt => pt.id !== p.id))}
          />
        ))}
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
        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
            <p className="text-red-400 text-2xl font-bold">게임 오버</p>
            <p className="text-white">점수: {displayScore} | 레벨: {displayLevel}</p>
            <button
              onClick={startGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
            >
              다시 시작
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-500 text-sm">마우스 이동 / 방향키: 패들 조작</p>
    </div>
  );
}
