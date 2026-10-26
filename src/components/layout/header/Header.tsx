'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import dynamic from 'next/dynamic';

const LanguageSelector = dynamic(() => import('./LanguageSelector'), { ssr: false });
import AuthButtons from './AuthButtons';
import { useTranslation } from '@/lib/i18n';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/store/auth/slice';

interface HeaderProps {
  isStorybook?: boolean;
}

export default function Header({ isStorybook = false }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation('');
  const menuText = t('Header.headerMenu');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <header
      className={`${isStorybook ? 'relative' : 'fixed left-0 top-0'} w-full ${isHovered ? 'z-[100]' : 'z-[50]'} transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* '헤더 보기' 글씨 */}
      <div
        className={`absolute left-0 top-0 z-10 flex w-full transform items-center justify-center bg-transparent py-2 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'pointer-events-none opacity-0' : 'opacity-100'} `}
      >
        <span className="font-handwriting text-lg font-bold text-gray-300">{menuText}</span>
        <MdKeyboardArrowDown className="ml-2 h-5 w-5 animate-bounce text-gray-300" />
      </div>
      {/* 전체 헤더 */}
      <div
        className={`w-full transform border-b bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 ${isHovered ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'} `}
      >
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-800 transition-colors hover:text-blue-600"
          >
            {!isStorybook && <img src="/favicon.ico" alt="logo" className="h-6 w-6" />}
            <span>Van's Dev Blog</span>
          </Link>
          {/* 인사 문구 추가 */}
          <div className="flex-grow text-center">
            {isAuthenticated && (
              <span className="font-handwriting text-xl text-gray-600">
                <span className="inline-block animate-[twinkle_2s_ease-in-out_infinite]">⭐</span>
                {t('Header.greeting', { username: user?.email?.split('@')[0] })}
                <span className="inline-block animate-[twinkle_2s_ease-in-out_infinite]">⭐</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/stocks"
                className="flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600"
              >
                <span>📈</span>
                <span>주가</span>
              </Link>
              <Link
                href="/games"
                className="flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600"
              >
                <span>🎮</span>
                <span>게임</span>
              </Link>
              <Link
                href="/projects"
                className="text-gray-600 transition-colors hover:text-blue-600"
              >
                {t('Header.projects')}
              </Link>
              <Link
                href="/about-van"
                className="text-gray-600 transition-colors hover:text-blue-600"
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
    </header>
  );
}
