'use client';
import { useCallback, useSyncExternalStore } from 'react';

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

const EMPTY_SCORES: AllScores = {};
const EMPTY_GAME_DATA: GameScoreData = { bestScore: 0, bestDetail: undefined, history: [] };

// localStorage를 외부 스토어로 구독 (useSyncExternalStore)
// - 스냅샷은 raw 문자열이 바뀔 때만 다시 파싱해 참조 안정성을 유지한다
// - 서버/하이드레이션 시에는 빈 스냅샷을 돌려주고 클라이언트에서 실제 값으로 갱신된다
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedScores: AllScores = EMPTY_SCORES;

function parseScores(raw: string | null): AllScores {
  try {
    return raw ? (JSON.parse(raw) as AllScores) : EMPTY_SCORES;
  } catch {
    return EMPTY_SCORES;
  }
}

function getScoresSnapshot(): AllScores {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedScores = parseScores(raw);
  }
  return cachedScores;
}

function getServerScoresSnapshot(): AllScores {
  return EMPTY_SCORES;
}

function subscribeScores(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function loadAllScores(): AllScores {
  if (typeof window === 'undefined') return {};
  return { ...getScoresSnapshot() };
}

function saveAllScores(allScores: AllScores): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));
  } catch {
    // localStorage 저장 실패 시 무시
  }
  // 같은 탭의 구독자에게 변경 알림 (storage 이벤트는 다른 탭에서만 발생)
  listeners.forEach((listener) => listener());
}

export function useGameScores(gameId: string): UseGameScoresReturn {
  const allScores = useSyncExternalStore(
    subscribeScores,
    getScoresSnapshot,
    getServerScoresSnapshot,
  );
  const gameData = allScores[gameId] ?? EMPTY_GAME_DATA;

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
    },
    [gameId],
  );

  const clearScores = useCallback(() => {
    const allScores = loadAllScores();
    delete allScores[gameId];
    saveAllScores(allScores);
  }, [gameId]);

  return {
    bestScore: gameData.bestScore,
    bestDetail: gameData.bestDetail,
    history: gameData.history,
    saveScore,
    clearScores,
  };
}
