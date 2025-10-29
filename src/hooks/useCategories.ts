/**
 * 카테고리 관리 훅
 * API 기반 카테고리 데이터 관리 및 캐싱
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiFetch } from '@/app/api/apiFetch/apiFetch';
import { 
  Category, 
  GroupedCategories, 
  MainCategoryOption, 
  SubCategoryOption,
  CategoryLoadingState 
} from '@/types/category';

/**
 * 카테고리 훅 반환 타입
 */
export interface UseCategoriesReturn {
  // 데이터
  categories: Category[];
  groupedCategories: GroupedCategories;
  mainCategoryOptions: MainCategoryOption[];
  
  // 상태
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 메서드
  refreshCategories: () => Promise<void>;
  getCategoryByValue: (value: string) => Category | undefined;
  getSubCategoriesByMainCategory: (mainCategory: string) => SubCategoryOption[];
}

/**
 * 카테고리 관리 훅
 * 
 * @param autoLoad - 자동으로 카테고리를 로드할지 여부 (기본: true)
 * @param activeOnly - 활성화된 카테고리만 조회할지 여부 (기본: true)
 * @returns UseCategoriesReturn
 */
export function useCategories(
  autoLoad: boolean = true,
  activeOnly: boolean = true
): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>({});
  const [loadingState, setLoadingState] = useState<CategoryLoadingState>({
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  /**
   * 카테고리 데이터 로드
   */
  const loadCategories = useCallback(async () => {
    setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🔄 카테고리 데이터 로딩 시작...');
      
      // 그룹별 카테고리 데이터 조회
      const response = await ApiFetch.getCategoriesGrouped(activeOnly);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || '카테고리 데이터를 불러오는데 실패했습니다.');
      }

      const groupedData = await response.json();
      console.log('✅ 카테고리 데이터 로딩 성공:', Object.keys(groupedData).length, '개 그룹');

      // 평면 배열로 변환
      const flatCategories: Category[] = [];
      Object.values(groupedData as GroupedCategories).forEach((categoryGroup) => {
        flatCategories.push(...categoryGroup);
      });

      setCategories(flatCategories);
      setGroupedCategories(groupedData);
      setLoadingState({
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카테고리 로딩 중 오류가 발생했습니다.';
      console.error('❌ 카테고리 로딩 실패:', error);
      
      setLoadingState({
        isLoading: false,
        error: errorMessage,
        lastUpdated: null,
      });
    }
  }, [activeOnly]);

  /**
   * 카테고리 새로고침
   */
  const refreshCategories = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  /**
   * 값으로 카테고리 찾기
   */
  const getCategoryByValue = useCallback((value: string): Category | undefined => {
    return categories.find(category => category.value === value);
  }, [categories]);

  /**
   * 메인 카테고리별 서브 카테고리 조회
   */
  const getSubCategoriesByMainCategory = useCallback((mainCategory: string): SubCategoryOption[] => {
    const category = getCategoryByValue(mainCategory);
    if (!category || !category.subCategories) {
      return [];
    }

    return category.subCategories.map(sub => ({
      value: sub.value,
      label: sub.label,
      description: sub.description,
      path: `${category.path}/${sub.value}`, // 경로 생성
    }));
  }, [getCategoryByValue]);

  /**
   * 메인 카테고리 옵션 생성 (기존 컴포넌트 호환성)
   */
  const mainCategoryOptions: MainCategoryOption[] = categories.map(category => ({
    value: category.value,
    label: category.label,
  }));

  // 자동 로드
  useEffect(() => {
    if (autoLoad) {
      loadCategories();
    }
  }, [autoLoad, loadCategories]);

  return {
    // 데이터
    categories,
    groupedCategories,
    mainCategoryOptions,
    
    // 상태
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    lastUpdated: loadingState.lastUpdated,
    
    // 메서드
    refreshCategories,
    getCategoryByValue,
    getSubCategoriesByMainCategory,
  };
}

/**
 * 특정 카테고리 조회 훅
 * 
 * @param value - 카테고리 값
 * @returns 카테고리 데이터 및 로딩 상태
 */
export function useCategory(value: string | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setCategory(null);
      setError(null);
      return;
    }

    const loadCategory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await ApiFetch.getCategoryByValue(value);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`카테고리 '${value}'를 찾을 수 없습니다.`);
          }
          throw new Error('카테고리 조회에 실패했습니다.');
        }

        const categoryData = await response.json();
        setCategory(categoryData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '카테고리 조회 중 오류가 발생했습니다.';
        setError(errorMessage);
        setCategory(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [value]);

  return {
    category,
    isLoading,
    error,
  };
}
