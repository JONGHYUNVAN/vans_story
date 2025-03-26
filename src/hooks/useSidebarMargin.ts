'use client'
import { useState, useEffect } from 'react';

/**
 * 화면 크기에 따라 사이드바 마진을 계산하는 커스텀 훅
 * @returns shouldApplyMargin: 사이드바 마진을 적용해야 하는지 여부
 */
export function useSidebarMargin() {
  const [shouldApplyMargin, setShouldApplyMargin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMargin = () => {
      const width = window.innerWidth;
      setShouldApplyMargin(width > 1280 && width < 1536);
    };
    
    checkMargin();
    
    const handleResize = () => {
      checkMargin();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { shouldApplyMargin };
} 