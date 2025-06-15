import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

/**
 * Storybook용 Redux Provider 래퍼 컴포넌트
 * 모든 상태 관리가 필요한 컴포넌트들을 위한 공통 Provider입니다.
 */
interface ReduxProviderProps {
  /** Provider로 감쌀 자식 컴포넌트들 */
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

export default ReduxProvider; 