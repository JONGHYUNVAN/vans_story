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