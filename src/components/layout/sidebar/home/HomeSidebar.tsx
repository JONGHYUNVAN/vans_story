'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useTranslation } from '@/lib/i18n';
import { POST_THEMES, POST_THEME_GROUPS } from '@/constants/postThemes';

export default function HomeSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('');
  const menuText = t('Sidebar.sidebarMenu');
  // 라우트가 있는 카테고리만 메뉴에 나온다
  const menuGroups = Object.entries(POST_THEME_GROUPS).map(([category, keys]) => ({
    category,
    items: keys.map((key) => POST_THEMES[key]),
  }));

  return (
    <div
      className={`${isOpen ? 'w-64' : 'w-16'} h-full transition-all duration-300`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 사이드바 미리보기 영역 - 마우스가 올라가지 않았을 때 보이는 부분 */}
      <div
        className={`absolute left-0 top-0 flex h-full w-16 transform items-center justify-center rounded-r-lg bg-transparent backdrop-blur-sm transition-all duration-300 ease-in-out ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'} `}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="writing-vertical ml-2 font-handwriting text-lg font-bold text-gray-300">
            {menuText}
          </span>
        </div>
        <MdKeyboardArrowRight className="h-5 w-5 animate-[bounce-right_1s_infinite] text-gray-300" />
      </div>
      {/* 사이드바 본체 - 마우스가 올라갔을 때 보이는 부분 */}
      <div
        className={`absolute left-0 top-0 h-full w-64 transform rounded-r-lg bg-white/80 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${
          isOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none -translate-x-64 opacity-0'
        } `}
      >
        <div className="border-b border-gray-200/50 p-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <img src="/favicon.ico" alt="logo" className="h-6 w-6" />
            <span>Van&apos;s Dev Blog</span>
          </Link>
        </div>

        <nav className="max-h-[calc(100vh-80px)] space-y-8 overflow-y-auto p-6">
          {menuGroups.map(({ category, items }) => (
            <div key={category} className="space-y-4">
              <h2 className="border-b pb-2 text-xl font-bold text-gray-800">{category}</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                        pathname.startsWith(item.path)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      } `}
                    >
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          pathname.startsWith(item.path)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:[&>path]:fill-[var(--icon-color)]'
                        } group-hover:scale-110`}
                        style={
                          {
                            '--icon-color': item.color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="font-medium group-hover:text-gray-900">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
