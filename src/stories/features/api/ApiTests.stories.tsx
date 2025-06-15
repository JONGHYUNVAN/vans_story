import type { Meta, StoryObj } from '@storybook/react';
import { withPadding } from '../../shared/decorators';
import { mockPostApi, mockAuthApi, createApiResponse } from '../../shared/mocks/apiData';
import { useState, useEffect } from 'react';

/**
 * # API 테스트 갤러리
 * 
 * 다양한 API 응답 상태를 시각적으로 테스트하고 확인할 수 있는 갤러리입니다.
 * 실제 API 호출 없이 모의 데이터를 사용하여 다양한 시나리오를 테스트할 수 있습니다.
 * 
 * ## 특징
 * - **모의 데이터**: 실제 API 호출 없이 테스트 가능
 * - **다양한 상태**: 성공, 실패, 로딩 등 모든 상태 시뮬레이션
 * - **실시간 UI**: 각 API 응답에 따른 UI 변화 확인
 * - **에러 핸들링**: 다양한 에러 상황 테스트
 * - **JSON 표시**: 실제 API 응답 데이터 확인
 * 
 * ## 사용법
 * 개발 및 테스트 환경에서 API 응답 시나리오를 확인할 때 사용합니다.
 * ```tsx
 * // 실제 컴포넌트에서는 이런 식으로 사용
 * const apiResponse = mockPostApi.getSingle;
 * ```
 */
const meta: Meta = {
  title: 'Features/API',
  decorators: [withPadding],
  parameters: {
    docs: {
      description: {
        component: 'API 응답 상태를 시각적으로 테스트하고 확인할 수 있는 갤러리입니다. 모의 데이터를 사용하여 다양한 시나리오를 테스트합니다.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

/**
 * API 응답 카드 컴포넌트
 */
interface ApiResponseCardProps {
  title: string;
  description: string;
  response: any;
  status?: 'success' | 'error' | 'loading';
}

function ApiResponseCard({ title, description, response, status = 'success' }: ApiResponseCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'loading': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">성공</span>;
      case 'error': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">에러</span>;
      case 'loading': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">로딩중</span>;
      default: return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {getStatusBadge()}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      {response.loading ? (
        <div className="flex items-center gap-2 p-4 bg-blue-100 rounded border border-blue-200">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-blue-700 font-medium">데이터를 불러오는 중...</span>
        </div>
      ) : response.error ? (
        <div className="p-4 bg-red-100 rounded border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 font-medium">❌ Error {response.status}</span>
          </div>
          <p className="text-red-700">{response.error}</p>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 font-medium">✅ Status {response.status}</span>
          </div>
          <pre className="text-xs text-gray-700 overflow-auto max-h-40">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * ## 포스트 API 테스트
 * 
 * **기능**: 포스트 CRUD 작업 테스트  
 * **응답**: 생성, 조회, 수정, 삭제 시나리오  
 * **상태**: 200, 201, 204 성공 응답  
 * **특징**: 
 * - 단일 포스트 조회 (GET)
 * - 포스트 목록 조회 (GET)
 * - 포스트 생성 (POST)
 * - 포스트 수정 (PATCH)
 * - 포스트 삭제 (DELETE)
 */
export const PostApiTests: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ApiResponseCard
        title="포스트 조회 (GET)"
        description="단일 포스트의 상세 정보를 가져옵니다."
        response={mockPostApi.getSingle}
        status="success"
      />
      
      <ApiResponseCard
        title="포스트 목록 (GET)"
        description="페이지네이션된 포스트 목록을 가져옵니다."
        response={mockPostApi.getList}
        status="success"
      />
      
      <ApiResponseCard
        title="포스트 생성 (POST)"
        description="새로운 포스트를 생성합니다."
        response={mockPostApi.create}
        status="success"
      />
      
      <ApiResponseCard
        title="포스트 수정 (PATCH)"
        description="기존 포스트를 수정합니다."
        response={mockPostApi.update}
        status="success"
      />
      
      <ApiResponseCard
        title="포스트 삭제 (DELETE)"
        description="포스트를 삭제합니다."
        response={mockPostApi.delete}
        status="success"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '포스트 관련 API의 모든 CRUD 작업을 테스트합니다. 각 응답 형태와 상태 코드를 확인할 수 있습니다.'
      }
    }
  }
};

/**
 * ## 인증 API 테스트
 * 
 * **기능**: 로그인/로그아웃 관련 테스트  
 * **응답**: 성공, 실패 시나리오  
 * **토큰**: JWT 토큰 관리 테스트  
 * **특징**: 
 * - 로그인 성공 (사용자 정보 + 토큰)
 * - 로그인 실패 (401 에러)
 * - 로그아웃 (세션 정리)
 * - 토큰 갱신 (리프레시 토큰)
 */
export const AuthApiTests: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ApiResponseCard
        title="로그인 성공"
        description="올바른 인증 정보로 로그인 성공"
        response={mockAuthApi.loginSuccess}
        status="success"
      />
      
      <ApiResponseCard
        title="로그인 실패"
        description="잘못된 인증 정보로 로그인 실패"
        response={mockAuthApi.loginFailure}
        status="error"
      />
      
      <ApiResponseCard
        title="로그아웃"
        description="안전한 로그아웃 처리"
        response={mockAuthApi.logoutSuccess}
        status="success"
      />
      
      <ApiResponseCard
        title="토큰 갱신"
        description="리프레시 토큰으로 액세스 토큰 갱신"
        response={mockAuthApi.refreshSuccess}
        status="success"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '인증 관련 API의 성공/실패 시나리오를 테스트합니다. JWT 토큰 관리도 포함됩니다.'
      }
    }
  }
};

