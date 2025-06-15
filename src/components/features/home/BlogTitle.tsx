/**
 * 블로그 제목 컴포넌트
 * @param title - 표시할 제목 텍스트
 * @param className - 추가 CSS 클래스
 * 
 * @example
 * ```tsx
 * <BlogTitle title="Van's Dev Blog" />
 * ```
 * 
 * @features
 * - 둥근 테두리의 투명한 배경에 흰색 텍스트로 표시
 * - 하단에 작은 삼각형 화살표 모양 추가
 * - 브랜드 아이덴티티를 강화하는 디자인
 */
interface BlogTitleProps {
  title?: string;
  className?: string;
}

export default function BlogTitle({ 
  title = "Van's Dev Blog",
  className = ""
}: BlogTitleProps) {
  return (
    <div className={`relative bg-transparent border-2 border-white text-white px-6 py-2 rounded-full inline-block ${className}`}>
      {title}
      <div 
        className="absolute left-1/2 w-0 h-0"
        style={{
          transform: 'translateX(-50%)',
          bottom: '-10px',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid white'
        }}
      />
    </div>
  );
} 