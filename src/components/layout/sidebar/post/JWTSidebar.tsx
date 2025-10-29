'use client';

import { MdSecurity } from 'react-icons/md';
import BaseSidebar from '../base/BaseSidebar';
import { IconType } from 'react-icons';

/**
 * JWT 전용 사이드바 컴포넌트
 * JWT 보안의 다크 그린 테마를 적용한 보안 중심의 스타일 사이드바입니다.
 */
export default function JWTSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="JWT"                         // 사이드바 헤더에 표시될 이름
      frameworkValue="jwt"                        // DB에서 조회할 프레임워크 값
      frameworkIcon={MdSecurity}                  // 헤더 아이콘 (보안 아이콘)
      frameworkColor="#1E4D2B"                    // 아이콘 색상 (다크 그린)
      frameworkPath="/post/view/jwt"              // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일 (다크 블랙 톤)
      backgroundClasses="bg-[#0A0A0A]"            // 전체 배경색 (매우 어두운 검정)
      sidebarContentBgClasses="bg-[#0A0A0A]"      // 사이드바 콘텐츠 배경색
      headerBgClasses="bg-[#1A1A1A] border-b border-[#FF3333]/20"  // 헤더 배경색 (빨간 테두리)
      previewButtonBgClasses="bg-[#1A1A1A] border border-[#FF3333]/20" // 미리보기 버튼 배경
      
      // 텍스트 스타일 (그레이/그린 톤)
      textColorClasses="text-[#A0AEC0]"           // 기본 텍스트 색상 (연한 그레이)
      categoryTitleClass="text-[#1E4D2B]"         // 카테고리 제목 색상 (다크 그린)
      descriptionTextClass="text-[#718096]"      // 설명 텍스트 색상 (중간 그레이)
      headerHoverTextClass="hover:text-[#1E4D2B]" // 헤더 호버 시 텍스트 색상
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-[#1A1A1A] hover:border-[#1E4D2B] hover:text-[#1E4D2B]" // 링크 호버 시 스타일
      activeLinkStyles="text-[#1E4D2B] bg-[#1A1A1A] border-[#1E4D2B]" // 활성 링크 스타일
      
      // 테두리 및 애니메이션
      borderClasses="border-[#FF3333]/20"         // 테두리 색상 (빨간색 투명)
      logoAnimation="transition-transform duration-300 group-hover:scale-110" // 로고 애니메이션
      
      // 커스텀 아이콘 렌더러 (JWT 전용 스타일)
      iconRenderer={(Icon: IconType, color: string) => (
        <Icon className="w-4 h-4 text-[#1E4D2B]" />
      )}
    />
  );
}