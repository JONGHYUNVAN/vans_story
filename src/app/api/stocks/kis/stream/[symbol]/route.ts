import { NextRequest } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

function sseError(payload: Record<string, string>): Response {
  return new Response(
    `event: error\ndata: ${JSON.stringify(payload)}\n\n`,
    { status: 502, headers: { 'Content-Type': 'text/event-stream' } },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;

  const targetUrl = `${DJANGO_API_URL}/api/kis/stream/${symbol}/`;

  console.log(`[kis/stream] ▶ 요청 심볼: ${symbol}`);
  console.log(`[kis/stream] ▶ 업스트림 URL: ${targetUrl}`);
  console.log(`[kis/stream] ▶ DJANGO_API_URL 환경변수: ${process.env.DJANGO_API_URL ?? '(미설정 → 기본값 http://localhost:8000)'}`);

  // 초기 연결 타임아웃: 헤더 수신까지만 30초 제한
  // 연결 성공 후엔 타임아웃을 해제해야 SSE body 스트리밍이 끊기지 않음
  const connectController = new AbortController();
  const timeoutHandle = setTimeout(
    () => connectController.abort(new DOMException('Connection timeout', 'TimeoutError')),
    30_000,
  );

  let upstream: Response;
  try {
    console.log(`[kis/stream] ▶ fetch 시작...`);
    upstream = await fetch(targetUrl, {
      headers: { Accept: 'text/event-stream' },
      signal: connectController.signal,
    });
    clearTimeout(timeoutHandle); // 헤더 수신 완료 → 타임아웃 해제 (스트리밍 계속)
    console.log(`[kis/stream] ✔ 업스트림 응답: ${upstream.status} ${upstream.statusText}`);
  } catch (error) {
    clearTimeout(timeoutHandle);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[kis/stream] ✖ fetch 실패 (${isTimeout ? 'TIMEOUT' : 'UNREACHABLE'}): ${msg}`);
    console.error(`[kis/stream] ✖ 실패한 URL: ${targetUrl}`);
    if (isTimeout) {
      return sseError({ code: 'DJANGO_TIMEOUT', url: targetUrl });
    }
    return sseError({ code: 'DJANGO_UNREACHABLE', url: targetUrl, detail: msg });
  }

  if (!upstream.ok || !upstream.body) {
    console.error(`[kis/stream] ✖ 업스트림 비정상 응답: status=${upstream.status}, hasBody=${!!upstream.body}`);
    return new Response(
      `event: error\ndata: ${JSON.stringify({ code: 'UPSTREAM_ERROR', status: String(upstream.status), url: targetUrl })}\n\n`,
      { status: upstream.status, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  console.log(`[kis/stream] ✔ SSE 스트림 passthrough 시작: ${symbol}`);
  return new Response(upstream.body, { headers: SSE_HEADERS });
}

// force-dynamic: SSE는 캐시 불가
// Node.js runtime: localhost fetch + console.log 정상 동작
export const dynamic = 'force-dynamic';
