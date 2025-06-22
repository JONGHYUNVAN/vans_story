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
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
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
        className="absolute w-96 h-96 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-400/20 rotate-45 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-purple-400/20 rotate-12 animate-pulse" />
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-bounce" 
           style={{ animationDuration: '3s' }} />
    </div>
  );
} 