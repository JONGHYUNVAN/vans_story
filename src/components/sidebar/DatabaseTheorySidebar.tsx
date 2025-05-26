'use client';

import React from 'react';
import BaseSidebar from './BaseSidebar';
import { TbDatabase } from 'react-icons/tb';
import { IconType } from 'react-icons';

// 데이터베이스 이론 아이콘 렌더링을 위한 커스텀 함수
const databaseTheoryIconRenderer = (Icon: IconType, color: string) => {
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

export default function DatabaseTheorySidebar() {
  const frameworkName = 'DatabaseTheory';
  const frameworkIcon = TbDatabase;
  const frameworkColor = '#2563EB';
  const frameworkPath = '/post/view/database-theory';

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
      iconRenderer={databaseTheoryIconRenderer}
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