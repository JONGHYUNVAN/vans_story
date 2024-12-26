'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import TypewriterComponent from 'typewriter-effect';

export default function ValidationMessage() {
  const { watch, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (focusedField === 'email') {
      setMessage(t('signup_validation.emailGuide'));
    } 
    else if (focusedField === 'username') {
      setMessage(t('signup_validation.usernameGuide'));
    } 
    else if (focusedField === 'password') {
      setMessage(t('signup_validation.passwordGuide'));
    } 
    else {
      setMessage(t('signup_validation.welcome'));
    }
  }, [focusedField, errors, t]);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      setFocusedField(target.name);
    };

    const handleBlur = () => {
      setFocusedField(null);
    };

    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      document.querySelectorAll('input').forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  return (
    <div className="text-center text-gray-700 text-2xl font-handwriting h-full flex items-center justify-center">
    <TypewriterComponent
    key={message} 
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