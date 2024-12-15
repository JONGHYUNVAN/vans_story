'use client';

import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { openLoginModal } from '@/store/modal/slice';
import { logout } from '@/store/auth/slice';
import { authApi } from '@/store/auth/api';
import { useTranslation } from '@/utils/i18n';
import { showLogoutAlert } from '@/utils/alerts';

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
        await authApi.logout();
        dispatch(logout());
        const message = t('auth.logout'); 
        showLogoutAlert(message); 
    } catch (error) {
        console.error('로그아웃 실패:', error);
    }
};

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
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