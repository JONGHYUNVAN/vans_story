'use client';

import { SiNextdotjs } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';
import { IconType } from 'react-icons';

export default function NextSidebar() {
  // Next.js에서는 아이콘을 특별한 방식으로 렌더링
  const nextIconRenderer = (Icon: IconType, color: string) => (
    <Icon className="w-4 h-4 p-[1px] bg-white rounded-full" style={{ color }} />
  );

  return (
    <BaseSidebar
      frameworkName="Next"
      frameworkIcon={SiNextdotjs}
      frameworkColor="#000000"
      frameworkPath="/post/view/nextjs"
      textColorClasses="text-[#888888]"
      borderClasses="border-[#333333]"
      iconRenderer={nextIconRenderer}
    />
  );
} 