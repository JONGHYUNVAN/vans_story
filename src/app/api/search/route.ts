import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * 게시물 검색을 위한 API 라우트 핸들러 (BFF 프록시)
 * - 클라이언트의 요청을 받아 Django 검색 API로 전달하고 결과를 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const token = request.headers.get('authorization');

    if (!query) {
      return NextResponse.json({ message: '검색어가 필요합니다.' }, { status: 400 });
    }

    // 환경변수 설정 (다른 API들과 동일한 패턴)
    const searchApiUrl = process.env.SEARCH_API_URL || 'http://localhost:8000';
    const encodedQuery = encodeURIComponent(query);
    const fullUrl = `${searchApiUrl}/api/v1/search/posts/?query=${encodedQuery}&language=all&page=1&page_size=20&sort=relevance`;

    // 인증된 응답이 익명 사용자에게 캐시되지 않도록 토큰이 있으면 캐시를 끈다(헤더는 캐시 키가 아니다).
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      ...(token ? { cache: 'no-store' } : { next: { revalidate: 60 } }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || '검색 요청이 실패했습니다.' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: '내부 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
