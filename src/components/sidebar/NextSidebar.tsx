import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/utils/i18n';

export default function NextSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  return (
    <div className="w-full h-full bg-black text-[#888888] border-r border-[#333333] rounded-r-lg overflow-hidden">
      <div className="p-4 border-b border-[#333333] backdrop-blur-sm bg-black/30">
        <Link 
          href="/post/view/frontend/nextjs" 
          className="flex items-center gap-2 text-xl font-bold text-white/90 hover:text-white transition-colors duration-300"
        >
          <svg height="20" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-105">
            <mask id="mask0_408_134" style={{maskType: 'alpha'}} x="0" y="0" width="180" height="180">
              <circle cx="90" cy="90" r="90" fill="black"/>
            </mask>
            <g mask="url(#mask0_408_134)">
              <circle cx="90" cy="90" r="90" fill="black"/>
              <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"/>
              <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
          Next.js
        </Link>
      </div>

      <nav className="px-3 py-4">
        <div className="mb-8">
          <h2 className="mb-4 px-4 text-sm font-semibold tracking-wide text-[#666666] uppercase">{t('Next.layouts')}</h2>
          <div className="space-y-1">
            <Link 
              href="/post/view/frontend/nextjs/layouts/nested" 
              className={`group block px-4 py-1.5 rounded-md transition-all duration-300 ease-in-out hover:bg-white/5 ${
                pathname === '/post/view/frontend/nextjs/layouts/nested' ? 'text-white bg-white/5' : 'text-[#888888]'
              }`}
            >
              <span className="transition-colors duration-300 group-hover:text-white">
                {t('Next.nestedLayouts')}
              </span>
            </Link>
            <p className="px-4 py-1 text-xs text-[#666666] leading-relaxed">
              {t('Next.nestedLayoutsDesc')}
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
} 