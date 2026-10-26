'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * 사용자가 OS에서 "동작 줄이기"를 켰는지. 서버 렌더와 첫 하이드레이션은 false(영상 있음)로 맞춘다.
 * 배경 영상처럼 장식용 움직임을 끌 때 쓴다.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
