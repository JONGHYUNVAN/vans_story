import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// GET /api/posts - 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    // URL 파라미터 전달
    const { searchParams } = new URL(request.url);
    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${apiUrl}/posts?${queryString}` : `${apiUrl}/posts`;

    // Next Data Cache는 요청 헤더를 캐시 키에 넣지 않는다. 인증된 응답을 익명 사용자에게 재사용하지 않도록
    // 토큰이 있으면 캐시를 끄고, 공개 요청만 1분 캐시한다.
    const res = await fetch(fullUrl, {
      headers: {
        ...(token && { Authorization: token }),
      },
      ...(token ? { cache: 'no-store' } : { next: { revalidate: 60 } }),
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse(null, { status: 500 });
  }
}

// POST /api/posts - 게시물 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || 'Post creation failed' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
