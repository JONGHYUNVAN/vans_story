'use client';

import { useState, useCallback } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';

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
  ) return 'win';
  return 'lose';
}

export default function RPSGame({ onGameEnd, onScoreChange }: GameComponentProps) {
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [history, setHistory] = useState<RoundHistory[]>([]);
  const [currentResult, setCurrentResult] = useState<RoundResult | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');

  const startGame = useCallback(() => {
    setRound(1);
    setPlayerScore(0);
    setCpuScore(0);
    setHistory([]);
    setCurrentResult(null);
    setCpuChoice(null);
    setPlayerChoice(null);
    setGameStatus('playing');
    onScoreChange(0);
  }, [onScoreChange]);

  const handleChoice = useCallback((choice: Choice) => {
    if (gameStatus !== 'playing') return;
    setGameStatus('animating');
    setPlayerChoice(choice);
    setCpuChoice(null);
    setCurrentResult(null);

    setTimeout(() => {
      const cpu = CPU_CHOICES[Math.floor(Math.random() * 3)];
      const result = getResult(choice, cpu);
      setCpuChoice(cpu);
      setCurrentResult(result);

      setHistory(prev => [...prev, { player: choice, cpu, result }]);

      let newPlayerScore = playerScore;
      let newCpuScore = cpuScore;
      let roundScore = 0;

      if (result === 'win') {
        newPlayerScore++;
        roundScore = 100;
      } else if (result === 'lose') {
        newCpuScore++;
        roundScore = 0;
      } else {
        roundScore = 50;
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
      } else {
        setTimeout(() => {
          setRound(r => r + 1);
          setGameStatus('playing');
        }, 1500);
      }
    }, 800);
  }, [gameStatus, playerScore, cpuScore, round, history, onGameEnd, onScoreChange]);

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
    <div className="flex flex-col items-center gap-4 p-4">
      {gameStatus === 'idle' ? (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-bold text-lg"
        >
          게임 시작
        </button>
      ) : (
        <>
          {/* Score header */}
          <div className="flex items-center gap-8 bg-gray-900 border border-gray-700 rounded-xl px-6 py-3">
            <div className="text-center">
              <p className="text-zinc-400 text-xs">나</p>
              <p className="text-white font-bold text-2xl">{playerScore}</p>
            </div>
            <div className="text-zinc-400 font-bold">
              라운드 {Math.min(round, 5)} / 5
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-xs">CPU</p>
              <p className="text-white font-bold text-2xl">{cpuScore}</p>
            </div>
          </div>

          {/* Current round display */}
          <div className="flex items-center gap-8 bg-gray-900 border border-gray-700 rounded-xl px-8 py-4 min-w-[280px] justify-center">
            <div className="text-center">
              <p className="text-zinc-400 text-xs mb-1">나</p>
              <span className="text-5xl">{playerChoice ? CHOICES.find(c => c.key === playerChoice)?.emoji : '?'}</span>
            </div>
            <div className="text-center">
              {gameStatus === 'animating' && !cpuChoice && (
                <p className="text-zinc-400 text-sm animate-pulse">생각 중...</p>
              )}
              {currentResult && (
                <p className={`font-black text-xl ${getResultColor(currentResult)}`}>
                  {getResultLabel(currentResult)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-xs mb-1">CPU</p>
              <span className="text-5xl">
                {gameStatus === 'animating' && !cpuChoice ? '❓' : cpuChoice ? CHOICES.find(c => c.key === cpuChoice)?.emoji : '?'}
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
                  className="flex flex-col items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-indigo-500 text-white rounded-xl px-5 py-3 transition-all"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="flex flex-col gap-1 w-full max-w-xs">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-zinc-800 rounded-lg px-3 py-1">
                  <span className="text-zinc-400">{i + 1}R</span>
                  <span>{CHOICES.find(c => c.key === h.player)?.emoji}</span>
                  <span className={getResultColor(h.result)}>{getResultLabel(h.result)}</span>
                  <span>{CHOICES.find(c => c.key === h.cpu)?.emoji}</span>
                </div>
              ))}
            </div>
          )}

          {gameStatus === 'finished' && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl font-black text-white">{getFinalMessage()}</p>
              <p className="text-zinc-400">{playerScore}승 {cpuScore}패</p>
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
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
