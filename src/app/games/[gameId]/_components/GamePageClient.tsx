'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getGameById } from '@/constants/games';
import { useGameScores } from '@/hooks/useGameScores';
import { useSound } from '@/hooks/useSound';
import { useBGM } from '@/hooks/useBGM';
import GameLayout from '@/components/features/games/GameLayout';
import ScorePanel from '@/components/features/games/ScorePanel';
import SnakeGame from '@/components/features/games/snake/SnakeGame';
import Game2048 from '@/components/features/games/puzzle2048/Game2048';
import TypingGame from '@/components/features/games/typing/TypingGame';
import MinesweeperGame from '@/components/features/games/minesweeper/MinesweeperGame';
import TetrisGame from '@/components/features/games/tetris/TetrisGame';
import FlappyGame from '@/components/features/games/flappy/FlappyGame';
import BreakoutGame from '@/components/features/games/breakout/BreakoutGame';
import MemoryGame from '@/components/features/games/memory/MemoryGame';
import WhackaMoleGame from '@/components/features/games/whackamole/WhackaMoleGame';
import WordleGame from '@/components/features/games/wordle/WordleGame';
import SlidingPuzzleGame from '@/components/features/games/slidingpuzzle/SlidingPuzzleGame';
import RPSGame from '@/components/features/games/rps/RPSGame';
import ReactionGame from '@/components/features/games/reaction/ReactionGame';

export interface GameComponentProps {
  onGameEnd: (score: number, detail?: string) => void;
  onScoreChange: (score: number) => void;
  onAction?: () => void;
  onMove?: () => void;
  onCombo?: (level: number) => void;
  onKeyClick?: () => void;
}

const GAME_COMPONENTS: Record<string, React.ComponentType<GameComponentProps>> = {
  snake: SnakeGame,
  '2048': Game2048,
  typing: TypingGame,
  minesweeper: MinesweeperGame,
  tetris: TetrisGame,
  flappy: FlappyGame,
  breakout: BreakoutGame,
  memory: MemoryGame,
  whackamole: WhackaMoleGame,
  wordle: WordleGame,
  slidingpuzzle: SlidingPuzzleGame,
  rps: RPSGame,
  reaction: ReactionGame,
};

interface GamePageClientProps {
  gameId: string;
}

export default function GamePageClient({ gameId }: GamePageClientProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const { bestScore, bestDetail, history, saveScore } = useGameScores(gameId);
  const {
    playScore, playGameOver,
    playJump, playHit, playLineClear, playMatch, playPing,
    playMoveTick, playKeyClick, playCombo, playSelect,
    isMuted, toggleMute,
  } = useSound();

  // BGM — 게임별 고유 배경음악
  useBGM(gameId, isMuted);

  // 점수 사운드 스로틀 (연속 호출 방지)
  const lastScoreSoundRef = useRef(0);
  const lastScoreRef = useRef(0);
  // 점수 UI 업데이트 rAF 스로틀 (프레임당 최대 1회 리렌더)
  const pendingScoreRef = useRef<number | null>(null);
  const scoreRafRef = useRef(0);

  useEffect(() => () => {
    if (scoreRafRef.current) cancelAnimationFrame(scoreRafRef.current);
  }, []);

  const game = getGameById(gameId);
  const GameComponent = GAME_COMPONENTS[gameId];

  // 게임별 onAction 사운드 매핑
  const actionSoundMap: Record<string, (() => void) | undefined> = {
    flappy: playJump,
    whackamole: playHit,
    tetris: playLineClear,
    memory: playMatch,
    reaction: playPing,
    minesweeper: playSelect,
    breakout: playHit,
    rps: playSelect,
    slidingpuzzle: playMoveTick,
    wordle: playKeyClick,
  };

  const handleGameEnd = useCallback((score: number, detail?: string) => {
    if (scoreRafRef.current) {
      cancelAnimationFrame(scoreRafRef.current);
      scoreRafRef.current = 0;
      pendingScoreRef.current = null;
    }
    saveScore(score, detail);
    setCurrentScore(score);
    playGameOver();
  }, [saveScore, playGameOver]);

  const handleScoreChange = useCallback((score: number) => {
    const now = Date.now();
    if (score > lastScoreRef.current && now - lastScoreSoundRef.current > 150) {
      playScore();
      lastScoreSoundRef.current = now;
    }
    lastScoreRef.current = score;

    pendingScoreRef.current = score;
    if (scoreRafRef.current) return;
    scoreRafRef.current = requestAnimationFrame(() => {
      scoreRafRef.current = 0;
      if (pendingScoreRef.current !== null) {
        setCurrentScore(pendingScoreRef.current);
        pendingScoreRef.current = null;
      }
    });
  }, [playScore]);

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen bg-[#08080b] flex items-center justify-center">
        <p className="text-zinc-400">게임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <GameLayout
      gameId={gameId}
      currentScore={currentScore}
      isMuted={isMuted}
      onToggleMute={toggleMute}
      scorePanel={
        <ScorePanel
          currentScore={currentScore}
          bestScore={bestScore}
          bestDetail={bestDetail}
          history={history}
        />
      }
    >
      <GameComponent
        onGameEnd={handleGameEnd}
        onScoreChange={handleScoreChange}
        onAction={actionSoundMap[gameId]}
        onMove={['snake', '2048', 'tetris', 'slidingpuzzle'].includes(gameId) ? playMoveTick : undefined}
        onCombo={playCombo}
        onKeyClick={['typing', 'wordle'].includes(gameId) ? playKeyClick : undefined}
      />
    </GameLayout>
  );
}
