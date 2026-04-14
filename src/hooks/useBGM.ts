'use client';

import { useCallback, useEffect, useRef } from 'react';

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

const R = 0; // rest
type Note = [number, number]; // [hz, beats]

interface Track {
  seq: Note[];
  wave: OscillatorType;
  vol: number;
}

interface Pattern {
  tracks: Track[];
  bpm: number;
}

// 음표 주파수 (Hz)
const C2=65.41, D2=73.42, E2=82.41, F2=87.31, G2=98.00, A2=110.00, B2=123.47;
const C3=130.81, D3=146.83, E3=164.81, F3=174.61, G3=196.00, A3=220.00, B3=246.94;
const C4=261.63, D4=293.66, Eb4=311.13, E4=329.63, F4=349.23, G4=392.00, Ab4=415.30, A4=440.00, Bb4=466.16, B4=493.88;
const C5=523.25, D5=587.33, Eb5=622.25, E5=659.25, F5=698.46, G5=783.99, Ab5=830.61, A5=880.00, Bb5=932.33, B5=987.77;
const C6=1046.50, D6=1174.66, E6=1318.51, F6=1396.91, G6=1567.98, A6=1760.00, B6=1975.53;

// ─── Tetris / Korobeiniki 섹션 배열 ──────────────────────────────────────────
// A 파트 (16 beats) — 원곡 주 선율
const T_A: Note[] = [
  [E5,1],[B4,0.5],[C5,0.5],[D5,1],[C5,0.5],[B4,0.5],
  [A4,1],[A4,0.5],[C5,0.5],[E5,1],[D5,0.5],[C5,0.5],
  [B4,1.5],[C5,0.5],[D5,1],[E5,1],
  [C5,1],[A4,1],[A4,2],
];
// B 파트 (16 beats) — 원곡 부 선율
const T_B: Note[] = [
  [D5,1.5],[F5,0.5],[A5,1],[G5,0.5],[F5,0.5],
  [E5,1.5],[C5,0.5],[E5,1],[D5,0.5],[C5,0.5],
  [B4,1],[B4,0.5],[C5,0.5],[D5,1],[E5,1],
  [C5,1],[A4,1],[A4,2],
];
// C 파트 (16 beats) — Bridge 상승부
const T_C: Note[] = [
  [A5,1],[G5,0.5],[F5,0.5],[E5,1],[F5,0.5],[G5,0.5],
  [A5,1],[E5,1],[E5,2],
  [G5,1],[F5,0.5],[E5,0.5],[D5,1],[E5,0.5],[F5,0.5],
  [E5,1],[C5,1],[C5,2],
];
// D 파트 (16 beats) — Bridge 하강부
const T_D: Note[] = [
  [F5,1],[E5,0.5],[D5,0.5],[C5,1],[D5,0.5],[E5,0.5],
  [F5,1],[D5,1],[D5,2],
  [E5,1],[D5,0.5],[C5,0.5],[B4,1],[C5,0.5],[D5,0.5],
  [E5,1],[A4,1],[A4,2],
];
// 베이스 섹션 (각 16 beats)
const T_Ab: Note[] = [
  [A2,1],[E3,1],[A2,1],[E3,1],
  [E2,1],[B2,1],[E2,1],[B2,1],
  [A2,1],[E3,1],[A2,1],[E3,1],
  [E2,1],[B2,1],[E2,1],[B2,1],
];
const T_Bb: Note[] = [
  [D3,1],[A2,1],[D3,1],[A2,1],
  [C3,1],[G2,1],[C3,1],[G2,1],
  [E2,1],[B2,1],[E2,1],[B2,1],
  [A2,1],[E3,1],[A2,1],[E3,1],
];
const T_Cb: Note[] = [
  [A2,1],[E3,1],[A2,1],[E3,1],
  [E2,1],[E3,1],[E2,1],[E3,1],
  [G2,1],[D3,1],[G2,1],[D3,1],
  [C3,1],[G2,1],[C3,1],[G2,1],
];
const T_Db: Note[] = [
  [F2,1],[C3,1],[F2,1],[C3,1],
  [D3,1],[A2,1],[D3,1],[A2,1],
  [C3,1],[G2,1],[C3,1],[G2,1],
  [A2,1],[E3,1],[A2,1],[E3,1],
];

