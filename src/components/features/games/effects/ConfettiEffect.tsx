'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  isCircle: boolean;
  rotateEnd: number;
}

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  count?: number;
}

const COLORS = ['#34d399', '#6366f1', '#facc15', '#f472b6', '#fb923c'];

function createPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const rotateDir = Math.random() > 0.5 ? 1 : -1;
    return {
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.floor(Math.random() * 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1200,
      duration: 1800 + Math.random() * 1200,
      isCircle: Math.random() > 0.5,
      rotateEnd: rotateDir * (360 + Math.random() * 360),
    };
  });
}

export default function ConfettiEffect({
  active,
  duration = 3000,
  count = 80,
}: ConfettiEffectProps) {
  const [pieces] = useState<ConfettiPiece[]>(() => createPieces(count));
  // active/duration 변경 시 다시 표시되도록 이전 값을 추적 (렌더 중 상태 조정 패턴)
  const [prevTrigger, setPrevTrigger] = useState({ active, duration });
  const [expired, setExpired] = useState(false);
  if (prevTrigger.active !== active || prevTrigger.duration !== duration) {
    setPrevTrigger({ active, duration });
    setExpired(false);
  }

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => {
      setExpired(true);
    }, duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  const visible = active && !expired;
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(var(--rotate-end)); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.x}%`,
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.6,
            borderRadius: p.isCircle ? '50%' : '2px',
            backgroundColor: p.color,
            // @ts-expect-error CSS custom properties
            '--rotate-end': `${p.rotateEnd}deg`,
            animation: `confetti-fall ${p.duration}ms ease-in ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
