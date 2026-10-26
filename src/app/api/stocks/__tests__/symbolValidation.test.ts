import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as snapshot } from '../kis/snapshot/[symbol]/route';
import { GET as stream } from '../kis/stream/[symbol]/route';
import { GET as detail } from '../detail/route';
import { GET as chart } from '../chart/route';
import { GET as quote } from '../quote/route';
import { GET as news } from '../news/route';
import { GET as dart } from '../dart/route';

function req(url: string) {
  return new NextRequest(`http://localhost:3000${url}`);
}
const params = (symbol: string) => ({ params: Promise.resolve({ symbol }) });

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv('DJANGO_API_URL', 'http://django.test');
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('KIS 라우트 심볼 검증 (경로 주입 방지)', () => {
  it('snapshot: "../../admin" 같은 경로는 400이고 업스트림을 부르지 않는다', async () => {
    const res = await snapshot(req('/api/stocks/kis/snapshot/x'), params('../../admin'));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('INVALID_SYMBOL');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('snapshot: 업스트림 실패 응답에 내부 URL을 넣지 않는다', async () => {
    fetchSpy.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await snapshot(req('/api/stocks/kis/snapshot/005930'), params('005930'));

    expect(res.status).toBe(502);
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain('django.test');
    expect(text).not.toContain('url');
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://django.test/api/kis/snapshot/005930/',
      expect.anything(),
    );
  });

  it('stream: 6자리 코드가 아니면 400 SSE 에러 프레임', async () => {
    const res = await stream(req('/api/stocks/kis/stream/x'), params('..%2F'));

    expect(res.status).toBe(400);
    expect(await res.text()).toContain('INVALID_SYMBOL');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('stream: 연결 실패 프레임에 내부 URL이 없다', async () => {
    fetchSpy.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await stream(req('/api/stocks/kis/stream/005930'), params('005930'));

    expect(res.status).toBe(502);
    const text = await res.text();
    expect(text).toContain('DJANGO_UNREACHABLE');
    expect(text).not.toContain('django.test');
  });
});

describe('Yahoo 계열 라우트 심볼 검증', () => {
  it.each([
    ['detail', (u: string) => detail(req(u)), '/api/stocks/detail?symbol='],
    ['chart', (u: string) => chart(req(u)), '/api/stocks/chart?symbol='],
    ['quote', (u: string) => quote(req(u)), '/api/stocks/quote?symbol='],
    ['news', (u: string) => news(req(u)), '/api/stocks/news?symbol='],
    ['dart', (u: string) => dart(req(u)), '/api/stocks/dart?symbol='],
  ])('%s: 잘못된 심볼은 400, 업스트림 호출 없음', async (_name, call, base) => {
    const res = await call(`${base}${encodeURIComponent('../../etc')}`);

    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
