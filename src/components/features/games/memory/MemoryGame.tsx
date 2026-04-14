'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';

const CARD_ICONS = ['🐍', '🔢', '⌨️', '💣', '🟦', '🐦', '🧱', '🃏'];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameStatus = 'idle' | 'playing' | 'won';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const icons = [...CARD_ICONS, ...CARD_ICONS];
  return shuffle(icons).map((icon, idx) => ({
    id: idx,
    icon,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryGame({ onGameEnd, onScoreChange, onAction }: GameComponentProps) {
  const [cards, setCards] = useState<Card[]>(createCards());
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const [flashActive, setFlashActive] = useState(false);
  const [flashColor, setFlashColor] = useState('rgba(52,211,153,0.2)');
  const [confettiActive, setConfettiActive] = useState(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const startGame = useCallback(() => {
    stopTimer();
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatchCount(0);
    setTime(0);
    setGameStatus('playing');
    lockRef.current = false;
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    onScoreChange(0);
  }, [stopTimer, onScoreChange]);

  const handleCardClick = useCallback((id: number) => {
    if (gameStatus !== 'playing') return;
    if (lockRef.current) return;
    const card = cards[id];
    if (card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedIds, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.icon === secondCard.icon) {
        // Match
        onAction?.();
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, isMatched: true, isFlipped: true }
            : c
        ));
        const newMatchCount = matchCount + 1;
        setMatchCount(newMatchCount);
        setFlippedIds([]);
        lockRef.current = false;
        setFlashColor('rgba(52,211,153,0.2)');
        setFlashActive(true);

        if (newMatchCount >= 8) {
          stopTimer();
          setGameStatus('won');
          const score = Math.max(0, 1000 - (moves + 1) * 10 - time * 2);
          onScoreChange(score);
          onGameEnd(score, `이동: ${moves + 1}회, 시간: ${time}초`);
          setConfettiActive(true);
        }
      } else {
        // No match — flip back
        setFlashColor('rgba(239,68,68,0.15)');
        setFlashActive(true);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedIds([]);
          lockRef.current = false;
        }, 800);
      }
    }
  }, [cards, flippedIds, gameStatus, matchCount, moves, time, stopTimer, onGameEnd, onScoreChange]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 relative">
      <ConfettiEffect active={confettiActive} duration={2500} />
      <FlashOverlay
        active={flashActive}
        color={flashColor}
        duration={300}
        onDone={() => setFlashActive(false)}
      />
      {/* Stats */}
      <div className="flex gap-6 bg-gray-900 border border-gray-700 rounded-xl px-6 py-3">
        <span className="text-white">이동: <span className="font-mono font-bold">{moves}</span></span>
        <span className="text-white">쌍: <span className="font-mono font-bold text-emerald-400">{matchCount}/8</span></span>
        <span className="text-white">시간: <span className="font-mono font-bold">{time}s</span></span>
      </div>

      {gameStatus === 'won' && (
        <div className="text-emerald-400 font-bold text-lg">완성! 점수: {Math.max(0, 1000 - moves * 10 - time * 2)}</div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          let cardClass = 'w-16 h-16 sm:w-[72px] sm:h-[72px] flex items-center justify-center text-2xl rounded-lg cursor-pointer border-2 transition-all duration-200 select-none ';
          if (card.isMatched) {
            cardClass += 'bg-emerald-900 border-emerald-500';
          } else if (card.isFlipped) {
            cardClass += 'bg-indigo-900 border-indigo-500';
          } else {
            cardClass += 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600';
          }
          return (
            <div
              key={card.id}
              className={cardClass}
              onClick={() => handleCardClick(card.id)}
              style={{
                transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {card.isFlipped || card.isMatched ? card.icon : '?'}
            </div>
          );
        })}
      </div>

      {gameStatus === 'idle' && (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2 font-bold"
        >
          게임 시작
        </button>
      )}
      {gameStatus === 'won' && (
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 py-2"
        >
          다시 시작
        </button>
      )}
      {gameStatus === 'playing' && (
        <p className="text-zinc-500 text-sm">카드를 클릭해 같은 쌍을 찾으세요</p>
      )}
    </div>
  );
}
