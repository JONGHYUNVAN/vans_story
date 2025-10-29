import { NextRequest, NextResponse } from 'next/server';

/**
 * 카테고리 값별 조회 API 라우트 핸들러 (BFF 프록시)
 * vans_story_be_post의 카테고리 값별 조회 API를 프록시합니다.
 */

type RouteContext = {
  params: { value: string };
};

// GET /api/categories/value/[value] - 값으로 카테고리 조회
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { value } = context.params;
    
    if (!value) {
      return NextResponse.json(
        { error: '카테고리 값이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const fullUrl = `${apiUrl}/categories/value/${encodeURIComponent(value)}`;

    console.log('🔄 카테고리 값별 조회 API 호출:', fullUrl);

    const res = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } // 5분 캐시
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: `카테고리 '${value}'를 찾을 수 없습니다.` },
          { status: 404 }
        );
      }
      console.error('❌ 카테고리 값별 조회 API 호출 실패:', res.status, res.statusText);
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ 카테고리 값별 조회 성공:', value);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 카테고리 값별 조회 API 오류:', error);
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
