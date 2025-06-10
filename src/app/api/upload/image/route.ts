import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 기존 이미지 API로 요청 전달
    const response = await fetch(`${process.env.IMAGE_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || '이미지 업로드에 실패했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('이미지 업로드 에러:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 