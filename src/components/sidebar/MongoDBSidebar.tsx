'use client';

import { SiMongodb } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';
import { IconType } from 'react-icons';

export default function MongoDBSidebar() {
  // MongoDB에서는 아이콘을 특별한 방식으로 렌더링하는 함수
  const mongodbIconRenderer = (Icon: IconType, color: string) => (
    <Icon className="w-4 h-4 p-[1px] rounded-full bg-gradient-to-br from-[#3a2617] to-[#2c1d12]" style={{ color }} />
  );

  return (
    <BaseSidebar
      frameworkName="MongoDB"
      frameworkIcon={SiMongodb}
      frameworkColor="#C19A6B" // MongoDB 브라운 테마 색상
      frameworkPath="/post/view/mongodb"
      backgroundClasses="bg-gradient-to-br from-[#2c1d12] to-[#3a2617]"
      previewButtonBgClasses="bg-[#3a2617]/80 backdrop-blur-sm"
      sidebarContentBgClasses="bg-gradient-to-br from-[#2c1d12] to-[#3a2617]"
      textColorClasses="text-[#F5DEB3]"
      hoverStyles="hover:bg-[#C19A6B]/20"
      activeLinkStyles="text-white bg-[#C19A6B]/30"
      headerBgClasses="backdrop-blur-sm bg-[#3a2617]/80"
      borderClasses="border-[#C19A6B]/30"
      logoAnimation="transition-transform duration-300 group-hover:scale-110"
      iconRenderer={mongodbIconRenderer}
      headerHoverTextClass="hover:text-[#F5DEB3]"
      descriptionTextClass="text-[#D2B48C]"
      categoryTitleClass="text-[#E6C8A0]"
    />
  );
} 