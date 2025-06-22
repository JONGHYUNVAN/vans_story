import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// GET /api/posts - 게시물 목록 조회 
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const token = headersList.get('Authorization');
    
    // URL 파라미터 전달
    const { searchParams } = new URL(request.url);
    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${apiUrl}/posts?${queryString}` : `${apiUrl}/posts`;

    const res = await fetch(fullUrl, {
      headers: {
        ...(token && { Authorization: token }),
      },
      next: { revalidate: 60 } // 1분 캐시
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
    const [headersList, body] = await Promise.all([
      headers(),
      request.json()
    ]);
    const token = headersList.get('Authorization');

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || 'Post creation failed' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 