'use client';

import { useState } from 'react';
import { getGameById } from '@/constants/games';
import { useGameScores } from '@/hooks/useGameScores';
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

  const game = getGameById(gameId);
  const GameComponent = GAME_COMPONENTS[gameId];

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen bg-[#08080b] flex items-center justify-center">
        <p className="text-zinc-400">게임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleGameEnd = (score: number, detail?: string) => {
    saveScore(score, detail);
    setCurrentScore(score);
  };

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
  };

  return (
    <GameLayout
      gameId={gameId}
      currentScore={currentScore}
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
      />
    </GameLayout>
  );
}
