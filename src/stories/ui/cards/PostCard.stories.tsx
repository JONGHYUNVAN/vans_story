import type { Meta, StoryObj } from '@storybook/react';
import { withCentered, withPadding } from '../../shared/decorators';
import { createPostData } from '../../shared/mocks/postData';

// PostCard 컴포넌트들 import
import SpringPostCard from '@/components/ui/post/postcard/spring/PostCard';
import NewPostCard from '@/components/ui/post/postcard/new/PostCard';
import NestJSPostCard from '@/components/ui/post/postcard/nestjs/PostCard';
import JWTPostCard from '@/components/ui/post/postcard/jwt/PostCard';
import NextJSPostCard from '@/components/ui/post/postcard/nextjs/PostCard';
import AlgorithmPostCard from '@/components/ui/post/postcard/algorithm/PostCard';
import MongoDBPostCard from '@/components/ui/post/postcard/mongodb/PostCard';
import MariaDBPostCard from '@/components/ui/post/postcard/mariadb/PostCard';
import DockerPostCard from '@/components/ui/post/postcard/docker/PostCard';

/**
 * # PostCard 컴포넌트 갤러리
 * 
 * 다양한 기술과 프레임워크별로 디자인된 PostCard 컴포넌트들의 갤러리입니다.
 * 각 카드는 해당 기술의 브랜드 컬러와 테마를 반영한 고유한 스타일을 가지고 있습니다.
 * 
 * ## 특징
 * - **테마별 디자인**: 각 기술의 브랜드 컬러와 느낌을 반영
 * - **호버 인터랙션**: 마우스 오버 시 부드러운 애니메이션과 상세 정보 표시
 * - **반응형 레이아웃**: 다양한 화면 크기에 적응하는 유연한 디자인
 * - **일관된 구조**: 동일한 데이터 구조를 사용하면서도 각기 다른 시각적 표현
 * 
 * ## 사용법
 * 각 포스트 목록 페이지에서 해당하는 PostCard를 사용하면 됩니다.
 * ```tsx
 * <SpringPostCard post={postData} />
 * <AlgorithmPostCard post={postData} />
 * <NextJSPostCard post={postData} />
 * ```
 */
const meta: Meta = {
  title: 'UI/Cards/PostCard',
  decorators: [withPadding],
  parameters: {
    docs: {
      description: {
        component: '기술별로 테마가 다른 PostCard 갤러리입니다. 각 카드는 고유한 스타일과 브랜드 컬러를 가지고 있습니다.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

/**
 * ## Spring Boot PostCard
 * 
 * **테마**: 그린 그라데이션 다크 테마  
 * **컬러**: Spring 그린 (#6DB33F, #9DE67E)  
 * **배경**: 다크 그린 (#0c1511)  
 * **특징**: 
 * - 어두운 배경에 그린 포인트 컬러
 * - 호버 시 그린 그라데이션 구분선
 * - Spring 전용 썸네일 이미지
 * - 그라데이션 효과가 적용된 구분선
 */
export const Spring: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <SpringPostCard post={createPostData.spring()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spring Boot 포스트용 다크 그린 테마 PostCard입니다. 그라데이션 구분선과 Spring 브랜드 컬러가 특징입니다.'
      }
    }
  }
};

/**
 * ## Algorithm PostCard
 * 
 * **테마**: 깔끔한 화이트 테마  
 * **컬러**: 그레이 계열 (#6B7280)  
 * **배경**: 화이트 (#FFFFFF)  
 * **특징**: 
 * - 흰색 배경에 검정 테두리
 * - 깔끔하고 가독성 좋은 디자인
 * - 알고리즘 전용 썸네일 이미지
 * - 미니멀한 호버 효과
 */
export const Algorithm: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AlgorithmPostCard post={createPostData.algorithm()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '알고리즘 포스트용 화이트 테마 PostCard입니다. 깔끔하고 가독성이 좋은 디자인이 특징입니다.'
      }
    }
  }
};

