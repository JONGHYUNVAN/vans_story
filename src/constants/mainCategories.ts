/**
 * 메인 카테고리 관련 상수들
 * 기존 themes.ts를 대체하며 명확한 네이밍 사용
 */

import { MainCategoryOption, SubCategoryOption } from '@/types/post'
import { main_categories } from '@/interfaces/post/categories'

// 메인 카테고리 목록 (기존 THEMES)
export const MAIN_CATEGORIES: MainCategoryOption[] = [
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nestjs', label: 'Nest.js' },
  { value: 'spring', label: 'Spring' },
  { value: 'database-theory', label: 'Database Theory' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'docker', label: 'Docker' },
  { value: 'jwt', label: 'JWT' },
  { value: 'jest', label: 'Jest' },
  { value: 'cypress', label: 'Cypress' },
  { value: 'junit5', label: 'JUnit5' },
  { value: 'git', label: 'Git' },
  { value: 'algorithm', label: 'Algorithm' }
]

// 메인 카테고리 이름 매핑 (기존 THEME_NAME_MAPPING)
const MAIN_CATEGORY_NAME_MAPPING: { [key: string]: string } = {
  'nextjs': 'Nextjs',
  'nestjs': 'Nestjs',
  'spring': 'Spring',
  'database-theory': 'DatabaseTheory',
  'mariadb': 'MariaDB',
  'mongodb': 'MongoDB',
  'docker': 'Docker',
  'jwt': 'JWT',
  'jest': 'Jest',
  'cypress': 'Cypress',
  'junit5': 'JUnit5',
  'git': 'Git',
  'algorithm': 'Algorithm'
}

/**
 * 메인 카테고리별 하위 카테고리 목록 조회
 * 기존 getCategoriesByTheme 함수를 대체
 */
export const getSubCategoriesByMainCategory = (mainCategory: string, language: string = 'ko'): SubCategoryOption[] => {
  try {
    // 동적으로 번역 데이터 가져오기
    const messages = require(`@/messages/${language}.json`)
    const categoryName = MAIN_CATEGORY_NAME_MAPPING[mainCategory] || mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)
    const categoryData = messages[categoryName]
    
    if (!categoryData?.categories) {
      console.warn(`❌ 메인 카테고리의 하위 카테고리 없음: ${categoryName}`)
      return []
    }

    // 모든 카테고리의 items를 하나의 배열로 변환
    const subCategories: SubCategoryOption[] = []
    Object.entries(categoryData.categories).forEach(([categoryKey, category]: [string, any]) => {
      if (category.items) {
        Object.entries(category.items).forEach(([itemKey, item]: [string, any]) => {
          subCategories.push({
            value: itemKey,
            label: item.title,
            description: item.description,
            path: item.path
          })
        })
      }
    })

    return subCategories
  } catch (error) {
    console.error('❌ 하위 카테고리 정보를 가져오는데 실패했습니다:', error)
    return []
  }
}

/**
 * 메인 카테고리 값으로 라벨 조회
 */
export const getMainCategoryLabel = (value: string): string => {
  const category = MAIN_CATEGORIES.find(cat => cat.value === value)
  return category?.label || value
}

/**
 * 메인 카테고리 존재 여부 확인
 */
export const isValidMainCategory = (value: string): boolean => {
  return MAIN_CATEGORIES.some(cat => cat.value === value)
}

// 기존 코드와의 호환성을 위한 별칭들 (점진적 마이그레이션용)
export const THEMES = MAIN_CATEGORIES // 기존 THEMES 별칭
export const getCategoriesByTheme = getSubCategoriesByMainCategory // 기존 함수명 별칭
