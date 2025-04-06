import { useState, useEffect } from 'react';
import { getCategoriesByTheme } from '@/constants/themes';

export interface Category {
  value: string;
  label: string;
  description?: string;
  path?: string;
}

export function useCategories(theme: string, language: string = 'ko') {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

  useEffect(() => {
    if (theme && language) {
      const newCategories = getCategoriesByTheme(theme, language);
      setCategories(newCategories);
      
      // 기존 선택된 카테고리가 새 테마에 없고, 선택된 카테고리가 없을 때만 첫 번째 카테고리로 설정
      if (!selectedCategory && !newCategories.some(c => c.value === selectedCategory) && newCategories.length > 0) {
        setSelectedCategory(newCategories[0].value);
      }
    } else {
      setCategories([]);
      setSelectedCategory(null);
    }
  }, [theme, language]);

  return {
    categories,
    selectedCategory,
    setSelectedCategory
  };
} 