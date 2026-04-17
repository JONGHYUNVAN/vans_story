'use client';

import { useEffect, useRef } from 'react';

/**
 * setInterval 기반 타이머 래퍼.
 * `intervalMs`가 null이면 정지. 값 변경 시 기존 interval을 clear 하고 재시작.
 * 언마운트 시 자동 정리.
 */
export function useGameTimer(
  callback: () => void,
  intervalMs: number | null,
) {
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  });

  useEffect(() => {
    if (intervalMs == null) return;
    const id = setInterval(() => cbRef.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
