import { useState, useEffect } from 'react';
import { useCategory } from './useCategory';

/**
 * 서브카테고리 옵션 타입
 */
export interface SubCategoryOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * useFrameworkCategories 훅의 반환 타입
 */
export interface UseFrameworkCategoriesReturn {
  subCategories: SubCategoryOption[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 프레임워크별 서브카테고리 조회 훅
 * 
 * @param frameworkValue - 프레임워크 값 (예: 'nextjs', 'nestjs', 'spring')
 * @returns UseFrameworkCategoriesReturn
 */
export function useFrameworkCategories(frameworkValue: string): UseFrameworkCategoriesReturn {
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  
  // API에서 카테고리 정보 가져오기
  const { category, isLoading, error } = useCategory(frameworkValue);

  useEffect(() => {
    if (category && category.subCategories) {
      // API에서 가져온 서브카테고리를 기존 형식에 맞게 변환
      const formattedSubCategories: SubCategoryOption[] = category.subCategories.map((sub: any) => ({
        value: sub.value,
        label: sub.label,
        description: sub.description
      }));
      
      setSubCategories(formattedSubCategories);
    }
  }, [category]);

  return {
    subCategories,
    isLoading,
    error
  };
}