/**
 * Windows 11 스타일 윈도우 컴포넌트
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { TitleBar } from './TitleBar'
import { ResizeHandles } from './ResizeHandle'
import { useWindowManager } from './WindowContext'
import { Position, Size, ResizeDirection } from './types'

// Throttle 함수 - 성능 최적화
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  } as T
}

interface WindowProps {
  id: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode  // icon을 props로 받을 수 있도록 추가
}

export function Window({ id, children, className = '', icon: iconProp }: WindowProps) {
  const {
    getWindow,
    closeWindow,
    minimizeWindow,
    toggleWindowState,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager()

  const windowRef = useRef<HTMLDivElement>(null)

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 })

  // 리사이즈 상태
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef({
    direction: '' as ResizeDirection,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowX: 0,
    windowY: 0,
  })

  // 스냅 존 감지
  const [snapZone, setSnapZone] = useState<'none' | 'maximize' | 'left' | 'right'>('none')

  // 윈도우 설정 가져오기
  const windowConfig = getWindow(id)

  // windowConfig가 없거나 닫혀있으면 조기 리턴 (모든 Hook 호출 후)
  const isOpen = windowConfig?.isOpen ?? false
  const title = windowConfig?.title ?? ''
  // props로 전달된 icon을 우선 사용, 없으면 config의 icon 사용
  const icon = iconProp ?? windowConfig?.icon
  const position = windowConfig?.position ?? { x: 0, y: 0 }
  const size = windowConfig?.size ?? { width: 400, height: 300 }
  const state = windowConfig?.state ?? 'normal'
  const zIndex = windowConfig?.zIndex ?? 1000
  const isActive = windowConfig?.isActive ?? false
  const minSize = windowConfig?.minSize
  const resizable = windowConfig?.resizable ?? true
  const draggable = windowConfig?.draggable ?? true
  const closable = windowConfig?.closable ?? true
  const minimizable = windowConfig?.minimizable ?? true
  const maximizable = windowConfig?.maximizable ?? true

  // 최대화 상태일 때의 위치/크기 계산
  const isMaximized = state === 'maximized'
  const isMinimized = state === 'minimized'

  const actualPosition = isMaximized
    ? { x: 0, y: 0 }
    : position

  const actualSize = isMaximized && typeof window !== 'undefined'
    ? { width: window.innerWidth, height: window.innerHeight - 48 }
    : size

  // 윈도우 클릭 시 포커스
  const handleWindowClick = useCallback(() => {
    if (!isActive) {
      focusWindow(id)
    }
  }, [id, isActive, focusWindow])

  // 드래그 시작
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!draggable || isMaximized) return

    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      windowX: position.x,
      windowY: position.y,
    }
    focusWindow(id)
  }, [draggable, isMaximized, position, id, focusWindow])

  // 드래그 중
  useEffect(() => {
    if (!isDragging) return

    // Throttle로 성능 최적화 (16ms = 60fps)
    const handleMouseMove = throttle((e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newX = dragStartRef.current.windowX + deltaX
      const newY = dragStartRef.current.windowY + deltaY

      // 스냅 존 감지
      const edgeThreshold = 10
      if (e.clientY < edgeThreshold) {
        setSnapZone('maximize')
      } else if (e.clientX < edgeThreshold) {
        setSnapZone('left')
      } else if (e.clientX > window.innerWidth - edgeThreshold) {
        setSnapZone('right')
      } else {
        setSnapZone('none')
      }

      updateWindowPosition(id, { x: newX, y: newY })
    }, 16)

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false)

      // 스냅 처리
      if (snapZone === 'maximize') {
        toggleWindowState(id)
      } else if (snapZone === 'left') {
        updateWindowPosition(id, { x: 0, y: 0 })
        updateWindowSize(id, { width: window.innerWidth / 2, height: window.innerHeight - 48 })
      } else if (snapZone === 'right') {
        updateWindowPosition(id, { x: window.innerWidth / 2, y: 0 })
        updateWindowSize(id, { width: window.innerWidth / 2, height: window.innerHeight - 48 })
      }

      setSnapZone('none')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, id, snapZone, updateWindowPosition, updateWindowSize, toggleWindowState])

  // 리사이즈 시작
  const handleResizeStart = useCallback((direction: ResizeDirection, e: React.MouseEvent) => {
    if (!resizable || isMaximized) return

    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    resizeStartRef.current = {
      direction,
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      windowX: position.x,
      windowY: position.y,
    }
    focusWindow(id)
  }, [resizable, isMaximized, size, position, id, focusWindow])

  // 리사이즈 중
  useEffect(() => {
    if (!isResizing) return

    // Throttle로 성능 최적화 (16ms = 60fps)
    const handleMouseMove = throttle((e: MouseEvent) => {
      const { direction, x: startX, y: startY, width: startWidth, height: startHeight, windowX, windowY } = resizeStartRef.current
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = windowX
      let newY = windowY

      // 방향에 따른 크기 계산
      if (direction.includes('e')) {
        newWidth = Math.max(minSize?.width || 300, startWidth + deltaX)
      }
      if (direction.includes('w')) {
        newWidth = Math.max(minSize?.width || 300, startWidth - deltaX)
        newX = windowX + (startWidth - newWidth)
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minSize?.height || 200, startHeight + deltaY)
      }
      if (direction.includes('n')) {
        newHeight = Math.max(minSize?.height || 200, startHeight - deltaY)
        newY = windowY + (startHeight - newHeight)
      }

      updateWindowSize(id, { width: newWidth, height: newHeight })
      if (newX !== windowX || newY !== windowY) {
        updateWindowPosition(id, { x: newX, y: newY })
      }
    }, 16)

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, id, minSize, updateWindowSize, updateWindowPosition])

  // 더블클릭으로 최대화/복원
  const handleTitleBarDoubleClick = useCallback(() => {
    if (maximizable) {
      toggleWindowState(id)
    }
  }, [id, maximizable, toggleWindowState])

  // 조기 리턴 - 모든 Hook 호출 후
  if (!isOpen) {
    return null
  }

  // 스냅 존 오버레이
  const renderSnapOverlay = () => {
    if (snapZone === 'none' || !isDragging) return null

    const overlayStyles: Record<'maximize' | 'left' | 'right', React.CSSProperties> = {
      maximize: {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 48px)',
      },
      left: {
        left: 0,
        top: 0,
        width: '50%',
        height: 'calc(100% - 48px)',
      },
      right: {
        left: '50%',
        top: 0,
        width: '50%',
        height: 'calc(100% - 48px)',
      },
    }

    return (
      <div
        className="fixed bg-blue-500/20 border-2 border-blue-500 pointer-events-none z-[10000]"
        style={overlayStyles[snapZone]}
      />
    )
  }

  const windowElement = !isMinimized ? (
    <div
      ref={windowRef}
      className={`
        fixed flex flex-col
        bg-white/90
        rounded-lg overflow-hidden
        shadow-lg
        border border-gray-300/50
        ${isActive ? 'ring-1 ring-blue-400/60' : ''}
        ${isDragging ? 'cursor-grabbing transition-none' : 'transition-shadow'}
        ${isResizing ? 'select-none transition-none' : ''}
        ${className}
      `}
      style={{
        left: `${actualPosition.x}px`,
        top: `${actualPosition.y}px`,
        width: `${actualSize.width}px`,
        height: `${actualSize.height}px`,
        zIndex,
        willChange: isDragging || isResizing ? 'transform' : 'auto',
      }}
      onClick={handleWindowClick}
      role="dialog"
      aria-label={title}
      aria-modal="false"
      tabIndex={-1}
    >
      {/* 타이틀바 */}
      <TitleBar
        title={title}
        icon={icon}
        isActive={isActive}
        isMaximized={isMaximized}
        onMinimize={minimizable ? () => minimizeWindow(id) : undefined}
        onMaximize={maximizable ? () => toggleWindowState(id) : undefined}
        onClose={closable ? () => closeWindow(id) : undefined}
        onMouseDown={handleDragStart}
        onDoubleClick={handleTitleBarDoubleClick}
        minimizable={minimizable}
        maximizable={maximizable}
        closable={closable}
      />

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto bg-white/80">
        {children}
      </div>

      {/* 리사이즈 핸들 */}
      {!isMaximized && resizable && (
        <ResizeHandles onResizeStart={handleResizeStart} />
      )}
    </div>
  ) : null

  if (typeof window === 'undefined') return null

  return (
    <>
      {createPortal(windowElement, document.body)}
      {createPortal(renderSnapOverlay(), document.body)}
    </>
  )
}
