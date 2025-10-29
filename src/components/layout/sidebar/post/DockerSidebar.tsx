'use client';

import { SiDocker } from 'react-icons/si';
import BaseSidebar from '../base/BaseSidebar';

/**
 * Docker 전용 사이드바 컴포넌트
 * Docker의 블루 그라데이션 테마를 적용한 컨테이너 중심의 특별한 배경 레이어 스타일 사이드바입니다.
 */
export default function DockerSidebar() {
  return (
    <BaseSidebar
      // 기본 정보
      frameworkName="Docker"                      // 사이드바 헤더에 표시될 이름
      frameworkValue="docker"                     // DB에서 조회할 프레임워크 값
      frameworkIcon={SiDocker}                    // 헤더 아이콘 (Docker)
      frameworkColor="#2496ED"                    // 아이콘 색상 (Docker 블루)
      frameworkPath="/post/view/docker"           // 헤더 클릭 시 이동할 경로
      
      // 배경 스타일 (다크 블루 톤)
      sidebarContentBgClasses="bg-[#0d1117]"      // 사이드바 콘텐츠 배경색
      headerBgClasses="backdrop-blur-sm"          // 헤더 배경색 (블러 효과)
      previewButtonBgClasses="bg-[#0d1117] backdrop-blur-sm" // 미리보기 버튼 배경
      
      // 텍스트 스타일 (밝은 그레이 톤)
      textColorClasses="text-gray-300"            // 기본 텍스트 색상
      categoryTitleClass="text-gray-400"          // 카테고리 제목 색상
      descriptionTextClass="text-gray-500"       // 설명 텍스트 색상
      headerHoverTextClass="hover:text-[#2496ED]/80" // 헤더 호버 시 텍스트 색상 (연한 블루)
      
      // 인터랙션 스타일
      hoverStyles="hover:bg-slate-800/40"         // 링크 호버 시 배경색
      activeLinkStyles="text-white bg-slate-800/50" // 활성 링크 스타일
      
      // 테두리 및 애니메이션
      borderClasses="border-slate-700/40"         // 테두리 색상
      logoAnimation="transition-transform duration-300 group-hover:scale-105" // 로고 애니메이션
      
      // 커스텀 배경 레이어 렌더러 (Docker 전용 그라데이션 배경)
      backgroundLayerRenderer={() => (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#121920] to-[#0a1017] z-0"></div>
          {/* GitHub 아이콘 대신 단순 그라데이션 배경 사용 */}
        </>
      )}
    />
  );
} 