import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const credentials = await request.json();
    
    const res = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
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