import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const signupData = await request.json();
    
    const res = await fetch(`${process.env.AUTH_API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
      credentials: 'include',
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    // 성공 시 빈 객체 반환 (JSON 파싱 에러 방지)
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
} 