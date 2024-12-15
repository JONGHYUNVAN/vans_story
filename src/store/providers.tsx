'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

/**
 * Redux 스토어를 제공하는 컴포넌트
 * @param {Object} props - 컴포넌트의 props
 * @param {React.ReactNode} props.children - Redux 스토어에 연결할 자식 컴포넌트
 * @description 
 * 이 컴포넌트는 Redux의 Provider를 사용하여 
 * 하위 컴포넌트에 Redux 스토어를 제공합니다. 
 * 이를 통해 하위 컴포넌트에서 Redux 상태와 액션을 사용할 수 있습니다.
 * 
 * @returns {JSX.Element} - Provider로 감싸진 자식 컴포넌트
 */
export function StoreProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}