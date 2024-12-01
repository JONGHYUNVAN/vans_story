/**
 * 홈페이지 메인 컴포넌트
 * - 타이핑 효과가 있는 환영 메시지 표시
 * - 배경 비디오와 오버레이 효과 포함
 */
import { BackgroundVideo, BlogTitle, MainContent } from '../components/home';
import TypewriterSection from '../components/home/TypewriterSection';

export default function Home() {
  return (
    <>
      <div className="h-[60vh] relative overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center gap-8">
            <BlogTitle />
            <TypewriterSection />
          </div>
        </div>
      </div>
      <MainContent />
    </>
  );
}
