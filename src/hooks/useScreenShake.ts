import { useState, useCallback, useRef } from 'react';

export interface UseScreenShakeReturn {
  shakeStyle: React.CSSProperties;
  triggerShake: (intensity?: number, duration?: number) => void;
}

export function useScreenShake(): UseScreenShakeReturn {
  const [shakeStyle, setShakeStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const triggerShake = useCallback((intensity: number = 8, duration: number = 400) => {
    cancelAnimationFrame(rafRef.current);

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      if (elapsed >= duration) {
        setShakeStyle({});
        return;
      }

      const progress = elapsed / duration;
      // Decaying amplitude
      const amplitude = intensity * (1 - progress);
      const tx = (Math.random() * 2 - 1) * amplitude;
      const ty = (Math.random() * 2 - 1) * amplitude;

      setShakeStyle({
        transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  return { shakeStyle, triggerShake };
}
