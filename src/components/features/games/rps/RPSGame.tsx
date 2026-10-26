'use client';

import { useState, useCallback } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/_components/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

type Choice = 'rock' | 'paper' | 'scissors';
type RoundResult = 'win' | 'lose' | 'draw';
type GameStatus = 'idle' | 'playing' | 'animating' | 'finished';

interface RoundHistory {
  player: Choice;
  cpu: Choice;
  result: RoundResult;
}

const CHOICES: { key: Choice; label: string; emoji: string }[] = [
  { key: 'rock', label: '바위', emoji: '✊' },
  { key: 'scissors', label: '가위', emoji: '✌️' },
  { key: 'paper', label: '보', emoji: '✋' },
];

const CPU_CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

function getResult(player: Choice, cpu: Choice): RoundResult {
  if (player === cpu) return 'draw';
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'scissors' && cpu === 'paper') ||
    (player === 'paper' && cpu === 'rock')
  )
    return 'win';
  return 'lose';
}

export default function RPSGame({
  onGameEnd,
  onScoreChange,
  onAction,
  onCombo,
}: GameComponentProps) {
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [history, setHistory] = useState<RoundHistory[]>([]);
  const [currentResult, setCurrentResult] = useState<RoundResult | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [flashActive, setFlashActive] = useState(false);
  const [flashColor, setFlashColor] = useState('rgba(52,211,153,0.3)');
  const [confettiActive, setConfettiActive] = useState(false);

  const { playSelect } = useSound();
  const combo = useCombo();

  const startGame = useCallback(() => {
    combo.reset();
    setRound(1);
    setPlayerScore(0);
    setCpuScore(0);
    setHistory([]);
    setCurrentResult(null);
    setCpuChoice(null);
    setPlayerChoice(null);
    setGameStatus('playing');
    onScoreChange(0);
  }, [onScoreChange, combo]);

  const handleChoice = useCallback(
    (choice: Choice) => {
      if (gameStatus !== 'playing') return;
      setGameStatus('animating');
      setPlayerChoice(choice);
      setCpuChoice(null);
      setCurrentResult(null);

      // 선택 즉시 사운드
      onAction?.();
      playSelect();

      setTimeout(() => {
        const cpu = CPU_CHOICES[Math.floor(Math.random() * 3)];
        const result = getResult(choice, cpu);
        setCpuChoice(cpu);
        setCurrentResult(result);

        setHistory((prev) => [...prev, { player: choice, cpu, result }]);

        let newPlayerScore = playerScore;
        let newCpuScore = cpuScore;
        let roundScore = 0;

        if (result === 'win') {
          newPlayerScore++;
          roundScore = 100;
          setFlashColor('rgba(52,211,153,0.3)');
          setFlashActive(true);

          // 콤보 추적 - 연속 승리
          const prevLevel = combo.comboLevel;
          const newLevel = combo.increment();
          if (newLevel > 0 && newLevel > prevLevel) {
            onCombo?.(newLevel);
          }
        } else if (result === 'lose') {
          newCpuScore++;
          roundScore = 0;
          setFlashColor('rgba(239,68,68,0.25)');
          setFlashActive(true);
          combo.reset();
        } else {
          roundScore = 50;
          // 무승부 시 콤보 유지
        }

        setPlayerScore(newPlayerScore);
        setCpuScore(newCpuScore);

        const totalScore = history.reduce((acc, h) => {
          if (h.result === 'win') return acc + 100;
          if (h.result === 'draw') return acc + 50;
          return acc;
        }, roundScore);

        onScoreChange(totalScore);

        if (round >= 5) {
          setGameStatus('finished');
          onGameEnd(totalScore, `${newPlayerScore}승 ${newCpuScore}패`);
          if (newPlayerScore > newCpuScore) {
            setConfettiActive(true);
          }
        } else {
          setTimeout(() => {
            setRound((r) => r + 1);
            setGameStatus('playing');
          }, 1500);
        }
      }, 800);
    },
    [
      gameStatus,
      playerScore,
      cpuScore,
      round,
      history,
      onGameEnd,
      onScoreChange,
      onAction,
      onCombo,
      playSelect,
      combo,
    ],
  );

  const getResultLabel = (result: RoundResult | null) => {
    if (!result) return '';
    if (result === 'win') return '승리!';
    if (result === 'lose') return '패배';
    return '무승부';
  };

  const getResultColor = (result: RoundResult | null) => {
    if (result === 'win') return 'text-emerald-400';
    if (result === 'lose') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getFinalMessage = () => {
    if (playerScore > cpuScore) return '승리! 🎉';
    if (playerScore < cpuScore) return '패배 😢';
    return '무승부 🤝';
  };

  return (
    <div className="relative flex flex-col items-center gap-4 p-4">
      <ConfettiEffect active={confettiActive} duration={2000} />
      <FlashOverlay
        active={flashActive}
        color={flashColor}
        duration={250}
        onDone={() => setFlashActive(false)}
      />
      {gameStatus === 'idle' ? (
        <button
          onClick={startGame}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-lg font-bold text-white hover:bg-indigo-500"
        >
          게임 시작
        </button>
      ) : (
        <>
          {/* Score header */}
          <div className="flex items-center gap-8 rounded-xl border border-gray-700 bg-gray-900 px-6 py-3">
            <div className="text-center">
              <p className="text-xs text-zinc-400">나</p>
              <p className="text-2xl font-bold text-white">{playerScore}</p>
            </div>
            <div className="font-bold text-zinc-400">라운드 {Math.min(round, 5)} / 5</div>
            <div className="text-center">
              <p className="text-xs text-zinc-400">CPU</p>
              <p className="text-2xl font-bold text-white">{cpuScore}</p>
            </div>
          </div>

          {/* Current round display */}
          <div className="flex min-w-[280px] items-center justify-center gap-8 rounded-xl border border-gray-700 bg-gray-900 px-8 py-4">
            <div className="text-center">
              <p className="mb-1 text-xs text-zinc-400">나</p>
              <span className="text-5xl">
                {playerChoice ? CHOICES.find((c) => c.key === playerChoice)?.emoji : '?'}
              </span>
            </div>
            <div className="text-center">
              {gameStatus === 'animating' && !cpuChoice && (
                <p className="animate-pulse text-sm text-zinc-400">생각 중...</p>
              )}
              {currentResult && (
                <p className={`text-xl font-black ${getResultColor(currentResult)}`}>
                  {getResultLabel(currentResult)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-zinc-400">CPU</p>
              <span className="text-5xl">
                {gameStatus === 'animating' && !cpuChoice
                  ? '❓'
                  : cpuChoice
                    ? CHOICES.find((c) => c.key === cpuChoice)?.emoji
                    : '?'}
              </span>
            </div>
          </div>

          {/* Choice buttons */}
          {gameStatus === 'playing' && (
            <div className="flex gap-3">
              {CHOICES.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => handleChoice(key)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-zinc-600 bg-zinc-800 px-5 py-3 text-white transition-all hover:border-indigo-500 hover:bg-zinc-700"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="flex w-full max-w-xs flex-col gap-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-1 text-sm"
                >
                  <span className="text-zinc-400">{i + 1}R</span>
                  <span>{CHOICES.find((c) => c.key === h.player)?.emoji}</span>
                  <span className={getResultColor(h.result)}>{getResultLabel(h.result)}</span>
                  <span>{CHOICES.find((c) => c.key === h.cpu)?.emoji}</span>
                </div>
              ))}
            </div>
          )}

          {gameStatus === 'finished' && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl font-black text-white">{getFinalMessage()}</p>
              <p className="text-zinc-400">
                {playerScore}승 {cpuScore}패
              </p>
              <button
                onClick={startGame}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-500"
              >
                다시 시작
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
