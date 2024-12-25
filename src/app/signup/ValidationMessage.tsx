'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import TypewriterComponent from 'typewriter-effect';

export default function ValidationMessage() {
  const { watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [prevMessage, setPrevMessage] = useState('');
  
  const email = watch('email');
  const username = watch('username');
  const password = watch('password');

  useEffect(() => {
    let newMessage = '';
    if (errors.email) {
      newMessage = t('signup_validation.emailError');
    } else if (errors.username) {
      newMessage = t('signup_validation.usernameError');
    } else if (errors.password) {
      newMessage = t('signup_validation.passwordError');
    } else if (!email && !username && !password) {
      newMessage = t('signup_validation.welcome');
    } else if (!email) {
      newMessage = t('signup_validation.enterEmail');
    } else if (!username) {
      newMessage = t('signup_validation.enterUsername');
    } else if (!password) {
      newMessage = t('signup_validation.enterPassword');
    } else {
      newMessage = t('signup_validation.allGood');
    }

    if (newMessage !== prevMessage) {
      setMessage(newMessage);
      setPrevMessage(newMessage);
    }
  }, [email, username, password, errors, t, prevMessage]);

  return (
    <div className="text-center text-gray-700 text-2xl font-handwriting h-full flex items-center justify-center">
    <TypewriterComponent
    onInit={(typewriter) => {
        typewriter
        .typeString(message)     // 문자열 출력
        .pauseFor(5000)          // 추가 대기
        .deleteAll()             // 전체 삭제
        .start();                // 타이핑 시작
    }}
    options={{
        loop: true, // 반복 실행 설정
        deleteSpeed: 100,
        delay: 50,
        cursor: '|',
    }}
    />
    </div>
  );
} 