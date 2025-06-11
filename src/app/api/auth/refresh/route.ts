import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = await fetch(`${process.env.AUTH_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    // Authorization 헤더 전달
    const authHeader = res.headers.get('Authorization');
    const response = new NextResponse(null, { status: 200 });
    if (authHeader) {
      response.headers.set('Authorization', authHeader);
    }

    return response;
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
} 