import { useState, useEffect } from 'react';
import { CategoryOption, getCategoriesByTheme } from '@/constants/themes';

export function useCategories(theme: string, language: string = 'ko') {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

  useEffect(() => {
    if (theme && language) {
      const newCategories = getCategoriesByTheme(theme, language);
      setCategories(newCategories);
      
      // 선택된 카테고리가 없고 새 카테고리가 있을 때만 첫 번째 카테고리로 설정
      if (!selectedCategory && newCategories.length > 0) {
        setSelectedCategory(newCategories[0]);
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