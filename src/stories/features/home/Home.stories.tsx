import type { Meta, StoryObj } from '@storybook/react';
import { withFullscreen, withRedux } from '../../shared/decorators/index';

// 홈 페이지 컴포넌트들 import
import { BackgroundVideo, BlogTitle, MainContent } from '@/components/features/home';
import TypewriterSection from '@/components/features/home/TypewriterSection';
import TypewriterText from '@/components/features/home/TypewriterText';

/**
 * # 홈 페이지 컴포넌트 갤러리
 * 
 * 홈 페이지를 구성하는 다양한 컴포넌트들의 갤러리입니다.
 * 각 컴포넌트는 홈 페이지의 특별한 부분을 담당하며, 사용자에게 강력한 첫인상을 제공합니다.
 * 
 * ## 특징
 * - **배경 비디오**: 자동 재생되는 풀스크린 배경 비디오
 * - **타이핑 효과**: 동적으로 변하는 텍스트와 커서 애니메이션
 * - **브랜드 아이덴티티**: 일관된 디자인과 색상 체계
 * - **기술 스택 표시**: 시각적으로 매력적인 기술 스택 소개
 * - **반응형 디자인**: 모든 디바이스에서 완벽한 표시
 * 
 * ## 사용법
 * 홈 페이지에서 각 컴포넌트를 조합하여 사용합니다.
 * ```tsx
 * <BackgroundVideo />
 * <BlogTitle />
 * <TypewriterSection />
 * <MainContent />
 * ```
 */
const meta: Meta = {
  title: 'Features/Home',
  decorators: [withRedux],
  parameters: {
    docs: {
      description: {
        component: '홈 페이지를 구성하는 주요 컴포넌트들의 갤러리입니다. 각 컴포넌트는 사용자에게 강력한 첫인상을 제공합니다.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

/**
 * ## 전체 홈 페이지
 * 
 * **구성**: 모든 홈 페이지 컴포넌트의 완전한 조합  
 * **높이**: 65vh (상단) + 콘텐츠 영역  
 * **배경**: 비디오 배경 + 오버레이 효과  
 * **특징**: 
 * - 전체 화면 비디오 배경
 * - 중앙 정렬된 타이틀과 타이핑 효과
 * - 하단 기술 스택 소개 영역
 * - 어두운 오버레이로 텍스트 가독성 향상
 */
export const FullHomePage: Story = {
  render: () => (
    <>
      <div className="h-[65vh] relative overflow-hidden w-full">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto w-full px-4 h-full flex flex-col items-center justify-center space-y-12 text-center">
            <BlogTitle />
            <TypewriterSection />
          </div>
        </div>
      </div>
      <MainContent />
    </>
  ),
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '완전한 홈 페이지 컴포넌트입니다. 비디오 배경, 타이틀, 타이핑 효과, 기술 스택 소개가 모두 포함되어 있습니다.'
      }
    }
  }
};

/**
 * ## 배경 비디오
 * 
 * **파일**: `/Home_background.webm`  
 * **기능**: 자동 재생, 무한 반복, 음소거  
 * **스타일**: 전체 화면 커버, 인라인 재생  
 * **특징**: 
 * - 자동 재생 및 무한 반복
 * - 모바일에서도 인라인 재생 지원
 * - 음소거 상태로 재생
 * - 전체 화면을 자연스럽게 커버
 */
export const BackgroundVideoComponent: Story = {
  render: () => (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      {/* 배경 비디오 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">배경 비디오</h3>
          <p className="text-sm text-gray-500">자동 재생 풀스크린 배경</p>
        </div>
        <div className="relative h-64">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">배경 비디오 재생 중</p>
          </div>
        </div>
      </div>
    </div>
  ),
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '홈 페이지의 배경 비디오 컴포넌트입니다. 자동 재생되며 전체 화면을 자연스럽게 채웁니다.'
      }
    }
  }
};

/**
 * ## 블로그 타이틀
 * 
 * **텍스트**: "Van's Dev Blog"  
 * **스타일**: 둥근 테두리, 투명 배경, 흰색 텍스트  
 * **장식**: 하단 삼각형 화살표  
 * **특징**: 
 * - 깔끔한 둥근 테두리 디자인
 * - 투명한 배경으로 비디오와 조화
 * - 하단 화살표로 시각적 포인트 제공
 * - 브랜드 아이덴티티를 강화하는 폰트
 */
export const BlogTitleComponent: Story = {
  name: '블로그 타이틀',
  render: () => (
    <div className="h-64 bg-black flex items-center justify-center">
      <BlogTitle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '블로그 타이틀 컴포넌트입니다. 둥근 테두리와 하단 화살표로 브랜드 아이덴티티를 표현합니다.'
      }
    }
  }
};

/**
 * ## 타이핑 효과 섹션
 * 
 * **구성**: TypewriterText 컴포넌트 래퍼  
 * **효과**: 동적으로 변하는 텍스트와 커서 애니메이션  
 * **텍스트**: "World", "Developer", "Everyone" 순환  
 * **특징**: 
 * - "Hello," 고정 텍스트 + 동적 텍스트
 * - 부드러운 타이핑 효과 애니메이션
 * - 깜빡이는 커서 효과
 * - 여러 텍스트 간 자연스러운 전환
 */
export const TypewriterSectionComponent: Story = {
  render: () => (
    <div className="h-64 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <TypewriterSection />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '타이핑 효과 섹션 컴포넌트입니다. 동적으로 변하는 텍스트와 커서 애니메이션을 제공합니다.'
      }
    }
  }
};

