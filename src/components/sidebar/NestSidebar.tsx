'use client';

import { SiNestjs } from 'react-icons/si';
import BaseSidebar from './BaseSidebar';
import { IconType } from 'react-icons';

export default function NestSidebar() {
  return (
    <BaseSidebar
      frameworkName="Nestjs"
      frameworkIcon={SiNestjs}
      frameworkColor="#E0234E"
      frameworkPath="/post/view/nestjs"
      textColorClasses="text-[#888888]"
      borderClasses="border-[#333333]"
    />
  );
} 