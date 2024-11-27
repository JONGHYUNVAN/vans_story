'use client';
import { useState, useEffect } from 'react';

/**
 * 타이핑 효과를 위한 단어 스타일 인터페이스
 */
interface TypewriterWord {
  text: string;
  style: {
    color: string;
    fontFamily: string;
  };
}

// 사용 가능한 색상 배열
const COLORS = [
  '#34D399', // emerald
  '#F472B6', // pink
  '#A78BFA', // purple
  '#FBBF24', // yellow
  '#60A5FA', // blue
];

// 사용 가능한 폰트 배열
const FONTS = [
  'monospace',
  'serif',
  'Helvetica',
  'Arial',
];

/**
 * 타이핑 효과를 구현하는 커스텀 훅
 * @param words 타이핑할 단어 배열
 * @returns 현재 텍스트와 스타일 객체
 */
export function useTypewriter(words: string[]) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [style, setStyle] = useState<TypewriterWord>({
    text: '',
    style: {
      color: COLORS[0],
      fontFamily: FONTS[0],
    }
  });

  /**
   * 랜덤한 스타일을 생성하는 함수
   * @param text 스타일을 적용할 텍스트
   * @returns 랜덤 색상과 폰트가 적용된 스타일 객체
   */
  const getRandomStyle = (text: string) => ({
    text,
    style: {
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      fontFamily: FONTS[Math.floor(Math.random() * FONTS.length)],
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = words[currentIndex];
      
      if (!isDeleting) {
        // 타이핑 중
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        
        if (currentText === '') {
          // 새 단어 시작 시 새로운 스타일 적용
          setStyle(getRandomStyle(currentWord));
        }
        
        if (currentText === currentWord) {
          // 단어 완성 시 삭제 모드로 전환
          setIsDeleting(true);
          setTimeout(() => {}, 2000); // 2초 대기
        }
      } else {
        // 삭제 중
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        
        if (currentText === '') {
          // 삭제 완료 시 다음 단어로 이동
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 100 : 150); // 삭제 시 더 빠른 속도

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, words]);

  return { text: currentText, style: style.style };
} 