'use client';

import { useTranslation } from '@/utils/i18n';
import { useTypewriter } from '@/hooks/useTypewriter';

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
  description: `여러 프로젝트를 직접 기획하고 개발하면서, 
  자연스럽게 실무에 필요한 백엔드 기술들을 익혀왔습니다.
  웹 서비스의 여러 기능들을 직접 설계하고 구현해보며, 
  백엔드 시스템이 어떻게 사용자 경험과 연결되는지를 고민합니다.
  코드 가독성과 유지보수성에 관심이 많고, 
  Swagger, readme, JavaDoc, JSDoc 등 여러 문서화 도구를 사용합니다.
  함께 만드는 프로젝트의 가치에 대해 고민하고 성장할 곳을 찾고 있습니다.`
};

const heroDataEn = {
  description: `Through planning and developing various projects, 
I have naturally learned backend technologies needed in practice.
By directly designing and implementing various web service features, 
I think about how backend systems connect to user experience.
I'm interested in code readability and maintainability, 
and use various documentation tools like Swagger, readme, JavaDoc, JSDoc.
I'm looking for a place to grow while thinking about the value of projects we build together.`
};

export function HeroSection() {
  const { t, locale } = useTranslation('about');
  
  const backendTermsKo = [
    '월요일보다 배포일이 더 무서운',
    '코드보다 주석이 더 긴',
    '신(新)기술이 신(神)기술인줄 아는',
    '테스트 코드만 열심히 짜는',
    'AI한테 화내는',
    '카페인으로 동작하는',
    '내 컴퓨터에선 잘 돌아가는',
    '작명이 제일 어려운'
  ];

  const backendTermsEn = [
    'more afraid of deployment than Monday',
    'writing more comments than code',
    'thinking new tech is godly tech',
    'writing test code diligently',
    'getting mad at AI',
    'powered by caffeine',
    'it works on my machine',
    'struggling most with naming'
  ];

  const backendTerms = locale === 'ko' ? backendTermsKo : backendTermsEn;
  const { text: typewriterText, style: typewriterStyle } = useTypewriter(backendTerms);

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
              {/* Typewriter Effect for greeting */}
              <div className="h-[10rem] md:h-[8rem] w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full">
                  <span style={typewriterStyle}>
                    {typewriterText}
                  </span>
                  <span className="animate-[blink_1s_steps(1)_infinite] text-gray-900 dark:text-white">|</span>
                </div>
              </div>
              <span className="text-gray-600 dark:text-gray-300">{t('AboutVan.hero.name')}</span>
            </h1>
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