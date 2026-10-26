'use client';

import { useTranslation } from '@/lib/i18n';
import type { SkillGroup } from '@/app/about-van/_types/portfolio';

export default function SkillsSection() {
  const { t } = useTranslation('about');
  const skillGroups: SkillGroup[] = t('AboutVan.skills.groups');

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
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t(`AboutVan.skills.categories.${group.category}`)}
              </h3>
              <div className="space-y-3">
                {group.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500" />
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
