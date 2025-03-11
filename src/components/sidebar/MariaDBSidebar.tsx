'use client';

import { SiMariadb } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';
import { IconType } from 'react-icons';

export default function MariaDBSidebar() {
  // MariaDB에서는 아이콘을 특별한 방식으로 렌더링하는 함수
  const mariadbIconRenderer = (Icon: IconType, color: string) => (
    <Icon className="w-4 h-4 p-[1px] rounded-full bg-gradient-to-br from-[#3A4044] to-[#1A2024]" style={{ color }} />
  );

  return (
    <BaseSidebar
      frameworkName="MariaDB"
      frameworkIcon={SiMariadb}
      frameworkColor="#2A3034" // MariaDB 다크 그레이 색상
      frameworkPath="/post/view/mariadb"
      backgroundClasses="bg-gradient-to-br from-[#1A2024] to-[#2A3034]"
      previewButtonBgClasses="bg-[#1A2024]/70 backdrop-blur-sm"
      sidebarContentBgClasses="bg-gradient-to-br from-[#1A2024] to-[#2A3034]"
      textColorClasses="text-[#A7B6BD]"
      hoverStyles="hover:bg-white/10"
      activeLinkStyles="text-white bg-white/10"
      headerBgClasses="backdrop-blur-sm bg-[#1A2024]/70"
      borderClasses="border-[#3A4044]/30"
      logoAnimation="transition-transform duration-300 group-hover:scale-110"
      iconRenderer={mariadbIconRenderer}
      headerHoverTextClass="hover:text-white"
      descriptionTextClass="text-[#7A868D]"
      categoryTitleClass="text-[#8FA7AF]"
    />
  );
} 