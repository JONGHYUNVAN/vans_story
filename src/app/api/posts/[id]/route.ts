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

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/posts/${id}`, {
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

// PATCH /api/posts/[id]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const [{ id }, headersList, body] = await Promise.all([
      context.params,
      headers(),
      request.json()
    ]);
    const token = headersList.get('Authorization');

    const apiUrl = process.env.POST_API_URL || 'http://localhost:3001/api/v1';
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || 'Update failed' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}