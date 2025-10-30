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
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  isDragging: boolean
}

function TaskbarButton({ window: win, onClick, onDragStart, onDragOver, onDrop, isDragging }: TaskbarButtonProps) {
  const [showPreview, setShowPreview] = useState(false)

  // 상태 텍스트 결정
  const getStateText = () => {
    if (!win.isOpen) return '닫힘'
    if (win.state === 'minimized') return '최소화됨'
    if (win.state === 'maximized') return '최대화됨'
    return '일반'
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      role="listitem"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <button
        onClick={onClick}
        className={`
          h-12 px-4 flex items-center justify-center gap-2
          rounded-md transition-all duration-100
          ${win.isOpen && win.isActive 
            ? 'bg-gray-200/80 border-b-2 border-blue-500' 
            : 'hover:bg-gray-100/50 border-b-2 border-transparent'
          }
          ${!win.isOpen ? 'opacity-40' : win.state === 'minimized' ? 'opacity-60' : ''}
          ${isDragging ? 'opacity-30 scale-95' : ''}
        `}
        aria-label={`${win.title} - ${getStateText()}`}
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

        {/* 닫힌 상태 표시 점 */}
        {!win.isOpen && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-400" />
        )}
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
            {getStateText()}
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
  const { windows, focusWindow, restoreWindow, openWindow, minimizeWindow, windowOrder, reorderWindows } = useWindowManager()
  const [draggedId, setDraggedId] = useState<string | null>(null)

  // windowOrder에 따라 윈도우 정렬
  const orderedWindows = windowOrder
    .map(id => windows.get(id))
    .filter((win): win is WindowConfig => win !== undefined)

  const handleWindowClick = (win: WindowConfig) => {
    // 닫힌 윈도우는 열기
    if (!win.isOpen) {
      openWindow(win.id)
    }
    // 최소화된 윈도우는 복원
    else if (win.state === 'minimized') {
      restoreWindow(win.id)
    }
    // 이미 활성 상태면 최소화
    else if (win.isActive) {
      minimizeWindow(win.id)
    }
    // 그 외에는 포커스
    else {
      focusWindow(win.id)
    }
  }

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (targetId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }

    const draggedIndex = windowOrder.indexOf(draggedId)
    const targetIndex = windowOrder.indexOf(targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null)
      return
    }

    // 새로운 순서 계산
    const newOrder = [...windowOrder]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedId)

    reorderWindows(newOrder)
    setDraggedId(null)
  }

  if (orderedWindows.length === 0) {
    return null
  }

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 h-12
        bg-white/80
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
        {orderedWindows.map((win) => (
          <TaskbarButton
            key={win.id}
            window={win}
            onClick={() => handleWindowClick(win)}
            onDragStart={handleDragStart(win.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(win.id)}
            isDragging={draggedId === win.id}
          />
        ))}
      </div>
    </div>
  )
}

