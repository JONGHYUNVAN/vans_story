import type { NextRequest } from 'next/server';
import { isValidKrxCode } from '@/lib/stocks/validateSymbol';

/** 요청 시점에 읽는다(모듈 로드 시 고정하면 테스트·런타임 설정 변경이 반영되지 않는다) */
const djangoApiUrl = () => process.env.DJANGO_API_URL || 'http://localhost:8001';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

function sseError(payload: Record<string, string>, status = 502): Response {
  return new Response(`event: error\ndata: ${JSON.stringify(payload)}\n\n`, {
    status,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

/** KIS 실시간 SSE 프록시. 심볼은 KRX 6자리 코드만 허용하고, 에러 프레임에 내부 URL을 싣지 않는다. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await params;
  if (!isValidKrxCode(symbol)) {
    return sseError({ code: 'INVALID_SYMBOL' }, 400);
  }

  const targetUrl = `${djangoApiUrl()}/api/kis/stream/${symbol}/`;

  // 초기 연결 타임아웃: 헤더 수신까지만 30초 제한
  // 연결 성공 후엔 타임아웃을 해제해야 SSE body 스트리밍이 끊기지 않음
  const connectController = new AbortController();
  const timeoutHandle = setTimeout(
    () => connectController.abort(new DOMException('Connection timeout', 'TimeoutError')),
    30_000,
  );

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      headers: { Accept: 'text/event-stream' },
      signal: connectController.signal,
    });
    clearTimeout(timeoutHandle); // 헤더 수신 완료 → 타임아웃 해제 (스트리밍 계속)
  } catch (error) {
    clearTimeout(timeoutHandle);
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError';
    console.error(
      `[kis/stream] 업스트림 연결 실패 (${isTimeout ? 'TIMEOUT' : 'UNREACHABLE'}):`,
      error,
    );
    return sseError({ code: isTimeout ? 'DJANGO_TIMEOUT' : 'DJANGO_UNREACHABLE' });
  }

  if (!upstream.ok || !upstream.body) {
    console.error(`[kis/stream] 업스트림 비정상 응답: status=${upstream.status}`);
    return sseError({ code: 'UPSTREAM_ERROR', status: String(upstream.status) }, upstream.status);
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}

// force-dynamic: SSE는 캐시 불가
// edge runtime: SSE passthrough에 최적화
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
