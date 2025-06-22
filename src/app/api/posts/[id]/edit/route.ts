import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/posts/[id]/edit - 편집용 게시물 조회 (인증 필요)
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const [{ id }, headersList] = await Promise.all([
      context.params,
      headers()
    ]);
    const token = headersList.get('Authorization');

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/posts/${id}/edit`, {
      headers: {
        Authorization: token,
      },
      next: { revalidate: 0 } // 편집용이므로 캐시 없음
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    return new NextResponse(null, { status: 500 });
  }
} 