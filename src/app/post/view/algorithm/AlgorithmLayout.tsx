'use client';

import { ReactNode } from 'react';
import { RiCodeBoxLine } from 'react-icons/ri';

interface AlgorithmLayoutProps {
  children: ReactNode;
  title: string;
  showHeader?: boolean;
  isPreview?: boolean;
  className?: string;
}

export default function AlgorithmLayout({ 
  children, 
  title, 
  showHeader = true,
  isPreview = false,
  className = ''
}: AlgorithmLayoutProps) {
  return (
    <div className={`relative overflow-hidden ${isPreview ? 'h-auto' : 'min-h-screen'} ${className}`}>
      {/* 배경 레이어 */}
      <div className="absolute inset-0 bg-white z-0"></div>
      
      {/* 알고리즘 패턴 배경 */}
      <div className="absolute inset-0 opacity-[0.05] z-[1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23777777' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23777777'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='15' cy='45' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='45' r='2' fill='%23777777'/%3E%3Cpath d='M15 15 L30 30 M45 15 L30 30 M15 45 L30 30 M45 45 L30 30' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-[2]">
        <div className={`mx-auto max-w-5xl px-6 py-12 ${isPreview ? 'h-auto min-h-[300px]' : 'min-h-screen'} border-x border-black relative`}>
          {/* 배경 */}
          <div className="absolute inset-0 z-[-1]">
            <div className="absolute inset-0 bg-white" />
          </div>

          {/* 헤더 */}
          {showHeader && (
            <div className="relative mb-8 pb-8 border-b border-black">
              <div className="flex items-center gap-3">
                <RiCodeBoxLine className="w-8 h-8 text-gray-700" />
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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