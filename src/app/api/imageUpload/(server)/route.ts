import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 환경 변수 확인 및 기본값 설정
    const imageApiUrl = process.env.IMAGE_API_URL || 'http://localhost:3002/api';
    console.log('📤 이미지 API URL:', `${imageApiUrl}/upload`);
    
    // 기존 이미지 API로 요청 전달
    const response = await fetch(`${imageApiUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('📤 이미지 API 응답 상태:', response.status);

    const data = await response.json();
    console.log('📤 이미지 API 응답 데이터:', data);
    
    if (!response.ok) {
      console.error('📤 이미지 API 에러:', data);
      return NextResponse.json(
        { error: data.error || '이미지 업로드에 실패했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('📤 이미지 업로드 에러:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 