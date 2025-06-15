'use client';

import React from 'react';
import BaseSidebar from '../base/BaseSidebar';
import { RiCodeBoxLine } from 'react-icons/ri';
import { IconType } from 'react-icons';

/**
 * 알고리즘 전용 사이드바 컴포넌트
 * 알고리즘의 깔끔한 화이트 테마를 적용한 미니멀한 스타일의 사이드바입니다.
 */
export default function AlgorithmSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="Algorithm"                    // 사이드바 헤더에 표시될 이름
      frameworkIcon={RiCodeBoxLine}               // 헤더 아이콘
      frameworkColor="#6B7280"                    // 아이콘 색상 (회색)
      frameworkPath="/post/view/algorithm"        // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일
      backgroundClasses="bg-white"                // 전체 배경색 (흰색)
      sidebarContentBgClasses="bg-white"          // 사이드바 콘텐츠 배경색
      headerBgClasses="bg-white"                  // 헤더 배경색
      previewButtonBgClasses="bg-white shadow-sm" // 미리보기 버튼 배경 (그림자 포함)
      
      // 텍스트 스타일
      textColorClasses="text-gray-700"            // 기본 텍스트 색상
      categoryTitleClass="text-gray-700"          // 카테고리 제목 색상
      descriptionTextClass="text-gray-500"       // 설명 텍스트 색상 (연한 회색)
      headerHoverTextClass="hover:text-gray-900"  // 헤더 호버 시 텍스트 색상
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-gray-100"             // 링크 호버 시 배경색
      activeLinkStyles="text-gray-900 bg-gray-100" // 활성 링크 스타일
      
      // 테두리
      borderClasses="border-black"                // 테두리 색상 (검정)
      
      // 커스텀 아이콘 렌더러 (알고리즘 전용 스타일)
      iconRenderer={(Icon: IconType, color: string) => (
        <div className="relative flex items-center justify-center w-6 h-6 transition-colors duration-200 ease-in-out text-gray-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    />
  );
} 