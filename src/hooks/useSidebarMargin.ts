import { useState, useEffect } from 'react';

/**
 * 화면 크기에 따라 사이드바 마진을 계산하는 커스텀 훅
 * @returns windowWidth: 현재 창 너비, shouldApplyMargin: 마진 적용 여부
 */
export function useSidebarMargin() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [shouldApplyMargin, setShouldApplyMargin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setWindowWidth(window.innerWidth);
    
    const checkMargin = () => {
      const width = window.innerWidth;
      setShouldApplyMargin(width > 1280 && width < 1536);
    };
    
    checkMargin();
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      checkMargin();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowWidth, shouldApplyMargin };
} 