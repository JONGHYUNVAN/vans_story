import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth 임시 코드를 JWT 토큰으로 교환하는 API 라우트
 * @description 중간 서버에서 받은 임시 코드를 백엔드로 전달하여 JWT 토큰을 받아옴
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: '임시 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 백엔드 서버로 임시 코드 전달하여 JWT 토큰 교환
    const backendUrl = process.env.AUTH_API_URL || 'http://localhost:8080';
    const exchangeResponse = await fetch(`${backendUrl}/oauth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include',
    });

    if (!exchangeResponse.ok) {
      const errorText = await exchangeResponse.text();
      console.error('Backend token exchange failed:', errorText);
      return NextResponse.json(
        { error: '토큰 교환에 실패했습니다.' },
        { status: exchangeResponse.status }
      );
    }

    // 백엔드에서 받은 JWT 토큰 추출
    const authHeader = exchangeResponse.headers.get('Authorization');
    const jwtToken = authHeader ? authHeader.split(' ')[1] : null;

    if (!jwtToken) {
      return NextResponse.json(
        { error: '백엔드에서 JWT 토큰을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    // 백엔드의 Set-Cookie 헤더를 그대로 전달 (Refresh Token)
    const response = NextResponse.json({
      success: true,
      token: jwtToken,
      message: '토큰 교환이 완료되었습니다.'
    });

    // 백엔드의 쿠키를 프론트엔드로 전달
    const setCookieHeader = exchangeResponse.headers.get('Set-Cookie');
    if (setCookieHeader) {
      response.headers.set('Set-Cookie', setCookieHeader);
    }

    return response;

  } catch (error) {
    console.error('OAuth callback API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 