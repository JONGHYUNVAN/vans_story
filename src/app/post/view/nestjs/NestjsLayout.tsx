import { SiNestjs } from 'react-icons/si';
import { ReactNode } from 'react';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

interface NestjsLayoutProps {
  children: ReactNode;
  title?: string;
  isPreview?: boolean;
}

export default function NestjsLayout({ children, title }: NestjsLayoutProps) {
    return (
    <div className={`transition-all duration-300`}>
      <div className="left-auto min-h-screen bg-gradient-to-br from-[#3d0415] via-[#2a0110] to-[#1a000a] relative overflow-hidden">
        {/* Nest.js 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 256 255' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'%3E%3Cpath d='M160.227 182.262h-33.981l84.183-84.183-15.655-15.657-84.182 84.183v-33.98l99.84-99.84 15.656 15.657-65.86 65.86 65.86 65.86-15.656 15.657-50.215-50.216v36.659Z' fill='%23E0234E'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* 움직이는 그라데이션 효과 */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#E0234E10] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#E0234E08] via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        </div>
        
        {/* 글로우 효과 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#E0234E08] blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-[#E0234E05] blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        
        <div className="relative">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-[#333333] relative">
            {/* 배경 비디오 */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/80" />
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-30"
                >
                  <source src="/nestjs_background.webm" type="video/webm" />
                </video>
              </div>

            {title && (
              <div className="relative mb-8 pb-8 border-b border-[#333333]">
                <div className="flex items-center gap-3">
                  <SiNestjs className="w-8 h-8 text-[#E0234E]" />
                  <h1 className="text-2xl font-semibold text-white">{title}</h1>
                </div>
              </div>
            )}

            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 