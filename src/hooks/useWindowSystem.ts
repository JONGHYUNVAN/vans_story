/**
 * Windows 11 스타일 윈도우 시스템 활성화 여부를 결정하는 Hook
 * 데스크톱에서만 윈도우 시스템 활성화, 모바일/태블릿에서는 전통적 레이아웃
 */

'use client'

import { useState, useEffect } from 'react'

interface UseWindowSystemOptions {
  /** 윈도우 시스템을 활성화할 최소 화면 너비 (기본: 1024px) */
  minWidth?: number
  /** 초기 로딩 시 깜빡임 방지를 위한 마운트 상태 */
  waitForMount?: boolean
}

export function useWindowSystem(options: UseWindowSystemOptions = {}) {
  const { minWidth = 1024, waitForMount = true } = options
  
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= minWidth)
    }

    // 초기 체크
    checkDesktop()

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkDesktop)

    return () => {
      window.removeEventListener('resize', checkDesktop)
    }
  }, [minWidth])

  // waitForMount가 true면 마운트될 때까지 기다림
  if (waitForMount && !isMounted) {
    return {
      isDesktop: false,
      isMobile: false,
      isTablet: false,
      isMounted: false,
      shouldUseWindowSystem: false,
    }
  }

  return {
    isDesktop,
    isMobile: !isDesktop && isMounted && window.innerWidth < 768,
    isTablet: !isDesktop && isMounted && window.innerWidth >= 768 && window.innerWidth < minWidth,
    isMounted,
    shouldUseWindowSystem: isDesktop && isMounted,
  }
}

