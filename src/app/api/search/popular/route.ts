import { NextResponse } from 'next/server';

const SEARCH_API_URL = process.env.SEARCH_API_URL || 'https://port-0-vans-devblog-django-m7fb3ua7b5f728d5.sel4.cloudtype.app';

// 운영 환경에서 환경 변수 체크
if (process.env.NODE_ENV === 'production' && !process.env.SEARCH_API_URL) {
  console.error('⚠️ SEARCH_API_URL 환경 변수가 운영 환경에서 설정되지 않았습니다!');
}

/**
 * 인기 검색어를 가져오는 API 라우트 핸들러 (BFF 프록시)
 * - Django 검색 API에서 인기 검색어를 가져와 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: Request) {
  try {
    const externalUrl = `${SEARCH_API_URL}/api/v1/search/popular/`;
    
    // 외부 API 호출
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // 캐시 전략 설정 (인기 검색어는 자주 변하지 않으므로 더 긴 캐시)
      next: {
        revalidate: 300, // 5분 캐시
      },
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      
      // HTML 응답인지 확인
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('External API returned HTML instead of JSON');
        // 외부 API가 실패했을 때 빈 배열 반환
        return NextResponse.json({
          popular_searches: []
        });
      }
      
      try {
        const errorData = await response.json();
        return NextResponse.json(
          { message: errorData.message || '외부 API 서버에서 오류가 발생했습니다.' },
          { status: response.status }
        );
      } catch (jsonError) {
        // 오류 시 빈 배열 반환
        return NextResponse.json({
          popular_searches: []
        });
      }
    }

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('External API returned non-JSON response:', contentType);
      // 빈 배열 반환
      return NextResponse.json({
        popular_searches: []
      });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route popular search error:', error);
    // 오류 시 빈 배열 반환
    return NextResponse.json({
      popular_searches: []
    });
  }
}
