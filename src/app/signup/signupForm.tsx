'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';

export default function SignupForm() {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  });

  const { register, formState: { errors }, watch } = methods;
  const values = watch();

  const showError = (fieldName: string) => {
    if (focusedField === fieldName) return false;
    if (!values[fieldName as keyof typeof values]) return false;
    return errors[fieldName as keyof typeof errors];
  };

  const getFieldProps = (fieldName: 'email' | 'username' | 'password') => {
    const validations = {
      email: {
        required: true,
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: t('signup_validation.emailError')
        }
      },
      username: {
        required: true,
        minLength: {
          value: 3,
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

  return (
    <FormProvider {...methods}>
      <motion.div className="w-full max-w-md bg-white/20 hover:bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-xl relative transition-all duration-300">
        <div className="absolute inset-2 border-2 border-gray-600/30 hover:border-gray-600/50 rounded-xl transition-colors duration-300" />
        
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center relative z-10">Sign Up</h2>
        <form className="space-y-6 relative z-10">
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
              placeholder="name"
              {...getFieldProps('username')}
            />
            {showError('username') && errors.username?.message && (
              <div className="absolute inset-x-0 flex justify-center">
                <span className="text-red-500 text-xs px-3 bg-transparent drop-shadow-[0_0px_1.5px_rgba(100,30,30)]">
                  {errors.username.message}
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
            className="w-full py-2 px-4 bg-gray-500 opacity-50 hover:bg-gray-500 hover:opacity-70 text-white rounded-lg transition-colors disabled:opacity-50 mt-8"
          >
            Sign Up
          </button>
        </form>
      </motion.div>
    </FormProvider>
  );
}