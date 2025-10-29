/**
 * Windows 11 스타일 작업표시줄 컴포넌트
 */

'use client'

import React, { useState } from 'react'
import { useWindowManager } from './WindowContext'
import { WindowConfig } from './types'

interface TaskbarButtonProps {
  window: WindowConfig
  onClick: () => void
}

function TaskbarButton({ window: win, onClick }: TaskbarButtonProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      role="listitem"
    >
      <button
        onClick={onClick}
        className={`
          h-12 px-4 flex items-center justify-center gap-2
          rounded-md transition-all duration-150
          ${win.isActive 
            ? 'bg-gray-200/80 border-b-2 border-blue-500' 
            : 'hover:bg-gray-100/50 border-b-2 border-transparent'
          }
          ${win.state === 'minimized' ? 'opacity-50' : ''}
        `}
        aria-label={`${win.title} - ${win.state === 'minimized' ? '최소화됨' : win.state === 'maximized' ? '최대화됨' : '일반'}`}
        aria-pressed={win.isActive}
      >
        {/* 아이콘 */}
        {win.icon && (
          <div className="w-5 h-5 flex items-center justify-center text-gray-700">
            {win.icon}
          </div>
        )}
        
        {/* 제목 (필요시) */}
        <span className="text-xs text-gray-800 hidden xl:inline max-w-[120px] truncate">
          {win.title}
        </span>
      </button>

      {/* 호버 프리뷰 */}
      {showPreview && (
        <div className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          bg-white/95 backdrop-blur-xl
          border border-gray-300
          rounded-lg shadow-lg
          p-2 min-w-[200px]
          animate-in fade-in zoom-in-95 duration-150
        ">
          <div className="text-xs text-gray-800 font-medium mb-1">
            {win.title}
          </div>
          <div className="text-[10px] text-gray-600">
            {win.state === 'minimized' ? '최소화됨' : 
             win.state === 'maximized' ? '최대화됨' : '일반'}
          </div>
          
          {/* 화살표 */}
          <div className="
            absolute top-full left-1/2 -translate-x-1/2 -mt-px
            w-2 h-2 rotate-45
            bg-white/95 border-r border-b border-gray-300
          " />
        </div>
      )}
    </div>
  )
}

interface TaskbarProps {
  className?: string
}

export function Taskbar({ className = '' }: TaskbarProps) {
  const { windows, focusWindow, restoreWindow } = useWindowManager()

  // 열려있는 윈도우들만 필터링
  const openWindows = Array.from(windows.values()).filter(w => w.isOpen)

  const handleWindowClick = (win: WindowConfig) => {
    if (win.state === 'minimized') {
      restoreWindow(win.id)
    } else if (win.isActive) {
      // 이미 활성 상태면 최소화 (선택사항)
      // minimizeWindow(win.id)
    } else {
      focusWindow(win.id)
    }
  }

  if (openWindows.length === 0) {
    return null
  }

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 h-12
        bg-white/70 backdrop-blur-2xl
        border-t border-gray-300/50
        shadow-[0_-4px_16px_rgba(0,0,0,0.08)]
        flex items-center justify-center
        z-[9999]
        ${className}
      `}
      role="navigation"
      aria-label="작업표시줄"
    >
      <div className="flex items-center gap-1" role="list">
        {openWindows.map((win) => (
          <TaskbarButton
            key={win.id}
            window={win}
            onClick={() => handleWindowClick(win)}
          />
        ))}
      </div>
    </div>
  )
}