/**
 * ## Next.js PostCard
 * 
 * **테마**: 블랙 미니멀 테마  
 * **컬러**: Next.js 블랙 (#000000)  
 * **배경**: 블랙 (#000000)  
 * **특징**: 
 * - 검정 배경에 흰색 텍스트
 * - 미니멀하고 세련된 디자인
 * - Next.js 전용 썸네일 이미지
 * - 블루 계열 호버 그림자
 */
export const NextJS: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <NextJSPostCard post={createPostData.nextjs()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Next.js 포스트용 블랙 테마 PostCard입니다. 미니멀한 디자인과 블루 호버 효과가 특징입니다.'
      }
    }
  }
};

/**
 * ## MongoDB PostCard
 * 
 * **테마**: 브라운 그라데이션 테마  
 * **컬러**: MongoDB 브라운 (#C19A6B, #8B6226)  
 * **배경**: 브라운 그라데이션 (#2c1d12 → #3a2617)  
 * **특징**: 
 * - 따뜻한 브라운 그라데이션 배경
 * - MongoDB 브랜드 컬러 적용
 * - 골드 계열 텍스트 컬러
 * - 브라운 테마 구분선
 */
export const MongoDB: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <MongoDBPostCard post={createPostData.mongodb()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'MongoDB 포스트용 브라운 테마 PostCard입니다. 따뜻한 그라데이션 배경과 골드 컬러가 특징입니다.'
      }
    }
  }
};

/**
 * ## Docker PostCard
 * 
 * **테마**: 블루 다크 테마  
 * **컬러**: Docker 블루 (#2496ED)  
 * **배경**: 다크 블루 (#0d1117)  
 * **특징**: 
 * - 어두운 배경에 블루 포인트
 * - Docker 브랜드 컬러 적용
 * - 블루 구분선과 호버 효과
 * - 컨테이너 느낌의 디자인
 */
export const Docker: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <DockerPostCard post={createPostData.docker()} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Docker 포스트용 블루 테마 PostCard입니다. 다크 배경과 Docker 브랜드 블루가 특징입니다.'
      }
    }
  }
};

/**
 * ## NestJS PostCard
 * 
 * **테마**: 빨간색 다크 테마  
 * **컬러**: NestJS 빨간색 (#E0234E)  
 * **배경**: 블랙 (#000000)  
 * **특징**: 
 * - 검정 배경에 빨간색 포인트
 * - NestJS 브랜드 컬러 적용
 * - 빨간색 구분선과 호버 그림자
 * - 강렬한 대비 효과
 */
export const NestJS: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <NestJSPostCard post={createPostData.custom({ 
        title: 'NestJS 마이크로서비스 아키텍처 구축하기',
        description: 'NestJS를 활용한 확장 가능한 마이크로서비스 아키텍처 설계와 구현 방법을 알아봅니다.',
        tags: ['NestJS', 'Microservices', 'TypeScript', 'Architecture'],
        topic: 'NestJS Advanced',
        theme: 'nestjs'
      })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'NestJS 포스트용 빨간색 테마 PostCard입니다. 검정 배경과 NestJS 브랜드 빨간색이 특징입니다.'
      }
    }
  }
};

/**
 * ## MariaDB PostCard
 * 
 * **테마**: 다크 그레이 그라데이션 테마  
 * **컬러**: MariaDB 그레이 (#A7B6BD, #2A3034)  
 * **배경**: 그레이 그라데이션 (#1A2024 → #2A3034)  
 * **특징**: 
 * - 차분한 그레이 그라데이션 배경
 * - 블루-그레이 텍스트 컬러
 * - 전문적이고 안정적인 느낌
 * - 은은한 그레이 구분선
 */
export const MariaDB: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <MariaDBPostCard post={createPostData.custom({ 
        title: 'MariaDB 성능 최적화와 인덱스 전략',
        description: 'MariaDB의 성능을 극대화하기 위한 인덱스 설계와 쿼리 최적화 기법을 다룹니다.',
        tags: ['MariaDB', 'Performance', 'Indexing', 'Database'],
        topic: 'MariaDB Optimization',
        theme: 'mariadb'
      })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'MariaDB 포스트용 그레이 테마 PostCard입니다. 차분한 그라데이션과 전문적인 느낌이 특징입니다.'
      }
    }
  }
};

