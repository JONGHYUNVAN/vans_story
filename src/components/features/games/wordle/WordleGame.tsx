'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useScreenShake } from '@/hooks/useScreenShake';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';

const WORDS = [
  'array', 'async', 'await', 'build', 'cache',
  'class', 'clone', 'const', 'crash', 'debug',
  'defer', 'error', 'fetch', 'final', 'float',
  'frame', 'graph', 'hooks', 'index', 'input',
  'light', 'linux', 'local', 'loops', 'merge',
  'modal', 'mount', 'mutex', 'nginx', 'nodes',
  'oauth', 'often', 'patch', 'proxy', 'query',
  'queue', 'realm', 'redux', 'regex', 'repos',
  'route', 'scope', 'setup', 'stack', 'state',
  'store', 'style', 'swift', 'token', 'types',
  'union', 'vague', 'valid', 'value', 'watch',
];

const QWERTY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

type LetterStatus = 'correct' | 'present' | 'absent' | 'unused';
type GameStatus = 'playing' | 'won' | 'lost';

interface GuessResult {
  letter: string;
  status: LetterStatus;
}

function evaluateGuess(guess: string[], answer: string): GuessResult[] {
  const result: GuessResult[] = guess.map(l => ({ letter: l, status: 'absent' as LetterStatus }));
  const answerArr = answer.split('');
  const used = Array(5).fill(false);

  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answerArr[i]) {
      result[i].status = 'correct';
      used[i] = true;
    }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (result[i].status === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === answerArr[j]) {
        result[i].status = 'present';
        used[j] = true;
        break;
      }
    }
  }
  return result;
}

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function WordleGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const [answer, setAnswer] = useState(() => randomWord());
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [letterStatus, setLetterStatus] = useState<Record<string, LetterStatus>>({});
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');
  const { shakeStyle, triggerShake } = useScreenShake();
  const [confettiActive, setConfettiActive] = useState(false);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setShake(true);
      triggerShake(6, 350);
      setTimeout(() => setShake(false), 500);
      setMessage('5글자를 입력하세요');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    const word = currentGuess.join('');
    const result = evaluateGuess(currentGuess, answer);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    // Update letter status
    const newLetterStatus = { ...letterStatus };
    for (const r of result) {
      const prev: LetterStatus | undefined = newLetterStatus[r.letter];
      if (prev === 'correct') continue;
      if (r.status === 'correct') {
        newLetterStatus[r.letter] = 'correct';
      } else if (r.status === 'present') {
        newLetterStatus[r.letter] = 'present';
      } else if (!prev) {
        newLetterStatus[r.letter] = 'absent';
      }
    }
    setLetterStatus(newLetterStatus);

    if (word === answer) {
      setGameStatus('won');
      const score = (7 - newGuesses.length) * 100;
      onScoreChange(score);
      onGameEnd(score, `${newGuesses.length}번째 시도`);
      setConfettiActive(true);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      onGameEnd(0, '실패');
      setMessage(`정답: ${answer.toUpperCase()}`);
    }
  }, [currentGuess, guesses, answer, letterStatus, onGameEnd, onScoreChange]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      const key = e.key.toLowerCase();
      if (key === 'enter') {
        submitGuess();
      } else if (key === 'backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess(prev => [...prev, key]);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [gameStatus, currentGuess, submitGuess]);

  const handleVirtualKey = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;
    if (key === 'Enter') {
      submitGuess();
    } else if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => [...prev, key]);
    }
  }, [gameStatus, currentGuess, submitGuess]);

  const restart = useCallback(() => {
    setAnswer(randomWord());
    setGuesses([]);
    setCurrentGuess([]);
    setGameStatus('playing');
    setLetterStatus({});
    setMessage('');
    onScoreChange(0);
  }, [onScoreChange]);

  const getKeyClass = (key: string): string => {
    const base = 'flex items-center justify-center rounded font-bold text-xs cursor-pointer select-none transition-colors ';
    if (key === 'Enter' || key === '⌫') {
      return base + 'bg-zinc-500 hover:bg-zinc-400 text-white px-2 py-3 min-w-[40px]';
    }
    const status = letterStatus[key];
    const sizeClass = 'w-8 h-10 ';
    if (status === 'correct') return base + sizeClass + 'bg-emerald-600 text-white';
    if (status === 'present') return base + sizeClass + 'bg-yellow-600 text-white';
    if (status === 'absent') return base + sizeClass + 'bg-zinc-700 text-zinc-400';
    return base + sizeClass + 'bg-zinc-500 hover:bg-zinc-400 text-white';
  };

  const getCellClass = (rowIdx: number, colIdx: number): string => {
    const base = 'w-[52px] h-[52px] flex items-center justify-center text-xl font-black border-2 rounded-md uppercase ';
    if (rowIdx < guesses.length) {
      const status = guesses[rowIdx][colIdx].status;
      if (status === 'correct') return base + 'bg-emerald-600 border-emerald-600 text-white';
      if (status === 'present') return base + 'bg-yellow-600 border-yellow-600 text-white';
      return base + 'bg-zinc-700 border-zinc-700 text-zinc-300';
    }
    if (rowIdx === guesses.length) {
      const letter = currentGuess[colIdx];
      if (letter) return base + 'border-white text-white bg-transparent';
      return base + 'border-zinc-600 text-transparent bg-transparent';
    }
    return base + 'border-zinc-600 text-transparent bg-transparent';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4" style={shakeStyle}>
      <ConfettiEffect active={confettiActive} duration={2500} />
      <div className="text-zinc-400 text-sm">개발자 워들 — 5글자 IT 용어 맞추기</div>

      {message && (
        <div className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-bold">{message}</div>
      )}

      {/* Game grid */}
      <div className={`flex flex-col gap-1 ${shake ? 'animate-bounce' : ''}`}>
        {Array.from({ length: 6 }, (_, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {Array.from({ length: 5 }, (_, colIdx) => (
              <div key={colIdx} className={getCellClass(rowIdx, colIdx)}>
                {rowIdx < guesses.length
                  ? guesses[rowIdx][colIdx].letter
                  : rowIdx === guesses.length
                  ? currentGuess[colIdx] ?? ''
                  : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Virtual keyboard */}
      <div className="flex flex-col items-center gap-1 mt-2">
        {QWERTY_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map(key => (
              <div key={key} className={getKeyClass(key)} onClick={() => handleVirtualKey(key)}>
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className="flex flex-col items-center gap-2">
          {gameStatus === 'won' && (
            <p className="text-emerald-400 font-bold">정답! 점수: {(7 - guesses.length) * 100}</p>
          )}
          {gameStatus === 'lost' && (
            <p className="text-red-400 font-bold">실패! 정답: {answer.toUpperCase()}</p>
          )}
          <button
            onClick={restart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
          >
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
}
