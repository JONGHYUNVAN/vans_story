'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import ParticleEffect from '@/components/features/games/effects/ParticleEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

const TOTAL_HOLES = 9;
const GAME_DURATION = 30;

type GameStatus = 'idle' | 'playing' | 'gameover';

export default function WhackaMoleGame({ onGameEnd, onScoreChange, onAction, onCombo }: GameComponentProps) {
  const [moles, setMoles] = useState<boolean[]>(Array(TOTAL_HOLES).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [combo, setCombo] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [hitAnim, setHitAnim] = useState<number | null>(null);

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastHitTimeRef = useRef<number>(0);
  const moleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { shakeStyle, triggerShake } = useScreenShake();
  const [flashActive, setFlashActive] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const particleIdRef = useRef(0);

  const soundCombo = useCombo();

  const clearAllTimers = useCallback(() => {
    if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    moleTimeoutsRef.current.forEach(t => clearTimeout(t));
    moleTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const spawnMoles = useCallback((level: number) => {
    const newMoles = Array(TOTAL_HOLES).fill(false);
    const count = Math.random() < 0.3 ? 2 : 1;
    const indices = new Set<number>();
    while (indices.size < count) indices.add(Math.floor(Math.random() * TOTAL_HOLES));
    indices.forEach(i => { newMoles[i] = true; });
    setMoles(newMoles);

    const duration = Math.max(600, 1000 - (level - 1) * 50);
    const timeout = setTimeout(() => {
      setMoles(Array(TOTAL_HOLES).fill(false));
    }, duration);
    moleTimeoutsRef.current.push(timeout);
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    scoreRef.current = 0;
    comboRef.current = 0;
    soundCombo.reset();
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setMoles(Array(TOTAL_HOLES).fill(false));
    setGameStatus('playing');
    onScoreChange(0);

    let elapsed = 0;

    countdownRef.current = setInterval(() => {
      elapsed++;
      const remaining = GAME_DURATION - elapsed;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearAllTimers();
        setGameStatus('gameover');
        setMoles(Array(TOTAL_HOLES).fill(false));
        onGameEnd(scoreRef.current);
        triggerShake(8, 400);
      }
    }, 1000);

    const level = 1;
    spawnMoles(level);
    moleTimerRef.current = setInterval(() => {
      const currentLevel = Math.floor(elapsed / 10) + 1;
      spawnMoles(currentLevel);
    }, 1000);
  }, [clearAllTimers, spawnMoles, onGameEnd, onScoreChange, soundCombo]);

  const handleHoleClick = useCallback((idx: number) => {
    if (gameStatus !== 'playing') return;

    if (moles[idx]) {
      // Hit
      onAction?.();
      const now = Date.now();
      let newCombo = comboRef.current;
      if (now - lastHitTimeRef.current < 1000) {
        newCombo++;
      } else {
        newCombo = 1;
      }
      comboRef.current = newCombo;
      lastHitTimeRef.current = now;
      setCombo(newCombo);

      // 사운드 콤보 추적
      const prevLevel = soundCombo.comboLevel;
      const newLevel = soundCombo.increment();
      if (newLevel > 0 && newLevel > prevLevel) {
        onCombo?.(newLevel);
      }

      const pts = 10 + (newCombo - 1) * 5;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      onScoreChange(scoreRef.current);

      // 파티클 (grid cell 중앙 위치 계산: padding=24, gap=16, cell=80)
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cellSize = 80;
      const gap = 16;
      const padding = 24;
      const px = padding + col * (cellSize + gap) + cellSize / 2;
      const py = padding + row * (cellSize + gap) + cellSize / 2;
      const pid = ++particleIdRef.current;
      setParticles(prev => [...prev, { id: pid, x: px, y: py }]);

      setLastHit(idx);
      setHitAnim(idx);
      setTimeout(() => {
        setHitAnim(null);
        setLastHit(null);
      }, 150);

      setMoles(prev => {
        const next = [...prev];
        next[idx] = false;
        return next;
      });
    } else {
      // Miss — penalty
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      onScoreChange(scoreRef.current);
      comboRef.current = 0;
      setCombo(0);
      soundCombo.reset();
      setFlashActive(true);
    }
  }, [gameStatus, moles, onScoreChange, onAction, onCombo, soundCombo]);

  return (
    <div className="flex flex-col items-center gap-4 p-4" style={shakeStyle}>
      <FlashOverlay
        active={flashActive}
        color="rgba(239,68,68,0.2)"
        duration={200}
        onDone={() => setFlashActive(false)}
      />
      {/* Header */}
      <div className="flex items-center gap-6 bg-gray-900 border border-gray-700 rounded-xl px-6 py-3">
        <span className="text-white font-mono text-lg">점수: <span className="font-bold text-yellow-400">{score}</span></span>
        {combo > 1 && (
          <span className="text-orange-400 font-bold text-lg animate-pulse">{combo}x 콤보!</span>
        )}
        <span className="text-white font-mono text-lg">
          {timeLeft > 5
            ? `⏱ ${timeLeft}s`
            : <span className="text-red-400 font-bold">⏱ {timeLeft}s</span>
          }
        </span>
      </div>

      {gameStatus === 'gameover' && (
        <div className="text-emerald-400 font-bold text-lg">최종 점수: {score}</div>
      )}

      {/* 3x3 grid */}
      <div className="relative grid grid-cols-3 gap-4 bg-gray-900 border border-gray-700 rounded-xl p-6">
        {particles.map(p => (
          <ParticleEffect
            key={p.id}
            x={p.x}
            y={p.y}
            color="#facc15"
            count={8}
            onDone={() => setParticles(prev => prev.filter(pt => pt.id !== p.id))}
          />
        ))}
        {moles.map((hasMole, idx) => (
          <div
            key={idx}
            onClick={() => handleHoleClick(idx)}
            className={[
              'w-[clamp(60px,22vw,88px)] h-[clamp(60px,22vw,88px)] rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-100 select-none',
              hasMole
                ? 'bg-amber-900 border-amber-600'
                : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700',
              hitAnim === idx ? 'scale-125' : '',
            ].join(' ')}
          >
            {hasMole ? (
              <span className="text-4xl">{lastHit === idx ? '💥' : '🦔'}</span>
            ) : (
              <span className="text-zinc-600 text-2xl">○</span>
            )}
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
      {gameStatus === 'gameover' && (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
        >
          다시 시작
        </button>
      )}
      <p className="text-zinc-500 text-sm">두더지 클릭 +10점 / 빈 구멍 클릭 -5점</p>
    </div>
  );
}
