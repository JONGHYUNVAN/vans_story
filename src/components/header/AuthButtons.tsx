'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RiLoginBoxLine, RiLogoutBoxRLine } from 'react-icons/ri'; // 로그인/아웃 아이콘
import { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/auth/slice';
import { authApi } from '@/store/auth/api';
import { useTranslation } from '@/utils/i18n';

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error: any) {
      console.error(t('Auth.logoutError', { name: error.message }), error);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <span className="text-gray-600">{t('Auth.greeting', { name: user?.name })}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded text-gray-600 hover:text-blue-600 transition-colors"
        >
          <RiLogoutBoxRLine className="w-5 h-5" />
          {t('Auth.logout')}
        </button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-2 px-4 py-2 rounded text-gray-600 hover:text-blue-600 transition-colors"
    >
      <RiLoginBoxLine className="w-5 h-5" />
      {t('Auth.login')}
    </Link>
  );
} 