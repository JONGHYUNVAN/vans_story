/**
 * Windows 11 스타일 윈도우 시스템 타입 정의
 */

export type WindowState = 'normal' | 'minimized' | 'maximized'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface WindowConfig {
  id: string
  type: 'form' | 'editor' | 'preview' | 'ai-chat'
  title: string
  icon?: React.ReactNode
  position: Position
  size: Size
  minSize?: Size
  maxSize?: Size
  state: WindowState
  zIndex: number
  isActive: boolean
  isOpen: boolean
  resizable?: boolean
  draggable?: boolean
  closable?: boolean
  minimizable?: boolean
  maximizable?: boolean
}

export interface WindowManagerState {
  windows: Map<string, WindowConfig>
  activeWindowId: string | null
  highestZIndex: number
}

export type ResizeDirection = 
  | 'n'  // north (top)
  | 's'  // south (bottom)
  | 'e'  // east (right)
  | 'w'  // west (left)
  | 'ne' // north-east
  | 'nw' // north-west
  | 'se' // south-east
  | 'sw' // south-west

export interface ResizeHandleProps {
  direction: ResizeDirection
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent) => void
}

export interface SnapZone {
  type: 'maximize' | 'left-half' | 'right-half'
  threshold: number // pixels from edge
}

