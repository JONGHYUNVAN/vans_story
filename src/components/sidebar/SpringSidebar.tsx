'use client';

import { SiSpring } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';

export default function SpringSidebar() {
  // Spring만의 특수 배경 레이어 렌더러
  const springBackgroundLayerRenderer = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#2f3b22] to-[#0a100d] z-0"></div>
      <div className="absolute inset-0 opacity-5 bg-[url('/spring-pattern.png')] bg-repeat z-0"></div>
    </>
  );

  return (
    <BaseSidebar
      frameworkName="Spring"
      frameworkIcon={SiSpring}
      frameworkColor="#6DB33F"
      frameworkPath="/post/view/spring"
      previewButtonBgClasses="bg-[#0c1511] backdrop-blur-sm"
      sidebarContentBgClasses="bg-[#0c1511]"
      textColorClasses="text-gray-300"
      hoverStyles="hover:bg-slate-800/40"
      activeLinkStyles="text-white bg-slate-800/50"
      headerBgClasses="backdrop-blur-sm"
      borderClasses="border-slate-700/40"
      backgroundLayerRenderer={springBackgroundLayerRenderer}
      logoAnimation="transition-transform duration-300 group-hover:scale-105"
      headerHoverTextClass="hover:text-[#9DE67E]/80"
      descriptionTextClass="text-gray-500"
      categoryTitleClass="text-gray-400"
    />
  );
} 