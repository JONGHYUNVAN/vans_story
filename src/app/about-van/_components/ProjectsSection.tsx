'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type {
  ProjectCategoryKey,
  ProjectItem,
  ProjectStatusKey,
} from '@/app/about-van/_types/portfolio';

type CategoryFilter = 'all' | ProjectCategoryKey;

// 상태 배지 색은 JSON의 status 토큰으로만 고르고, 실제 클래스는 여기서 결정한다.
const STATUS_CLASSES: Record<ProjectStatusKey, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  deployed: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  inProgress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
};

// "2024.12" 형식을 비교 가능한 날짜로 바꿔 최신순 정렬
function toTime(date: string): number {
  return new Date(date.replace('.', '/')).getTime();
}

export default function ProjectsSection() {
  const { t } = useTranslation('about');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const projects: ProjectItem[] = t('AboutVan.projects.items');
  const categoryLabels: Record<CategoryFilter, string> = t('AboutVan.projects.categories');
  const categories = Object.keys(categoryLabels) as CategoryFilter[];

  const filteredProjects = projects
    .filter((project) => selectedCategory === 'all' || project.category === selectedCategory)
    .sort((a, b) => toTime(b.date) - toTime(a.date));

  return (
    <section className="border-b border-gray-200 py-20 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {t('AboutVan.projects.title')}
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('AboutVan.projects.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="rounded-sm bg-gray-100 px-2 py-1 dark:bg-gray-800">
                        {categoryLabels[project.category]}
                      </span>
                      <span>{project.date}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs ${STATUS_CLASSES[project.status]}`}
                      >
                        {t(`AboutVan.projects.status.${project.status}`)}
                      </span>
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                      >
                        {t('AboutVan.projects.githubLink')}
                      </a>
                    )}
                    {project.linkUrl && (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm bg-gray-900 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                      >
                        {t('AboutVan.projects.demoLink')}
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('AboutVan.projects.features')}
                  </h4>
                  <div className="grid gap-1 md:grid-cols-2">
                    {project.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="rounded-sm border-l-4 border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{t('AboutVan.projects.impact')}</span>{' '}
                    {project.impact}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('AboutVan.projects.techUsed')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
