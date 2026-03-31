/**
 * 홈페이지 메인 컴포넌트
 * - 타이핑 효과가 있는 환영 메시지 표시
 * - 배경 비디오와 오버레이 효과 포함
 */
import Link from 'next/link';
import { BackgroundVideo, BlogTitle, SearchSection } from '../components/features/home';
import TypewriterSection from '../components/features/home/TypewriterSection';

export default function Home() {
  return (
    <div className="w-full bg-black">
      <div className="h-[65vh] relative overflow-hidden w-full">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto w-full px-4 h-full flex flex-col items-center justify-center space-y-12 text-center">
            <BlogTitle />
            <TypewriterSection />
          </div>
        </div>
      </div>
      <SearchSection />
      {/* 빠른 링크 */}
      <div className="bg-black border-t border-gray-800/50 py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <Link
            href="/stocks"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800/60 border border-gray-700/60 rounded-xl
                       text-gray-300 text-sm font-medium hover:bg-gray-700/60 hover:text-white hover:border-gray-600
                       transition-all duration-200"
          >
            <span>📈</span>
            <span>주가 대시보드</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
