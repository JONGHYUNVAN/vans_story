import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import type { IconType } from 'react-icons';
import { useTranslation } from '@/lib/i18n';
import { useFrameworkCategories } from '@/hooks/useFrameworkCategories';

interface BaseSidebarProps {
  frameworkName: string; // 'Next', 'Nest', 'Spring'
  frameworkValue: string; // 'nextjs', 'nestjs', 'spring' - DB에서 조회할 값
  frameworkIcon: IconType; // SiNextdotjs, SiNestjs, SiSpring
  frameworkColor: string; // '#000000', '#E0234E', '#6DB33F'
  frameworkPath: string; // '/post/view/nextjs', '/post/view/nestjs', '/post/view/spring'
  backgroundClasses?: string; // 배경 스타일 (기본 검정)
  previewButtonBgClasses?: string; // 미리보기 버튼 배경 스타일
  sidebarContentBgClasses?: string; // 사이드바 콘텐츠 배경 스타일
  textColorClasses?: string; // 텍스트 기본 색상
  hoverStyles?: string; // 호버 스타일
  activeLinkStyles?: string; // 활성 링크 스타일
  headerBgClasses?: string; // 헤더 배경 스타일
  borderClasses?: string; // 테두리 스타일
  logoAnimation?: string; // 로고 애니메이션
  iconRenderer?: (icon: IconType, color: string) => ReactNode; // 아이콘 렌더링 방식
  // 배경 레이어 커스텀 렌더러 (Spring에만 사용됨)
  backgroundLayerRenderer?: () => ReactNode;
  headerHoverTextClass?: string; // 헤더 텍스트 호버 색상
  descriptionTextClass?: string; // 설명 텍스트 색상
  categoryTitleClass?: string; // 카테고리 제목 색상
}

