import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
  try {
    const headersList = await headers();
    const token = headersList.get('Authorization');

    const res = await fetch(`${process.env.AUTH_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: token || '',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
} 