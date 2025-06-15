'use client';

import { usePathname } from 'next/navigation';
import MainSidebar from '../home/HomeSidebar';
import { THEME_SIDEBARS } from '../../../../interfaces/post/categories';

export default function Sidebar() {
  const pathname = usePathname();
  const currentTheme = Object.keys(THEME_SIDEBARS).find(theme => 
    pathname.startsWith(`/post/view/${theme}`)
  );

  const SidebarComponent = currentTheme ? THEME_SIDEBARS[currentTheme as keyof typeof THEME_SIDEBARS] : MainSidebar;

  return (
    <aside className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      <SidebarComponent />
    </aside>
  );
}
