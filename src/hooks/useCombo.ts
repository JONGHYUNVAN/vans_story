'use client';

import { useRef } from 'react';

interface UseComboReturn {
  comboCount: number;
  comboLevel: number;
  increment: () => number;
  reset: () => void;
}

function calcLevel(count: number): number {
  if (count >= 20) return 5;
  if (count >= 15) return 4;
  if (count >= 10) return 3;
  if (count >= 6)  return 2;
  if (count >= 3)  return 1;
  return 0;
}

export function useCombo(): UseComboReturn {
  const comboCountRef = useRef(0);
  const comboLevelRef = useRef(0);

  const proxy = useRef<UseComboReturn>({
    get comboCount() { return comboCountRef.current; },
    get comboLevel() { return comboLevelRef.current; },
    increment() {
      comboCountRef.current += 1;
      const newLevel = calcLevel(comboCountRef.current);
      comboLevelRef.current = newLevel;
      return newLevel;
    },
    reset() {
      comboCountRef.current = 0;
      comboLevelRef.current = 0;
    },
  });

  return proxy.current;
}
