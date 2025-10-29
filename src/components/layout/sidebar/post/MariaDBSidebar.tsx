'use client';

import { SiMariadb } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';
import { IconType } from 'react-icons';

/**
 * MariaDB 전용 사이드바 컴포넌트
 * MariaDB의 다크 그레이 그라데이션 테마를 적용한 데이터베이스 스타일의 사이드바입니다.
 */
export default function MariaDBSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="MariaDB"                     // 사이드바 헤더에 표시될 이름
      frameworkValue="mariadb"                    // DB에서 조회할 프레임워크 값
      frameworkIcon={SiMariadb}                   // 헤더 아이콘 (MariaDB)
      frameworkColor="#2A3034"                    // 아이콘 색상 (MariaDB 다크 그레이)
      frameworkPath="/post/view/mariadb"          // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일 (MariaDB 다크 그레이 그라데이션)
      backgroundClasses="bg-gradient-to-br from-[#1A2024] to-[#2A3034]"        // 전체 배경색
      sidebarContentBgClasses="bg-gradient-to-br from-[#1A2024] to-[#2A3034]"  // 사이드바 콘텐츠 배경색
      headerBgClasses="backdrop-blur-sm bg-[#1A2024]/70"                       // 헤더 배경색
      previewButtonBgClasses="bg-[#1A2024]/70 backdrop-blur-sm"               // 미리보기 버튼 배경
      
      // 텍스트 스타일 (블루/그레이 톤)
      textColorClasses="text-[#A7B6BD]"           // 기본 텍스트 색상 (연한 블루 그레이)
      categoryTitleClass="text-[#8FA7AF]"         // 카테고리 제목 색상
      descriptionTextClass="text-[#7A868D]"      // 설명 텍스트 색상
      headerHoverTextClass="hover:text-white"     // 헤더 호버 시 텍스트 색상
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-white/10"             // 링크 호버 시 배경색 (흰색 투명)
      activeLinkStyles="text-white bg-white/10"   // 활성 링크 스타일
      
      // 테두리 및 애니메이션
      borderClasses="border-[#3A4044]/30"         // 테두리 색상
      logoAnimation="transition-transform duration-300 group-hover:scale-110" // 로고 애니메이션
      
      // 커스텀 아이콘 렌더러 (MariaDB 전용 스타일)
      iconRenderer={(Icon: IconType, color: string) => (
        <Icon 
          className="w-4 h-4 p-[1px] rounded-full bg-gradient-to-br from-[#3A4044] to-[#1A2024]" 
          style={{ color }} 
        />
      )}
    />
  );
} 