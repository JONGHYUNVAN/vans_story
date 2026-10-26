'use client';

import { SiMongodb } from 'react-icons/si';
import { ReactNode } from 'react';

interface MongodbLayoutProps {
  children: ReactNode;
  title?: string;
  isPreview?: boolean;
}

export default function MongodbLayout({ children, title, isPreview = false }: MongodbLayoutProps) {
  return (
      <div className="left-auto min-h-screen bg-[#2c1d12] relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ba8448] to-[#8b5e2f] z-0"></div>
        
        {/* MongoDB 로고 패턴 */}
        <div className="absolute inset-0 opacity-[0.15] z-[1]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.802-.436-1.222-.174-.978-.314-1.974-.314-2.968 0-.314.07-.628.027-.94-.09-.706-.44-1.318-.98-1.82-.82-.766-1.9-.98-2.934-.57-.52.2-1.02.436-1.494.7-.315.174-.54.383-.834.366-.37-.006-.62-.296-.796-.575-.81-1.322-1.02-2.7-1.004-4.142.012-.94.314-1.796.664-2.645.836-2.022 2.08-3.784 3.743-5.18C12.46 6.782 13.67 6.15 15.065 6.15c.313 0 .627.727.94.122z' fill='%23f0d8a8'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="relative z-[2]">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-[#A67C52]/30 relative">
            {/* 배경 비디오 */}
            {!isPreview && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/70" />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-75"
                >
                  <source src="/mongodb_background.webm" type="video/webm" />
                </video>
              </div>
            )}

            {title && (
              <div className="relative mb-8 pb-8 border-b border-[#A67C52]/30">
                <div className="flex items-center gap-3">
                  <SiMongodb className="w-8 h-8 text-[#C19A6B]" />
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
  );
} 