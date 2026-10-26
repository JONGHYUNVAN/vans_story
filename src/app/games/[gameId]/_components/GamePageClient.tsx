'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { getGameById } from '@/constants/games';
import { useGameScores } from '@/hooks/useGameScores';
import { useSound } from '@/hooks/useSound';
import { useBGM } from '@/hooks/useBGM';
import GameLayout from '@/components/features/games/GameLayout';
import ScorePanel from '@/components/features/games/ScorePanel';
const SnakeGame = dynamic(() => import('@/components/features/games/snake/SnakeGame'));
const Game2048 = dynamic(() => import('@/components/features/games/puzzle2048/Game2048'));
const MinesweeperGame = dynamic(() => import('@/components/features/games/minesweeper/MinesweeperGame'));
const TetrisGame = dynamic(() => import('@/components/features/games/tetris/TetrisGame'));
const FlappyGame = dynamic(() => import('@/components/features/games/flappy/FlappyGame'));
const BreakoutGame = dynamic(() => import('@/components/features/games/breakout/BreakoutGame'));
const MemoryGame = dynamic(() => import('@/components/features/games/memory/MemoryGame'));
const WhackaMoleGame = dynamic(() => import('@/components/features/games/whackamole/WhackaMoleGame'));
const WordleGame = dynamic(() => import('@/components/features/games/wordle/WordleGame'));
const SlidingPuzzleGame = dynamic(() => import('@/components/features/games/slidingpuzzle/SlidingPuzzleGame'));
const RPSGame = dynamic(() => import('@/components/features/games/rps/RPSGame'));
const ReactionGame = dynamic(() => import('@/components/features/games/reaction/ReactionGame'));

// 게임은 각자 수천 줄이라 선택한 게임의 코드만 내려받도록 전부 dynamic import.
// TypingGame은 Math.random() 기반 셔플을 사용하므로 SSR 비활성화
const TypingGame = dynamic(
  () => import('@/components/features/games/typing/TypingGame'),
  { ssr: false }
);

export interface GameComponentProps {
  onGameEnd: (score: number, detail?: string) => void;
  onScoreChange: (score: number) => void;
  onAction?: () => void;
  onMove?: () => void;
  onCombo?: (level: number) => void;
  onKeyClick?: () => void;
  onLongMode?: (active: boolean) => void;
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
  const [fullWidth, setFullWidth] = useState(false);
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
      fullWidth={fullWidth}
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
        onLongMode={gameId === 'typing' ? setFullWidth : undefined}
      />
    </GameLayout>
  );
}
