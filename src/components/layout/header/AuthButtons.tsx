'use client';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { openLoginModal } from '@/store/modal/slice';
import { logout } from '@/store/auth/slice';
import { authService } from '@/components/features/auth/authService';
import { useTranslation } from '@/lib/i18n';
import { showLogoutAlert } from '@/lib/alerts';

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation('');

  const handleLogout = async () => {
    try {
      await authService.logout();
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
            className="text-gray-600 transition-colors hover:text-red-600"
          >
            {t('common.logout')}
          </button>
        </div>
      ) : (
        <button
          onClick={() => dispatch(openLoginModal())}
          className="text-gray-600 transition-colors hover:text-blue-600"
        >
          {t('common.login')}
        </button>
      )}
    </>
  );
}
