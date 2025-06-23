'use client';

import { useState } from 'react';
import { useTranslation } from '@/utils/i18n';

const projectsKo = [
  {
    id: 1,
    title: 'Van\'s DevBlog',
    description: '현재 배포 중인 개인 기술 블로그입니다. Next.js와 NestJS를 활용한 풀스택 개발로, JWT 인증, 이미지 업로드, AI 채팅 기능을 구현했습니다. Tiptap 에디터를 사용한 마크다운 작성 기능도 포함되어 있습니다.',
    tech: ['Spring Boot','Kotlin','Next.js', 'Nest.js', 'TypeScript','MariaDB', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
    linkUrl: 'https://vans-story.vercel.app/',
    category: '개인',
    status: 'Deployed',
    date: '2024.12',
    impact: 'GitHub Actions CI/CD, Storybook 문서화 적용',
    features: [
      'JWT 기반 사용자 인증 시스템',
      'Tiptap 에디터를 활용한 포스트 작성',
      'AI 채팅 모달 기능',
      '이미지 업로드 및 최적화',
      '다국어 지원 (한국어/영어)',
      'Storybook을 활용한 컴포넌트 문서화'
    ]
  },
  {
    id: 2,
    title: 'Meta2day',
    description: '아키아카에서 A팀 팀장으로 참여한 백엔드 개발 프로젝트입니다. Spring Boot 기반의 백엔드 아키텍처를 설계하고 구현했으며, 팀원들과 협업하여 완성도 높은 결과물을 도출했습니다.',
    tech: ['Next.js','Nest.js', 'TypeScript', 'MySQL', 'AWS'],
    githubUrl: 'https://github.com/JONGHYUNVAN/Meta2day',
    linkUrl: 'https://meta2day.com/',
    category: '팀',
    status: 'Deployed',
    date: '2024.09',
    impact: 'A팀 팀장으로 프로젝트 리딩, 백엔드 아키텍처 설계',
    features: [
      'Spring Boot 기반 REST API 개발',
      'MySQL 데이터베이스 설계 및 최적화',
      'AWS 클라우드 인프라 구성',
      '팀 프로젝트 관리 및 일정 조율'
    ]
  },
  {
    id: 3,
    title: 'Library Project',
    description: '사용자들의 사이트와 책에 대한 관심을 유도하고, 로그인한 사용자들의 활동 데이터를 수집하는 도서관 웹 사이트입니다. 홈, 로그인, 마이페이지, 랭킹, 검색 기능을 구현했으며 반응형 모바일 지원도 포함되어 있습니다.',
    tech: ['Spring Boot','Java', 'TypeScript', 'CSS', 'JavaScript','MySQL'],
    githubUrl: 'https://github.com/JONGHYUNVAN/library-project',
    category: '개인',
    status: 'Completed',
    date: '2024.08',
    impact: '최초로 풀스택 개발 경험',
    features: [
      '사용자 인증 및 로그인 시스템',
      '도서 검색 및 랭킹 기능',
      '개인화된 마이페이지',
      '반응형 모바일 UI',
      '사용자 활동 데이터 수집'
    ]
  },
  {
    id: 4,
    title: 'MovieMovit',
    description: '외부 API를 활용하여 영화 정보와 이벤트 정보를 제공하는 웹 사이트입니다. Next.js와 NestJS를 활용한 풀스택 개발로, 사용자가 다양한 영화 관련 정보와 최신 이벤트를 확인할 수 있는 플랫폼을 구현했습니다.',
    tech: ['Next.js', 'NestJS', 'TypeScript', 'External APIs'],
    githubUrl: 'https://github.com/JONGHYUNVAN/moviemovit',
    category: '개인',
    status: 'Completed',
    date: '2024.06',
    impact: 'Next.js + NestJS 풀스택 개발, 외부 API 연동 및 활용 경험',
    features: [
      '외부 API를 활용한 영화 정보 제공',
      '영화 관련 이벤트 정보 조회',
      'Next.js 기반 반응형 프론트엔드',
      'NestJS 기반 백엔드 API 서버',
      'TypeScript를 활용한 타입 안전성 확보'
    ]
  },
  {
    id: 5,
    title: 'I Pill U',
    description: '코드스테이츠 부트캠프 메인 프로젝트로 개발한 영양제 맞춤 서비스입니다. 사용자의 건강 상태와 필요에 따라 영양제를 추천하고, 복용 일정을 관리할 수 있는 개인 맞춤형 헬스케어 플랫폼입니다. 백엔드 부팀장으로 참여했습니다.',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'MySQL', 'React'],
    githubUrl: 'https://github.com/codestates-seb/seb42_main_013',
    category: '팀',
    status: 'Completed',
    date: '2023.04',
    impact: '부트캠프 메인 프로젝트, 백엔드 부팀장으로 팀 리딩 경험',
    features: [
      'Spring Security + JWT 기반 사용자 인증',
      '개인 맞춤형 영양제 추천 시스템',
      '영양제 복용 일정 관리 (달력/타임라인)',
      'Naver Open API를 활용한 영양제 정보 검색',
      '바코드 인식을 통한 영양제 자동 등록',
      '모바일 최적화 반응형 UI'
    ]
  }
].sort((a, b) => {
  // 날짜를 비교하여 최신순으로 정렬
  const dateA = new Date(a.date.replace('.', '/'));
  const dateB = new Date(b.date.replace('.', '/'));
  return dateB.getTime() - dateA.getTime();
});

