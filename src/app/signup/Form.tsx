'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import { authService } from '@/components/features/auth/authService';
import { showAlert } from '@/utils/alerts';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const { t } = useTranslation('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      password: ''
    }
  });

  const { register, formState: { errors }, watch, handleSubmit } = methods;
  const values = watch();

  const showError = (fieldName: string) => {
    if (focusedField === fieldName) return false;
    if (!values[fieldName as keyof typeof values]) return false;
    return errors[fieldName as keyof typeof errors];
  };

  const getFieldProps = (fieldName: 'email' | 'nickname' | 'password') => {
    const validations = {
      email: {
        required: true,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: t('signup_validation.emailError')
        }
      },
      nickname: {
        required: true,
        minLength: {
          value: 2,
          message: t('signup_validation.usernameError')
        },
        maxLength: {
          value: 50,
          message: t('signup_validation.usernameError')
        }
      },
      password: {
        required: true,
        pattern: {
          value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          message: t('signup_validation.passwordError')
        }
      }
    };

    return {
      ...register(fieldName, validations[fieldName]),
      onFocus: () => setFocusedField(fieldName),
      onBlur: () => setFocusedField(null),
      className: `w-full px-4 py-2 text-center bg-gray-100/30 hover:bg-gray-100/50 border ${
        showError(fieldName) ? 'border-2 border-red-500' : 'border-gray-300/30 hover:border-gray-300/50'
      } rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-300`
    };
  };

  const onSubmit = async (data: { email: string; nickname: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await authService.signup(data);
      showAlert('회원가입 성공', '회원가입이 완료되었습니다.', 'success');
      router.push('/'); // 홈으로 이동
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      showAlert('회원가입 실패', errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md bg-white/20 hover:bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-xl relative transition-all duration-300">
        <div className="absolute inset-2 border-2 border-gray-600/30 hover:border-gray-600/50 rounded-xl transition-colors duration-300" />
        
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center relative z-10">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="relative pt-2">
            <input
              type="email"
              placeholder="Email"
              {...getFieldProps('email')}
            />
            {showError('email') && errors.email?.message && (
              <div className="absolute inset-x-0 flex justify-center">
                <span className="text-red-500 text-xs px-3 bg-transparent drop-shadow-[0_0px_1.5px_rgba(100,30,30)]">
                  {errors.email.message}
                </span>
              </div>
            )}
          </div>

          <div className="relative pt-2">
            <input
              type="text"
              placeholder="nickname"
              {...getFieldProps('nickname')}
            />
            {showError('nickname') && errors.nickname?.message && (
              <div className="absolute inset-x-0 flex justify-center">
                <span className="text-red-500 text-xs px-3 bg-transparent drop-shadow-[0_0px_1.5px_rgba(100,30,30)]">
                  {errors.nickname.message}
                </span>
              </div>
            )}
          </div>

          <div className="relative pt-2">
            <input
              type="password"
              placeholder="Password"
              {...getFieldProps('password')}
            />
            {showError('password') && errors.password?.message && (
              <div className="absolute inset-x-0 flex justify-center">
                <span className="text-red-500 text-xs px-3 bg-transparent drop-shadow-[0_0px_1.5px_rgba(100,30,30)]">
                  {errors.password.message}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-lg transition-colors mt-8 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-500 hover:bg-gray-600 hover:opacity-70'
            }`}
          >
            {isSubmitting ? '회원가입 중...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </FormProvider>
  );
}