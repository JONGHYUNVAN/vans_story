'use client'

import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { closeLoginModal } from '@/store/modal/slice';
import { authApi } from '@/store/auth/api';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isLoginModalOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setPasswordError('');

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('useremail') as string;
    const password = formData.get('password') as string;

    try {
      const data = await authApi.login({ email, password });
      console.log('로그인 성공:', data);
      // 로그인 성공 후 추가 로직
    } catch (error) {
      console.error('로그인 실패:', error);
      setPasswordError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 추가
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 로직 추가
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="electric-border rounded-xl">
        <div className="relative bg-[#191919] opacity-80 hover:opacity-95 transition-opacity duration-200 rounded-xl">
          <span 
            className="absolute top-2 right-2 text-white text-3xl cursor-pointer z-10" 
            onClick={() => dispatch(closeLoginModal())}
          >
            &times;
          </span>
          <div className="flex items-center justify-center h-auto">
            <Image src={`/login.webp`} alt={`login`} width={400} height={900} className="rounded-l-xl" />
            <div className="w-[400px] p-10 text-center">
              <h1 className="mt-5 text-white uppercase font-bold text-3xl neon-text" translate="no">Welcome !</h1>
              <form className="mt-10" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="useremail"
                  placeholder="User Email"
                  className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                />

                {passwordError && (
                  <p className="text-red-500 text-xl Nanum-Pen-Script mb-4 neon-text-red">{passwordError}</p>
                )}

                <div className="flex mt-10 items-center justify-center my-5">
                  <div className="flex-grow border-t border-gray-600"></div>
                  {isSubmitting ? (
                    <p className="px-4 text-gray-300">Logging in... wait a second</p>
                  ) : (
                    <a href="/signup" className="px-4 text-gray-300 link-underline">Need new account?</a>
                  )}
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <input
                  type="submit"
                  value="Login"
                  className="w-3/5 mx-auto p-3 mt-5 mb-3 border-2 border-[#2ecc71] text-white bg-transparent rounded-full cursor-pointer transition duration-300 hover:bg-[#2ecc71]"
                />
              </form>
              <ul className="flex justify-center mt-6 space-x-14">
                <li>
                  <a href="#" onClick={handleKakaoLogin} className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoKakao">
                    <Image src="/kakao.webp" alt="Kakao" width={32} height={32} className="rounded-full" />
                  </a>
                </li>
                <li>
                  <a href="#" onClick={handleGoogleLogin} className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoGoogle">
                    <Image src="/google.webp" alt="Google" width={30} height={30} className="rounded-full" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;