'use client';

import { MdSecurity } from 'react-icons/md';
import BaseSidebar from './BaseSidebar';
import { IconType } from 'react-icons';

export default function JWTSidebar() {
  const jwtIconRenderer = (Icon: IconType, color: string) => (
    <Icon className="w-4 h-4 text-[#1E4D2B]" />
  );

  return (
    <BaseSidebar
      frameworkName="JWT"
      frameworkIcon={MdSecurity}
      frameworkColor="#1E4D2B"
      frameworkPath="/post/view/jwt"
      backgroundClasses="bg-[#0A0A0A]"
      previewButtonBgClasses="bg-[#1A1A1A] border border-[#FF3333]/20"
      sidebarContentBgClasses="bg-[#0A0A0A]"
      textColorClasses="text-[#A0AEC0]"
      hoverStyles="hover:bg-[#1A1A1A] hover:border-[#1E4D2B] hover:text-[#1E4D2B]"
      activeLinkStyles="text-[#1E4D2B] bg-[#1A1A1A] border-[#1E4D2B]"
      headerBgClasses="bg-[#1A1A1A] border-b border-[#FF3333]/20"
      borderClasses="border-[#FF3333]/20"
      logoAnimation="transition-transform duration-300 group-hover:scale-110"
      iconRenderer={jwtIconRenderer}
      headerHoverTextClass="hover:text-[#1E4D2B]"
      descriptionTextClass="text-[#718096]"
      categoryTitleClass="text-[#1E4D2B]"
    />
  );
}