'use client';

import { ReactNode } from 'react';
import { SiDocker } from 'react-icons/si';

interface DockerLayoutProps {
  children: ReactNode;
  title: string;
  showHeader?: boolean;
  isPreview?: boolean;
  className?: string;
}

export default function DockerLayout({ 
  children, 
  title, 
  showHeader = true,
  isPreview = false,
  className = ''
}: DockerLayoutProps) {
  return (
    <div className={`relative overflow-hidden ${isPreview ? 'h-auto' : 'min-h-screen'} ${className}`}>
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-[#0d1117] z-0"></div>
      
      {/* Docker 로고 패턴 배경 */}
      <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M15,30h25v25h-25z M45,30h25v25h-25z M75,30h25v25h-25z M15,60h25v25h-25z M45,60h25v25h-25z M75,60h25v25h-25z' fill='%232496ED'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />
      
      {/* 움직이는 그라데이션 효과 */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#2496ED08] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#2496ED05] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
      </div>

      <div className="relative z-[2]">
        <div className={`mx-auto max-w-5xl px-6 py-12 ${isPreview ? 'h-auto min-h-[300px]' : 'min-h-screen'} border-x border-slate-700/30 relative`}>
          {/* 배경 */}
          <div className="absolute inset-0 z-[-1]">
            <div className="absolute inset-0 bg-[#0d1117]" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/docker_background.webm" type="video/webm" />
            </video>
          </div>

          {/* 헤더 */}
          {showHeader && (
            <div className="relative mb-8 pb-8 border-b border-slate-700/40">
              <div className="flex items-center gap-3">
                <SiDocker className="w-8 h-8 text-[#2496ED]" />
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
              </div>
            </div>
          )}

          {/* 컨텐츠 */}
          {children}
        </div>
      </div>
    </div>
  );
} 