import { NextRequest } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;

  try {
    const upstream = await fetch(
      `${DJANGO_API_URL}/api/kis/stream/${symbol}/`,
      {
        headers: { Accept: 'text/event-stream' },
        signal: request.signal,
      },
    );

    if (!upstream.ok || !upstream.body) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'KIS 스트림 연결 실패', code: 'UPSTREAM_ERROR' },
        }),
        { status: upstream.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: 'proxy error' })}\n\n`,
      {
        status: 502,
        headers: { 'Content-Type': 'text/event-stream' },
      },
    );
  }
}

// SSE는 장시간 연결이므로 dynamic 강제
export const dynamic = 'force-dynamic';
