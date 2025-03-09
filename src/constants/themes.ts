import { main_categories } from '@/components/sidebar/categories';

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

// main_categories에서 테마별 카테고리 정보 추출
export const getCategoriesByTheme = (theme: string) => {
  for (const [category, items] of Object.entries(main_categories)) {
    const matchingItem = items.find(item => item.path.includes(`/post/view/${theme}`));
    if (matchingItem) {
      return [{
        value: category.toLowerCase(),
        label: category
      }];
    }
  }
  return [];
};