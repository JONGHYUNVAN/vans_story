'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from '@/utils/i18n';
import { SiNextdotjs } from "react-icons/si";

export default function NextSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        const isSmall = window.innerWidth < 1280;
        setIsSmallScreen(isSmall);
        setIsOpen(!isSmall);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'SiNextdotjs':
        return SiNextdotjs;
      default:
        return SiNextdotjs;
    }
  };
  
  return (
    <div 
      className="w-64 h-full"
      onMouseEnter={() => {
        if (isSmallScreen) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (isSmallScreen) setIsOpen(false);
      }}
    >
      {/* 작은 화면에서만 보이는 미리보기 버튼 */}
      <div className={`
        absolute left-0 top-0 h-full w-16
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm rounded-r-lg
        transform transition-all duration-300 ease-in-out
        ${!isSmallScreen || isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <div className="flex flex-col items-center gap-2">
          <span className="ml-2 text-lg font-bold text-white/70 font-handwriting writing-vertical">
            Next.js
          </span>
        </div>
        <MdKeyboardArrowRight className="w-5 h-5 text-white/70 animate-[bounce-right_1s_infinite]" />
      </div>

      {/* 사이드바 본체 */}
      <div className={`
        absolute top-0 left-0 w-64 h-full
        bg-black text-[#888888] border-r border-[#333333] rounded-r-lg overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : '-translate-x-64 opacity-0 pointer-events-none'
        }
      `}>
        <div className="p-4 border-b border-[#333333] backdrop-blur-sm bg-black/30">
          <Link 
            href="/post/view/nextjs" 
            className="flex items-center gap-2 text-xl font-bold text-white/90 hover:text-white transition-colors duration-300"
          >
            <SiNextdotjs className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
            Next.js
          </Link>
        </div>

        <nav className="px-3 py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {Object.entries(t('Next.categories')).map(([categoryKey, category]: [string, any]) => (
            <div key={categoryKey} className="mb-8">
              <h2 className="mb-4 px-4 text-sm font-semibold tracking-wide text-[#666666] uppercase">
                {category.title}
              </h2>
              <div className="space-y-3">
                {Object.entries(category.items).map(([itemKey, item]: [string, any]) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <div key={itemKey} className="space-y-1">
                      <Link 
                        href={item.path}
                        className={`group block px-4 py-1.5 rounded-md transition-all duration-300 ease-in-out hover:bg-white/5 ${
                          pathname === item.path ? 'text-white bg-white/5' : 'text-[#888888]'
                        }`}
                      >
                        <span className="transition-colors duration-300 group-hover:text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 p-[1px] bg-white rounded-full" style={{ color: item.color }} />
                          {item.title}
                        </span>
                      </Link>
                      <p className="px-4 py-1 text-xs text-[#666666] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
} 