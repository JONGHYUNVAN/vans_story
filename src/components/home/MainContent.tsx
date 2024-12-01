'use client';

/**
 * 메인 콘텐츠 컴포넌트
 * - 블로그 소개와 기술 스택 정보를 표시
 * - 그리드 패턴 배경과 카드 형태의 레이아웃
 * - 기술 스택별 아이콘과 호버 효과 포함
 */
import styles from './MainContent.module.css';
import { FaReact, FaLaptopCode } from "react-icons/fa";
import { TbBrandNextjs } from "react-icons/tb";
import { BiServer } from "react-icons/bi";
import { SiSpringboot } from "react-icons/si";
import { useTranslation } from '@/utils/i18n';
import { useState, useEffect } from 'react';


export default function MainContent() {
  const { t, locale, changeLocale } = useTranslation(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // 또는 로딩 상태를 보여줄 수 있습니다
  }
  
  // 기술 스택 정보 배열 - 아이콘과 이름 정의
  const techStacks = [
    { name: 'Frontend', icon: <FaLaptopCode className="text-blue-400" /> },
    { name: 'Backend', icon: <BiServer className="text-gray-400" /> },
    { name: 'React', icon: <FaReact className="text-blue-400" /> },
    { name: 'Next.js', icon: <TbBrandNextjs className="text-white" /> },
    { name: 'Spring Boot', icon: <SiSpringboot className="text-green-400" /> },
  ];

  return (
    <section className="relative bg-gray-900 w-full py-16">
      {/* 배경 그리드 패턴 */}
      <div className={`absolute inset-0 ${styles.bgGridPattern} opacity-[0.05]`} />
      
      {/* 메인 컨텐츠 컨테이너 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
          {/* 섹션 제목 */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-blue-400" />
            <h2 className="text-2xl font-bold text-white">{t('home.blogIntro')}</h2>
          </div>

          {/* 소개 텍스트 영역 */}
          <div className="text-lg leading-relaxed space-y-6 text-gray-300">
            {/* 인사말 */}
            <p className="flex items-center gap-2">
              <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
              {t('home.welcome')}
            </p>
            
            {/* 기술 스택 소개 */}
            <div className="pl-6 border-l-2 border-gray-600">
              <p className="mb-4">
                {t('home.techIntro')}
              </p>
              {/* 기술 스택 태그 목록 */}
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech) => (
                  <span 
                    key={tech.name} 
                    className="px-3 py-1 bg-gray-700 text-sm rounded-full text-gray-200 flex items-center gap-1 border border-gray-600 hover:bg-gray-600 transition-colors"
                  >
                    {tech.icon}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* 마무리 메시지 */}
            <p className="text-right italic text-gray-400">
              {t('home.expectation')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 