import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * 타입이 지정된 커스텀 디스패치 훅
 * @description Redux의 useDispatch 훅을 래핑하여, 
 * 타입이 지정된 AppDispatch를 반환합니다. 
 * 이 훅을 사용하면 액션을 디스패치할 때 타입 안전성을 보장받을 수 있습니다.
 * @returns {AppDispatch} - 타입이 지정된 디스패치 함수
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 타입이 지정된 커스텀 셀렉터 훅
 * @description Redux의 useSelector 훅을 래핑하여, 
 * RootState 타입을 사용하여 상태를 선택합니다. 
 * 이 훅을 사용하면 상태를 선택할 때 타입 안전성을 보장받을 수 있습니다.
 * @type {TypedUseSelectorHook<RootState>} - 타입이 지정된 셀렉터 훅
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 