/**
 * ## 타이핑 텍스트 (단일)
 * 
 * **텍스트**: 예시 "Developer"  
 * **구조**: "Hello," + 동적 텍스트 + 커서  
 * **애니메이션**: 커서 깜빡임  
 * **특징**: 
 * - 큰 폰트 사이즈 (text-6xl)
 * - 흰색 텍스트로 가독성 확보
 * - 중앙 정렬 레이아웃
 * - 커서 애니메이션으로 타이핑 느낌 강화
 */
export const TypewriterTextComponent: Story = {
  render: () => (
    <div className="h-64 bg-black flex items-center justify-center">
      <TypewriterText 
        text="Developer" 
        style={{ color: '#ffffff', fontFamily: 'inherit' }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '단일 타이핑 텍스트 컴포넌트입니다. "Hello," 텍스트와 함께 동적 텍스트를 표시합니다.'
      }
    }
  }
};

/**
 * ## 메인 콘텐츠
 * 
 * **배경**: 다크 그레이 + 그리드 패턴  
 * **구성**: 소개 텍스트 + 기술 스택 태그  
 * **카드**: 그레이 배경의 둥근 카드 형태  
 * **특징**: 
 * - 그리드 패턴 배경으로 기술적 느낌
 * - 기술 스택별 아이콘과 호버 효과
 * - 카드 형태의 깔끔한 레이아웃
 * - 다국어 지원 (i18n)
 * - 단계별 정보 표시 (인사말 → 기술 소개 → 마무리)
 */
export const MainContentComponent: Story = {
  render: () => <MainContent />,
  parameters: {
    docs: {
      description: {
        story: '메인 콘텐츠 컴포넌트입니다. 블로그 소개와 기술 스택 정보를 카드 형태로 표시합니다.'
      }
    }
  }
};

/**
 * ## 전체 컴포넌트 비교
 * 
 * 모든 홈 페이지 컴포넌트를 개별적으로 확인할 수 있는 갤러리 뷰입니다.
 * 각 컴포넌트의 특징과 스타일을 직관적으로 비교할 수 있습니다.
 */
export const AllHomeComponents: Story = {
  render: () => (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      {/* 배경 비디오 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">배경 비디오</h3>
          <p className="text-sm text-gray-500">자동 재생 풀스크린 배경</p>
        </div>
        <div className="relative h-64">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">배경 비디오 재생 중</p>
          </div>
        </div>
      </div>

      {/* 블로그 타이틀 */}
      <div className="bg-black rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">블로그 타이틀</h3>
          <p className="text-sm text-gray-500">브랜드 아이덴티티 표현</p>
        </div>
        <div className="h-32 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <BlogTitle />
        </div>
      </div>

      {/* 타이핑 효과 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">타이핑 효과</h3>
          <p className="text-sm text-gray-500">동적 텍스트 애니메이션</p>
        </div>
        <div className="h-32 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <TypewriterSection />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h3 className="font-semibold text-gray-700">메인 콘텐츠</h3>
          <p className="text-sm text-gray-500">소개글과 기술 스택</p>
        </div>
        <div className="p-0">
          <MainContent />
        </div>
      </div>
    </div>
  ),
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '모든 홈 페이지 컴포넌트를 한 번에 비교할 수 있는 갤러리 뷰입니다.'
      }
    }
  }
}; 