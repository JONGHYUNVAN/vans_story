'use client';

import { useEffect, useRef, useState } from 'react';

interface FlashOverlayProps {
  color?: string;
  duration?: number;
  active: boolean;
  onDone?: () => void;
}

export default function FlashOverlay({
  color = 'rgba(239,68,68,0.35)',
  duration = 300,
  active,
  onDone,
}: FlashOverlayProps) {
  const [opacity, setOpacity] = useState(0);
  const onDoneRef = useRef(onDone);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevActive = useRef(false);

  // 최신 onDone 콜백을 ref에 유지 (렌더 중 ref 쓰기 방지)
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (active && !prevActive.current) {
      // Rising edge: trigger flash
      setOpacity(1);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOpacity(0);
        onDoneRef.current?.();
      }, duration);
    }
    prevActive.current = active;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, duration]);

  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
        zIndex: 50,
        borderRadius: 'inherit',
        transition: `opacity ${duration}ms ease-out`,
      }}
    />
  );
}
