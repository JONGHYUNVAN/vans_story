/**
 * Windows 11 스타일 윈도우 매니저 Context
 */

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { WindowConfig, WindowManagerState, Position, Size, WindowState } from './types'

interface WindowManagerContextValue extends WindowManagerState {
  createWindow: (config: Omit<WindowConfig, 'zIndex' | 'isActive' | 'isOpen'> & { isOpen?: boolean }) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: Position) => void
  updateWindowSize: (id: string, size: Size) => void
  updateWindowState: (id: string, state: WindowState) => void
  getWindow: (id: string) => WindowConfig | undefined
  toggleWindowState: (id: string) => void
  openWindow: (id: string) => void
  windowOrder: string[]
  reorderWindows: (newOrder: string[]) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

export function useWindowManager() {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider')
  }
  return context
}

interface WindowManagerProviderProps {
  children: React.ReactNode
  persistKey?: string // localStorage key for persistence
}

// localStorage 버전 관리
const STORAGE_VERSION = '2.0.0' // icon 제거 후 버전

export function WindowManagerProvider({ children, persistKey = 'windows-state' }: WindowManagerProviderProps) {
  // 환경에 따라 다른 키 사용 (개발/프로덕션 분리)
  const envPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const fullPersistKey = `${envPrefix}-${persistKey}`
  // 초기값은 항상 빈 상태로 시작 (SSR/CSR 일치)
  const [windows, setWindows] = useState<Map<string, WindowConfig>>(new Map())
  const [windowOrder, setWindowOrder] = useState<string[]>([]) // 작업표시줄 아이콘 순서
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [highestZIndex, setHighestZIndex] = useState(1000)
  const [isHydrated, setIsHydrated] = useState(false)

  // 클라이언트에서 마운트된 후 localStorage에서 복원
  useEffect(() => {
    setIsHydrated(true)
    
    try {
      const saved = localStorage.getItem(fullPersistKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        
        // ✅ 버전 체크 - 이전 버전이면 초기화
        if (parsed.version !== STORAGE_VERSION) {
          console.log(`[${envPrefix}] localStorage version mismatch, clearing...`)
          localStorage.removeItem(fullPersistKey)
          return
        }
        
        // windows 복원
        if (parsed.windows) {
          const restoredWindows = new Map<string, WindowConfig>()
          Object.entries(parsed.windows).forEach(([id, config]) => {
            // ✅ icon 속성 제거 (직렬화된 객체이므로 사용 불가)
            const { icon, ...rest } = config as WindowConfig
            restoredWindows.set(id, rest as WindowConfig)
          })
          setWindows(restoredWindows)
        }
        
        // activeWindowId 복원
        if (parsed.activeWindowId) {
          setActiveWindowId(parsed.activeWindowId)
        }
        
        // highestZIndex 복원
        if (parsed.highestZIndex) {
          setHighestZIndex(parsed.highestZIndex)
        }
        
        // windowOrder 복원
        if (parsed.windowOrder && Array.isArray(parsed.windowOrder)) {
          setWindowOrder(parsed.windowOrder)
        }
      }
    } catch (error) {
      console.error('Failed to restore window state:', error)
      // 복원 실패 시 localStorage 초기화
      localStorage.removeItem(fullPersistKey)
    }
  }, [fullPersistKey, envPrefix])

  // localStorage에 상태 저장 (hydration 완료 후에만)
  useEffect(() => {
    if (!isHydrated) return
    
    try {
      // icon은 React 요소이므로 직렬화에서 제외
      const serializableWindows = Array.from(windows.entries()).map(([id, config]) => {
        const { icon, ...rest } = config
        return [id, rest]
      })
      
      const state = {
        version: STORAGE_VERSION, // ✅ 버전 정보 추가
        environment: envPrefix, // 환경 정보 추가
        windows: Object.fromEntries(serializableWindows),
        activeWindowId,
        highestZIndex,
        windowOrder
      }
      localStorage.setItem(fullPersistKey, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save window state:', error)
    }
  }, [windows, activeWindowId, highestZIndex, windowOrder, fullPersistKey, isHydrated, envPrefix])

  const createWindow = useCallback((config: Omit<WindowConfig, 'zIndex' | 'isActive' | 'isOpen'> & { isOpen?: boolean }) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const newZIndex = highestZIndex + 1
      
      const windowConfig: WindowConfig = {
        ...config,
        zIndex: newZIndex,
        isActive: config.isOpen !== false, // isOpen이 false가 아니면 활성화
        isOpen: config.isOpen ?? true, // 기본값은 true
        resizable: config.resizable ?? true,
        draggable: config.draggable ?? true,
        closable: config.closable ?? true,
        minimizable: config.minimizable ?? true,
        maximizable: config.maximizable ?? true,
      }
      
      newWindows.set(config.id, windowConfig)
      return newWindows
    })
    
    // windowOrder에 추가 (이미 존재하지 않으면)
    setWindowOrder(prev => {
      if (!prev.includes(config.id)) {
        return [...prev, config.id]
      }
      return prev
    })
    
    setHighestZIndex((prev: number) => prev + 1)
    if (config.isOpen !== false) {
      setActiveWindowId(config.id)
    }
  }, [highestZIndex])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        // 윈도우를 숨김 (isOpen: false), 작업표시줄에서 다시 열 수 있도록
        newWindows.set(id, { ...window, isOpen: false, state: 'normal' })
      }
      return newWindows
    })
    
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }, [activeWindowId])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, state: 'minimized', isActive: false })
      }
      return newWindows
    })
    
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }, [activeWindowId])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, state: 'maximized' })
      }
      return newWindows
    })
  }, [])

  const restoreWindow = useCallback((id: string) => {
    const newZIndex = highestZIndex + 1
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, state: 'normal', isActive: true, zIndex: newZIndex })
        
        // 다른 모든 윈도우를 비활성화
        newWindows.forEach((w, wId) => {
          if (wId !== id && w.isActive) {
            newWindows.set(wId, { ...w, isActive: false })
          }
        })
      }
      return newWindows
    })
    
    setHighestZIndex(newZIndex)
    setActiveWindowId(id)
  }, [highestZIndex])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      
      if (window && window.state === 'minimized') {
        newWindows.set(id, { ...window, state: 'normal', isActive: true })
      } else if (window) {
        const newZIndex = highestZIndex + 1
        newWindows.set(id, { ...window, zIndex: newZIndex, isActive: true })
        setHighestZIndex(newZIndex)
      }
      
      // 다른 윈도우들 비활성화
      newWindows.forEach((win, winId) => {
        if (winId !== id && win.isActive) {
          newWindows.set(winId, { ...win, isActive: false })
        }
      })
      
      return newWindows
    })
    
    setActiveWindowId(id)
  }, [highestZIndex])

  const updateWindowPosition = useCallback((id: string, position: Position) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, position })
      }
      return newWindows
    })
  }, [])

  const updateWindowSize = useCallback((id: string, size: Size) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, size })
      }
      return newWindows
    })
  }, [])

  const updateWindowState = useCallback((id: string, state: WindowState) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, state })
      }
      return newWindows
    })
  }, [])

  const getWindow = useCallback((id: string) => {
    return windows.get(id)
  }, [windows])

  const toggleWindowState = useCallback((id: string) => {
    const window = windows.get(id)
    if (!window) return
    
    if (window.state === 'maximized') {
      restoreWindow(id)
    } else if (window.state === 'normal') {
      maximizeWindow(id)
    }
  }, [windows, restoreWindow, maximizeWindow])

  const openWindow = useCallback((id: string) => {
    const newZIndex = highestZIndex + 1
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, isOpen: true, isActive: true, state: 'normal', zIndex: newZIndex })
        
        // 다른 모든 윈도우를 비활성화
        newWindows.forEach((w, wId) => {
          if (wId !== id && w.isActive) {
            newWindows.set(wId, { ...w, isActive: false })
          }
        })
      }
      return newWindows
    })
    
    setHighestZIndex(newZIndex)
    setActiveWindowId(id)
  }, [highestZIndex])

  const reorderWindows = useCallback((newOrder: string[]) => {
    setWindowOrder(newOrder)
  }, [])

  const value: WindowManagerContextValue = {
    windows,
    activeWindowId,
    highestZIndex,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    updateWindowState,
    getWindow,
    toggleWindowState,
    openWindow,
    windowOrder,
    reorderWindows,
  }

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

