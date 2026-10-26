/**
 * 하위 카테고리 관리 훅
 * 기존 useCategories를 대체하며 명확한 네이밍 사용
 */

import { useState, useMemo } from 'react';
import type { SubCategoryOption } from '@/types/post';
import { getSubCategoriesByMainCategory } from '@/constants/mainCategories';

export interface UseSubCategoriesReturn {
  subCategories: SubCategoryOption[];
  selectedSubCategory: SubCategoryOption | null;
  setSelectedSubCategory: (subCategory: SubCategoryOption | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshSubCategories: () => void;
}

export function useSubCategories(
  mainCategory: string,
  language: string = 'ko',
): UseSubCategoriesReturn {
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryOption | null>(null);

  // 하위 카테고리 목록은 동기 조회이므로 state 대신 렌더 중에 파생
  const { subCategories, error } = useMemo<{
    subCategories: SubCategoryOption[];
    error: string | null;
  }>(() => {
    if (!mainCategory || !language) {
      return { subCategories: [], error: null };
    }

    try {
      console.log('🔄 useSubCategories - mainCategory:', mainCategory, 'language:', language);

      const newSubCategories = getSubCategoriesByMainCategory(mainCategory, language);
      console.log('📋 로딩된 하위 카테고리들:', newSubCategories.length, '개');

      return { subCategories: newSubCategories, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '하위 카테고리 로딩 실패';
      console.error('❌ useSubCategories 에러:', err);
      return { subCategories: [], error: errorMessage };
    }
  }, [mainCategory, language]);

  // 메인 카테고리가 변경되면 항상 첫 번째 하위 카테고리로 자동 선택
  // (목록이 비어 있으면 기존 선택을 유지하고, 메인 카테고리가 없으면 선택 해제)
  const selectDefault = () => {
    if (!mainCategory || !language) {
      setSelectedSubCategory(null);
    } else if (subCategories.length > 0) {
      console.log('🎯 첫 번째 하위 카테고리로 자동 선택:', subCategories[0].label);
      setSelectedSubCategory(subCategories[0]);
    }
  };

  // mainCategory/language 변경 시 렌더 중에 기본 선택 적용 (effect 내 동기 setState 방지)
  const selectionKey = `${mainCategory}|${language}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState<string | null>(null);
  if (prevSelectionKey !== selectionKey) {
    setPrevSelectionKey(selectionKey);
    selectDefault();
  }

  const refreshSubCategories = () => {
    selectDefault();
  };

  return {
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
    // 동기 조회라 로딩 상태가 렌더에 반영된 적이 없으므로 항상 false
    isLoading: false,
    error,
    refreshSubCategories,
  };
}

// 기존 useCategories와의 호환성을 위한 별칭 (점진적 마이그레이션용)
export const useCategories = useSubCategories;
