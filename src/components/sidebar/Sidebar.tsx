'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from '@/utils/i18n';
import MainSidebar from './MainSidebar';
import NextSidebar from './NextSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const menuText = t('Sidebar.sidebarMenu');

  return (
    <aside 
      className="fixed left-0 top-0 h-full z-[20] 
        w-64 
        lg:w-64 lg:translate-x-0 
        max-lg:w-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 사이드바 미리보기 영역 - 마우스가 올라가지 않았을 때 보이는 부분 */}
      <div className={`
        absolute left-0 top-0 h-full w-16
        lg:hidden
        flex items-center justify-center
        bg-transparent
        transform transition-all duration-300
        ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <div className="flex flex-col items-center gap-2">
          <span className="ml-2 text-lg font-bold text-white/70 font-handwriting writing-vertical">
            {menuText}
          </span>
        </div>
        <MdKeyboardArrowRight className="w-5 h-5 text-white/70 animate-[bounce-right_1s_infinite]" />
      </div>

      {/* 사이드바 본체 - 마우스가 올라갔을 때 보이는 부분 */}
      <div className={`
        w-full h-full
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto
        ${isHovered 
          ? 'translate-x-0' 
          : '-translate-x-[calc(100%-1rem)] pointer-events-none opacity-0'}
      `}>
        {pathname.startsWith('/post/view/frontend/nextjs') ? <NextSidebar /> : <MainSidebar />}
      </div>
    </aside>
  );
} 
