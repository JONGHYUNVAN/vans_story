'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import LanguageSelector from './LanguageSelector';
import AuthButtons from './AuthButtons';
import { useTranslation } from '@/utils/i18n';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [menuText, setMenuText] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    setMenuText(t('Header.headerMenu'));
  }, [t]);

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* '헤더 보기' 글씨 */}
      <div className={`
        absolute top-0 left-0 w-full 
        flex items-center justify-center py-2
        bg-transparent backdrop-blur-sm
        transform transition-all duration-300
        ${isHovered ? 'opacity-0' : 'opacity-100'}
      `}>
        <span className="text-lg font-bold text-white/70 font-handwriting">{menuText}</span>
        <MdKeyboardArrowDown className="ml-2 w-5 h-5 text-white/70 animate-bounce" />
      </div>

      {/* 전체 헤더 */}
      <div className={`
        w-full bg-white/80 backdrop-blur-md border-b shadow-sm
        transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}>
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
  <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
  Van's Dev Blog
          </Link>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/projects" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('Header.projects')}
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('Header.aboutVan')}
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <AuthButtons />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
} 