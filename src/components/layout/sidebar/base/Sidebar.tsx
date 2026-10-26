'use client';

import { usePathname } from 'next/navigation';
import MainSidebar from '@/components/layout/sidebar/home/HomeSidebar';
import PostSidebar from '@/components/layout/sidebar/post/PostSidebar';
import { POST_THEME_KEYS } from '@/constants/postThemes';

export default function Sidebar() {
  const pathname = usePathname();

  // /stocks, /games 관련 페이지에선 사이드바 미표시
  if (pathname.startsWith('/stocks') || pathname.startsWith('/games')) return null;

  const themeKey = POST_THEME_KEYS.find((key) => pathname.startsWith(`/post/view/${key}`));

  return (
    <aside className="fixed left-0 top-0 z-[30] h-full overflow-hidden transition-all duration-300 hover:z-[110]">
      {themeKey ? <PostSidebar themeKey={themeKey} /> : <MainSidebar />}
    </aside>
  );
}
