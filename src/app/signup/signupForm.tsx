'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import ValidationMessage from './ValidationMessage';
import { useTranslation } from '@/utils/i18n';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: 회원가입 로직 구현
    setIsLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/20 hover:bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-xl relative transition-all duration-300"
      >
        <div className="absolute inset-2 border-2 border-gray-600/30 hover:border-gray-600/50 rounded-xl transition-colors duration-300" />
        
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center relative z-10">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 text-center bg-gray-100/30 hover:bg-gray-100/50 border border-gray-300/30 hover:border-gray-300/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-300"
              {...methods.register('email', {
                required: t('signup_validation.required.email'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('signup_validation.emailError')
                }
              })}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 text-center bg-gray-100/30 hover:bg-gray-100/50 border border-gray-300/30 hover:border-gray-300/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-300"
              {...methods.register('username', {
                required: t('signup_validation.required.username'),
                minLength: {
                  value: 3,
                  message: t('signup_validation.usernameGuide')
                },
                maxLength: {
                  value: 50,
                  message: t('signup_validation.usernameGuide')
                }
              })}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 text-center bg-gray-100/30 hover:bg-gray-100/50 border border-gray-300/30 hover:border-gray-300/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors duration-300"
              {...methods.register('password', {
                required: t('signup_validation.required.password'),
                minLength: {
                  value: 8,
                  message: t('signup_validation.passwordGuide')
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
                  message: t('signup_validation.passwordGuide')
                }
              })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gray-500 opacity-50 hover:bg-gray-500 hover:opacity-70 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </motion.div>
    </FormProvider>
  );
}