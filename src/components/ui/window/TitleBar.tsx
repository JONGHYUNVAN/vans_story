/**
 * Windows 11 스타일 타이틀바 컴포넌트
 */

'use client';

import React from 'react';
import { Square, X } from 'lucide-react';

interface TitleBarProps {
  title: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
}

export function TitleBar({
  title,
  icon,
  isActive = true,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDown,
  onDoubleClick,
  minimizable = true,
  maximizable = true,
  closable = true,
}: TitleBarProps) {
  return (
    <div
      className={`flex h-8 items-center justify-between px-2 ${isActive ? 'bg-white/50' : 'bg-white/30'} cursor-default border-b border-gray-300/30 transition-colors duration-150 select-none`}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      role="banner"
      aria-label="윈도우 타이틀바"
    >
      {/* 왼쪽: 아이콘 + 제목 */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        {icon && <div className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</div>}
        <span
          className={`truncate text-xs font-normal ${isActive ? 'text-gray-800' : 'text-gray-600'} `}
        >
          {title}
        </span>
      </div>

      {/* 오른쪽: 컨트롤 버튼들 */}
      <div className="flex items-center gap-0">
        {/* 최소화 버튼 */}
        {minimizable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex h-8 w-11 items-center justify-center text-gray-700 transition-colors duration-100 hover:bg-black/6 active:bg-black/8"
            aria-label="최소화"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        )}

        {/* 최대화/복원 버튼 */}
        {maximizable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex h-8 w-11 items-center justify-center text-gray-700 transition-colors duration-100 hover:bg-black/6 active:bg-black/8"
            aria-label={isMaximized ? '이전 크기로' : '최대화'}
          >
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect
                  x="2"
                  y="0"
                  width="8"
                  height="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <rect
                  x="0"
                  y="2"
                  width="8"
                  height="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            ) : (
              <Square size={10} strokeWidth={1.5} />
            )}
          </button>
        )}

        {/* 닫기 버튼 */}
        {closable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex h-8 w-11 items-center justify-center text-gray-700 transition-colors duration-100 hover:bg-red-500 hover:text-white active:bg-red-600"
            aria-label="닫기"
          >
            <X size={10} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
