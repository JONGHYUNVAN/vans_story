'use client'
import { useState, useEffect } from 'react';

/**
 * 화면 크기에 따라 사이드바 마진을 계산하는 커스텀 훅
 * @returns sidebarMargin: 사이드바 마진 클래스 문자열
 */
export function useSidebarMargin() {
  const [sidebarMargin, setSidebarMargin] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMargin = () => {
      const width = window.innerWidth;
      setSidebarMargin(width > 1280 && width < 1536 ? 'ml-64' : '');
    };
    
    checkMargin();
    
    const handleResize = () => {
      checkMargin();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { sidebarMargin };
} 