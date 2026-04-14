'use client';
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'vans_games_scores';
const MAX_HISTORY = 10;

export interface ScoreRecord {
  score: number;
  detail?: string;
  playedAt: string;
}

interface GameScoreData {
  bestScore: number;
  bestDetail?: string;
  history: ScoreRecord[];
}

type AllScores = Record<string, GameScoreData>;

export interface UseGameScoresReturn {
  bestScore: number;
  bestDetail?: string;
  history: ScoreRecord[];
  saveScore: (score: number, detail?: string) => void;
  clearScores: () => void;
}

function loadAllScores(): AllScores {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AllScores) : {};
  } catch {
    return {};
  }
}

function saveAllScores(allScores: AllScores): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));
  } catch {
    // localStorage 저장 실패 시 무시
  }
}

export function useGameScores(gameId: string): UseGameScoresReturn {
  const [gameData, setGameData] = useState<GameScoreData>({
    bestScore: 0,
    bestDetail: undefined,
    history: [],
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const allScores = loadAllScores();
    const data = allScores[gameId];
    if (data) {
      setGameData(data);
    }
  }, [gameId]);

  const saveScore = useCallback(
    (score: number, detail?: string) => {
      const allScores = loadAllScores();
      const current = allScores[gameId] ?? {
        bestScore: 0,
        bestDetail: undefined,
        history: [],
      };

      const newRecord: ScoreRecord = {
        score,
        detail,
        playedAt: new Date().toISOString(),
      };

      const newHistory = [newRecord, ...current.history].slice(0, MAX_HISTORY);
      const isBest = score > current.bestScore;

      const updated: GameScoreData = {
        bestScore: isBest ? score : current.bestScore,
        bestDetail: isBest ? detail : current.bestDetail,
        history: newHistory,
      };

      allScores[gameId] = updated;
      saveAllScores(allScores);
      setGameData(updated);
    },
    [gameId]
  );

  const clearScores = useCallback(() => {
    const allScores = loadAllScores();
    delete allScores[gameId];
    saveAllScores(allScores);
    setGameData({ bestScore: 0, bestDetail: undefined, history: [] });
  }, [gameId]);

  return {
    bestScore: gameData.bestScore,
    bestDetail: gameData.bestDetail,
    history: gameData.history,
    saveScore,
    clearScores,
  };
}
