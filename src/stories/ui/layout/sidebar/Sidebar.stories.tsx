import type { Meta, StoryObj } from '@storybook/react';

// 사이드바 컴포넌트들 import
import AlgorithmSidebar from '@/components/layout/sidebar/post/AlgorithmSidebar';
import SpringSidebar from '@/components/layout/sidebar/post/SpringSidebar';
import NextSidebar from '@/components/layout/sidebar/post/NextSidebar';
import MariaDBSidebar from '@/components/layout/sidebar/post/MariaDBSidebar';
import NestSidebar from '@/components/layout/sidebar/post/NestSidebar';
import DockerSidebar from '@/components/layout/sidebar/post/DockerSidebar';

/**
 * # 사이드바 컴포넌트 갤러리
 * 
 * 다양한 프레임워크와 기술별로 커스터마이징된 사이드바 컴포넌트들을 모아놓은 갤러리입니다.
 * 각 사이드바는 해당 기술의 브랜드 컬러와 테마를 반영한 독특한 디자인을 가지고 있습니다.
 * 
 * ## 특징
 * - **반응형 디자인**: 화면 크기에 따라 자동으로 축소/확장됩니다.
 * - **호버 인터랙션**: 마우스 오버 시 부드러운 애니메이션과 함께 확장됩니다.
 * - **브랜드 컬러**: 각 기술의 공식 컬러를 사용한 일관된 테마입니다.
 * - **네비게이션**: 카테고리별 포스트 목록과 직접 링크를 제공합니다.
 * 
 * ## 사용법
 * 각 포스트 뷰 페이지에서 해당하는 사이드바를 사용하면 됩니다.
 * ```tsx
 * <AlgorithmSidebar />
 * <SpringSidebar />
 * <NextSidebar />
 * ```
 */
const meta: Meta = {
  title: 'UI/Layout/Sidebar',
  parameters: {
    docs: {
      description: {
        component: '기술별로 테마가 다른 사이드바 갤러리입니다. 각 사이드바는 고유한 스타일과 브랜드 컬러를 가지고 있습니다.'
      }
    },
    layout: 'fullscreen',
  }
};

export default meta;

type Story = StoryObj;

/**
 * ## 알고리즘 사이드바
 * 
 * **테마**: 깔끔한 화이트 테마  
 * **컬러**: 그레이 계열 (#6B7280)  
 * **스타일**: 미니멀하고 심플한 디자인  
 * **특징**: 
 * - 흰색 배경에 회색 텍스트로 가독성이 뛰어남
 * - 검정 테두리로 명확한 경계 구분
 * - 호버 시 연한 그레이 하이라이트
 */
export const Algorithm: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '256px', height: '100vh' }}>
      <AlgorithmSidebar />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '알고리즘 포스트용 화이트 테마 사이드바입니다. 깔끔하고 가독성이 좋은 디자인이 특징입니다.'
      }
    }
  }
};

/**
 * ## Spring Boot 사이드바
 * 
 * **테마**: 그린 그라데이션 + 커스텀 배경 레이어  
 * **컬러**: Spring 그린 (#6DB33F)  
 * **스타일**: 다크 배경에 그린 포인트  
 * **특징**: 
 * - 특별한 배경 레이어 렌더링
 * - 그라데이션 배경 효과
 * - Spring 브랜드 컬러 적용
 * - 블러 효과가 적용된 헤더
 */
export const Spring: Story = {
  render: () => <SpringSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Spring Boot 포스트용 그린 테마 사이드바입니다. 커스텀 배경 레이어와 그라데이션 효과가 특징입니다.'
      }
    }
  }
};

/**
 * ## Next.js 사이드바
 * 
 * **테마**: 블랙 미니멀 + 원형 배경  
 * **컬러**: Next.js 블랙 (#000000)  
 * **스타일**: 미니멀한 다크 테마  
 * **특징**: 
 * - Next.js 아이콘에 흰색 원형 배경 적용
 * - 미니멀한 다크 그레이 텍스트
 * - 깔끔한 검정 테두리
 * - 심플하고 세련된 디자인
 */
