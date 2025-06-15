import type { Meta, StoryObj } from '@storybook/react';
import { withRedux, withFullscreen, withPadding } from '../../../shared/decorators/index';
import React from 'react';

// Header 컴포넌트들 import
import Header from '@/components/layout/header/Header';
import LanguageSelector from '@/components/layout/header/LanguageSelector';
import AuthButtons from '@/components/layout/header/AuthButtons';
import { PostHeader } from '@/app/post/new/components/PostHeader';

// ViewPostHeader를 위한 모킹된 래퍼 컴포넌트 (Next.js 라우터 없이 작동)
function MockedViewPostHeader({ postId }: { postId: string }) {
  return (
    <div className="border-b border-gray-100/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl text-white font-gamjaFlower">게시글 보기</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              onClick={() => {
                alert(`포스트 ${postId} 수정 페이지로 이동 (Storybook 모킹)`);
              }}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * # Header 컴포넌트 갤러리
 * 
 * 다양한 페이지에서 사용되는 헤더 컴포넌트들의 갤러리입니다.
 * 각 헤더는 해당 페이지의 기능과 맥락에 맞는 디자인과 기능을 제공합니다.
 * 
 * ## 특징
 * - **반응형 네비게이션**: 화면 크기에 따라 적응하는 유연한 메뉴 구조
 * - **호버 인터랙션**: 마우스 오버 시 부드러운 애니메이션으로 전체 메뉴 표시
 * - **인증 상태 관리**: 로그인/로그아웃 상태에 따른 동적 UI 변화
 * - **다국어 지원**: 언어 선택기를 통한 실시간 언어 변경
 * - **컨텍스트별 헤더**: 각 페이지의 특성에 맞는 전용 헤더
 * 
 * ## 사용법
 * 각 페이지의 목적에 맞는 헤더를 선택하여 사용하면 됩니다.
 * ```tsx
 * <Header />                    // 메인 헤더
 * <PostHeader />                // 포스트 작성/편집 헤더
 * <ViewPostHeader />            // 포스트 보기 헤더
 * ```
 */
const meta: Meta = {
  title: 'UI/Layout/Header',
  decorators: [withRedux],
  parameters: {
    docs: {
      description: {
        component: '다양한 페이지에서 사용되는 헤더 컴포넌트들의 갤러리입니다. 각 헤더는 페이지별 특성에 맞는 디자인과 기능을 제공합니다.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

/**
 * ## 메인 헤더
 * 
 * **위치**: 모든 페이지 상단  
 * **기능**: 전역 네비게이션, 언어 선택, 인증 관리  
 * **스타일**: 호버 시 확장되는 숨겨진 헤더  
 * **특징**: 
 * - 기본 상태에서는 "메뉴 보기" 텍스트만 표시
 * - 마우스 오버 시 전체 헤더 메뉴 표시
 * - 블러 효과가 적용된 반투명 배경
 * - 로그인 상태에 따른 개인화된 인사말
 * - 프로젝트, 소개 페이지로의 네비게이션
 */
export const MainHeader: Story = {
  render: () => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">메인 헤더 (호버 인터랙션)</h3>
          <p className="text-sm text-gray-500">상단에 마우스를 올려보세요. 헤더가 나타납니다!</p>
        </div>
        <div style={{ height: '200px', position: 'relative' }}>
          <Header isStorybook={true} />
          <div className="pt-20 p-4 text-center">
            <p className="text-gray-600">
              마우스를 상단에 올려보세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '메인 헤더 컴포넌트입니다. 호버 시 전체 메뉴가 나타나며, 언어 선택과 인증 기능을 제공합니다.'
      }
    }
  }
};

/**
 * ## 포스트 작성/편집 헤더
 * 
 * **위치**: 포스트 작성/편집 페이지  
 * **기능**: 임시저장, 게시글 발행  
 * **스타일**: 다크 테마의 고정 헤더  
 * **특징**: 
 * - 검정 배경에 블러 효과
 * - 임시저장과 발행 버튼 제공
 * - 상단에 고정되어 스크롤 시에도 접근 가능
 * - 포스트 작성 전용 액션 버튼들
 */
export const PostEditorHeader: Story = {
  render: () => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">포스트 작성/편집 헤더</h3>
          <p className="text-sm text-gray-500">임시저장과 발행 기능</p>
        </div>
        <div style={{ height: '200px', position: 'relative' }}>
          <PostHeader 
            postData={undefined}
            onSubmit={async (e) => {
              e.preventDefault();
              alert('게시글이 발행되었습니다!');
            }}
            onTempSave={() => {
              alert('임시저장되었습니다!');
            }}
          />
          <div className="pt-20 p-4 text-center">
            <p className="text-gray-600">
              포스트 작성/편집 시 사용되는 헤더입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '포스트 작성/편집 페이지에서 사용되는 헤더입니다. 임시저장과 발행 기능을 제공합니다.'
      }
    }
  }
};

