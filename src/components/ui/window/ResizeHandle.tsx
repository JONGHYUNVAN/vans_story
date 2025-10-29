/**
 * Windows 11 스타일 리사이즈 핸들 컴포넌트
 */

'use client'

import React from 'react'
import { ResizeDirection, ResizeHandleProps } from './types'

const CURSOR_MAP: Record<ResizeDirection, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize',
}

const POSITION_CLASSES: Record<ResizeDirection, string> = {
  n: 'top-0 left-0 right-0 h-1',
  s: 'bottom-0 left-0 right-0 h-1',
  e: 'top-0 right-0 bottom-0 w-1',
  w: 'top-0 left-0 bottom-0 w-1',
  ne: 'top-0 right-0 w-3 h-3',
  nw: 'top-0 left-0 w-3 h-3',
  se: 'bottom-0 right-0 w-3 h-3',
  sw: 'bottom-0 left-0 w-3 h-3',
}

export function ResizeHandle({ direction, onResizeStart }: ResizeHandleProps) {
  const cursor = CURSOR_MAP[direction]
  const positionClass = POSITION_CLASSES[direction]

  return (
    <div
      className={`
        absolute ${positionClass}
        hover:bg-blue-500/20
        transition-colors duration-100
        z-10
      `}
      style={{ cursor }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onResizeStart(direction, e)
      }}
      aria-label={`크기 조절: ${direction}`}
    />
  )
}

interface ResizeHandlesProps {
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void
  disabled?: boolean
}

export function ResizeHandles({ onResizeStart, disabled = false }: ResizeHandlesProps) {
  if (disabled) return null

  const directions: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

  return (
    <>
      {directions.map((direction) => (
        <ResizeHandle
          key={direction}
          direction={direction}
          onResizeStart={onResizeStart}
        />
      ))}
    </>
  )
}

