'use client';

import { SiNestjs } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';

/**
 * NestJS 전용 사이드바 컴포넌트
 * NestJS의 빨간색 테마를 적용한 미니멀한 스타일의 사이드바입니다.
 */
export default function NestSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="Nestjs"                      // 사이드바 헤더에 표시될 이름
      frameworkValue="nestjs"                     // DB에서 조회할 프레임워크 값
      frameworkIcon={SiNestjs}                    // 헤더 아이콘 (NestJS)
      frameworkColor="#E0234E"                    // 아이콘 색상 (NestJS 빨간색)
      frameworkPath="/post/view/nestjs"           // 헤더 클릭 시 이동할 경로
      
      // 텍스트 스타일 (미니멀 다크 톤)
      textColorClasses="text-[#888888]"           // 기본 텍스트 색상 (회색)
      
      // 테두리
      borderClasses="border-[#333333]"            // 테두리 색상 (다크 그레이)
    />
  );
} 