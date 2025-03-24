import { main_categories } from '@/components/sidebar/categories';

export interface ThemeOption {
  value: string
  label: string
}

export interface CategoryOption {
  value: string
  label: string
  description?: string
  path?: string
}

export const THEMES: ThemeOption[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'nest', label: 'Nest.js' },
  { value: 'spring', label: 'Spring' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'docker', label: 'Docker' },
  { value: 'jwt', label: 'JWT' },
  { value: 'jest', label: 'Jest' },
  { value: 'cypress', label: 'Cypress' },
  { value: 'junit5', label: 'JUnit5' },
  { value: 'git', label: 'Git' },
  { value: 'algorithm', label: 'Algorithm' }
];

// 번역 데이터에서 테마별 카테고리 정보 추출
export const getCategoriesByTheme = (theme: string, language: string = 'ko') => {
  try {
    // 동적으로 번역 데이터 가져오기
    const messages = require(`@/messages/${language}.json`);
    const themeData = messages[theme.charAt(0).toUpperCase() + theme.slice(1)];
    
    if (!themeData?.categories) {
      return [];
    }

    // 모든 카테고리의 items를 하나의 배열로 변환
    const categories: CategoryOption[] = [];
    Object.entries(themeData.categories).forEach(([categoryKey, category]: [string, any]) => {
      if (category.items) {
        Object.entries(category.items).forEach(([itemKey, item]: [string, any]) => {
          categories.push({
            value: itemKey,
            label: item.title,
            description: item.description,
            path: item.path
          });
        });
      }
    });

    return categories;
  } catch (error) {
    console.error('카테고리 정보를 가져오는데 실패했습니다:', error);
    return [];
  }
};