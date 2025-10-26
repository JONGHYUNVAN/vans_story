/**
 * 하위 카테고리 관리 훅
 * 기존 useCategories를 대체하며 명확한 네이밍 사용
 */

import { useState, useEffect } from 'react'
import { SubCategoryOption } from '@/types/post'
import { getSubCategoriesByMainCategory } from '@/constants/mainCategories'

export interface UseSubCategoriesReturn {
  subCategories: SubCategoryOption[]
  selectedSubCategory: SubCategoryOption | null
  setSelectedSubCategory: (subCategory: SubCategoryOption | null) => void
  isLoading: boolean
  error: string | null
  refreshSubCategories: () => void
}

export function useSubCategories(
  mainCategory: string, 
  language: string = 'ko'
): UseSubCategoriesReturn {
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryOption | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSubCategories = async () => {
    if (!mainCategory || !language) {
      setSubCategories([])
      setSelectedSubCategory(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 useSubCategories - mainCategory:', mainCategory, 'language:', language)
      
      const newSubCategories = getSubCategoriesByMainCategory(mainCategory, language)
      console.log('📋 로딩된 하위 카테고리들:', newSubCategories.length, '개')
      
      setSubCategories(newSubCategories)
      
      // 선택된 하위 카테고리가 없고 새 하위 카테고리가 있을 때만 첫 번째로 설정
      if (!selectedSubCategory && newSubCategories.length > 0) {
        console.log('🎯 첫 번째 하위 카테고리로 자동 선택:', newSubCategories[0].label)
        setSelectedSubCategory(newSubCategories[0])
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '하위 카테고리 로딩 실패'
      setError(errorMessage)
      console.error('❌ useSubCategories 에러:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubCategories()
  }, [mainCategory, language])

  const refreshSubCategories = () => {
    loadSubCategories()
  }

  return {
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
    isLoading,
    error,
    refreshSubCategories
  }
}

// 기존 useCategories와의 호환성을 위한 별칭 (점진적 마이그레이션용)
export const useCategories = useSubCategories
