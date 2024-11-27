'use client';

/**
 * 홈페이지 메인 컴포넌트
 * - 타이핑 효과가 있는 환영 메시지 표시
 * - 배경 비디오와 오버레이 효과 포함
 */
import { useTypewriter } from '../hooks/useTypewriter';
import { 
  BackgroundVideo, 
  BlogTitle, 
  TypewriterText,
  MainContent 
} from '../components/home';

export default function Home() {
  // 타이핑 효과를 위한 텍스트 배열과 스타일 설정
  const { text, style } = useTypewriter(['World!', 'Developer!', 'Everyone!']);

  return (
    <>
      {/* 히어로 섹션: 60vh 높이의 비디오 배경 */}
      <div className="h-[60vh] relative overflow-hidden">
        <BackgroundVideo />
        {/* 비디오 위의 어두운 오버레이 레이어 */}
        <div className="absolute inset-0 bg-black/30">
          {/* 중앙 정렬된 컨텐츠 컨테이너 */}
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center gap-8">
            <BlogTitle />
            <TypewriterText text={text} style={style} />
          </div>
        </div>
      </div>
      {/* 메인 컨텐츠 영역 */}
      <MainContent />
    </>
  );
}
