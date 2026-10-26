import { NextResponse } from 'next/server';

/**
 * BFF 라우트의 로그인 가드.
 *
 * `Authorization: Bearer <JWT>`가 있고, 세 부분으로 된 JWT이며, `exp`가 지나지 않았을 때만 토큰을 돌려준다.
 * 서명은 여기서 검증하지 않는다(비밀키는 백엔드에만 있다). 그래도 익명 호출과 만료 토큰 재사용은 BFF에서
 * 막히고, 위조 토큰은 백엔드가 거른다. 하류 서비스(이미지·AI)는 X-API-Key만 보므로 이 가드가 유일한 문이다.
 */
export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;

  const token = header.slice('Bearer '.length).trim();
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return null;
  } catch {
    return null;
  }
  return token;
}

export function unauthorizedResponse(message = '로그인이 필요합니다.') {
  return NextResponse.json(
    { success: false, error: { message, code: 'UNAUTHORIZED' } },
    { status: 401 },
  );
}
