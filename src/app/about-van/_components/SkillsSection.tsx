'use client';

import { useTranslation } from '@/lib/i18n';

const skillCategoriesKo = [
  {
    title: '언어',
    skills: ['Java', 'Kotlin', 'TypeScript'],
  },
  {
    title: '데이터베이스',
    skills: ['MySQL/MariaDB', 'Oracle', 'MongoDB'],
  },
  {
    title: '인증/보안',
    skills: ['JWT', 'Spring Security'],
  },
  {
    title: '개발 도구',
    skills: ['Git/GitHub', 'GitHub Actions', 'Postman', 'Swagger', 'Docker'],
  },
  {
    title: '클라우드 및 배포',
    skills: ['EC2', 'RDS', 'Route53', 'S3', 'CloudFront'],
  },
  {
    title: '테스트 및 문서화',
    skills: ['JUnit', 'MockMvc', 'Jest', 'JavaDoc/JSDoc', 'Storybook', 'Markdown Docs'],
  },
];

const skillCategoriesEn = [
  {
    title: 'Languages',
    skills: ['Java', 'Kotlin', 'TypeScript'],
  },
  {
    title: 'Databases',
    skills: ['MySQL/MariaDB', 'Oracle', 'MongoDB'],
  },
  {
    title: 'Auth/Security',
    skills: ['JWT', 'Spring Security'],
  },
  {
    title: 'Dev Tools',
    skills: ['Git/GitHub', 'GitHub Actions', 'Postman', 'Swagger', 'Docker'],
  },
  {
    title: 'Cloud & Deploy',
    skills: ['EC2', 'RDS', 'Route53', 'S3', 'CloudFront'],
  },
  {
    title: 'Test & Docs',
    skills: ['JUnit', 'MockMvc', 'Jest', 'JavaDoc/JSDoc', 'Storybook', 'Markdown Docs'],
  },
];

export function SkillsSection() {
  const { t, locale } = useTranslation('about');

  // 언어에 따라 데이터 선택
  const skillCategories = locale === 'ko' ? skillCategoriesKo : skillCategoriesEn;

  return (
    <section className="border-b border-gray-200 py-20 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {t('AboutVan.skills.title')}
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('AboutVan.skills.description')}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
