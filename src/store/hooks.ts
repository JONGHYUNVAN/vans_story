import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * 타입이 지정된 커스텀 디스패치 훅
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 타입이 지정된 커스텀 셀렉터 훅
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 