'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SidebarWrapperProps {
  children: ReactNode;
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const width = useWindowWidth();
  const shouldApplyMargin = width > 1280 && width < 1536;
  
  return (
    <div className={shouldApplyMargin ? 'ml-64' : ''}>
      {children}
    </div>
  );
} 