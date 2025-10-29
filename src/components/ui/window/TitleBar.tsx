/**
 * Windows 11 스타일 타이틀바 컴포넌트
 */

'use client'

import React from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'

interface TitleBarProps {
  title: string
  icon?: React.ReactNode
  isActive?: boolean
  isMaximized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  onMouseDown?: (e: React.MouseEvent) => void
  onDoubleClick?: () => void
  minimizable?: boolean
  maximizable?: boolean
  closable?: boolean
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
      className={`
        flex items-center justify-between h-8 px-2
        ${isActive ? 'bg-white/50' : 'bg-white/30'}
        border-b border-gray-300/30
        select-none cursor-default
        transition-colors duration-150
      `}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      role="banner"
      aria-label="윈도우 타이틀바"
    >
      {/* 왼쪽: 아이콘 + 제목 */}
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {icon && (
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className={`
          text-xs font-normal truncate
          ${isActive ? 'text-gray-800' : 'text-gray-600'}
        `}>
          {title}
        </span>
      </div>

      {/* 오른쪽: 컨트롤 버튼들 */}
      <div className="flex items-center gap-0">
        {/* 최소화 버튼 */}
        {minimizable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMinimize?.()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="
              w-11 h-8 flex items-center justify-center
              hover:bg-black/[0.06]
              active:bg-black/[0.08]
              transition-colors duration-100
              text-gray-700
            "
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
              e.stopPropagation()
              onMaximize?.()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="
              w-11 h-8 flex items-center justify-center
              hover:bg-black/[0.06]
              active:bg-black/[0.08]
              transition-colors duration-100
              text-gray-700
            "
            aria-label={isMaximized ? '이전 크기로' : '최대화'}
          >
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="2" y="0" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="0" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
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
              e.stopPropagation()
              onClose?.()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="
              w-11 h-8 flex items-center justify-center
              hover:bg-red-500
              active:bg-red-600
              transition-colors duration-100
              text-gray-700 hover:text-white
            "
            aria-label="닫기"
          >
            <X size={10} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  )
}

