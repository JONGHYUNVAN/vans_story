/**
 * 홈페이지 배경 비디오 컴포넌트
 * - 자동 재생 및 무한 반복
 * - 음소거 상태로 재생
 * - 모바일 환경에서도 인라인 재생 지원
 * - 전체 화면을 커버하도록 설정
 */
'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function BackgroundVideo() {
  // OS '동작 줄이기'면 영상 대신 배경색만
  if (useReducedMotion()) {
    return <div className="absolute top-0 left-0 z-0 h-full w-full bg-[#1a1a1a]" />;
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="absolute top-0 left-0 z-0 h-full w-full object-cover"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <source src="/Home_background.webm" type="video/webm" />
      <source src="/Home_background.mp4" type="video/mp4" />
    </video>
  );
}
