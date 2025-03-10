import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useTranslation } from '@/utils/i18n';
import { IconType } from 'react-icons';

interface BaseSidebarProps {
  frameworkName: string;        // 'Next', 'Nest', 'Spring'
  frameworkIcon: IconType;      // SiNextdotjs, SiNestjs, SiSpring
  frameworkColor: string;       // '#000000', '#E0234E', '#6DB33F'
  frameworkPath: string;        // '/post/view/nextjs', '/post/view/nestjs', '/post/view/spring'
  backgroundClasses?: string;   // 배경 스타일 (기본 검정)
  previewButtonBgClasses?: string; // 미리보기 버튼 배경 스타일
  sidebarContentBgClasses?: string; // 사이드바 콘텐츠 배경 스타일 
  textColorClasses?: string;    // 텍스트 기본 색상
  hoverStyles?: string;         // 호버 스타일
  activeLinkStyles?: string;    // 활성 링크 스타일
  headerBgClasses?: string;     // 헤더 배경 스타일
  borderClasses?: string;       // 테두리 스타일
  logoAnimation?: string;       // 로고 애니메이션
  iconRenderer?: (icon: IconType, color: string) => ReactNode; // 아이콘 렌더링 방식
  // 배경 레이어 커스텀 렌더러 (Spring에만 사용됨)
  backgroundLayerRenderer?: () => ReactNode;
  headerHoverTextClass?: string; // 헤더 텍스트 호버 색상
  descriptionTextClass?: string; // 설명 텍스트 색상
  categoryTitleClass?: string;   // 카테고리 제목 색상
}

export default function BaseSidebar({
  frameworkName,
  frameworkIcon: FrameworkIcon,
  frameworkColor,
  frameworkPath,
  backgroundClasses = "bg-black",
  previewButtonBgClasses = "bg-black/50 backdrop-blur-sm",
  sidebarContentBgClasses = "bg-black",
  textColorClasses = "text-[#888888]",
  hoverStyles = "hover:bg-white/5",
  activeLinkStyles = "text-white bg-white/5",
  headerBgClasses = "backdrop-blur-sm bg-black/30",
  borderClasses = "border-[#333333]",
  logoAnimation = "transition-transform duration-300 group-hover:scale-105",
  iconRenderer = (Icon, color) => <Icon className="w-4 h-4" style={{ color }} />,
  backgroundLayerRenderer,
  headerHoverTextClass = "hover:text-white",
  descriptionTextClass = "text-[#666666]",
  categoryTitleClass = "text-[#666666]"
}: BaseSidebarProps) {
  const { t } = useTranslation('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const pathname = usePathname();

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
  const getIcon = (iconName: string): IconType => {
    // 이 함수는 호환성을 위해 유지하지만 실제로는 항상 기본값 반환
    return FrameworkIcon;
  };

  return (
    <div 
      className="w-64 h-full"
      onMouseEnter={() => {
        if (isSmallScreen) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (isSmallScreen) setIsOpen(false);
      }}
    >
      {/* 작은 화면에서만 보이는 미리보기 버튼 */}
      <div className={`
        absolute left-0 top-0 h-full w-16
        flex items-center justify-center
        ${previewButtonBgClasses} rounded-r-lg
        transform transition-all duration-300 ease-in-out border-r ${borderClasses}
        ${!isSmallScreen || isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <div className="flex flex-col items-center gap-2">
          <span className="ml-2 text-lg font-bold text-white/70 font-handwriting writing-vertical">
            {frameworkName}
          </span>
        </div>
        <MdKeyboardArrowRight className="w-5 h-5 text-white/70 animate-[bounce-right_1s_infinite]" />
      </div>

      {/* 사이드바 본체 */}
      <div className={`
        absolute top-0 left-0 w-64 h-full
        ${sidebarContentBgClasses} ${textColorClasses} border-r ${borderClasses} rounded-r-lg overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : '-translate-x-64 opacity-0 pointer-events-none'
        }
      `}>
        {/* 배경 레이어 (Spring에서만 사용) */}
        {backgroundLayerRenderer && backgroundLayerRenderer()}
        
        <div className={`p-4 border-b ${borderClasses} ${headerBgClasses} ${backgroundLayerRenderer ? 'relative z-10' : ''}`}>
          <Link 
            href={frameworkPath}
            className={`flex items-center gap-2 text-xl font-bold text-white/90 ${headerHoverTextClass} transition-colors duration-300`}
          >
            <FrameworkIcon className={`w-8 h-8 text-[${frameworkColor}] ${logoAnimation}`} />
            {frameworkName}
          </Link>
        </div>

        <nav className={`px-3 py-4 overflow-y-auto max-h-[calc(100vh-80px)] ${backgroundLayerRenderer ? 'relative z-10' : ''}`}>
          {Object.entries(t(`${frameworkName}.categories`)).map(([categoryKey, category]: [string, any]) => (
            <div key={categoryKey} className="mb-8">
              <h2 className={`mb-4 px-4 text-sm font-semibold tracking-wide ${categoryTitleClass} uppercase`}>
                {category.title}
              </h2>
              <div className="space-y-3">
                {Object.entries(category.items).map(([itemKey, item]: [string, any]) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <div key={itemKey} className="space-y-1">
                      <Link 
                        href={item.path}
                        className={`group block px-4 py-1.5 rounded-md transition-all duration-300 ease-in-out ${hoverStyles} ${
                          pathname === item.path ? activeLinkStyles : textColorClasses
                        }`}
                      >
                        <span className="transition-colors duration-300 group-hover:text-white flex items-center gap-2">
                          {iconRenderer(Icon, item.color)}
                          {item.title}
                        </span>
                      </Link>
                      <p className={`px-4 py-1 text-xs ${descriptionTextClass} leading-relaxed`}>
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
} 