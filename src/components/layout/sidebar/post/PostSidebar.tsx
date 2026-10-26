'use client';

import type { IconType } from 'react-icons';
import BaseSidebar from '@/components/layout/sidebar/base/BaseSidebar';
import { POST_LAYOUT_ICON_OVERRIDES, POST_THEMES, type PostThemeKey } from '@/constants/postThemes';

/**
 * 카테고리 페이지의 사이드바. 색·배경·아이콘 스타일은 theme.sidebar에서 온다.
 * (예전의 NextSidebar, NestSidebar … 9개 파일을 대체)
 */
export default function PostSidebar({ themeKey }: { themeKey: PostThemeKey }) {
  const theme = POST_THEMES[themeKey];
  const s = theme.sidebar;
  const Icon = POST_LAYOUT_ICON_OVERRIDES[theme.key] ?? theme.icon;

  const iconRenderer = (ItemIcon: IconType, color: string) => {
    switch (s.iconVariant) {
      case 'white-circle':
        return <ItemIcon className="h-4 w-4 rounded-full bg-white p-[1px]" style={{ color }} />;
      case 'gradient-circle':
        return (
          <ItemIcon
            className={`h-4 w-4 rounded-full p-[1px] ${s.iconGradientClass}`}
            style={{ color }}
          />
        );
      case 'fixed-color':
        return <ItemIcon className={`h-4 w-4 ${s.iconFixedColorClass}`} />;
      case 'boxed':
        return (
          <div className="relative flex h-6 w-6 items-center justify-center text-gray-600 transition-colors duration-200 ease-in-out">
            <ItemIcon className="h-5 w-5" />
          </div>
        );
      default:
        return <ItemIcon className="h-4 w-4" style={{ color }} />;
    }
  };

  return (
    <BaseSidebar
      frameworkName={s.name}
      frameworkValue={theme.key}
      frameworkIcon={Icon}
      frameworkColor={s.iconColor}
      frameworkPath={theme.path}
      textColorClasses={s.textColorClasses}
      borderClasses={s.borderClasses}
      sidebarContentBgClasses={s.sidebarContentBgClasses}
      headerBgClasses={s.headerBgClasses}
      previewButtonBgClasses={s.previewButtonBgClasses}
      categoryTitleClass={s.categoryTitleClass}
      descriptionTextClass={s.descriptionTextClass}
      headerHoverTextClass={s.headerHoverTextClass}
      hoverStyles={s.hoverStyles}
      activeLinkStyles={s.activeLinkStyles}
      logoAnimation={s.logoAnimation}
      iconRenderer={iconRenderer}
      backgroundLayerRenderer={
        s.backgroundGradientClass
          ? () => <div className={`absolute inset-0 z-0 ${s.backgroundGradientClass}`} />
          : undefined
      }
    />
  );
}
