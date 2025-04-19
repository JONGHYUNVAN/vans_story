'use client';

import { ReactNode } from 'react';
import { MdSecurity } from 'react-icons/md';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

interface JwtLayoutProps {
  children: ReactNode;
  title?: string;
  isPreview?: boolean;
}

export default function JWTLayout({ children, title, isPreview = false }: JwtLayoutProps) {
  const { shouldApplyMargin = false } = isPreview ? { shouldApplyMargin: false } : useSidebarMargin();

  return (
    <div className={`transition-all duration-300`}>
      <div className="left-auto min-h-screen bg-black relative overflow-hidden">
        {/* JWT 패턴 배경 - 실제 JWT 토큰 형태로 디자인 */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'%3E%3Ctext x='10' y='30' font-family='monospace' font-size='12' fill='%23FF3333'%3Eeyj0eXAiOiJKV1QiLCJhbG%3C/text%3E%3Ctext x='10' y='50' font-family='monospace' font-size='12' fill='%23FF3333'%3EnVzZXJuYW1lIjoiSm9obiIsImF%3C/text%3E%3Ctext x='10' y='70' font-family='monospace' font-size='12' fill='%23FF3333'%3ENuRXkwMHFPOUZPcmNsZk40RiI%3C/text%3E%3Cline x1='0' y1='35' x2='300' y2='35' stroke='%23FF3333' stroke-width='0.5' stroke-dasharray='2,2' /%3E%3Cline x1='0' y1='65' x2='300' y2='65' stroke='%23FF3333' stroke-width='0.5' stroke-dasharray='2,2' /%3E%3Ctext x='260' y='25' font-family='monospace' font-size='8' fill='%231E4D2B'%3Eheader%3C/text%3E%3Ctext x='260' y='55' font-family='monospace' font-size='8' fill='%231E4D2B'%3Epayload%3C/text%3E%3Ctext x='260' y='85' font-family='monospace' font-size='8' fill='%231E4D2B'%3Esignature%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '300px 100px'
        }} />

        <div className="relative">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-[#FF3333]/20 relative">
            {/* 배경 효과 */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/80" />
            </div>

            {title && (
              <div className="relative mb-8 pb-8 border-b border-[#FF3333]/20">
                <div className="flex items-center gap-3">
                  <MdSecurity className="w-8 h-8 text-[#1E4D2B]" />
                  <h1 className="text-2xl font-semibold text-white">{title}</h1>
                </div>
              </div>
            )}

            <div className="relative z-10 text-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 