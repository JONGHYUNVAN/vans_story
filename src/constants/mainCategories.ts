/**
 * 메인 카테고리 관련 상수들
 * 기존 themes.ts를 대체하며 명확한 네이밍 사용
 */

import { MainCategoryOption, SubCategoryOption } from '@/types/post'
import { main_categories } from '@/interfaces/post/categories'
import { SiNestjs, SiSpring, SiMariadb, SiMongodb, SiNextdotjs, 
         SiDocker, SiJest, SiCypress, SiGit, SiJunit5 } from "react-icons/si"
import { TbBinaryTree2, TbDatabase } from "react-icons/tb"
import { RiShieldKeyholeLine } from "react-icons/ri"

// 카테고리 그룹 타입
export type CategoryGroup = 'frontend' | 'backend' | 'database' | 'devops' | 'testing' | 'cs'

// 그룹별 메인 카테고리
export const CATEGORY_GROUPS = {
  frontend: {
    label: '프론트엔드',
    categories: [
      { value: 'nextjs', label: 'Next.js', icon: SiNextdotjs, color: '#000000' },
    ]
  },
  backend: {
    label: '백엔드',
    categories: [
      { value: 'nestjs', label: 'Nest.js', icon: SiNestjs, color: '#E0234E' },
      { value: 'spring', label: 'Spring', icon: SiSpring, color: '#6DB33F' },
      { value: 'jwt', label: 'JWT', icon: RiShieldKeyholeLine, color: '#00B4CC' },
    ]
  },
  database: {
    label: 'DB',
    categories: [
      { value: 'database-theory', label: 'Database Theory', icon: TbDatabase, color: '#2563EB' },
      { value: 'mariadb', label: 'MariaDB', icon: SiMariadb, color: '#003545' },
      { value: 'mongodb', label: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    ]
  },
  devops: {
    label: 'DevOps',
    categories: [
      { value: 'docker', label: 'Docker', icon: SiDocker, color: '#2496ED' },
      { value: 'git', label: 'Git', icon: SiGit, color: '#F05032' },
    ]
  },
  testing: {
    label: '테스트',
    categories: [
      { value: 'jest', label: 'Jest', icon: SiJest, color: '#C21325' },
      { value: 'cypress', label: 'Cypress', icon: SiCypress, color: '#17202C' },
      { value: 'junit5', label: 'JUnit5', icon: SiJunit5, color: '#25A162' },
    ]
  },
  cs: {
    label: 'CS',
    categories: [
      { value: 'algorithm', label: 'Algorithm', icon: TbBinaryTree2, color: '#4CAF50' },
    ]
  }
} as const

// 메인 카테고리 목록 (기존 THEMES) - 모든 카테고리를 평탄화
export const MAIN_CATEGORIES: MainCategoryOption[] = [
  ...CATEGORY_GROUPS.frontend.categories,
  ...CATEGORY_GROUPS.backend.categories,
  ...CATEGORY_GROUPS.database.categories,
  ...CATEGORY_GROUPS.devops.categories,
  ...CATEGORY_GROUPS.testing.categories,
  ...CATEGORY_GROUPS.cs.categories,
] as MainCategoryOption[]

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