const projectsEn = [
  {
    id: 1,
    title: 'Van\'s DevBlog',
    description: 'A personal tech blog currently deployed. Full-stack development using Next.js and NestJS, implementing JWT authentication, image upload, and AI chat features. It also includes markdown writing functionality using the Tiptap editor.',
    tech: ['Spring Boot','Kotlin','Next.js', 'Nest.js', 'TypeScript','MariaDB', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
    linkUrl: 'https://vans-story.vercel.app/',
    category: 'Personal',
    status: 'Deployed',
    date: '2024.12',
    impact: 'Applied GitHub Actions CI/CD, Storybook documentation',
    features: [
      'JWT-based user authentication system',
      'Post creation using Tiptap editor',
      'AI chat modal functionality',
      'Image upload and optimization',
      'Multi-language support (Korean/English)',
      'Component documentation using Storybook'
    ]
  },
  {
    id: 2,
    title: 'Meta2day',
    description: 'A backend development project I participated in as Team A leader at AKIAKA. I designed and implemented a Spring Boot-based backend architecture and produced high-quality results through collaboration with team members.',
    tech: ['Next.js','Nest.js', 'TypeScript', 'MySQL', 'AWS'],
    githubUrl: 'https://github.com/JONGHYUNVAN/Meta2day',
    linkUrl: 'https://meta2day.com/',
    category: 'Team',
    status: 'Deployed',
    date: '2024.09',
    impact: 'Project leadership as Team A leader, backend architecture design',
    features: [
      'Spring Boot-based REST API development',
      'MySQL database design and optimization',
      'AWS cloud infrastructure configuration',
      'Team project management and scheduling'
    ]
  },
  {
    id: 3,
    title: 'Library Project',
    description: 'A library website designed to generate user interest in the site and books, and collect activity data from logged-in users. It implements home, login, my page, ranking, and search features with responsive mobile support.',
    tech: ['Spring Boot','Java', 'TypeScript', 'CSS', 'JavaScript','MySQL'],
    githubUrl: 'https://github.com/JONGHYUNVAN/library-project',
    category: 'Personal',
    status: 'Completed',
    date: '2024.08',
    impact: 'First full-stack development experience',
    features: [
      'User authentication and login system',
      'Book search and ranking functionality',
      'Personalized my page',
      'Responsive mobile UI',
      'User activity data collection'
    ]
  },
  {
    id: 4,
    title: 'MovieMovit',
    description: 'A website that provides movie information and event information using external APIs. Full-stack development using Next.js and NestJS, implementing a platform where users can check various movie-related information and latest events.',
    tech: ['Next.js', 'NestJS', 'TypeScript', 'External APIs'],
    githubUrl: 'https://github.com/JONGHYUNVAN/moviemovit',
    category: 'Personal',
    status: 'Completed',
    date: '2024.06',
    impact: 'Next.js + NestJS full-stack development, external API integration and utilization experience',
    features: [
      'Movie information provision using external APIs',
      'Movie-related event information inquiry',
      'Next.js-based responsive frontend',
      'NestJS-based backend API server',
      'Type safety using TypeScript'
    ]
  },
  {
    id: 5,
    title: 'I Pill U',
    description: 'A personalized supplement service developed as the main project of Code States bootcamp. A personalized healthcare platform that recommends supplements based on users\' health conditions and needs, and manages dosing schedules. I participated as backend sub-leader.',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'MySQL', 'React'],
    githubUrl: 'https://github.com/codestates-seb/seb42_main_013',
    category: 'Team',
    status: 'Completed',
    date: '2023.04',
    impact: 'Bootcamp main project, team leadership experience as backend sub-leader',
    features: [
      'Spring Security + JWT-based user authentication',
      'Personalized supplement recommendation system',
      'Supplement dosing schedule management (calendar/timeline)',
      'Supplement information search using Naver Open API',
      'Automatic supplement registration through barcode recognition',
      'Mobile-optimized responsive UI'
    ]
  }
].sort((a, b) => {
  // 날짜를 비교하여 최신순으로 정렬
  const dateA = new Date(a.date.replace('.', '/'));
  const dateB = new Date(b.date.replace('.', '/'));
  return dateB.getTime() - dateA.getTime();
});

const categoriesKo = ['All', '개인', '팀'];
const categoriesEn = ['All', 'Personal', 'Team'];

const statusLabelsKo = {
  'Completed': '완료',
  'Deployed': '배포중',
  'InProgress': '진행중'
};

const statusLabelsEn = {
  'Completed': 'Completed',
  'Deployed': 'Deployed',
  'InProgress': 'In Progress'
};

export function ProjectsSection() {
  const { t, locale } = useTranslation('about');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 언어에 따라 데이터 선택
  const projects = locale === 'ko' ? projectsKo : projectsEn;
  const categories = locale === 'ko' ? categoriesKo : categoriesEn;
  const statusLabels = locale === 'ko' ? statusLabelsKo : statusLabelsEn;

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('AboutVan.projects.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {t('AboutVan.projects.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                        {project.category}
                      </span>
                      <span>{project.date}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'Completed'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : project.status === 'Deployed'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}>
                        {statusLabels[project.status as keyof typeof statusLabels] || project.status}
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
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {project.linkUrl && (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                      >
                        Link
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Features */}
                {project.features && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {locale === 'ko' ? '주요 기능' : 'Key Features'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-1">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded border-l-4 border-gray-300 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{locale === 'ko' ? '성과:' : 'Impact:'}</span> {project.impact}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {locale === 'ko' ? '사용 기술' : 'Technologies Used'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
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