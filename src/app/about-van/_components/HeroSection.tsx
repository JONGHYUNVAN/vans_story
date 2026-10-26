'use client';

import { useTranslation } from '@/lib/i18n';
import { useTypewriter } from '@/hooks/useTypewriter';
import type { SocialLink } from '@/app/about-van/_types/portfolio';

export default function HeroSection() {
  const { t } = useTranslation('about');

  const typewriterTerms: string[] = t('AboutVan.hero.typewriterTerms');
  const socialLinks: SocialLink[] = t('AboutVan.hero.socialLinkItems');
  const { text: typewriterText, style: typewriterStyle } = useTypewriter(typewriterTerms);

  return (
    <section className="border-b border-gray-200 py-20 dark:border-gray-800">
      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* Left Side - Main Content */}
        <div className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl leading-tight font-bold text-gray-900 md:text-6xl dark:text-white">
              {/* Typewriter Effect for greeting */}
              <div className="relative h-40 w-full overflow-hidden md:h-32">
                <div className="absolute top-0 left-0 w-full">
                  <span style={typewriterStyle}>{typewriterText}</span>
                  <span className="animate-[blink_1s_steps(1)_infinite] text-gray-900 dark:text-white">
                    |
                  </span>
                </div>
              </div>
              <span className="text-gray-600 dark:text-gray-300">{t('AboutVan.hero.name')}</span>
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-2xl">
            <p className="leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-400">
              {t('AboutVan.hero.description')}
            </p>
          </div>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('AboutVan.hero.contactInfo')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">📍</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('AboutVan.hero.location')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">📧</span>
                  <p className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    {t('AboutVan.hero.email')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">💼</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('AboutVan.hero.currentWork')}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('AboutVan.hero.socialLinks')}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
