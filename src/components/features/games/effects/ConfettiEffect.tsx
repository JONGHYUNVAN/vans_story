'use client';

import { useEffect, useRef, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  isCircle: boolean;
  rotateDir: number;
}

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  count?: number;
}

const COLORS = ['#34d399', '#6366f1', '#facc15', '#f472b6', '#fb923c'];

function createPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 6 + Math.floor(Math.random() * 8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1200,
    duration: 1800 + Math.random() * 1200,
    isCircle: Math.random() > 0.5,
    rotateDir: Math.random() > 0.5 ? 1 : -1,
  }));
}

export default function ConfettiEffect({
  active,
  duration = 3000,
  count = 80,
}: ConfettiEffectProps) {
  const [visible, setVisible] = useState(false);
  const [pieces] = useState<ConfettiPiece[]>(() => createPieces(count));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    } else {
      setVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, duration]);

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
      {pieces.map(p => (
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
            '--rotate-end': `${p.rotateDir * (360 + Math.random() * 360)}deg`,
            animation: `confetti-fall ${p.duration}ms ease-in ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