/**
 * ## 포스트 보기 헤더
 * 
 * **위치**: 포스트 상세 보기 페이지  
 * **기능**: 포스트 수정으로 이동  
 * **스타일**: 다크 테마의 간결한 헤더  
 * **특징**: 
 * - 검정 배경에 블러 효과
 * - 포스트 수정 버튼 제공
 * - 상단에 고정되어 스크롤 중에도 접근 가능
 * - 포스트 보기 전용 액션 버튼
 */
export const PostViewHeader: Story = {
  render: () => (
    <div style={{ height: '200px', position: 'relative' }}>
      <MockedViewPostHeader postId="sample-post-id" />
      <div className="pt-20 p-4 text-center">
        <p className="text-gray-600">
          포스트 상세 보기 시 사용되는 헤더입니다.
        </p>
      </div>
    </div>
  ),
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '포스트 상세 보기 페이지에서 사용되는 헤더입니다. 포스트 수정 기능을 제공합니다.'
      }
    }
  }
};

/**
 * ## 언어 선택기
 * 
 * **기능**: 한국어/영어 언어 전환  
 * **위치**: 메인 헤더 우상단  
 * **스타일**: 드롭다운 메뉴 형태  
 * **특징**: 
 * - 국기 아이콘과 언어명 표시
 * - 드롭다운 형태의 언어 선택 메뉴
 * - 선택한 언어로 즉시 UI 변경
 * - 깔끔한 회색 테마 디자인
 */
export const LanguageSelectorComponent: Story = {
  render: () => (
    <div className="p-8 flex justify-center">
      <LanguageSelector />
    </div>
  ),
  decorators: [withPadding],
  parameters: {
    docs: {
      description: {
        story: '언어 선택기 컴포넌트입니다. 한국어와 영어 간 전환이 가능합니다.'
      }
    }
  }
};

/**
 * ## 인증 버튼
 * 
 * **기능**: 로그인/로그아웃 관리  
 * **위치**: 메인 헤더 우상단  
 * **상태**: 인증 상태에 따라 동적 변화  
 * **특징**: 
 * - 비로그인 시: "로그인" 버튼 표시
 * - 로그인 시: "로그아웃" 버튼 표시
 * - Redux 상태 관리와 연동
 * - 호버 시 색상 변화 효과
 */
export const AuthButtonsComponent: Story = {
  render: () => (
    <div className="p-8 flex justify-center gap-4">
      <div className="text-center">
        <p className="mb-4 text-sm text-gray-600">로그인 상태에 따라 버튼이 변합니다</p>
        <AuthButtons />
      </div>
    </div>
  ),
  decorators: [withPadding],
  parameters: {
    docs: {
      description: {
        story: '인증 버튼 컴포넌트입니다. 로그인 상태에 따라 버튼이 동적으로 변합니다.'
      }
    }
  }
};

/**
 * ## 전체 헤더 비교
 * 
 * 모든 헤더 컴포넌트를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.
 * 각 헤더의 용도와 스타일 차이를 직관적으로 확인할 수 있습니다.
 */
export const AllHeaders: Story = {
  render: () => (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      {/* 메인 헤더 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">메인 헤더 (호버 인터랙션)</h3>
          <p className="text-sm text-gray-500">상단에 마우스를 올려보세요</p>
        </div>
        <div className="relative h-32">
          <Header isStorybook={true} />
        </div>
      </div>

      {/* 포스트 작성 헤더 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">포스트 작성/편집 헤더</h3>
          <p className="text-sm text-gray-500">임시저장과 발행 기능</p>
        </div>
        <div className="relative h-20">
          <PostHeader 
            postData={undefined}
            onSubmit={async (e) => {
              e.preventDefault();
              alert('게시글 발행!');
            }}
            onTempSave={() => alert('임시저장!')}
          />
        </div>
      </div>

      {/* 포스트 보기 헤더 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">포스트 보기 헤더</h3>
          <p className="text-sm text-gray-500">포스트 수정 기능</p>
        </div>
        <div className="relative h-20">
          <MockedViewPostHeader postId="sample-post" />
        </div>
      </div>

      {/* 개별 컴포넌트들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">언어 선택기</h3>
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">인증 버튼</h3>
          <div className="flex justify-center">
            <AuthButtons />
          </div>
        </div>
      </div>
    </div>
  ),
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '모든 헤더 컴포넌트를 한 번에 비교할 수 있는 갤러리 뷰입니다. 각 헤더의 특징을 직관적으로 확인할 수 있습니다.'
      }
    }
  }
}; 