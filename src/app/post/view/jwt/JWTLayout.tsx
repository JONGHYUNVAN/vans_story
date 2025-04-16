'use client';

import { ReactNode } from 'react';
import { MdSecurity } from 'react-icons/md';

interface JwtLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  isPreview?: boolean;
  className?: string;
}

export default function JWTLayout({
  children,
  title,
  showHeader = true,
  isPreview = false,
  className = '',
}: JwtLayoutProps) {
  return (
    <div className={`min-h-screen bg-[#0A0A0A] ${className}`}>
      {showHeader && !isPreview && (
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1E4D2B]/20 backdrop-blur-sm mb-4 border border-[#FF3333]/20">
                <MdSecurity className="h-8 w-8 text-[#1E4D2B]" />
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {title || 'JWT'}
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-[#88A8A8] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                JSON Web Token에 대한 포스트를 확인하세요
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
} 