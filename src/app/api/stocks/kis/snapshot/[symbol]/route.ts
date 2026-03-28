import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;

  try {
    const res = await fetch(`${DJANGO_API_URL}/api/kis/snapshot/${symbol}/`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'KIS 스냅샷 조회 실패',
          code: 'PROXY_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 502 },
    );
  }
}
