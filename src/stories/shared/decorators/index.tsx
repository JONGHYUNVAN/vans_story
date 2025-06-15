import React from 'react';
import { Decorator } from '@storybook/react';
import { ReduxProvider } from '../providers/ReduxProvider';

/**
 * Redux Provider를 포함하는 데코레이터
 * 상태 관리가 필요한 컴포넌트들에 사용합니다.
 */
export const withRedux: Decorator = (Story) => (
  <ReduxProvider>
    <Story />
  </ReduxProvider>
);

/**
 * 전체 화면 레이아웃을 위한 데코레이터
 * 사이드바, 헤더 등 레이아웃 컴포넌트들에 사용합니다.
 */
export const withFullscreen: Decorator = (Story) => (
  <div 
    style={{ 
      height: '100vh', 
      width: '100vw',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Story />
  </div>
);

/**
 * 중앙 정렬 레이아웃을 위한 데코레이터
 * 카드, 버튼 등 개별 컴포넌트들에 사용합니다.
 */
export const withCentered: Decorator = (Story) => (
  <div 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '400px',
      padding: '24px'
    }}
  >
    <Story />
  </div>
);

/**
 * 패딩을 포함한 데코레이터
 * 일반적인 컴포넌트들에 사용합니다.
 */
export const withPadding: Decorator = (Story) => (
  <div style={{ padding: '24px' }}>
    <Story />
  </div>
);

/**
 * 다크 배경을 위한 데코레이터
 * 다크 테마 컴포넌트들에 사용합니다.
 */
export const withDarkBackground: Decorator = (Story) => (
  <div 
    style={{ 
      background: '#1a1a1a',
      minHeight: '400px',
      padding: '24px'
    }}
  >
    <Story />
  </div>
);

/**
 * 라이트 배경을 위한 데코레이터
 * 라이트 테마 컴포넌트들에 사용합니다.
 */
export const withLightBackground: Decorator = (Story) => (
  <div 
    style={{ 
      background: '#f8f9fa',
      minHeight: '400px',
      padding: '24px'
    }}
  >
    <Story />
  </div>
); 