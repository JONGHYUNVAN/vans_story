'use client';

import { useState } from 'react';

const vansDevBlogProject = {
  id: 'vansdevblog',
  title: 'VansDevBlog - 마이크로서비스 기반 풀스택 블로그',
  description: '현재 배포 중인 개인 기술 블로그입니다. 마이크로서비스 아키텍처를 적용하여 6개의 독립적인 서비스로 구성되어 있습니다.',
  deployUrl: 'https://vansdevblog.online/',
  githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
  status: 'Deployed',
  date: '2024.12',
  category: '개인',
  services: [
    {
      name: 'Frontend (Next.js)',
      description: 'React 19, Next.js 15 기반 프론트엔드',
      tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Storybook'],
      features: [
        '타이핑 효과가 있는 인터랙티브 홈페이지',
        'JWT 기반 사용자 인증 시스템',
        'Tiptap 에디터를 활용한 마크다운 작성',
        '다국어 지원 (한국어/영어)',
        'Storybook을 활용한 컴포넌트 문서화',
        '반응형 디자인'
      ]
    },
    {
      name: 'Backend - User Service (Spring Boot)',
      description: 'Kotlin 기반 사용자 관리 및 인증 서비스',
      tech: ['Spring Boot 3.5.0', 'Kotlin 1.9.22', 'MariaDB', 'JWT', 'Spring Security'],
      features: [
        'JWT 기반 사용자 인증 및 권한 관리',
        'Spring Security를 활용한 보안 설정',
        'MariaDB 기반 사용자 데이터 관리',
        'CORS 지원 및 API 로깅',
        'Swagger/OpenAPI 문서화',
        'CloudType 512MB 환경 최적화'
      ]
    },
    {
      name: 'Backend - Post Service (NestJS)',
      description: 'TypeScript 기반 게시글 관리 서비스',
      tech: ['NestJS 11.0.0', 'TypeScript', 'MongoDB', 'Mongoose', 'JWT'],
      features: [
        '게시글 CRUD 및 페이지네이션',
        'MongoDB 기반 게시글 데이터 관리',
        'JWT 기반 인증 가드',
        'Swagger API 문서화',
        '테마 및 카테고리별 게시글 분류',
        'TypeDoc 문서 자동 생성'
      ]
    },
    {
      name: 'OAuth Authentication Server',
      description: 'OAuth 2.0 기반 소셜 로그인 중간 서버',
      tech: ['Next.js 15.3.3', 'TypeScript', 'OAuth 2.0', 'JWT', 'JOSE'],
      features: [
        'Google, Kakao OAuth 2.0 지원',
        'CSRF 방지를 위한 state 파라미터 검증',
        'OAuth 토큰 즉시 폐기로 보안 강화',
        '최소 정보 전달 (사용자 ID만)',
        '포괄적인 에러 핸들링',
        'CORS 지원'
      ]
    },
    {
      name: 'Image Processing Service',
      description: 'AWS S3 기반 이미지 업로드 및 처리 서비스',
      tech: ['Next.js 15.3.1', 'Sharp', 'AWS S3', 'WebP', 'TypeScript'],
      features: [
        'Sharp 라이브러리를 사용한 WebP 변환',
        'AWS S3 멀티파트 업로드',
        '이미지 품질 최적화 (80-85%)',
        '메타데이터 추출 (너비, 높이, 포맷)',
        '고유 파일명 생성으로 중복 방지',
        '최대 5MB 파일 크기 제한'
      ]
    },
    {
      name: 'AI Chat Service',
      description: 'OpenAI API 기반 AI 채팅 서비스',
      tech: ['Next.js 15', 'OpenAI API', 'TypeScript', 'React 19'],
      features: [
        'OpenAI GPT-4o-mini 모델 사용',
        'ChatGPT API 연동',
        '사용자 맞춤형 응답 생성',
        'API 사용량 모니터링',
        'CORS 지원',
        '에러 핸들링 및 로깅'
      ]
    }
  ],
  architecture: {
    description: '마이크로서비스 아키텍처로 각 서비스가 독립적으로 배포되며 API Gateway를 통해 통신합니다.',
    benefits: [
      '서비스별 독립적인 배포 및 확장',
      '기술 스택의 다양성 (Spring Boot + NestJS)',
      '장애 격리 및 복원력 향상',
      '개발팀 분리 및 병렬 개발 가능',
      '서비스별 최적화된 데이터베이스 선택'
    ]
  },
  impact: '마이크로서비스 아키텍처 설계 및 구현, 독립적인 서비스 배포, 확장성 있는 시스템 구축',
  totalTech: ['Next.js 15', 'Spring Boot', 'Kotlin', 'NestJS', 'TypeScript', 'MariaDB', 'MongoDB', 'AWS S3', 'OpenAI API', 'JWT', 'OAuth 2.0', 'Tailwind CSS', 'Sharp', 'Storybook']
};

export default function ProjectsPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Projects
          </h1>
          <p className="text-lg text-gray-600">
            개발 프로젝트들과 아키텍처를 소개합니다.
          </p>
        </div>

        {/* VansDevBlog Project */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {vansDevBlogProject.title}
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {vansDevBlogProject.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {vansDevBlogProject.status}
                </span>
                <span className="text-gray-500">{vansDevBlogProject.date}</span>
                <span className="text-gray-500">{vansDevBlogProject.category}</span>
              </div>
              <div className="flex gap-4">
                <a
                  href={vansDevBlogProject.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  사이트 방문
                </a>
                <a
                  href={vansDevBlogProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {vansDevBlogProject.totalTech.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Architecture */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">아키텍처</h3>
            <p className="text-gray-600 mb-4">{vansDevBlogProject.architecture.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vansDevBlogProject.architecture.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">마이크로서비스 구성</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vansDevBlogProject.services.map((service, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedService === service.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(
                    selectedService === service.name ? null : service.name
                  )}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {service.tech.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{service.tech.length - 3} more
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-blue-600">
                    {selectedService === service.name ? '접기' : '자세히 보기'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Details */}
          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              {vansDevBlogProject.services
                .filter(service => service.name === selectedService)
                .map((service, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold mb-3">{service.name}</h4>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">기술 스택</h5>
                      <div className="flex flex-wrap gap-2">
                        {service.tech.map((tech) => (
                          <span
                            key={tech}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">주요 기능</h5>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Impact */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">프로젝트 임팩트</h3>
            <p className="text-gray-700">{vansDevBlogProject.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 