'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  opacity: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  color?: string;
  count?: number;
  onDone?: () => void;
}

export default function ParticleEffect({
  x,
  y,
  color = '#34d399',
  count = 8,
  onDone,
}: ParticleEffectProps) {
  const onDoneRef = useRef(onDone);

  // 최신 onDone 콜백을 ref에 유지 (렌더 중 ref 쓰기 방지)
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDoneRef.current?.();
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // 파티클 랜덤 값은 마운트 시 한 번만 생성 (렌더 중 Math.random 호출 방지)
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (360 / count) * i,
      distance: 20 + Math.random() * 20,
      size: 4 + Math.floor(Math.random() * 5),
      opacity: 0.8 + Math.random() * 0.2,
    })),
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <style>{`
        @keyframes particle-fly {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: p.opacity,
              // @ts-expect-error CSS custom properties
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animation: 'particle-fly 600ms ease-out forwards',
            }}
          />
        );
      })}
    </div>
  );
}
