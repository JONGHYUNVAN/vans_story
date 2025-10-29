/**
 * Windows 11 스타일 윈도우 매니저 Context
 */

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { WindowConfig, WindowManagerState, Position, Size, WindowState } from './types'

interface WindowManagerContextValue extends WindowManagerState {
  createWindow: (config: Omit<WindowConfig, 'zIndex' | 'isActive' | 'isOpen'>) => void
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

export function WindowManagerProvider({ children, persistKey = 'windows-state' }: WindowManagerProviderProps) {
  const [windows, setWindows] = useState<Map<string, WindowConfig>>(new Map())
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [highestZIndex, setHighestZIndex] = useState(1000)

  // localStorage에서 상태 복원 (초기 마운트 시에만)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        const restoredWindows = new Map<string, WindowConfig>()
        
        Object.entries(parsed.windows || {}).forEach(([id, config]) => {
          restoredWindows.set(id, config as WindowConfig)
        })
        
        setWindows(restoredWindows)
        setActiveWindowId(parsed.activeWindowId || null)
        setHighestZIndex(parsed.highestZIndex || 1000)
      }
    } catch (error) {
      console.error('Failed to restore window state:', error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 초기 마운트 시에만 실행

  // localStorage에 상태 저장
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const state = {
        windows: Object.fromEntries(windows.entries()),
        activeWindowId,
        highestZIndex
      }
      localStorage.setItem(persistKey, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save window state:', error)
    }
  }, [windows, activeWindowId, highestZIndex, persistKey])

  const createWindow = useCallback((config: Omit<WindowConfig, 'zIndex' | 'isActive' | 'isOpen'>) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const newZIndex = highestZIndex + 1
      
      const windowConfig: WindowConfig = {
        ...config,
        zIndex: newZIndex,
        isActive: true,
        isOpen: true,
        resizable: config.resizable ?? true,
        draggable: config.draggable ?? true,
        closable: config.closable ?? true,
        minimizable: config.minimizable ?? true,
        maximizable: config.maximizable ?? true,
      }
      
      newWindows.set(config.id, windowConfig)
      return newWindows
    })
    
    setHighestZIndex(prev => prev + 1)
    setActiveWindowId(config.id)
  }, [highestZIndex])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const newWindows = new Map(prev)
      const window = newWindows.get(id)
      if (window) {
        newWindows.set(id, { ...window, isOpen: false })
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
  }

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

