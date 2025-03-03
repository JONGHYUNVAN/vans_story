'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { closeLoginModal } from '@/store/modal/slice';
import { authApi } from '@/api/auth/authApi';
import { loginFailure, loginStart, loginSuccess, loginFinish} from '@/store/auth/slice';
import { useTranslation } from '@/utils/i18n';
import { showWelcomeAlert } from '@/utils/alerts';

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isLoginModalOpen);
  const [passwordError, setPasswordError] = useState('');
  const { t } = useTranslation();   
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [saveEmail, setSaveEmail] = useState(false);
  const [email, setEmail] = useState('');

  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  /**
   * 로그인 폼 제출 핸들러
   * @param {React.FormEvent} event - 폼 제출 이벤트
   * @returns {Promise<void>} - 비동기 작업
   * @description 
   * 사용자가 입력한 이메일과 비밀번호로 로그인 시도를 합니다.  
   * 로그인 성공 시 환영 메시지를 표시하고 모달을 닫습니다.  
   * 로그인 실패 시 에러 메시지를 표시합니다.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
        dispatch(loginStart());
        await authApi.login({ email, password });
        dispatch(loginSuccess({ email }));

        // 이메일 저장 처리
        if (saveEmail) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        const title = t('auth.welcome', { username: email.split('@')[0] }); 
        setPasswordError('');
        showWelcomeAlert(title);
        dispatch(closeLoginModal());
    } catch (error) {
        const errorMessage = error instanceof Error 
            ? t(`auth.loginError.${error.message}`)
            : t('auth.loginError.default');
        dispatch(loginFailure(errorMessage));
        setPasswordError(errorMessage);
    } finally {
      dispatch(loginFinish()); 
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 추가
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 로직 추가
  };

  const handleCloseModal = () => {
    setPasswordError(''); 
    dispatch(closeLoginModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* 모달의 외부 배경 */}
      <div className="electric-border rounded-xl">
        {/* 모달의 내부 컨테이너 */}
        <div className="relative bg-[#191919] opacity-80 hover:opacity-95 transition-opacity duration-200 rounded-xl">
          {/* 모달 닫기 버튼 */}
          <span 
            className="absolute top-2 right-2 text-white text-3xl cursor-pointer z-10" 
            onClick={() => handleCloseModal()}
          >
            &times;
          </span>
          <div className="flex items-center justify-center h-auto">
            {/* 로그인 이미지 */}
            <Image 
              src={`/login.webp`} 
              alt={`login`} 
              width={400} 
              height={900} 
              className="rounded-l-xl" 
              style={{ width: 'auto', height: 'auto' }} 
            />
            <div className="w-[400px] p-10 text-center">
              {/* 환영 메시지 */}
              <h1 className="mt-5 text-white uppercase font-bold text-3xl neon-text" translate="no">Welcome !</h1>
              {/* 로그인 폼 */}
              <form 
                name="login-form"
                className="mt-10" 
                onSubmit={handleSubmit} 
                autoComplete="on"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  placeholder="User Email"
                  className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                  autoComplete="username"
                  spellCheck="false"
                  autoCapitalize="off"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                  autoComplete="current-password"
                />

                {/* 아이디 저장 체크박스 */}
                <div className="flex items-center justify-center mb-4 group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="saveEmail"
                      checked={saveEmail}
                      onChange={(e) => setSaveEmail(e.target.checked)}
                      className="peer sr-only" // 원래 체크박스는 숨김
                    />
                    <div 
                      onClick={() => setSaveEmail(!saveEmail)}
                      className="w-5 h-5 border-2 border-[#3498db] rounded-md 
                      transition-all duration-200 
                      peer-checked:border-[#2ecc71] peer-checked:bg-[#2ecc71]/20
                      peer-checked:shadow-[0_0_10px_#2ecc71] 
                      peer-focus:ring-2 peer-focus:ring-[#2ecc71]/50
                      cursor-pointer
                      after:content-[''] after:block after:opacity-0
                      after:w-2 after:h-3 after:border-r-2 after:border-b-2
                      after:border-white after:rotate-45 after:absolute
                      after:top-1/2 after:left-1/2 after:-translate-y-[70%] after:-translate-x-1/2
                      peer-checked:after:opacity-100 after:transition-opacity"
                    ></div>
                  </div>
                  <label 
                    htmlFor="saveEmail" 
                    className="ml-2 text-sm text-gray-400 cursor-pointer select-none 
                      group-hover:text-gray-300 transition-colors
                      group-hover:text-shadow-[0_0_10px_#3498db]"
                  >
                    Remember Email
                  </label>
                </div>

                {/* 비밀번호 에러 메시지 */}
                {passwordError && (
                  <p className="text-red-500 text-xl Nanum-Pen-Script mb-4 neon-text-red">{passwordError}</p>
                )}

                {/* 로그인 및 회원가입 안내 */}
                <div className="flex mt-10 items-center justify-center my-5">
                  <div className="flex-grow border-t border-gray-600"></div>
                  {isLoading ? (
                    <p className="px-4 text-gray-300">Logging in... wait a second</p>
                  ) : (
                    <a href="/signup" className="px-4 text-gray-300 link-underline">Need new account?</a>
                  )}
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* 로그인 버튼 */}
                <input
                  type="submit"
                  value="Login"
                  className="w-3/5 mx-auto p-3 mt-5 mb-3 border-2 border-[#2ecc71] text-white bg-transparent rounded-full cursor-pointer transition duration-300 hover:bg-[#2ecc71]"
                />
              </form>
              {/* 소셜 로그인 버튼들 */}
              <ul className="flex justify-center mt-6 space-x-14">
                <li>
                  <a 
                    href="#" 
                    onClick={handleKakaoLogin} 
                    className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoKakao"
                  >
                    <Image 
                      src="/kakao.webp" 
                      alt="Kakao" 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                      style={{ width: 'auto', height: 'auto' }} 
                    />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={handleGoogleLogin} 
                    className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoGoogle"
                  >
                    <Image 
                      src="/google.webp" 
                      alt="Google" 
                      width={30} 
                      height={30} 
                      className="rounded-full" 
                      style={{ width: 30, height: 30 }} 
                    />
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