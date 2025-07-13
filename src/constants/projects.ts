import { Project } from '@/interfaces/project';

/**
 * VansDevBlog 프로젝트 데이터
 */
export const vansDevBlogProject: Project = {
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
      description: 'React, Next.js 기반 프론트엔드',
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
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
      tech: ['Spring Boot', 'Kotlin', 'MariaDB', 'JWT', 'Spring Security'],
      features: [
        'JWT 기반 사용자 인증 및 권한 관리',
        'Spring Security를 활용한 보안 설정',
        'MariaDB 기반 사용자 데이터 관리',
        'CORS 지원 및 API 로깅'
      ]
    },
    {
      name: 'Backend - Post Service (NestJS)',
      description: 'TypeScript 기반 게시글 관리 서비스',
      tech: ['NestJS', 'TypeScript', 'MongoDB', 'Mongoose', 'JWT'],
      features: [
        '게시글 CRUD 및 페이지네이션',
        'MongoDB 기반 게시글 데이터 관리',
        'JWT 기반 인증 가드',
        '테마 및 카테고리별 게시글 분류'
      ]
    },
    {
      name: 'OAuth Authentication Server',
      description: 'OAuth 2.0 기반 소셜 로그인 중간 서버',
      tech: ['Next.js', 'TypeScript', 'OAuth 2.0', 'JWT', 'JOSE'],
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
      tech: ['Next.js', 'Sharp', 'AWS S3', 'WebP', 'TypeScript'],
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
      tech: ['Next.js', 'OpenAI API', 'TypeScript', 'React'],
      features: [
        'OpenAI GPT-4o-mini 모델 사용',
        'ChatGPT API 연동',
        '사용자 맞춤형 응답 생성',
        'CORS 지원'
      ]
    }
  ],
  architecture: {
    description: '마이크로서비스 아키텍처로 각 서비스가 독립적으로 배포되며 직접 통신합니다.',
    benefits: [
      '각 서비스별 독립적인 배포 및 관리 (각 백엔드 서버 및 db, 프론트엔드 서버, 각 api 라우트 서버)',
      '다양한 기술 스택 학습 및 적용 (Spring Boot , NestJS , Next.js)',
      '한 서버 장애 발생시에도 나머지 서비스는 정상 동작',
      '서비스별 최적화된 데이터베이스 선택 (MariaDB, MongoDB)',
      '기능별 코드 분리로 유지보수성 향상',
      '개인 프로젝트 내에서 풀스택 개발 경험 확장'
    ]
  },
  impact: '마이크로서비스 아키텍처 설계 및 구현, 독립적인 서비스 배포, 확장성 있는 시스템 구축',
  totalTech: ['Next.js', 'Spring Boot', 'Kotlin', 'NestJS', 'TypeScript', 'MariaDB', 'MongoDB', 'AWS S3', 'OpenAI API', 'JWT', 'OAuth 2.0', 'Tailwind CSS', 'Sharp', 'Storybook']
}; 