/**
 * 블로그 제목 컴포넌트
 * - 둥근 테두리의 투명한 배경에 흰색 텍스트로 표시
 * - 하단에 작은 삼각형 화살표 모양 추가
 */
export default function BlogTitle() {
  return (
    <div className="relative bg-transparent border-2 border-white text-white px-6 py-2 rounded-full">
      Van&apos;s Dev Blog
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-0 h-0 
          border-l-[10px] border-l-transparent
          border-r-[10px] border-r-transparent
          border-t-[10px] border-t-white">
      </div>
    </div>
  );
} 