export default function BaseSidebar({
  frameworkName,
  frameworkValue,
  frameworkIcon: FrameworkIcon,
  frameworkColor,
  frameworkPath,
  previewButtonBgClasses = 'bg-black/50 backdrop-blur-xs',
  sidebarContentBgClasses = 'bg-black',
  textColorClasses = 'text-[#888888]',
  hoverStyles = 'hover:bg-white/5',
  activeLinkStyles = 'text-white bg-white/5',
  headerBgClasses = 'backdrop-blur-xs bg-black/30',
  borderClasses = 'border-[#333333]',
  logoAnimation = 'transition-transform duration-300 group-hover:scale-105',
  iconRenderer = (Icon, color) => <Icon className="h-4 w-4" style={{ color }} />,
  backgroundLayerRenderer,
  headerHoverTextClass = 'hover:text-white',
  descriptionTextClass = 'text-[#666666]',
  categoryTitleClass = 'text-[#666666]',
}: BaseSidebarProps) {
  const { t } = useTranslation('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const pathname = usePathname();

  // DB에서 서브카테고리 가져오기
  const { subCategories, isLoading, error } = useFrameworkCategories(frameworkValue);

  // 화면 크기 감지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        const isSmall = window.innerWidth < 1280;
        setIsSmallScreen(isSmall);
        setIsOpen(!isSmall);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  // 아이콘 가져오기 함수 (실제로는 각 사이드바에서 전달된 값만 사용)
  const getIcon = (_iconName: string): IconType => {
    // 이 함수는 호환성을 위해 유지하지만 실제로는 항상 기본값 반환
    return FrameworkIcon;
  };

  return (
    <div
      className="h-full w-64"
      onMouseEnter={() => {
        if (isSmallScreen) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (isSmallScreen) setIsOpen(false);
      }}
    >
      {/* 작은 화면에서만 보이는 미니 사이드바 */}
      <div
        className={`absolute top-0 left-0 flex h-full w-16 items-center justify-center ${previewButtonBgClasses} transform rounded-r-lg border-r transition-all duration-300 ease-in-out ${borderClasses} ${!isSmallScreen || isOpen ? 'pointer-events-none opacity-0' : 'opacity-30'} `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="mb-2 text-center">
            <FrameworkIcon className="mx-auto mb-1 h-8 w-8" style={{ color: frameworkColor }} />
          </div>
          <span className="text-center font-handwriting text-base font-bold text-gray-800">
            {frameworkName}
          </span>
        </div>
        <MdKeyboardArrowRight className="absolute right-1 h-5 w-5 animate-[bounce-right_1s_infinite] text-gray-800" />
      </div>
      {/* 사이드바 본체 */}
      <div
        className={`absolute top-0 left-0 h-full w-64 ${sidebarContentBgClasses} ${textColorClasses} border-r ${borderClasses} transform overflow-hidden rounded-r-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none -translate-x-64 opacity-0'
        } `}
      >
        {/* 배경 레이어 (Spring에서만 사용) */}
        {backgroundLayerRenderer && backgroundLayerRenderer()}

        <div
          className={`border-b p-4 ${borderClasses} ${headerBgClasses} ${backgroundLayerRenderer ? 'relative z-10' : ''}`}
        >
          <Link
            href={frameworkPath}
            className={`flex items-center gap-2 text-xl font-bold text-gray-800 transition-colors duration-300 ${headerHoverTextClass}`}
          >
            <FrameworkIcon
              className={`h-8 w-8 ${logoAnimation}`}
              style={{ color: frameworkColor }}
            />
            {frameworkName}
          </Link>
        </div>

        <nav
          className={`max-h-[calc(100vh-80px)] overflow-y-auto px-3 py-4 ${backgroundLayerRenderer ? 'relative z-10' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">카테고리 로딩 중...</div>
            </div>
          ) : error ? (
            <div className="px-4 py-2 text-sm text-red-400">
              카테고리 로드 실패. 기본 카테고리를 표시합니다.
            </div>
          ) : null}

          {/* DB에서 가져온 서브카테고리 또는 폴백으로 하드코딩된 카테고리 */}
          {subCategories.length > 0 ? (
            <div className="mb-8">
              <h2
                className={`mb-4 px-4 text-sm font-semibold tracking-wide ${categoryTitleClass} uppercase`}
              >
                {frameworkName} 카테고리
              </h2>
              <div className="space-y-3">
                {subCategories.map((subCategory) => {
                  const categoryPath = `${frameworkPath}/category/${subCategory.value}`;
                  return (
                    <div key={subCategory.value} className="space-y-1">
                      <Link
                        href={categoryPath}
                        className={`group block rounded-md px-4 py-1.5 transition-all duration-300 ease-in-out ${hoverStyles} ${
                          pathname === categoryPath ? activeLinkStyles : textColorClasses
                        }`}
                      >
                        <span className="flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                          {iconRenderer(FrameworkIcon, frameworkColor)}
                          {subCategory.label}
                        </span>
                      </Link>
                      {subCategory.description && (
                        <p className={`px-4 py-1 text-xs ${descriptionTextClass} leading-relaxed`}>
                          {subCategory.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // 폴백: 하드코딩된 카테고리 (API 실패 시 또는 데이터가 없을 때)
            Object.entries(t(`${frameworkName}.categories`)).map(
              ([categoryKey, category]: [string, any]) => (
                <div key={categoryKey} className="mb-8">
                  <h2
                    className={`mb-4 px-4 text-sm font-semibold tracking-wide ${categoryTitleClass} uppercase`}
                  >
                    {category.title}
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(category.items).map(([itemKey, item]: [string, any]) => {
                      const Icon = getIcon(item.icon);
                      return (
                        <div key={itemKey} className="space-y-1">
                          <Link
                            href={item.path}
                            className={`group block rounded-md px-4 py-1.5 transition-all duration-300 ease-in-out ${hoverStyles} ${
                              pathname === item.path ? activeLinkStyles : textColorClasses
                            }`}
                          >
                            <span className="flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                              {iconRenderer(Icon, item.color)}
                              {item.title}
                            </span>
                          </Link>
                          <p
                            className={`px-4 py-1 text-xs ${descriptionTextClass} leading-relaxed`}
                          >
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )
          )}
        </nav>
      </div>
    </div>
  );
}