export const NextJS: Story = {
  render: () => <NextSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Next.js 포스트용 블랙 테마 사이드바입니다. 미니멀한 디자인과 원형 아이콘 배경이 특징입니다.'
      }
    }
  }
};

/**
 * ## MariaDB 사이드바
 * 
 * **테마**: 다크 그레이 그라데이션  
 * **컬러**: MariaDB 다크 그레이 (#2A3034)  
 * **스타일**: 데이터베이스 전문가를 위한 다크 테마  
 * **특징**: 
 * - 그라데이션 배경 (#1A2024 → #2A3034)
 * - 블루-그레이 텍스트 컬러
 * - 전문적이고 안정적인 느낌
 * - 블러 효과 헤더
 */
export const MariaDB: Story = {
  render: () => <MariaDBSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'MariaDB 포스트용 다크 그레이 테마 사이드바입니다. 그라데이션 배경과 전문적인 느낌이 특징입니다.'
      }
    }
  }
};

/**
 * ## NestJS 사이드바
 * 
 * **테마**: 빨간색 미니멀  
 * **컬러**: NestJS 빨간색 (#E0234E)  
 * **스타일**: 간결한 다크 테마  
 * **특징**: 
 * - NestJS 브랜드 빨간색 아이콘
 * - 미니멀한 다크 그레이 텍스트
 * - 검정 배경에 깔끔한 디자인
 * - 심플하면서도 강렬한 포인트 컬러
 */
export const NestJS: Story = {
  render: () => <NestSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'NestJS 포스트용 빨간색 테마 사이드바입니다. NestJS 브랜드 컬러와 미니멀한 디자인이 특징입니다.'
      }
    }
  }
};

/**
 * ## Docker 사이드바
 * 
 * **테마**: 블루 그라데이션 + 커스텀 배경 레이어  
 * **컬러**: Docker 블루 (#2496ED)  
 * **스타일**: 컨테이너 중심의 다크 테마  
 * **특징**: 
 * - 특별한 배경 레이어 렌더링
 * - Docker 브랜드 블루 컬러
 * - 다크 배경 (#0d1117)
 * - 블러 효과와 그라데이션
 */
export const Docker: Story = {
  render: () => <DockerSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Docker 포스트용 블루 테마 사이드바입니다. 커스텀 배경 레이어와 Docker 브랜드 컬러가 특징입니다.'
      }
    }
  }
};

// Storybook용 사이드바 래퍼 컴포넌트
function SidebarWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden border" style={{ width: '280px', height: '380px' }}>
      <div className="text-center p-2 bg-gray-800 text-white font-semibold text-xs">{title}</div>
      <div className="relative overflow-auto" style={{ height: '500px', transform: 'scale(0.72)', transformOrigin: 'top left' }}>
        <div style={{ position: 'relative', width: '256px', height: '500px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * ## 전체 사이드바 비교
 * 
 * 모든 사이드바를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.
 * 각 사이드바의 테마와 스타일 차이를 직관적으로 확인할 수 있습니다.
 */
export const AllSidebars: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 320px)', 
      gridTemplateRows: 'repeat(2, 400px)',
      gap: '20px', 
      padding: '20px', 
      backgroundColor: '#f9fafb',
      justifyContent: 'center',
      alignContent: 'center',
      minHeight: '100vh'
    }}>
      <SidebarWrapper title="Algorithm">
        <AlgorithmSidebar />
      </SidebarWrapper>
      
      <SidebarWrapper title="Spring Boot">
        <SpringSidebar />
      </SidebarWrapper>
      
      <SidebarWrapper title="Next.js">
        <NextSidebar />
      </SidebarWrapper>
      
      <SidebarWrapper title="MariaDB">
        <MariaDBSidebar />
      </SidebarWrapper>
      
      <SidebarWrapper title="NestJS">
        <NestSidebar />
      </SidebarWrapper>
      
      <SidebarWrapper title="Docker">
        <DockerSidebar />
      </SidebarWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 사이드바를 한 번에 비교할 수 있는 갤러리 뷰입니다. 각 테마의 특징을 직관적으로 확인할 수 있습니다.'
      }
    }
  }
}; 