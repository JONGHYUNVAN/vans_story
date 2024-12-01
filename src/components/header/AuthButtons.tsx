import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/auth/slice';
import { authApi } from '@/store/auth/api';

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <span>안녕하세요, {user?.name}님</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          로그아웃
        </button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      로그인
    </Link>
  );
} 