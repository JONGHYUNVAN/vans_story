/**
 * Windows 11 스타일 윈도우 시스템 - 공개 API
 */

export { Window } from './Window'
export { TitleBar } from './TitleBar'
export { ResizeHandle, ResizeHandles } from './ResizeHandle'
export { Taskbar } from './Taskbar'
export { WindowManagerProvider, useWindowManager } from './WindowContext'
export { ContextMenu, useContextMenu } from './ContextMenu'

export type {
  WindowConfig,
  WindowState,
  Position,
  Size,
  ResizeDirection,
  WindowManagerState,
} from './types'

export type { ContextMenuItem } from './ContextMenu'
