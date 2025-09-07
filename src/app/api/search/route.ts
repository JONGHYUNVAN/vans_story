import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * 게시물 검색을 위한 API 라우트 핸들러 (BFF 프록시)
 * - 클라이언트의 요청을 받아 Django 검색 API로 전달하고 결과를 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  try {
    const [headersList, { searchParams }] = await Promise.all([
      headers(),
      Promise.resolve(new URL(request.url))
    ]);
    
    const query = searchParams.get('query');
    const token = headersList.get('Authorization');

    if (!query) {
      return NextResponse.json(
        { message: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // 환경변수 설정 (다른 API들과 동일한 패턴)
    const searchApiUrl = process.env.SEARCH_API_URL || 'http://localhost:8000';
    const encodedQuery = encodeURIComponent(query);
    const fullUrl = `${searchApiUrl}/api/v1/search/posts/?query=${encodedQuery}&language=all&page=1&page_size=20&sort=relevance`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      next: { revalidate: 60 } // 1분 캐시
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || '검색 요청이 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