// 게임별 멀티트랙 BGM
const BGM: Record<string, Pattern> = {
  // Snake: NES 어드벤처, 밝은 C장조, 32비트 A+B
  snake: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          [E5,1],[G5,1],[A5,2],
          [G5,1],[E5,1],[D5,2],
          [C5,1],[E5,1],[G5,2],
          [A5,1],[G5,0.5],[E5,0.5],[C5,2],
          [E5,1],[G5,1],[A5,2],
          [A5,1],[G5,1],[E5,2],
          [C5,2],[C5,1],[D5,1],[E5,2],
          [D5,1],[C5,1],[C5,2],
        ],
        wave: 'square',
        vol: 0.06,
      },
      // 베이스 (sine)
      {
        seq: [
          [C3,4],[R,2],[C3,2],
          [G2,4],[R,2],[G2,2],
          [C3,4],[R,2],[C3,2],
          [G2,4],[R,2],[G2,2],
          [C3,4],[R,2],[C3,2],
          [E3,4],[R,2],[E3,2],
          [C3,4],[R,2],[C3,2],
          [G2,4],[R,2],[G2,2],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 130,
  },

  // 2048: 로파이 재즈, C장조7, 32비트
  '2048': {
    tracks: [
      // 멜로디 (sine)
      {
        seq: [
          [C4,2],[E4,2],[G4,2],[B4,2],
          [A4,2],[F4,2],[E4,2],[C4,2],
          [D4,2],[F4,2],[A4,2],[C5,2],
          [G4,2],[E4,2],[D4,2],[C4,4],
          [E4,2],[G4,2],[B4,2],[A4,2],
          [F4,2],[E4,2],[C4,2],[E4,2],
          [G4,2],[A4,2],[C5,2],[D5,2],
          [C5,2],[A4,2],[F4,2],[C4,4],
        ],
        wave: 'sine',
        vol: 0.07,
      },
      // 베이스 (sine)
      {
        seq: [
          [C3,4],[C3,4],
          [G2,4],[G2,4],
          [D3,4],[D3,4],
          [C3,4],[C3,4],
          [C3,4],[C3,4],
          [A2,4],[A2,4],
          [F2,4],[F2,4],
          [C3,4],[C3,4],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 88,
  },

  // Typing: 빠른 칩튠, 32비트
  typing: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          [C5,0.5],[G4,0.5],[A4,0.5],[E5,0.5],
          [D5,0.5],[B4,0.5],[C5,1],[R,1],
          [E5,0.5],[D5,0.5],[C5,0.5],[B4,0.5],
          [A4,0.5],[G4,0.5],[C5,2],
          [C5,0.5],[E5,0.5],[G5,0.5],[A5,0.5],
          [G5,0.5],[E5,0.5],[D5,1],[R,1],
          [G5,0.5],[F5,0.5],[E5,0.5],[D5,0.5],
          [C5,0.5],[B4,0.5],[C5,2],
        ],
        wave: 'square',
        vol: 0.06,
      },
      // 베이스 (square)
      {
        seq: [
          [C4,2],[R,2],[C4,2],[R,2],
          [G3,2],[R,2],[G3,2],[R,2],
          [C4,2],[R,2],[C4,2],[R,2],
          [G3,2],[R,2],[G3,2],[R,2],
          [C4,2],[R,2],[C4,2],[R,2],
          [G3,2],[R,2],[G3,2],[R,2],
          [C4,2],[R,2],[C4,2],[R,2],
          [G3,2],[R,2],[G3,2],[R,2],
        ],
        wave: 'square',
        vol: 0.04,
      },
    ],
    bpm: 165,
  },

  // Minesweeper: 긴장감 있는 A단조, 반음계, 32비트
  minesweeper: {
    tracks: [
      // 멜로디 (triangle)
      {
        seq: [
          [A4,1],[C5,1],[E5,1],[G5,1],
          [F5,1.5],[D5,0.5],[E5,1],[R,1],
          [A4,1],[Bb4,1],[B4,1],[C5,1],
          [Bb4,2],[A4,1],[R,1],
          [E5,1],[G5,1],[A5,1],[B5,1],
          [G5,1.5],[E5,0.5],[F5,1],[R,1],
          [C5,1],[Eb5,1],[F5,1],[G5,1],
          [E5,2],[A4,1],[R,1],
        ],
        wave: 'triangle',
        vol: 0.06,
      },
      // 베이스 (sine)
      {
        seq: [
          [A3,2],[E3,2],
          [A3,2],[E3,2],
          [A3,2],[F3,2],
          [E3,2],[A2,2],
          [A3,2],[E3,2],
          [A3,2],[E3,2],
          [F3,2],[E3,2],
          [A3,2],[A2,2],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 78,
  },

  // Tetris: Korobeiniki 완전판 — 272 beats ≈ 102초
  // 구조: [AA+BB] × 3 + [CC] + [DD] + A (Coda)
  tetris: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          // Verse 1: A×2 + B×2  (64 beats)
          ...T_A, ...T_A, ...T_B, ...T_B,
          // Bridge 1: C×2       (32 beats)
          ...T_C, ...T_C,
          // Verse 2: A×2 + B×2  (64 beats)
          ...T_A, ...T_A, ...T_B, ...T_B,
          // Bridge 2: D×2       (32 beats)
          ...T_D, ...T_D,
          // Verse 3: A×2 + B×2  (64 beats)
          ...T_A, ...T_A, ...T_B, ...T_B,
          // Coda: A              (16 beats)
          ...T_A,
        ],
        wave: 'square',
        vol: 0.07,
      },
      // 베이스 (triangle) — 동일 272 beats
      {
        seq: [
          ...T_Ab, ...T_Ab, ...T_Bb, ...T_Bb,
          ...T_Cb, ...T_Cb,
          ...T_Ab, ...T_Ab, ...T_Bb, ...T_Bb,
          ...T_Db, ...T_Db,
          ...T_Ab, ...T_Ab, ...T_Bb, ...T_Bb,
          ...T_Ab,
        ],
        wave: 'triangle',
        vol: 0.08,
      },
    ],
    bpm: 160,
  },

  // Flappy: 열대/카리브해, 32비트
  flappy: {
    tracks: [
      // 멜로디 (triangle)
      {
        seq: [
          [G5,0.5],[E5,0.5],[G5,1],[C5,1],
          [D5,0.5],[E5,0.5],[G5,1],[R,1],
          [A5,0.5],[G5,0.5],[E5,1],[C5,1],
          [D5,1],[G5,1],[E5,2],
          [G5,0.5],[E5,0.5],[G5,1],[C5,1],
          [D5,0.5],[E5,0.5],[G5,1],[R,1],
          [B5,0.5],[A5,0.5],[G5,1],[E5,1],
          [F5,1],[G5,1],[E5,2],
        ],
        wave: 'triangle',
        vol: 0.07,
      },
      // 베이스 (sine)
      {
        seq: [
          [C3,2],[C3,2],
          [G2,2],[G2,2],
          [C3,2],[C3,2],
          [G2,2],[G2,2],
          [C3,2],[C3,2],
          [G2,2],[G2,2],
          [C3,2],[C3,2],
          [G2,2],[G2,2],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 180,
  },

  // Breakout: 고속 아케이드, 32비트
  breakout: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          [C5,0.5],[E5,0.5],[G5,0.5],[C6,0.5],
          [B5,0.5],[G5,0.5],[E5,0.5],[C5,0.5],
          [D5,0.5],[F5,0.5],[A5,0.5],[D6,0.5],
          [C6,0.5],[A5,0.5],[F5,0.5],[D5,0.5],
          [E5,0.5],[G5,0.5],[B5,0.5],[E6,0.5],
          [D6,0.5],[B5,0.5],[G5,0.5],[E5,0.5],
          [F5,0.5],[A5,0.5],[C6,0.5],[F6,0.5],
          [E6,0.5],[C6,0.5],[A5,0.5],[F5,0.5],
        ],
        wave: 'square',
        vol: 0.06,
      },
      // 베이스 (square)
      {
        seq: [
          [C3,2],[C3,2],
          [D3,2],[D3,2],
          [E3,2],[E3,2],
          [F3,2],[F3,2],
          [G3,2],[G3,2],
          [A3,2],[A3,2],
          [B3,2],[B3,2],
          [C4,2],[C4,2],
        ],
        wave: 'square',
        vol: 0.04,
      },
    ],
    bpm: 195,
  },

  // Memory: 부드러운 피아노풍, 32비트
  memory: {
    tracks: [
      // 멜로디 (sine)
      {
        seq: [
          [C4,1],[E4,1],[G4,1],[C5,1],
          [G4,1],[E4,1],[F4,1],[A4,1],
          [E4,1],[G4,1],[B4,1],[G4,1],
          [F4,1],[D4,1],[C4,2],
          [C4,1],[E4,1],[G4,1],[C5,1],
          [B4,1],[G4,1],[A4,1],[B4,1],
          [G4,1],[B4,1],[D5,1],[B4,1],
          [A4,1],[F4,1],[E4,2],
        ],
        wave: 'sine',
        vol: 0.07,
      },
      // 베이스 (sine)
      {
        seq: [
          [C3,2],[C3,2],
          [F3,2],[F3,2],
          [C3,2],[C3,2],
          [G2,2],[G2,2],
          [C3,2],[C3,2],
          [F3,2],[F3,2],
          [C3,2],[C3,2],
          [G2,2],[G2,2],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 90,
  },

  // WhackaMole: 극속 유쾌, 32비트
  whackamole: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          [G5,0.5],[A5,0.5],[B5,0.5],[A5,0.5],
          [G5,0.5],[F5,0.5],[E5,0.5],[G5,0.5],
          [A5,0.5],[B5,0.5],[C6,0.5],[B5,0.5],
          [A5,0.5],[G5,0.5],[F5,1],
          [B5,0.5],[C6,0.5],[D6,0.5],[C6,0.5],
          [B5,0.5],[A5,0.5],[G5,0.5],[A5,0.5],
          [B5,0.5],[C6,0.5],[D6,0.5],[C6,0.5],
          [B5,0.5],[A5,0.5],[G5,1],
        ],
        wave: 'square',
        vol: 0.06,
      },
      // 베이스 (square)
      {
        seq: [
          [G3,2],[G3,2],
          [D3,2],[D3,2],
          [G3,2],[G3,2],
          [D3,2],[D3,2],
          [G3,2],[G3,2],
          [D3,2],[D3,2],
          [G3,2],[G3,2],
          [D3,2],[D3,2],
        ],
        wave: 'square',
        vol: 0.04,
      },
    ],
    bpm: 215,
  },

  // Wordle: 사색적 G장조, 32비트
  wordle: {
    tracks: [
      // 멜로디 (sine)
      {
        seq: [
          [G4,1],[D4,1],[E4,1],[G4,2],
          [E4,1],[D4,1],[G4,2],
          [B4,1],[A4,1],[B4,1],[D5,2],
          [B4,1],[A4,1],[G4,2],
          [G4,1],[D4,1],[E4,1],[G4,2],
          [E4,1],[D4,1],[G4,2],
          [B4,1],[A4,1],[B4,1],[D5,2],
          [D5,1],[C5,1],[B4,2],
        ],
        wave: 'sine',
        vol: 0.07,
      },
      // 베이스 (sine)
      {
        seq: [
          [G2,2],[G2,2],
          [D2,2],[D2,2],
          [G2,2],[G2,2],
          [D2,2],[D2,2],
          [G2,2],[G2,2],
          [D2,2],[D2,2],
          [G2,2],[G2,2],
          [D2,2],[D2,2],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 95,
  },

  // SlidingPuzzle: 5음계 선(禪), 32비트
  slidingpuzzle: {
    tracks: [
      // 멜로디 (sine)
      {
        seq: [
          [C4,2],[G4,2],[E4,2],[A4,2],
          [G4,2],[F4,2],[E4,2],[C4,2],
          [C4,2],[G4,2],[E4,2],[A4,2],
          [G4,2],[F4,2],[E4,2],[C4,2],
          [D4,2],[A4,2],[F4,2],[B4,2],
          [A4,2],[G4,2],[F4,2],[D4,2],
          [D4,2],[A4,2],[F4,2],[B4,2],
          [A4,2],[G4,2],[F4,2],[D4,2],
        ],
        wave: 'sine',
        vol: 0.07,
      },
      // 베이스 (sine)
      {
        seq: [
          [C3,4],[C3,4],
          [G2,4],[G2,4],
          [C3,4],[C3,4],
          [G2,4],[G2,4],
          [D3,4],[D3,4],
          [A2,4],[A2,4],
          [D3,4],[D3,4],
          [A2,4],[A2,4],
        ],
        wave: 'sine',
        vol: 0.05,
      },
    ],
    bpm: 68,
  },

  // RPS: D장조 배틀, 32비트
  rps: {
    tracks: [
      // 멜로디 (sawtooth)
      {
        seq: [
          [D5,0.5],[F5,0.5],[A5,0.5],[D6,0.5],
          [C6,0.5],[A5,0.5],[F5,1],[R,1],
          [F5,0.5],[A5,0.5],[C6,0.5],[F6,0.5],
          [E6,0.5],[C6,0.5],[A5,2],
          [A5,0.5],[C6,0.5],[D6,0.5],[A6,0.5],
          [G6,0.5],[D6,0.5],[C6,1],[R,1],
          [D5,0.5],[F5,0.5],[A5,0.5],[D6,0.5],
          [C6,0.5],[A5,0.5],[F5,2],
        ],
        wave: 'sawtooth',
        vol: 0.05,
      },
      // 베이스 (square)
      {
        seq: [
          [D3,2],[D3,2],
          [A2,2],[A2,2],
          [D3,2],[D3,2],
          [A2,2],[A2,2],
          [D3,2],[D3,2],
          [A2,2],[A2,2],
          [D3,2],[D3,2],
          [A2,2],[A2,2],
        ],
        wave: 'square',
        vol: 0.04,
      },
    ],
    bpm: 148,
  },

  // Reaction: 미니멀 긴장감, 24비트
  reaction: {
    tracks: [
      // 멜로디 (square)
      {
        seq: [
          [G4,0.5],[R,0.5],[G4,0.5],[R,0.5],
          [A4,0.5],[R,1.5],
          [G4,0.5],[R,0.5],[G4,0.5],[R,0.5],
          [B4,0.5],[R,1.5],
          [A4,0.5],[R,0.5],[A4,0.5],[R,0.5],
          [B4,0.5],[R,1.5],
        ],
        wave: 'square',
        vol: 0.07,
      },
      // 베이스 (square)
      {
        seq: [
          [G3,2],[R,2],[G3,2],[R,2],
          [A3,2],[R,4],
          [G3,2],[R,2],[G3,2],[R,2],
          [B3,2],[R,4],
          [A3,2],[R,2],[A3,2],[R,2],
          [B3,2],[R,4],
        ],
        wave: 'square',
        vol: 0.05,
      },
    ],
    bpm: 175,
  },
};

export function useBGM(gameId: string, isMuted: boolean) {
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isPlayingRef = useRef(false);
  const trackStatesRef = useRef<Array<{ noteIdx: number; nextTime: number }>>([]);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    if (schedulerRef.current !== undefined) {
      clearTimeout(schedulerRef.current);
      schedulerRef.current = undefined;
    }
  }, []);

  const play = useCallback(() => {
    if (isMutedRef.current) return;
    const pattern = BGM[gameId];
    if (!pattern) return;
    const ctx = getCtx();
    if (!ctx) return;

    stop();
    isPlayingRef.current = true;
    trackStatesRef.current = pattern.tracks.map(() => ({
      noteIdx: 0,
      nextTime: ctx.currentTime + 0.15,
    }));

    const beatDur = 60 / pattern.bpm;
    const LOOKAHEAD = 0.2;
    const SCHEDULE_MS = 30;

    const schedule = () => {
      const ctx2 = getCtx();
      if (!ctx2 || !isPlayingRef.current) return;

      for (let t = 0; t < pattern.tracks.length; t++) {
        const track = pattern.tracks[t];
        const state = trackStatesRef.current[t];

        while (state.nextTime < ctx2.currentTime + LOOKAHEAD) {
          const idx = state.noteIdx % track.seq.length;
          const [freq, beats] = track.seq[idx];

          if (freq > 0 && !isMutedRef.current) {
            const dur = beats * beatDur * 0.8;
            const startAt = state.nextTime;
            const osc = ctx2.createOscillator();
            const gain = ctx2.createGain();
            osc.connect(gain);
            gain.connect(ctx2.destination);
            osc.type = track.wave;
            osc.frequency.setValueAtTime(freq, startAt);
            gain.gain.setValueAtTime(track.vol, startAt);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
            osc.start(startAt);
            osc.stop(startAt + dur + 0.01);
          }

          state.nextTime += beats * beatDur;
          state.noteIdx++;
        }
      }

      if (isPlayingRef.current) {
        schedulerRef.current = setTimeout(schedule, SCHEDULE_MS);
      }
    };

    schedule();
  }, [gameId, stop]);

  useEffect(() => {
    if (!isMuted) {
      const timer = setTimeout(play, 400);
      return () => {
        clearTimeout(timer);
        stop();
      };
    } else {
      stop();
      return undefined;
    }
  }, [isMuted, gameId, play, stop]);

  return { play, stop };
}
