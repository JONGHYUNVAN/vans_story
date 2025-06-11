import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/posts/[id]
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

    const res = await fetch(`${process.env.API_URL}/posts/${id}`, {
      headers: {
        Authorization: token || '',
      },
      next: { revalidate: 0 } // 항상 최신 데이터
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching post:', error);
    return new NextResponse(null, { status: 500 });
  }
} 