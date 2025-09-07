import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * 인기 검색어를 가져오는 API 라우트 핸들러 (BFF 프록시)
 * - Django 검색 API에서 인기 검색어를 가져와 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const token = headersList.get('Authorization');
    
    // 환경변수 설정 (다른 API들과 동일한 패턴)
    const searchApiUrl = process.env.SEARCH_API_URL || 'http://localhost:8000';
    const fullUrl = `${searchApiUrl}/api/v1/search/popular/`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      next: { revalidate: 300 } // 5분 캐시
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || '인기 검색어 조회가 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
