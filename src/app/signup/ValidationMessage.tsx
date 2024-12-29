'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from '@/utils/i18n';
import TypewriterComponent from 'typewriter-effect';

/**
 * 유효성 검사 메시지 컴포넌트
 * 
 * @component
 * @description
 * 회원가입 폼의 입력 필드에 대한 안내 메시지를 타이핑 효과와 함께 표시합니다.
 * 각 입력 필드에 포커스될 때마다 해당 필드에 대한 가이드라인이 표시됩니다.
 * 
 * @example
 *  메시지 출력 예시:
 *  - 초기 화면: "환영합니다! 회원가입을 시작해볼까요?"
 *  - 이메일 필드 포커스: "이메일 형식에 맞춰 입력해 주세요 (예: yourname@domain.com)"
 *  - 사용자명 필드 포커스: "사용자명은 3자 이상 50자 이하여야 합니다"
 *  - 비밀번호 필드 포커스: "비밀번호는 8자 이상이며, 영문자, 숫자, 특수문자를 포함해야 합니다"
 * 
 * @returns {JSX.Element} 타이핑 효과가 적용된 유효성 검사 메시지를 렌더링합니다.
 */
export default function ValidationMessage() {
  const { watch } = useFormContext();
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    switch (focusedField) {
      case 'email':
        setMessage(t('signup_validation.emailGuide'));
        break;
      case 'username':
        setMessage(t('signup_validation.usernameGuide'));
        break;
      case 'password':
        setMessage(t('signup_validation.passwordGuide'));
        break;
      default:
        setMessage(t('signup_validation.welcome'));
    }
  }, [focusedField, t]);

  return (
    <div className="text-center text-gray-700 text-2xl font-handwriting h-full flex items-center justify-center">
      <TypewriterComponent
        key={message}
        onInit={(typewriter) => {
          typewriter
            .typeString(message)
            .pauseFor(5000)
            .deleteAll()
            .start();
        }}
        options={{
          loop: true,
          deleteSpeed: 100,
          skipAddStyles: false,
          cursor: '|',
          delay: 50,
        }}
      />
    </div>
  );
} 