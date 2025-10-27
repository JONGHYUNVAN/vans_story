'use client';

import { useEffect, useRef, useState } from 'react';

interface RipplePoint {
  x: number;
  y: number;
  timestamp: number;
  id: number;
}

interface CursorRippleProps {
  className?: string;
  rippleColor?: string;
  rippleSize?: number;
  rippleDuration?: number;
  maxRipples?: number;
}

/**
 * 커서 움직임에 따라 물결 효과를 생성하는 컴포넌트
 * 2025년 스타일의 모던한 인터랙티브 효과
 */
export default function CursorRipple({
  className = '',
  rippleColor = 'rgba(147, 51, 234, 0.3)', // purple-600 with opacity
  rippleSize = 100,
  rippleDuration = 1000,
  maxRipples = 5
}: CursorRippleProps) {
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    let animationFrame: number;
    let lastMouseMove = 0;
    const throttleDelay = 50; // 50ms 간격으로 물결 생성 제한

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMove < throttleDelay) return;
      lastMouseMove = now;

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 컨테이너 영역 밖이면 무시
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      setMousePosition({ x, y });

      // 새로운 물결 추가
      const newRipple: RipplePoint = {
        x,
        y,
        timestamp: now,
        id: rippleIdRef.current++
      };

      setRipples(prev => {
        const filtered = prev.filter(ripple => now - ripple.timestamp < rippleDuration);
        const newRipples = [...filtered, newRipple];
        return newRipples.slice(-maxRipples); // 최대 개수 제한
      });
    };

    const handleMouseLeave = () => {
      // 마우스가 영역을 벗어나면 기존 물결들을 서서히 제거
      setTimeout(() => {
        setRipples([]);
      }, rippleDuration / 2);
    };

    // 전체 문서에서 마우스 이벤트 감지
    document.addEventListener('mousemove', handleMouseMove);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // 만료된 물결 정리
    const cleanupRipples = () => {
      const now = Date.now();
      setRipples(prev => prev.filter(ripple => now - ripple.timestamp < rippleDuration));
      animationFrame = requestAnimationFrame(cleanupRipples);
    };
    animationFrame = requestAnimationFrame(cleanupRipples);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [rippleDuration, maxRipples]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* 커서 따라다니는 글로우 효과 */}
      <div
        className="absolute w-32 h-32 rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: `radial-gradient(circle, ${rippleColor} 0%, transparent 70%)`,
          opacity: 0.3,
          transform: 'scale(0.8)',
        }}
      />

      {/* 물결 효과들 */}
      {ripples.map((ripple) => {
        const age = Date.now() - ripple.timestamp;
        const progress = Math.min(age / rippleDuration, 1);
        const scale = 0.1 + progress * 2;
        const opacity = Math.max(0, 1 - progress);

        return (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - rippleSize / 2,
              top: ripple.y - rippleSize / 2,
              width: rippleSize,
              height: rippleSize,
              background: `radial-gradient(circle, transparent 30%, ${rippleColor} 50%, transparent 70%)`,
              transform: `scale(${scale})`,
              opacity,
              transition: 'none',
            }}
          />
        );
      })}

      {/* 추가 파티클 효과 */}
      {ripples.slice(-2).map((ripple) => {
        const age = Date.now() - ripple.timestamp;
        const progress = Math.min(age / (rippleDuration * 0.6), 1);
        const particles = Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const distance = progress * 60;
          const x = ripple.x + Math.cos(angle) * distance;
          const y = ripple.y + Math.sin(angle) * distance;
          const opacity = Math.max(0, 1 - progress);

          return (
            <div
              key={`${ripple.id}-particle-${i}`}
              className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{
                left: x,
                top: y,
                background: rippleColor,
                opacity: opacity * 0.6,
                transform: `scale(${1 - progress})`,
              }}
            />
          );
        });

        return particles;
      })}
    </div>
  );
}
