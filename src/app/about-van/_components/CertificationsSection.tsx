'use client';

import { useTranslation } from '@/lib/i18n';
import type { CertificationItem, Tone } from '@/app/about-van/_types/portfolio';

// 카드 배경·테두리 색은 JSON의 tone 토큰으로만 고르고, 실제 클래스는 여기서 결정한다.
const TONE_CLASSES: Record<Tone, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
};

export default function CertificationsSection() {
  const { t } = useTranslation('about');
  const certifications: CertificationItem[] = t('AboutVan.certifications.items');

  return (
    <section className="py-20">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {t('AboutVan.certifications.title')}
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('AboutVan.certifications.description')}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className={`rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg ${TONE_CLASSES[cert.tone]} hover:scale-105`}
            >
              {/* Certificate Icon */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">{cert.icon}</span>
              </div>

              {/* Certificate Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.fullName}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{cert.issuer}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cert.date}</span>
                </div>

                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
