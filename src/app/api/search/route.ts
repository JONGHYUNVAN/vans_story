import { NextResponse } from 'next/server';

const SEARCH_API_URL = process.env.SEARCH_API_URL || 'http://localhost:8000/api/v1/search';

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

    const encodedQuery = encodeURIComponent(query);
    const externalUrl = `${SEARCH_API_URL}/posts?query=${encodedQuery}`;
    
    // 서버 환경에서 외부 API 호출
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
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || '외부 API 서버에서 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route search error:', error);
    return NextResponse.json(
      { message: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
