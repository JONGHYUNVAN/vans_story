'use client';

import { useEffect, useRef } from 'react';

/**
 * requestAnimationFrame 루프 래퍼.
 * `active`가 true인 동안 매 프레임 `callback(timestamp)`을 호출.
 * 콜백이 명시적으로 `false`를 반환하면 스스로 정지.
 * 언마운트 또는 active=false 전환 시 자동 cancel.
 * `timestamp`는 `requestAnimationFrame`이 제공하는 DOMHighResTimeStamp 원본.
 */
export function useGameLoop(
  callback: (timestamp: number) => boolean | void,
  active: boolean,
) {
  const cbRef = useRef(callback);
  const rafRef = useRef(0);

  useEffect(() => {
    cbRef.current = callback;
  });

  useEffect(() => {
    if (!active) return;

    const tick = (now: number) => {
      const cont = cbRef.current(now);
      if (cont === false) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);
}
