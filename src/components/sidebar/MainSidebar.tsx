'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from '@/utils/i18n';
import { categories } from './categories';

export default function MainSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const menuText = t('Sidebar.sidebarMenu');
  
  return (
    <div 
      className="w-64 h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 사이드바 미리보기 영역 - 마우스가 올라가지 않았을 때 보이는 부분 */}
      <div className={`
        absolute left-0 top-0 h-full w-16
        flex items-center justify-center
        bg-black/30 backdrop-blur-sm rounded-r-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
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
        absolute top-0 left-0 w-64 h-full
        bg-white/80 backdrop-blur-md shadow-lg rounded-r-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : '-translate-x-64 opacity-0 pointer-events-none'
        }
      `}>
        <div className="p-4 border-b border-gray-200/50">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-800"
          >
            <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
            Van's Dev Blog
          </Link>
        </div>

        <nav className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                {category}
              </h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.path}>
                    <Link 
                      href={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 group
                        ${pathname.startsWith(item.path)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon 
                        className={`w-5 h-5 transition-all duration-200
                          ${pathname.startsWith(item.path)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:[&>path]:fill-[var(--icon-color)]'
                          }
                          group-hover:scale-110
                        `} 
                        style={{ 
                          '--icon-color': item.color
                        } as React.CSSProperties}
                      />
                      <span className={`font-medium group-hover:text-gray-900`}>
                        {item.name}
                      </span>
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