/**
 * ## 에러 상태 테스트
 * 
 * **기능**: 다양한 에러 상황 시뮬레이션  
 * **상태**: 401, 403, 404, 500 에러  
 * **핸들링**: 에러 메시지와 UI 표시  
 * **특징**: 
 * - 인증 필요 (401 Unauthorized)
 * - 권한 없음 (403 Forbidden)
 * - 찾을 수 없음 (404 Not Found)
 * - 서버 에러 (500 Internal Server Error)
 */
export const ErrorStateTests: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ApiResponseCard
        title="인증 에러 (401)"
        description="로그인이 필요한 요청"
        response={createApiResponse.authError()}
        status="error"
      />
      
      <ApiResponseCard
        title="권한 에러 (403)"
        description="접근 권한이 없는 요청"
        response={createApiResponse.permissionError()}
        status="error"
      />
      
      <ApiResponseCard
        title="찾을 수 없음 (404)"
        description="존재하지 않는 리소스 요청"
        response={createApiResponse.notFoundError()}
        status="error"
      />
      
      <ApiResponseCard
        title="서버 에러 (500)"
        description="서버 내부 오류 발생"
        response={createApiResponse.error("서버에서 처리 중 오류가 발생했습니다.", 500)}
        status="error"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 HTTP 에러 상태를 시뮬레이션합니다. 각 에러 상황에 대한 적절한 UI 표시를 확인할 수 있습니다.'
      }
    }
  }
};

/**
 * ## 로딩 상태 테스트
 * 
 * **기능**: API 요청 중 로딩 상태 표시  
 * **애니메이션**: 스피너와 로딩 메시지  
 * **시뮬레이션**: 실제 네트워크 지연 모방  
 * **특징**: 
 * - 스피너 애니메이션
 * - 로딩 메시지 표시
 * - 사용자 경험 개선
 * - 네트워크 지연 시뮬레이션
 */
export const LoadingStateTest: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const response = isLoading 
      ? createApiResponse.loading()
      : mockPostApi.getSingle;

    return (
      <div className="max-w-md mx-auto">
        <ApiResponseCard
          title="로딩 상태 시뮬레이션"
          description="3초 후 데이터가 로드됩니다."
          response={response}
          status={isLoading ? "loading" : "success"}
        />
        
        {!isLoading && (
          <button
            onClick={() => setIsLoading(true)}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            다시 로딩하기
          </button>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'API 요청 중 로딩 상태를 시뮬레이션합니다. 스피너 애니메이션과 로딩 메시지를 확인할 수 있습니다.'
      }
    }
  }
};

/**
 * ## 전체 API 상태 비교
 * 
 * 모든 API 응답 상태를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.
 * 성공, 에러, 로딩 상태의 UI 차이를 직관적으로 확인할 수 있습니다.
 */
export const AllApiStates: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 성공 상태들 */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">✅ 성공 응답</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ApiResponseCard
            title="GET 200"
            description="데이터 조회 성공"
            response={mockPostApi.getSingle}
            status="success"
          />
          <ApiResponseCard
            title="POST 201"
            description="데이터 생성 성공"
            response={mockPostApi.create}
            status="success"
          />
          <ApiResponseCard
            title="DELETE 204"
            description="데이터 삭제 성공"
            response={mockPostApi.delete}
            status="success"
          />
        </div>
      </section>

      {/* 에러 상태들 */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">❌ 에러 응답</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ApiResponseCard
            title="401 Unauthorized"
            description="인증 필요"
            response={createApiResponse.authError()}
            status="error"
          />
          <ApiResponseCard
            title="403 Forbidden"
            description="권한 없음"
            response={createApiResponse.permissionError()}
            status="error"
          />
          <ApiResponseCard
            title="404 Not Found"
            description="리소스 없음"
            response={createApiResponse.notFoundError()}
            status="error"
          />
        </div>
      </section>

      {/* 로딩 상태 */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">⏳ 로딩 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ApiResponseCard
            title="데이터 로딩 중"
            description="서버에서 데이터를 가져오는 중"
            response={createApiResponse.loading()}
            status="loading"
          />
        </div>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 API 응답 상태를 한 번에 비교할 수 있는 종합 갤러리입니다. 성공, 에러, 로딩 상태의 UI 차이를 확인할 수 있습니다.'
      }
    }
  }
}; 