/**
 * 홈페이지 메인 컴포넌트
 * - 타이핑 효과가 있는 환영 메시지 표시
 * - 배경 비디오와 오버레이 효과 포함
 */
import { BackgroundVideo, BlogTitle, SearchSection } from '@/components/features/home';
import TypewriterSection from '@/components/features/home/TypewriterSection';

export default function Home() {
  return (
    <div className="w-full bg-black">
      <div className="relative h-[65vh] w-full overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto flex h-full w-full flex-col items-center justify-center space-y-12 px-4 text-center">
            <BlogTitle />
            <TypewriterSection />
          </div>
        </div>
      </div>
      <SearchSection />
    </div>
  );
}
