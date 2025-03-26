import { SiMariadb } from 'react-icons/si';
import { ReactNode } from 'react';
import { useSidebarMargin } from '@/hooks/useSidebarMargin';

interface MariadbLayoutProps {
  children: ReactNode;
  title?: string;
  isPreview?: boolean;
}

export default function MariadbLayout({ children, title, isPreview = false }: MariadbLayoutProps) {
  const { shouldApplyMargin = false } = isPreview ? { shouldApplyMargin: false } : useSidebarMargin();

  return (
    <div className={`transition-all duration-300 ${!isPreview && shouldApplyMargin ? 'ml-0 lg:ml-64' : ''}`}>
      <div className="left-auto min-h-screen bg-[#0c1511] relative overflow-hidden">
        {/* 배경 레이어 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2024] to-[#212A2E] z-0"></div>
        
        {/* MariaDB ER 다이어그램 패턴 */}
        <div className="absolute inset-0 opacity-[0.15] z-[1]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300A1CB' stroke-width='1.5'%3E%3Ccircle cx='15' cy='15' r='6' /%3E%3Ccircle cx='65' cy='15' r='6' /%3E%3Ccircle cx='15' cy='65' r='6' /%3E%3Ccircle cx='65' cy='65' r='6' /%3E%3Cpath d='M22 15 L58 15' stroke-dasharray='3,3' /%3E%3Cpath d='M15 22 L15 58' stroke-dasharray='3,3' /%3E%3Cpath d='M22 65 L58 65' stroke-dasharray='3,3' /%3E%3Cpath d='M65 22 L65 58' stroke-dasharray='3,3' /%3E%3Crect x='35' y='35' width='10' height='10' stroke='%2300A1CB' fill='%2300A1CB' fill-opacity='0.2' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }} />
        
        <div className="relative z-[2]">
          <div className="mx-auto max-w-5xl px-6 py-12 min-h-screen border-x border-slate-700/30 relative">
            {/* 배경 비디오 */}
            {!isPreview && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/80" />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-30"
                >
                  <source src="/mariadb_background.webm" type="video/webm" />
                </video>
              </div>
            )}

            {title && (
              <div className="relative mb-8 pb-8 border-b border-blue-700/30">
                <div className="flex items-center gap-3">
                  <SiMariadb className="w-8 h-8 text-[#003545]" />
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