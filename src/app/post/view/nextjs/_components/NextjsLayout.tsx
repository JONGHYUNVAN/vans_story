'use client';

import { SiNextdotjs } from 'react-icons/si';
import type { ReactNode } from 'react';

interface NextjsLayoutProps {
  children: ReactNode;
  title?: string;
  isPreview?: boolean;
}

export default function NextjsLayout({ children, title }: NextjsLayoutProps) {
  return (
    <div className="transition-all duration-300">
      <div className="relative left-auto min-h-screen overflow-hidden bg-black">
        {/* 그리드 배경 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(#80808015 1px, transparent 1px), radial-gradient(#80808015 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        <div className="relative">
          <div className="relative mx-auto min-h-screen max-w-5xl border-x border-[#333333] px-6 py-12">
            {/* 배경 비디오 */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/80" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover opacity-30"
              >
                <source src="/nextjs_background.webm" type="video/webm" />
              </video>
            </div>

            {title && (
              <div className="relative mb-8 border-b border-[#333333] pb-8">
                <div className="flex items-center gap-3">
                  <SiNextdotjs className="h-8 w-8" />
                  <h1 className="text-2xl font-semibold text-white">{title}</h1>
                </div>
              </div>
            )}

            <div className="relative z-10 text-white">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
