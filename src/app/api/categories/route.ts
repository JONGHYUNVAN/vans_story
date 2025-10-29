import { NextRequest, NextResponse } from 'next/server';

/**
 * 카테고리 API 라우트 핸들러 (BFF 프록시)
 * vans_story_be_post의 카테고리 API를 프록시합니다.
 */

// GET /api/categories - 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 전달
    const { searchParams } = new URL(request.url);
    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${apiUrl}/categories?${queryString}` : `${apiUrl}/categories`;

    console.log('🔄 카테고리 API 호출:', fullUrl);

    const res = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } // 5분 캐시 (카테고리는 자주 변경되지 않음)
    });

    if (!res.ok) {
      console.error('❌ 카테고리 API 호출 실패:', res.status, res.statusText);
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ 카테고리 데이터 조회 성공:', data.length, '개');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 카테고리 API 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}
