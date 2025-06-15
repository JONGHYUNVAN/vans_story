'use client';

import { SiNextdotjs } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';
import { IconType } from 'react-icons';

/**
 * Next.js 전용 사이드바 컴포넌트
 * Next.js의 블랙 테마를 적용한 미니멀한 스타일의 사이드바입니다.
 */
export default function NextSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="Nextjs"                      // 사이드바 헤더에 표시될 이름
      frameworkIcon={SiNextdotjs}                 // 헤더 아이콘 (Next.js)
      frameworkColor="#000000"                    // 아이콘 색상 (블랙)
      frameworkPath="/post/view/nextjs"           // 헤더 클릭 시 이동할 경로
      
      // 텍스트 스타일 (미니멀 다크 톤)
      textColorClasses="text-[#888888]"           // 기본 텍스트 색상 (회색)
      
      // 테두리
      borderClasses="border-[#333333]"            // 테두리 색상 (다크 그레이)
      
      // 커스텀 아이콘 렌더러 (Next.js 전용 스타일 - 흰색 원형 배경)
      iconRenderer={(Icon: IconType, color: string) => (
        <Icon 
          className="w-4 h-4 p-[1px] bg-white rounded-full" 
          style={{ color }} 
        />
      )}
    />
  );
} 