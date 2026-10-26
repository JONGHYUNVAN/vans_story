'use client';

import { useEffect, useState } from 'react';

export function BackgroundElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-purple-900/50">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive glow effect */}
      <div
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Geometric shapes */}
      <div className="absolute left-1/4 top-1/4 h-32 w-32 rotate-45 animate-pulse border border-blue-400/20" />
      <div className="absolute bottom-1/4 right-1/4 h-24 w-24 rotate-12 animate-pulse border border-purple-400/20" />
      <div
        className="absolute right-1/3 top-1/2 h-16 w-16 animate-bounce rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
}
