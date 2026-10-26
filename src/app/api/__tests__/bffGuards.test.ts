import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadImage } from '../imageUpload/(server)/route';
import { POST as aiChat } from '../ai/chat/route';
import { GET as listPosts } from '../posts/route';
import { GET as search } from '../search/route';

function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}
const VALID = `Bearer ${jwt({ sub: 'a@b.c', exp: Math.floor(Date.now() / 1000) + 3600 })}`;

function req(url: string, init: ConstructorParameters<typeof NextRequest>[1] = {}) {
  return new NextRequest(`http://localhost:3000${url}`, init);
}

function okJson(body: unknown = { ok: true }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv('IMAGE_API_URL', 'http://image.test/api');
  vi.stubEnv('IMAGE_ROUTE_API_KEY', 'img-key');
  vi.stubEnv('AI_API_URL', 'http://ai.test');
  vi.stubEnv('AI_ROUTE_API_KEY', 'ai-key');
  vi.stubEnv('POST_API_URL', 'http://post.test/api/v1');
  vi.stubEnv('SEARCH_API_URL', 'http://search.test');
  fetchSpy = vi.spyOn(globalThis, 'fetch');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/imageUpload', () => {
  it('토큰이 없으면 401이고 이미지 서비스를 호출하지 않는다', async () => {
    const form = new FormData();
    form.append('image', new Blob(['x']), 'x.png');

    const res = await uploadImage(req('/api/imageUpload', { method: 'POST', body: form }));

    expect(res.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('토큰이 있으면 X-API-Key와 Authorization을 붙여 전달한다', async () => {
    fetchSpy.mockResolvedValue(okJson({ fileName: 'https://cdn/x.webp' }));
    const form = new FormData();
    form.append('image', new Blob(['x']), 'x.png');

    const res = await uploadImage(
      req('/api/imageUpload', { method: 'POST', body: form, headers: { authorization: VALID } }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ fileName: 'https://cdn/x.webp' });
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://image.test/api/upload');
    expect(init.headers).toEqual({ 'X-API-Key': 'img-key', Authorization: VALID });
  });
});

describe('POST /api/ai/chat', () => {
  it('토큰이 없으면 401이고 AI 서비스를 호출하지 않는다', async () => {
    const res = await aiChat(
      req('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message: 'hi' }) }),
    );

    expect(res.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('만료된 토큰도 401', async () => {
    const expired = `Bearer ${jwt({ sub: 'a', exp: 1 })}`;
    const res = await aiChat(
      req('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'hi' }),
        headers: { authorization: expired },
      }),
    );

    expect(res.status).toBe(401);
  });

  it('토큰이 있으면 AI 서비스로 전달하고 응답을 매핑한다', async () => {
    fetchSpy.mockResolvedValue(
      okJson({ id: 'c1', response: '안녕', model: 'gpt-4.1-nano', usage: { total_tokens: 3 } }),
    );

    const res = await aiChat(
      req('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'hi' }),
        headers: { authorization: VALID },
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.message).toBe('안녕');
    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe(VALID);
    expect((init.headers as Record<string, string>)['X-API-Key']).toBe('ai-key');
  });
});

describe('캐시 정책: 인증된 요청은 no-store, 공개 요청만 revalidate', () => {
  it('GET /api/posts', async () => {
    fetchSpy.mockResolvedValue(okJson([]));

    await listPosts(req('/api/posts?page=1'));
    await listPosts(req('/api/posts?page=1', { headers: { authorization: VALID } }));

    const [, anonInit] = fetchSpy.mock.calls[0] as [string, RequestInit & { next?: unknown }];
    const [, authInit] = fetchSpy.mock.calls[1] as [string, RequestInit & { next?: unknown }];
    expect(anonInit.next).toEqual({ revalidate: 60 });
    expect(anonInit.cache).toBeUndefined();
    expect(authInit.cache).toBe('no-store');
    expect(authInit.next).toBeUndefined();
    expect((authInit.headers as Record<string, string>).Authorization).toBe(VALID);
  });

  it('GET /api/search', async () => {
    fetchSpy.mockResolvedValue(okJson({ results: [] }));

    await search(req('/api/search?query=next'));
    await search(req('/api/search?query=next', { headers: { authorization: VALID } }));

    const [, anonInit] = fetchSpy.mock.calls[0] as [string, RequestInit & { next?: unknown }];
    const [, authInit] = fetchSpy.mock.calls[1] as [string, RequestInit & { next?: unknown }];
    expect(anonInit.next).toEqual({ revalidate: 60 });
    expect(authInit.cache).toBe('no-store');
  });

  it('GET /api/search: 검색어가 없으면 400', async () => {
    const res = await search(req('/api/search'));
    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
