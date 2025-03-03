'use client';

import { usePathname } from 'next/navigation';
import MainSidebar from './MainSidebar';
import NextSidebar from './NextSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const isNextjsPage = pathname.startsWith('/post/view/frontend/nextjs');
  
  return (
    <aside className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      {isNextjsPage ? <NextSidebar /> : <MainSidebar />}
    </aside>
  );
}
