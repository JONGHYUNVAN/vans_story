'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { ExperienceItem } from '@/app/about-van/_types/portfolio';

export default function ExperienceSection() {
  const { t } = useTranslation('about');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const experiences: ExperienceItem[] = t('AboutVan.experience.items');
  const selected = experiences[selectedIndex];

  return (
    <section className="border-b border-gray-200 py-20 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {t('AboutVan.experience.title')}
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('AboutVan.experience.description')}
          </p>
        </div>

        {/* Experience Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
          {experiences.map((exp, index) => (
            <button
              key={exp.company}
              onClick={() => setSelectedIndex(index)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                selectedIndex === index
                  ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {exp.company}
            </button>
          ))}
        </div>

        {/* Experience Detail */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selected.position}
            </h3>
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
              <span className="font-medium">{selected.company}</span>
              <span>•</span>
              <span>{selected.period}</span>
              <span>•</span>
              <span>{selected.location}</span>
            </div>
          </div>

          <p className="leading-relaxed text-gray-700 dark:text-gray-300">{selected.description}</p>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('AboutVan.experience.achievements')}
            </h4>
            <ul className="space-y-2">
              {selected.achievements.map((achievement) => (
                <li key={achievement} className="flex items-start gap-3">
                  <span className="mt-1.5 text-sm text-gray-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('AboutVan.experience.techUsed')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