/**
 * ## JWT PostCard
 * 
 * **테마**: 보안 다크 그린 테마  
 * **컬러**: 다크 그린 (#1E4D2B), 레드 (#FF3333)  
 * **배경**: 블랙 (#0a0a0a)  
 * **특징**: 
 * - 보안 느낌의 다크 테마
 * - 빨간색 테두리에서 그린으로 변화
 * - 보안 아이콘 배지
 * - 암호화/보안 전용 디자인
 */
export const JWT: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <JWTPostCard post={createPostData.custom({ 
        title: 'JWT 토큰 보안과 인증 전략',
        description: 'JWT(JSON Web Token)를 활용한 안전한 인증 시스템 구축과 보안 고려사항을 알아봅니다.',
        tags: ['JWT', 'Security', 'Authentication', 'Token'],
        topic: 'Security & Authentication',
        theme: 'jwt'
      })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'JWT 포스트용 보안 테마 PostCard입니다. 다크 그린과 보안 아이콘이 특징입니다.'
      }
    }
  }
};

/**
 * ## New PostCard (기본 테마)
 * 
 * **테마**: 기본 화이트 테마  
 * **컬러**: 기본 그레이 계열  
 * **배경**: 화이트 (#FFFFFF)  
 * **특징**: 
 * - 범용적으로 사용 가능한 기본 디자인
 * - 깔끔한 흰색 배경
 * - 그레이 구분선과 호버 효과
 * - 새로운 포스트용 기본 스타일
 */
export const New: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <NewPostCard post={createPostData.custom({ 
        title: '새로운 기술 트렌드와 개발 동향',
        description: '최신 개발 트렌드와 새로운 기술들을 소개하는 포스트입니다.',
        tags: ['Trends', 'Technology', 'Development', 'New'],
        topic: 'Tech Trends 2024',
        theme: 'new'
      })} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 화이트 테마 PostCard입니다. 범용적으로 사용할 수 있는 깔끔한 디자인이 특징입니다.'
      }
    }
  }
};

/**
 * ## 전체 PostCard 비교
 * 
 * 모든 PostCard를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.
 * 각 카드의 테마와 스타일 차이를 직관적으로 확인할 수 있습니다.
 */
export const AllPostCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 min-h-screen">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Spring Boot</h3>
        <SpringPostCard post={createPostData.spring()} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Algorithm</h3>
        <AlgorithmPostCard post={createPostData.algorithm()} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Next.js</h3>
        <NextJSPostCard post={createPostData.nextjs()} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">MongoDB</h3>
        <MongoDBPostCard post={createPostData.mongodb()} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Docker</h3>
        <DockerPostCard post={createPostData.docker()} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">NestJS</h3>
        <NestJSPostCard post={createPostData.custom({ 
          title: 'NestJS 마이크로서비스 아키텍처',
          description: 'NestJS 마이크로서비스 구축 가이드',
          tags: ['NestJS', 'Microservices'],
          theme: 'nestjs'
        })} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">MariaDB</h3>
        <MariaDBPostCard post={createPostData.custom({ 
          title: 'MariaDB 성능 최적화',
          description: 'MariaDB 인덱스와 쿼리 최적화',
          tags: ['MariaDB', 'Performance'],
          theme: 'mariadb'
        })} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">JWT Security</h3>
        <JWTPostCard post={createPostData.custom({ 
          title: 'JWT 보안 인증 전략',
          description: 'JWT 토큰 기반 안전한 인증',
          tags: ['JWT', 'Security'],
          theme: 'jwt'
        })} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">New (기본)</h3>
        <NewPostCard post={createPostData.custom({ 
          title: '새로운 기술 트렌드',
          description: '최신 개발 동향과 트렌드',
          tags: ['Trends', 'New'],
          theme: 'new'
        })} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 PostCard를 한 번에 비교할 수 있는 갤러리 뷰입니다. 각 테마의 특징을 직관적으로 확인할 수 있습니다.'
      }
    }
  }
}; 