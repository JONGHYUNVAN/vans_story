import { NextResponse } from 'next/server';

const SEARCH_API_URL = process.env.SEARCH_API_URL || 'http://127.0.0.1:8000/api/v1/search';

// 운영 환경에서 환경 변수 체크
if (process.env.NODE_ENV === 'production' && !process.env.SEARCH_API_URL) {
  console.error('⚠️ SEARCH_API_URL 환경 변수가 운영 환경에서 설정되지 않았습니다!');
}

/**
 * 게시물 검색을 위한 API 라우트 핸들러 (BFF 프록시)
 * - 클라이언트의 요청을 받아 Django 검색 API로 전달하고 결과를 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { message: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // 운영 환경에서는 검색 서버 연결 오류 반환
    if (process.env.NODE_ENV === 'production') {
      console.log('🔍 Search API - Production mode, returning connection error for query:', query);
      return NextResponse.json(
        { 
          message: '검색 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'+process.env.SEARCH_API_URL,
          results: [],
          total: 0
        },
        { status: 503 }
      );
    }

    const encodedQuery = encodeURIComponent(query);
    const externalUrl = `${SEARCH_API_URL}/posts/?query=${encodedQuery}`;
    
    console.log('🔍 Search API - Development mode, searching external API:', externalUrl);
    
    // 개발 환경에서만 외부 API 호출
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // 필요에 따라 캐시 전략 설정
      next: {
        revalidate: 60, // 1분 캐시
      },
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      
      // HTML 응답인지 확인
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('External API returned HTML instead of JSON');
        return NextResponse.json(
          { 
            message: '검색 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
            results: [],
            total: 0
          },
          { status: 503 }
        );
      }
      
      try {
        const errorData = await response.json();
        return NextResponse.json(
          { message: errorData.message || '외부 API 서버에서 오류가 발생했습니다.' },
          { status: response.status }
        );
      } catch (jsonError) {
        return NextResponse.json(
          { message: '외부 API 서버에서 오류가 발생했습니다.' },
          { status: response.status }
        );
      }
    }

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('External API returned non-JSON response:', contentType);
      return NextResponse.json(
        { 
          message: '검색 서버에서 잘못된 응답을 받았습니다.',
          results: [],
          total: 0
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route search error:', error);
    return NextResponse.json(
      { 
        message: '내부 서버 오류가 발생했습니다.',
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
