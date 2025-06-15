/**
 * 홈페이지 배경 비디오 컴포넌트
 * - 자동 재생 및 무한 반복
 * - 음소거 상태로 재생
 * - 모바일 환경에서도 인라인 재생 지원
 * - 전체 화면을 커버하도록 설정
 */
export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <source src="/Home_background.webm" type="video/webm" />
      <source src="/Home_background.mp4" type="video/mp4" />
    </video>
  );
} 