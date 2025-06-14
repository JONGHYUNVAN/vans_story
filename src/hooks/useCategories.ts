import { useState, useEffect } from 'react';
import { CategoryOption, getCategoriesByTheme } from '@/constants/themes';

export function useCategories(theme: string, language: string = 'ko') {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

  useEffect(() => {
    console.log('🔄 useCategories useEffect - theme:', theme, 'language:', language);
    
    if (theme && language) {
      const newCategories = getCategoriesByTheme(theme, language);
      console.log('📋 로딩된 카테고리들:', newCategories.length, '개');
      
      setCategories(newCategories);
      
      // 선택된 카테고리가 없고 새 카테고리가 있을 때만 첫 번째 카테고리로 설정
      if (!selectedCategory && newCategories.length > 0) {
        console.log('🎯 첫 번째 카테고리로 자동 선택:', newCategories[0].label);
        setSelectedCategory(newCategories[0]);
      }
    } else {
      console.log('❌ theme 또는 language 없음, 카테고리 초기화');
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