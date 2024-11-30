/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // 지원할 언어 목록
    locales: ['ko', 'en'],
    // 기본 언어
    defaultLocale: 'ko',
    // 브라우저/시스템 언어 자동 감지
    localeDetection: true,
    // 도메인별 언어 설정 (선택사항)
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'ko',
      },
      {
        domain: 'example.en',
        defaultLocale: 'en',
      },
    ],
  },
};

export default nextConfig; 