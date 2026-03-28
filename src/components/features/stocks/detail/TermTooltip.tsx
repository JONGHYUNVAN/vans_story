'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface TermTooltipProps {
  children: ReactNode;
  text: string;
  /** 툴팁 패널 가로 너비, 기본 200px */
  width?: number;
}

/**
 * 호버 시 설명 텍스트를 말풍선으로 보여주는 범용 툴팁.
 * 마우스 커서 위치 기준으로 표시하므로 absolute/fixed 자식에도 정상 작동.
 */
export default function TermTooltip({ children, text, width = 200 }: TermTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos]         = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  function handleMouseEnter(e: React.MouseEvent) {
    setPos({ top: e.clientY, left: e.clientX });
    setVisible(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    setPos({ top: e.clientY, left: e.clientX });
  }

  function handleFocus(e: React.FocusEvent) {
    // FocusEvent에는 clientY가 없으므로 요소의 위치에서 계산
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ top: rect.top, left: rect.left + rect.width / 2 });
    setVisible(true);
  }

  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    window.addEventListener('scroll', hide, { passive: true });
    return () => window.removeEventListener('scroll', hide);
  }, [visible]);

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setVisible(false)}
        onFocus={handleFocus}
        onBlur={() => setVisible(false)}
        className="cursor-help"
        style={{ display: 'contents' }}
      >
        {children}
      </span>

      {visible && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top:       (Number.isFinite(pos.top)  ? pos.top  : 0) - 12,
            left:      Number.isFinite(pos.left) ? pos.left : 0,
            transform: 'translate(-50%, -100%)',
            width,
          }}
        >
          <div className="rounded-lg bg-zinc-900/95 border border-zinc-700 text-white text-[11px] leading-relaxed px-3 py-2 shadow-xl font-sans tracking-normal normal-case font-normal whitespace-pre-line">
            {text}
            {/* 아래 삼각형 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-700" />
          </div>
        </div>
      )}
    </>
  );
}
