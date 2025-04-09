'use client';

import { SiDocker } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';

export default function DockerSidebar() {
  // Docker만의 특수 배경 레이어 렌더러
  const dockerBackgroundLayerRenderer = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#121920] to-[#0a1017] z-0"></div>
      {/* GitHub 아이콘 대신 단순 그라데이션 배경 사용 */}
    </>
  );

  return (
    <BaseSidebar
      frameworkName="Docker"
      frameworkIcon={SiDocker}
      frameworkColor="#2496ED"
      frameworkPath="/post/view/docker"
      previewButtonBgClasses="bg-[#0d1117] backdrop-blur-sm"
      sidebarContentBgClasses="bg-[#0d1117]"
      textColorClasses="text-gray-300"
      hoverStyles="hover:bg-slate-800/40"
      activeLinkStyles="text-white bg-slate-800/50"
      headerBgClasses="backdrop-blur-sm"
      borderClasses="border-slate-700/40"
      backgroundLayerRenderer={dockerBackgroundLayerRenderer}
      logoAnimation="transition-transform duration-300 group-hover:scale-105"
      headerHoverTextClass="hover:text-[#2496ED]/80"
      descriptionTextClass="text-gray-500"
      categoryTitleClass="text-gray-400"
    />
  );
} 