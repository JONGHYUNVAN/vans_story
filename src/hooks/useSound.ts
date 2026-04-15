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

  // 방향 이동 틱 (Snake 방향 전환 / 2048 타일 슬라이드)
  const playMoveTick = useCallback(() => {
    if (isMuted) return;
    tone(660, 0.04, 'square', 0.04);
  }, [isMuted]);

  // 타이핑 키 클릭
  const playKeyClick = useCallback(() => {
    if (isMuted) return;
    tone(900, 0.025, 'square', 0.05);
  }, [isMuted]);

  // 콤보 레벨별 상승 사운드 (level: 1~5+)
  const playCombo = useCallback((level: number) => {
    if (isMuted) return;
    const lv = Math.min(level, 5);
    const freqs = [440, 550, 660, 880, 1047];
    const freq = freqs[lv - 1];
    if (lv === 1) {
      tone(freq, 0.1, 'sine', 0.11, freq * 1.2);
    } else if (lv === 2) {
      tone(freq, 0.12, 'triangle', 0.13, freq * 1.25);
      tone(freq * 1.5, 0.1, 'triangle', 0.07, undefined, 0.07);
    } else if (lv === 3) {
      tone(freq, 0.1, 'triangle', 0.15, freq * 1.5);
      tone(freq * 1.25, 0.12, 'triangle', 0.1, freq * 1.6, 0.06);
    } else if (lv === 4) {
      tone(freq, 0.08, 'square', 0.12, freq * 1.5);
      tone(freq * 1.25, 0.1, 'square', 0.08, freq * 1.75, 0.05);
      tone(freq * 1.5, 0.12, 'square', 0.06, freq * 2.0, 0.1);
    } else {
      tone(freq, 0.08, 'triangle', 0.16, freq * 1.5);
      tone(freq * 1.25, 0.1, 'triangle', 0.12, freq * 1.75, 0.04);
      tone(freq * 1.5, 0.12, 'triangle', 0.08, freq * 2.0, 0.08);
      tone(freq * 2.0, 0.15, 'sine', 0.1, freq * 2.5, 0.12);
    }
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
    playMoveTick,
    playKeyClick,
    playCombo,
    isMuted,
    toggleMute,
  };
}
