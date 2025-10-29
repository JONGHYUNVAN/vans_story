import { useState, useEffect } from 'react';
import { ApiFetch } from '@/lib/apiFetch';
import { Category } from '@/types/category';

/**
 * useCategory 훅의 반환 타입
 */
export interface UseCategoryReturn {
  category: Category | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 단일 카테고리 조회 훅
 * 
 * @param categoryValue - 조회할 카테고리 값 (예: 'nextjs', 'nestjs', 'spring')
 * @returns UseCategoryReturn
 */
export function useCategory(categoryValue: string): UseCategoryReturn {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryValue) {
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await ApiFetch.getCategoryByValue(categoryValue);
        
        if (!response.ok) {
          throw new Error(`카테고리 조회 실패: ${response.status}`);
        }
        
        const categoryData: Category = await response.json();
        setCategory(categoryData);
      } catch (err) {
        console.error('카테고리 조회 중 오류:', err);
        setError(err instanceof Error ? err.message : '카테고리 조회 실패');
        setCategory(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryValue]);

  return {
    category,
    isLoading,
    error
  };
}
