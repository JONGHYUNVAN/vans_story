'use client';

import { ReactNode } from 'react';
import { SiSpring } from 'react-icons/si';

interface SpringLayoutProps {
  children: ReactNode;
  title: string;
  showHeader?: boolean;
  isPreview?: boolean;
  className?: string;
}

export default function SpringLayout({ 
  children, 
  title, 
  showHeader = true,
  isPreview = false,
  className = ''
}: SpringLayoutProps) {
  return (
    <div className={`relative overflow-hidden ${isPreview ? 'h-auto' : 'min-h-screen'} ${className}`}>
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-[#0c1511] z-0"></div>
      
      {/* Spring 로고 패턴 배경 */}
      <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M91.8 28.6C86.9 16.8 77.5 7.4 65.7 2.5 59.9 0.2 53.7-0.5 47.6 0.3 41.5 1.1 35.7 3.4 30.6 7 25.5 10.6 21.3 15.4 18.2 21 15.1 26.6 13.3 32.8 12.9 39.2 12.5 45.6 13.6 52 16.1 57.9 18.6 63.8 22.3 69.1 27 73.4 31.7 77.7 37.2 81 43.2 83.1 49.2 85.2 55.6 86 62 85.6 68.4 85.2 74.6 83.4 80.2 80.3 85.8 77.2 90.6 73 94.2 67.9 97.8 62.8 100.1 57 100.9 50.9 101.7 44.8 101 38.6 98.7 32.8 93.8 21 84.4 11.6 72.6 6.7L91.8 28.6Z' fill='%236DB33F'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* 움직이는 그라데이션 효과 */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#6DB33F08] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#6DB33F05] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
      </div>

      <div className="relative z-[2]">
        <div className={`mx-auto max-w-5xl px-6 py-12 ${isPreview ? 'h-auto min-h-[300px]' : 'min-h-screen'} border-x border-slate-700/30 relative`}>
          {/* 배경 */}
          <div className="absolute inset-0 z-[-1]">
            <div className="absolute inset-0 bg-[#0c1511]" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source src="/spring_background.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/70" />
          </div>

          {/* 헤더 */}
          {showHeader && (
            <div className="relative mb-8 pb-8 border-b border-slate-700/40">
              <div className="flex items-center gap-3">
                <SiSpring className="w-8 h-8 text-[#6DB33F]" />
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
              </div>
            </div>
          )}

          {/* 컨텐츠 */}
          <div className="relative z-10 text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 