/**
 * 회원가입 배경 비디오 컴포넌트
 * - 자동 재생 및 무한 반복
 * - 음소거 상태로 재생
 * - 모바일 환경에서도 인라인 재생 지원
 * - 전체 화면을 커버하도록 설정
 */
'use client';
export default function BackgroundVideo() {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFD700]/70 via-[#DAA520]/60 to-[#B8860B]/60">
        {/* 좌우 장식적 요소 */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#FFD700]/30 to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#FFD700]/30 to-transparent"></div>
        
        {/* 진짜 금색 글로우 효과 */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.4)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(218,165,32,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_70%,rgba(255,223,0,0.3)_0%,transparent_50%)]"></div>
        
        <video
          autoPlay    // 자동 재생
          loop        // 무한 반복
          muted       // 음소거
          playsInline // 모바일에서 전체화면 없이 인라인 재생
          className="w-[90vw] max-w-6xl h-auto object-contain rounded-2xl shadow-2xl shadow-[#B8860B]/40 border-2 border-[#FFD700]/40 relative z-0"
        >
          <source src="/Signup_background.webm" type="video/webm" />
        </video>
      </div>
    );
  } 