'use client';

import React from 'react';
import { Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BaseSidebar from './BaseSidebar';
import { IoIosArrowForward } from 'react-icons/io';
import { useTranslation } from '@/utils/i18n';
import { TbBinaryTree } from 'react-icons/tb';
import { RiCodeBoxLine } from 'react-icons/ri';
import { IconType } from 'react-icons';

// 알고리즘 아이콘 렌더링을 위한 커스텀 함수
const algorithmIconRenderer = (Icon: IconType, color: string) => {
  return (
    <div className={`
      relative flex items-center justify-center w-6 h-6 
      transition-colors duration-200 ease-in-out
      text-gray-600
    `}>
      <Icon className="w-5 h-5" />
    </div>
  );
};

export default function AlgorithmSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation('Algorithm');

  const frameworkName = 'Algorithm';
  const frameworkIcon = RiCodeBoxLine;
  const frameworkColor = '#6B7280';
  const frameworkPath = '/post/view/algorithm';

  // 사이드바 배경 클래스 정의
  const backgroundClasses = 'bg-white';
  const sidebarContentBgClasses = 'bg-white';

  // 링크 스타일 클래스 정의
  const textColorClasses = 'text-gray-700';
  const hoverStyles = 'hover:bg-gray-100';
  const activeLinkStyles = 'text-gray-900 bg-gray-100';

  // 설명 텍스트 클래스 정의
  const descriptionTextClass = 'text-gray-500';

  // 하이라이트 클래스 (활성화된 섹션을 위한)
  const headerHoverTextClass = 'hover:text-gray-900';

  // 카테고리 제목 클래스
  const categoryTitleClass = 'text-gray-700';

  // 버튼 스타일 클래스 정의
  const previewButtonBgClasses = 'bg-white shadow-sm';
  
  // 테두리 스타일
  const borderClasses = 'border-black';
  
  // 헤더 배경 스타일
  const headerBgClasses = 'bg-white';

  return (
    <BaseSidebar
      frameworkName={frameworkName}
      frameworkIcon={frameworkIcon}
      frameworkColor={frameworkColor}
      frameworkPath={frameworkPath}
      iconRenderer={algorithmIconRenderer}
      backgroundClasses={backgroundClasses}
      sidebarContentBgClasses={sidebarContentBgClasses}
      textColorClasses={textColorClasses}
      hoverStyles={hoverStyles}
      activeLinkStyles={activeLinkStyles}
      descriptionTextClass={descriptionTextClass}
      headerHoverTextClass={headerHoverTextClass}
      categoryTitleClass={categoryTitleClass}
      previewButtonBgClasses={previewButtonBgClasses}
      borderClasses={borderClasses}
      headerBgClasses={headerBgClasses}
    />
  );
} 