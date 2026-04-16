'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController from '@/components/features/games/GameOverlayController';

const CODE_SNIPPETS: string[] = [
  'const fetchData = async (url: string) => {',
  'interface User { id: number; name: string; }',
  'export default function Home() {',
  'const [state, setState] = useState(false);',
  'import { useEffect, useCallback } from "react";',
  'SELECT * FROM users WHERE active = true;',
  'docker compose up -d --build',
  'git rebase -i HEAD~3',
  'npm install --save-dev typescript',
  'const router = useRouter();',
  'return NextResponse.json(data, { status: 200 });',
  'throw new Error("Unauthorized access");',
  'console.log("Hello, World!");',
  'for (let i = 0; i < arr.length; i++) {',
  'const result = await prisma.user.findMany();',
  'app.get("/api/health", (req, res) => {',
  'FROM node:20-alpine AS builder',
  'kubectl apply -f deployment.yaml',
  'export const metadata: Metadata = {',
  'def train_model(data, epochs=10):',
  'model.compile(optimizer="adam")',
  'class UserService { constructor() {} }',
  'pipe(map(x => x * 2), filter(x => x > 5))',
  'const sum = arr.reduce((a, b) => a + b, 0);',
  'border border-gray-700 rounded-lg p-4',
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type CharStatus = 'correct' | 'incorrect' | 'pending';
type GameStatus = 'idle' | 'playing' | 'finished';

interface TypingState {
  gameStatus: GameStatus;
  timeLimit: 30 | 60;
  timeLeft: number;
  snippets: string[];
  currentSnippetIndex: number;
  currentCharIndex: number;
  typedChars: CharStatus[];
  totalCorrect: number;
  totalIncorrect: number;
  totalTyped: number;
  wpm: number;
}

const IGNORED_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape', 'CapsLock',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

function makeInitialState(timeLimit: 30 | 60, snippets: string[]): TypingState {
  return {
    gameStatus: 'idle',
    timeLimit,
    timeLeft: timeLimit,
    snippets,
    currentSnippetIndex: 0,
    currentCharIndex: 0,
    typedChars: Array(snippets[0]?.length ?? 0).fill('pending'),
    totalCorrect: 0,
    totalIncorrect: 0,
    totalTyped: 0,
    wpm: 0,
  };
}

export default function TypingGame({ onGameEnd, onScoreChange, onKeyClick, onCombo }: GameComponentProps) {
  const [timeLimit, setTimeLimit] = useState<30 | 60>(60);
  const [state, setState] = useState<TypingState>(() =>
    makeInitialState(60, shuffleArray(CODE_SNIPPETS))
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const prevSnippetIndexRef = useRef(0);
  const prevIncorrectRef = useRef(0);
  const correctComboRef = useRef(0);
  const { playKeyClick, playCombo } = useSound();
  const combo = useCombo();

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishGame = useCallback(
    (finalState: TypingState) => {
      stopTimer();
      const elapsed = finalState.timeLimit - finalState.timeLeft;
      const elapsedMinutes = elapsed / 60;
      const wpm =
        elapsedMinutes > 0
          ? Math.round(finalState.totalCorrect / 5 / elapsedMinutes)
          : 0;
      const accuracy =
        finalState.totalTyped > 0
          ? Math.round((finalState.totalCorrect / finalState.totalTyped) * 100)
          : 100;
      onGameEnd(wpm, `WPM: ${wpm}, 정확도: ${accuracy}%`);
      setState(s => ({ ...s, gameStatus: 'finished', wpm }));
    },
    [stopTimer, onGameEnd]
  );

  // 타이머
  useEffect(() => {
    if (state.gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.gameStatus !== 'playing') return prev;
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, timeLeft: 0, gameStatus: 'finished' };
        }
        const elapsed = prev.timeLimit - newTimeLeft;
        const elapsedMinutes = elapsed / 60;
        const wpm =
          elapsedMinutes > 0
            ? Math.round(prev.totalCorrect / 5 / elapsedMinutes)
            : 0;
        onScoreChange(wpm);
        return { ...prev, timeLeft: newTimeLeft, wpm };
      });
    }, 1000);

    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus]);

  // finished 감지 후 처리
  useEffect(() => {
    if (state.gameStatus === 'finished' && state.timeLeft === 0) {
      const elapsed = state.timeLimit;
      const elapsedMinutes = elapsed / 60;
      const wpm =
        elapsedMinutes > 0
          ? Math.round(state.totalCorrect / 5 / elapsedMinutes)
          : 0;
      const accuracy =
        state.totalTyped > 0
          ? Math.round((state.totalCorrect / state.totalTyped) * 100)
          : 100;
      onGameEnd(wpm, `WPM: ${wpm}, 정확도: ${accuracy}%`);
      setState(s => ({ ...s, wpm }));
      stopTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus, state.timeLeft]);

  const handleKey = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      const key = 'key' in e ? e.key : (e as React.KeyboardEvent).key;

      if (IGNORED_KEYS.has(key)) return;

      setState(prev => {
        if (prev.gameStatus === 'finished') return prev;

        const currentSnippet = prev.snippets[prev.currentSnippetIndex] ?? '';
        let newState = { ...prev };

        // 게임 시작
        if (prev.gameStatus === 'idle') {
          newState = { ...newState, gameStatus: 'playing' };
        }

        if (key === 'Backspace') {
          if (newState.currentCharIndex > 0) {
            const newTyped = [...newState.typedChars];
            newTyped[newState.currentCharIndex - 1] = 'pending';
            newState = {
              ...newState,
              currentCharIndex: newState.currentCharIndex - 1,
              typedChars: newTyped,
            };
          }
          return newState;
        }

        if (key.length !== 1) return newState;

        onKeyClick?.();

        const expected = currentSnippet[newState.currentCharIndex];
        if (expected === undefined) return newState;

        const isCorrect = key === expected;

        if (isCorrect) {
          // 정확 입력 사운드
          playKeyClick();

          correctComboRef.current += 1;
          const rawCombo = correctComboRef.current;
          if (rawCombo > 0 && rawCombo % 5 === 0) {
            const level = Math.min(Math.floor(rawCombo / 5), 5);
            onCombo?.(level);
          }

          // useCombo 기반 콤보 레벨 사운드
          const prevLevel = combo.comboLevel;
          const newLevel = combo.increment();
          if (newLevel > 0 && newLevel > prevLevel) {
            playCombo(newLevel);
          }
        } else {
          correctComboRef.current = 0;
          combo.reset();
        }

        const newTyped = [...newState.typedChars];
        newTyped[newState.currentCharIndex] = isCorrect ? 'correct' : 'incorrect';

        const newCharIndex = newState.currentCharIndex + 1;
        const newTotalCorrect = isCorrect ? newState.totalCorrect + 1 : newState.totalCorrect;
        const newTotalIncorrect = isCorrect ? newState.totalIncorrect : newState.totalIncorrect + 1;
        const newTotalTyped = newState.totalTyped + 1;

        // 스니펫 완료
        if (newCharIndex >= currentSnippet.length) {
          const nextIndex = newState.currentSnippetIndex + 1;
          const nextSnippet = newState.snippets[nextIndex] ?? '';
          return {
            ...newState,
            currentSnippetIndex: nextIndex,
            currentCharIndex: 0,
            typedChars: Array(nextSnippet.length).fill('pending'),
            totalCorrect: newTotalCorrect,
            totalIncorrect: newTotalIncorrect,
            totalTyped: newTotalTyped,
          };
        }

        return {
          ...newState,
          currentCharIndex: newCharIndex,
          typedChars: newTyped,
          totalCorrect: newTotalCorrect,
          totalIncorrect: newTotalIncorrect,
          totalTyped: newTotalTyped,
        };
      });
    },
    [onKeyClick, onCombo, playKeyClick, playCombo, combo]
  );

  // 이펙트 감지
  useEffect(() => {
    // 오타 감지
    if (state.totalIncorrect > prevIncorrectRef.current) {
      setFlashActive(true);
    }
    prevIncorrectRef.current = state.totalIncorrect;
  }, [state.totalIncorrect]);

  useEffect(() => {
    // 완료 + WPM 40 이상 → 컨페티
    if (state.gameStatus === 'finished' && state.wpm >= 40) {
      setConfettiActive(true);
    }
  }, [state.gameStatus, state.wpm]);

  useEffect(() => {
    // 스니펫 완료 감지
    if (
      state.currentSnippetIndex > prevSnippetIndexRef.current &&
      state.gameStatus === 'playing'
    ) {
      setFlashActive(true);
    }
    prevSnippetIndexRef.current = state.currentSnippetIndex;
  }, [state.currentSnippetIndex, state.gameStatus]);

  // document-level keydown
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.gameStatus === 'finished') return;
      handleKey(e);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleKey, state.gameStatus]);

  const resetGame = useCallback(() => {
    stopTimer();
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, shuffleArray(CODE_SNIPPETS)));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [stopTimer, timeLimit, combo]);

  const handleTimeLimitChange = useCallback(
    (limit: 30 | 60) => {
      setTimeLimit(limit);
      stopTimer();
      setState(makeInitialState(limit, shuffleArray(CODE_SNIPPETS)));
    },
    [stopTimer]
  );

  const currentSnippet = state.snippets[state.currentSnippetIndex] ?? '';
  const accuracy =
    state.totalTyped > 0
      ? Math.round((state.totalCorrect / state.totalTyped) * 100)
      : 100;

  return (
    <div
      ref={gameAreaRef}
      tabIndex={0}
      className="flex flex-col gap-4 outline-none relative"
      onClick={() => hiddenInputRef.current?.focus()}
    >
      <ConfettiEffect active={confettiActive} duration={3000} />
      <FlashOverlay
        active={flashActive}
        color="rgba(239,68,68,0.25)"
        duration={250}
        onDone={() => setFlashActive(false)}
      />
      {/* 숨겨진 모바일 input */}
      <input
        ref={hiddenInputRef}
        className="sr-only"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
        readOnly={false}
        aria-label="타이핑 입력"
        onKeyDown={(e) => {
          const key = e.key;
          if (IGNORED_KEYS.has(key)) return;
          if (key !== 'Unidentified' && (key.length === 1 || key === 'Backspace')) {
            e.preventDefault();
            handleKey(e as unknown as KeyboardEvent);
          }
        }}
        onInput={(e) => {
          const input = e.currentTarget;
          const value = input.value;
          if (!value) return;
          for (const char of value) {
            const syntheticEvent = { key: char } as unknown as KeyboardEvent;
            handleKey(syntheticEvent);
          }
          input.value = '';
        }}
      />

      {/* 시간 선택 (idle 상태에서만) */}
      {state.gameStatus === 'idle' && (
        <div className="flex items-center gap-3">
          <p className="text-xs text-zinc-500">시간 선택:</p>
          {([30, 60] as const).map(t => (
            <button
              key={t}
              onClick={() => handleTimeLimitChange(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                timeLimit === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
              }`}
            >
              {t}초
            </button>
          ))}
        </div>
      )}

      {/* 타이머 + WPM */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-zinc-500">남은 시간</p>
          <p
            className={`text-3xl font-mono font-bold ${
              state.timeLeft <= 10 ? 'text-red-400' : 'text-white'
            }`}
          >
            {state.timeLeft}s
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">WPM</p>
          <p className="text-3xl font-mono font-bold text-indigo-400">{state.wpm}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">정확도</p>
          <p className="text-xl font-bold text-emerald-400">{accuracy}%</p>
        </div>
      </div>

      {/* 타이핑 텍스트 영역 */}
      {state.gameStatus !== 'finished' && (
        <div className="bg-gray-900 rounded-xl p-6 min-h-[200px] border border-gray-700">
          {state.gameStatus === 'idle' && (
            <p className="text-zinc-500 text-sm mb-4 text-center">
              타이핑을 시작하면 자동으로 게임이 시작됩니다
            </p>
          )}
          <div className="font-mono text-lg leading-relaxed select-none">
            {currentSnippet.split('').map((char, index) => {
              const status = state.typedChars[index] ?? 'pending';
              const isCurrent = index === state.currentCharIndex;

              let className = 'text-zinc-500';
              if (status === 'correct') className = 'text-emerald-400';
              if (status === 'incorrect') className = 'text-red-400 underline';
              if (isCurrent && state.gameStatus !== 'idle')
                className += ' bg-indigo-500/30 rounded';

              return (
                <span key={index} className={className}>
                  {char === ' ' ? '\u00A0' : char}
                  {isCurrent && state.gameStatus === 'playing' && (
                    <span className="animate-pulse text-indigo-400">|</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 온스크린 QWERTY 키보드 — 모바일(1024px 미만)에서만 표시 */}
      {state.gameStatus !== 'finished' && (
        <div className="relative min-h-[120px] lg:hidden">
          <GameOverlayController
            type="keyboard"
            onKey={(key) => handleKey({ key } as unknown as KeyboardEvent)}
            disabled={false}
          />
        </div>
      )}

      {/* 결과 화면 */}
      {state.gameStatus === 'finished' && (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 text-center space-y-4">
          <p className="text-zinc-400 text-sm">결과</p>
          <div>
            <p className="text-6xl font-black text-indigo-400">{state.wpm}</p>
            <p className="text-zinc-500 mt-1">WPM</p>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-xl font-bold text-emerald-400">{accuracy}%</p>
              <p className="text-xs text-zinc-500">정확도</p>
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-300">{state.totalTyped}</p>
              <p className="text-xs text-zinc-500">총 타이핑 수</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-400">{state.totalIncorrect}</p>
              <p className="text-xs text-zinc-500">오타</p>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
          >
            다시 시작
          </button>
        </div>
      )}

      <p className="text-xs text-zinc-600 text-center">
        {state.gameStatus === 'idle'
          ? '키보드를 입력하면 자동 시작됩니다 (모바일: 화면을 탭하세요)'
          : state.gameStatus === 'playing'
          ? 'Backspace로 수정 가능'
          : ''}
      </p>
    </div>
  );
}
