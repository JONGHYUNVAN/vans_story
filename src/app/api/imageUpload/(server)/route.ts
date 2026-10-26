import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getBearerToken, unauthorizedResponse } from '@/lib/api/requireAuth';

/**
 * 이미지 업로드 BFF. 이미지 서비스는 X-API-Key만 검사하므로 로그인 여부는 여기서 거른다
 * (안 그러면 누구나 S3에 업로드할 수 있다).
 */
export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const imageApiUrl = process.env.IMAGE_API_URL || 'http://localhost:3002/api';

    const response = await fetch(`${imageApiUrl}/upload`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.IMAGE_ROUTE_API_KEY || '',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('이미지 API 에러:', response.status, data);
      return NextResponse.json(
        { error: data?.error || '이미지 업로드에 실패했습니다.' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('이미지 업로드 에러:', error);
    return NextResponse.json({ error: '이미지 업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
