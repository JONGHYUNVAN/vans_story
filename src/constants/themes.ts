export interface ThemeOption {
  value: string
  label: string
}

export interface CategoryOption {
  value: string
  label: string
  themeValue: string
}

export const THEMES: ThemeOption[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'nest', label: 'NestJS' },
  { value: 'next', label: 'Next.js' },
  { value: 'react', label: 'React' },
]

export const CATEGORIES: CategoryOption[] = [
  { value: 'layout', label: '레이아웃', themeValue: 'next' },
  // 나중에 추가될 다른 카테고리들
]

// 특정 테마에 해당하는 카테고리만 필터링하는 헬퍼 함수
export const getCategoriesByTheme = (themeValue: string): CategoryOption[] => {
  return CATEGORIES.filter(category => category.themeValue === themeValue)
} 