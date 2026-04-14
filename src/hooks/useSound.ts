'use client';

import { useCallback, useState } from 'react';

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (sharedCtx.state === 'suspended') sharedCtx.resume();
  return sharedCtx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.12,
  freqEnd?: number,
  delay = 0,
) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, now + dur);
  }
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.start(now);
  osc.stop(now + dur + 0.01);
}

export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('vans_sound_muted') === 'true';
  });

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('vans_sound_muted', String(next));
      return next;
    });
  }, []);

  const playHover = useCallback(() => {
    if (isMuted) return;
    tone(700, 0.07, 'sine', 0.05);
  }, [isMuted]);

  const playSelect = useCallback(() => {
    if (isMuted) return;
    tone(900, 0.06, 'triangle', 0.14);
    tone(1200, 0.1, 'triangle', 0.1, undefined, 0.06);
  }, [isMuted]);

  const playGameStart = useCallback(() => {
    if (isMuted) return;
    tone(523, 0.1, 'triangle', 0.18, undefined, 0);
    tone(659, 0.1, 'triangle', 0.18, undefined, 0.1);
    tone(784, 0.2, 'triangle', 0.18, undefined, 0.2);
  }, [isMuted]);

  const playGameOver = useCallback(() => {
    if (isMuted) return;
    tone(400, 0.15, 'sawtooth', 0.14, 200, 0);
    tone(200, 0.3, 'sawtooth', 0.1, 100, 0.15);
  }, [isMuted]);

  const playHighScore = useCallback(() => {
    if (isMuted) return;
    tone(523, 0.08, 'triangle', 0.18, undefined, 0);
    tone(659, 0.08, 'triangle', 0.18, undefined, 0.09);
    tone(784, 0.08, 'triangle', 0.18, undefined, 0.18);
    tone(1047, 0.35, 'triangle', 0.22, undefined, 0.27);
  }, [isMuted]);

  const playScore = useCallback(() => {
    if (isMuted) return;
    tone(880, 0.08, 'sine', 0.09, 1100);
  }, [isMuted]);

  // Flappy: 날갯짓 "fwoop"
  const playJump = useCallback(() => {
    if (isMuted) return;
    tone(300, 0.09, 'sine', 0.1, 550);
  }, [isMuted]);

  // WhackaMole: 두더지 타격 "bonk"
  const playHit = useCallback(() => {
    if (isMuted) return;
    tone(320, 0.06, 'triangle', 0.18, 160);
    tone(200, 0.08, 'triangle', 0.08, undefined, 0.06);
  }, [isMuted]);

  // Tetris: 줄 제거 상승 스윕
  const playLineClear = useCallback(() => {
    if (isMuted) return;
    tone(400, 0.12, 'square', 0.1, 800);
    tone(600, 0.12, 'square', 0.08, 1000, 0.1);
  }, [isMuted]);

  // Memory: 카드 매치 "딩"
  const playMatch = useCallback(() => {
    if (isMuted) return;
    tone(800, 0.08, 'sine', 0.14);
    tone(1000, 0.14, 'sine', 0.12, undefined, 0.08);
  }, [isMuted]);

  // Reaction: 반응 성공 "핑"
  const playPing = useCallback(() => {
    if (isMuted) return;
    tone(1200, 0.05, 'sine', 0.15, 1600);
  }, [isMuted]);

  return {
    playHover,
    playSelect,
    playGameStart,
    playGameOver,
    playHighScore,
    playScore,
    playJump,
    playHit,
    playLineClear,
    playMatch,
    playPing,
    isMuted,
    toggleMute,
  };
}
