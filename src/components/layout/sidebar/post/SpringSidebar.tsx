'use client';

import { SiSpring } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';

/**
 * Spring 전용 사이드바 컴포넌트
 * Spring의 그린 그라데이션 테마를 적용한 특별한 배경 레이어 스타일의 사이드바입니다.
 */
export default function SpringSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="Spring"                      // 사이드바 헤더에 표시될 이름
      frameworkValue="spring"                     // DB에서 조회할 프레임워크 값
      frameworkIcon={SiSpring}                    // 헤더 아이콘 (Spring)
      frameworkColor="#6DB33F"                    // 아이콘 색상 (Spring 그린)
      frameworkPath="/post/view/spring"           // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일 (다크 그린 톤)
      sidebarContentBgClasses="bg-[#0c1511]"      // 사이드바 콘텐츠 배경색
      headerBgClasses="backdrop-blur-sm"          // 헤더 배경색 (블러 효과)
      previewButtonBgClasses="bg-[#0c1511] backdrop-blur-sm" // 미리보기 버튼 배경
      
      // 텍스트 스타일 (밝은 그레이 톤)
      textColorClasses="text-gray-300"            // 기본 텍스트 색상
      categoryTitleClass="text-gray-400"          // 카테고리 제목 색상
      descriptionTextClass="text-gray-500"       // 설명 텍스트 색상
      headerHoverTextClass="hover:text-[#9DE67E]/80" // 헤더 호버 시 텍스트 색상 (연한 그린)
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-slate-800/40"         // 링크 호버 시 배경색
      activeLinkStyles="text-white bg-slate-800/50" // 활성 링크 스타일
      
      // 테두리 및 애니메이션
      borderClasses="border-slate-700/40"         // 테두리 색상
      logoAnimation="transition-transform duration-300 group-hover:scale-105" // 로고 애니메이션
      
      // 커스텀 배경 레이어 렌더러 (Spring 전용 그라데이션 배경)
      backgroundLayerRenderer={() => (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#2f3b22] to-[#0a100d] z-0"></div>
          <div className="absolute inset-0 opacity-5 bg-[url('/spring-pattern.png')] bg-repeat z-0"></div>
        </>
      )}
    />
  );
} 