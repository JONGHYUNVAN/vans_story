'use client';

import { useAppDispatch } from '@/store/hooks';
import { openLoginModal } from '@/store/modal/slice';

export default function AuthButtons() {
  const dispatch = useAppDispatch();

  return (
    <button 
      onClick={() => dispatch(openLoginModal())}
      className="text-gray-600 hover:text-blue-600 transition-colors"
    >
      로그인
    </button>
  );
} 