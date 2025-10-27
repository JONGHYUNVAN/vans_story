'use client';

import { useEffect, useRef, useCallback } from 'react';

interface WavePoint {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  timestamp: number;
}

interface AdvancedCursorRippleProps {
  className?: string;
  waveColor?: string;
  maxWaves?: number;
  waveSpeed?: number;
  maxRadius?: number;
  enabled?: boolean;
}

/**
 * Canvas 기반의 고급 커서 물결 효과 컴포넌트
 * 더 부드럽고 자연스러운 물리 기반 애니메이션
 */
export default function AdvancedCursorRipple({
  className = '',
  waveColor = '#9333ea',
  maxWaves = 8,
  waveSpeed = 2,
  maxRadius = 150,
  enabled = true
}: AdvancedCursorRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<WavePoint[]>([]);
  const animationFrameRef = useRef<number>();
  const lastMouseMoveRef = useRef<number>(0);

  const createWave = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 100) return; // 100ms 간격으로 제한
    lastMouseMoveRef.current = now;

    const newWave: WavePoint = {
      x,
      y,
      radius: 0,
      maxRadius: maxRadius + Math.random() * 50,
      opacity: 0.6,
      speed: waveSpeed + Math.random() * 1,
      timestamp: now
    };

    wavesRef.current.push(newWave);
    
    // 최대 파도 개수 제한
    if (wavesRef.current.length > maxWaves) {
      wavesRef.current.shift();
    }
  }, [maxRadius, waveSpeed, maxWaves]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 조정
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // 캔버스 클리어
    ctx.clearRect(0, 0, rect.width, rect.height);

    const now = Date.now();
    
    // 파도 업데이트 및 렌더링
    wavesRef.current = wavesRef.current.filter(wave => {
      const age = now - wave.timestamp;
      const progress = wave.radius / wave.maxRadius;
      
      // 파도 확장
      wave.radius += wave.speed;
      
      // 투명도 감소
      wave.opacity = Math.max(0, 0.6 * (1 - progress));
      
      // 파도가 최대 크기에 도달하거나 투명해지면 제거
      if (wave.radius >= wave.maxRadius || wave.opacity <= 0.01) {
        return false;
      }

      // 파도 렌더링
      ctx.save();
      
      // 그라데이션 생성
      const gradient = ctx.createRadialGradient(
        wave.x, wave.y, 0,
        wave.x, wave.y, wave.radius
      );
      
      const color = hexToRgb(waveColor);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity * 0.3})`);
      gradient.addColorStop(0.8, `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      // 원형 파도 그리기
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 외곽선 효과
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${wave.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
      return true;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [enabled, waveColor]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 모바일 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 캔버스 영역 밖이면 무시
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      
      createWave(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        createWave(x, y);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        createWave(x, y);
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    // 데스크톱에서는 전체 문서에서 마우스 이벤트 감지, 모바일에서는 터치 이벤트
    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    }
    
    window.addEventListener('resize', handleResize);
    
    // 초기 크기 설정
    handleResize();
    
    // 애니메이션 시작
    animate();

    return () => {
      if (!isMobile) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      } else {
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, createWave, animate]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ 
        zIndex: 2,
        mixBlendMode: 'screen' // 블렌드 모드로 더 자연스러운 효과
      }}
    />
  );
}

// 헬퍼 함수: hex 색상을 RGB로 변환
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 147, g: 51, b: 234 }; // 기본값: purple-600
}
