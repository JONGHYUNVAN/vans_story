interface TypewriterTextProps {
  text: string;
  style: {
    color: string;
    fontFamily: string;
  };
}

/**
 * 타이핑 효과가 있는 텍스트 컴포넌트
 * - "Hello," 텍스트와 함께 동적으로 변하는 텍스트 표시
 * - 커서 깜빡임 애니메이션 효과 포함
 */
export default function TypewriterText({ text, style }: TypewriterTextProps) {
  return (
    <h1 className="text-6xl font-bold text-white flex items-center">
      {/* 고정된 "Hello," 텍스트 */}
      <span className="w-[180px]">Hello,</span>
      {/* 타이핑 효과가 적용될 텍스트 컨테이너 */}
      <div className="relative w-[300px] flex items-center">
        {/* 동적으로 변하는 텍스트 */}
        <span style={style} className="mr-1">
          {text}
        </span>
        {/* 깜빡이는 커서 효과 */}
        <span className="animate-[blink_1s_steps(1)_infinite] text-white">|</span>
      </div>
    </h1>
  );
} 