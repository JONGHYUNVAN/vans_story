'use client';

import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { openLoginModal } from '@/store/modal/slice';
import { logout } from '@/store/auth/slice';
import { authApi } from '@/store/auth/api';

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <button 
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          로그아웃
        </button>
      ) : (
        <button 
          onClick={() => dispatch(openLoginModal())}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          로그인
        </button>
      )}
    </>
  );
} 