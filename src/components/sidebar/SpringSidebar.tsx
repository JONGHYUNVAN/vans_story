import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiSpring } from 'react-icons/si';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useTranslation } from '@/utils/i18n';

export default function SpringSidebar() {
  const { t } = useTranslation('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const pathname = usePathname();

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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'SiSpring':
        return SiSpring;
      default:
        return SiSpring;
    }
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
        bg-[#0c1511] backdrop-blur-sm rounded-r-lg
        transform transition-all duration-300 ease-in-out border-r border-slate-700/40
        ${!isSmallScreen || isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <div className="flex flex-col items-center gap-2">
          <span className="ml-2 text-lg font-bold text-gray-300 font-handwriting writing-vertical">
            Spring
          </span>
        </div>
        <MdKeyboardArrowRight className="w-5 h-5 text-gray-300 animate-[bounce-right_1s_infinite]" />
      </div>

      {/* 사이드바 본체 */}
      <div className={`
        absolute top-0 left-0 w-64 h-full
        bg-[#0c1511] text-gray-300 border-r border-slate-700/40 rounded-r-lg overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'translate-x-0 opacity-100 pointer-events-auto' 
          : '-translate-x-64 opacity-0 pointer-events-none'
        }
      `}>
        {/* 배경 레이어 - 그라디언트 및 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2f3b22] to-[#0a100d] z-0"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('/spring-pattern.png')] bg-repeat z-0"></div>
        
        <div className="relative z-10 p-4 border-b border-slate-700/40 backdrop-blur-sm">
          <Link 
            href="/post/view/spring" 
            className="flex items-center gap-2 text-xl font-bold text-white/90 hover:text-[#9DE67E]/80 transition-colors duration-300"
          >
            <SiSpring className="w-8 h-8 text-[#6DB33F] transition-transform duration-300 group-hover:scale-105" />
            Spring
          </Link>
        </div>

        <nav className="relative z-10 px-3 py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {Object.entries(t('Spring.categories')).map(([categoryKey, category]: [string, any]) => (
            <div key={categoryKey} className="mb-8">
              <h2 className="mb-4 px-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                {category.title}
              </h2>
              <div className="space-y-3">
                {Object.entries(category.items).map(([itemKey, item]: [string, any]) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <div key={itemKey} className="space-y-1">
                      <Link 
                        href={item.path}
                        className={`group block px-4 py-1.5 rounded-md transition-all duration-300 ease-in-out hover:bg-slate-800/40 ${
                          pathname === item.path ? 'text-white bg-slate-800/50' : 'text-gray-300'
                        }`}
                      >
                        <span className="transition-colors duration-300 group-hover:text-white flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: item.color }} />
                          {item.title}
                        </span>
                      </Link>
                      <p className="px-4 py-1 text-xs text-gray-500 leading-relaxed">
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