'use client';

import { SiMongodb } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';
import { IconType } from 'react-icons';

/**
 * MongoDB 전용 사이드바 컴포넌트
 * MongoDB의 브라운 그라데이션 테마를 적용한 특별한 스타일의 사이드바입니다.
 */
export default function MongoDBSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="MongoDB"                     // 사이드바 헤더에 표시될 이름
      frameworkIcon={SiMongodb}                   // 헤더 아이콘 (MongoDB)
      frameworkColor="#C19A6B"                    // 아이콘 색상 (MongoDB 브라운)
      frameworkPath="/post/view/mongodb"          // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일 (MongoDB 브라운 그라데이션)
      backgroundClasses="bg-gradient-to-br from-[#2c1d12] to-[#3a2617]"        // 전체 배경색
      sidebarContentBgClasses="bg-gradient-to-br from-[#2c1d12] to-[#3a2617]"  // 사이드바 콘텐츠 배경색
      headerBgClasses="backdrop-blur-sm bg-[#3a2617]/80"                       // 헤더 배경색
      previewButtonBgClasses="bg-[#3a2617]/80 backdrop-blur-sm"               // 미리보기 버튼 배경
      
      // 텍스트 스타일 (밝은 브라운 톤)
      textColorClasses="text-[#F5DEB3]"           // 기본 텍스트 색상 (베이지)
      categoryTitleClass="text-[#E6C8A0]"         // 카테고리 제목 색상
      descriptionTextClass="text-[#D2B48C]"      // 설명 텍스트 색상 (연한 브라운)
      headerHoverTextClass="hover:text-[#F5DEB3]" // 헤더 호버 시 텍스트 색상
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-[#C19A6B]/20"         // 링크 호버 시 배경색
      activeLinkStyles="text-white bg-[#C19A6B]/30" // 활성 링크 스타일
      
      // 테두리 및 애니메이션
      borderClasses="border-[#C19A6B]/30"         // 테두리 색상
      logoAnimation="transition-transform duration-300 group-hover:scale-110" // 로고 애니메이션
      
      // 커스텀 아이콘 렌더러 (MongoDB 전용 스타일)
      iconRenderer={(Icon: IconType, color: string) => (
        <Icon 
          className="w-4 h-4 p-[1px] rounded-full bg-gradient-to-br from-[#3a2617] to-[#2c1d12]" 
          style={{ color }} 
        />
      )}
    />
  );
} 