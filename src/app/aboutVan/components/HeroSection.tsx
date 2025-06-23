'use client';

import { useTranslation } from '@/utils/i18n';

const socialLinksKo = [
  { name: 'GitHub', url: 'https://github.com/JONGHYUNVAN', icon: '🐱' },
  { name: 'Email', url: 'whdgus808@naver.com', icon: '📧' },
  { name: 'Blog', url: 'https://vansdevblog.online', icon: '📝' }
];

const socialLinksEn = [
  { name: 'GitHub', url: 'https://github.com/JONGHYUNVAN', icon: '🐱' },
  { name: 'Email', url: 'whdgus808@naver.com', icon: '📧' },
  { name: 'Blog', url: 'https://vansdevblog.online', icon: '📝' }
];

const heroDataKo = {
  description: `여러 프로젝트를 직접 기획하고 개발하며, JWT 기반 사용자 인증, 이미지 업로드 처리, 검색 기능 구현 등 실무에서 요구되는 백엔드 기능을 직접 구현해 보았습니다.
코드 품질과 시스템 확장성에 관심이 많아, GitHub Actions를 활용한 CI/CD 자동화, ELB(Elastic Load Balancer)의 healthcheck 기반 트래픽 분산 구성도 경험했습니다.
또한 협업과 유지보수성을 중요하게 생각하여, 팀 프로젝트에서는 API 문서를 위한 Swagger 및 각 언어의 Docs 작성, 테스트 코드 작성, GitHub를 통한 협업 경험을 쌓아가고 있습니다.`
};

const heroDataEn = {
  description: `I have directly planned and developed various projects, implementing backend features required in practice such as JWT-based user authentication, image upload processing, and search functionality.
With a strong interest in code quality and system scalability, I have also experienced CI/CD automation using GitHub Actions and traffic distribution configuration based on ELB (Elastic Load Balancer) health checks.
I value collaboration and maintainability, so in team projects, I am building experience in writing API documentation using Swagger, documentation in various languages, test code writing, and collaboration through GitHub.`
};

export function HeroSection() {
  const { t, locale } = useTranslation('about');

  // 언어에 따라 데이터 선택
  const socialLinks = locale === 'ko' ? socialLinksKo : socialLinksEn;
  const heroData = locale === 'ko' ? heroDataKo : heroDataEn;

  return (
    <section className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Main Content */}
        <div className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('AboutVan.hero.greeting')}
              <br />
              <span className="text-gray-600 dark:text-gray-300">{t('AboutVan.hero.name')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light">
              {t('AboutVan.hero.role')}
            </p>
          </div>

          {/* Description */}
          <div className="max-w-2xl">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {heroData.description}
            </p>
          </div>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('AboutVan.hero.contactInfo')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">📍</span>
                  <span className="text-gray-700 dark:text-gray-300">{t('AboutVan.hero.location')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">📧</span>
                  <p 
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    whdgus808@naver.com
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">💼</span>
                  <span className="text-gray-700 dark:text-gray-300">{t('AboutVan.hero.currentWork')}</span>
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
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
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