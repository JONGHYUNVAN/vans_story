'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import LanguageSelector from './LanguageSelector';
import AuthButtons from './AuthButtons';
import { useTranslation } from '@/utils/i18n';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/store/auth/slice';

interface HeaderProps {
  isStorybook?: boolean;
}

export default function Header({ isStorybook = false }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {user,isAuthenticated} = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation('');
  const menuText = t('Header.headerMenu');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    (<header 
        className={`${isStorybook ? 'relative' : 'fixed top-0 left-0'} w-full ${isHovered ? 'z-[100]' : 'z-[50]'} transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* '헤더 보기' 글씨 */}
      <div className={`
        absolute top-0 left-0 w-full z-10
        flex items-center justify-center py-2
        bg-transparent backdrop-blur-sm
        transform transition-all duration-300
        ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <span className="text-lg font-bold text-gray-300 font-handwriting">{menuText}</span>
        <MdKeyboardArrowDown className="ml-2 w-5 h-5 text-gray-300 animate-bounce" />
      </div>
      {/* 전체 헤더 */}
      <div className={`
        w-full bg-white/80 backdrop-blur-md border-b shadow-sm 
        transform transition-all duration-300
        ${isHovered ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
      `}>
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            {!isStorybook && <img src="/favicon.ico" alt="logo" className="w-6 h-6" />}
            <span>Van's Dev Blog</span>
          </Link>
          {/* 인사 문구 추가 */}
          <div className="flex-grow text-center">
            {isAuthenticated && ( 
              <span className="text-gray-600 font-handwriting text-xl">
                <span className="inline-block animate-[twinkle_2s_ease-in-out_infinite]">⭐</span>
                {t('Header.greeting', { username: user?.email?.split('@')[0] })}
                <span className="inline-block animate-[twinkle_2s_ease-in-out_infinite]">⭐</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/projects"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('Header.projects')}
              </Link>
              <Link
                href="/aboutVan"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
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
    </header>)
  );
} 