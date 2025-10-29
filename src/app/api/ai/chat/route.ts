import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createErrorResponse, createSuccessResponse } from '@/lib/errorHandler';

export type ChatRequest = {
  message: string;
  model?: string;        // 선택사항, 기본값: gpt-4o-mini
  max_tokens?: number;   // 선택사항, 기본값: 1000
  temperature?: number;  // 선택사항, 기본값: 0.7 (0=일관적, 2=창의적)
};

// POST /api/ai/chat - 채팅 메시지 전송
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const token = headersList.get('Authorization');
    const body: ChatRequest = await request.json();

    // 메시지 데이터 검증
    if (!body.message || body.message.trim() === '') {
      return createErrorResponse(
        400,
        '메시지 내용이 필요합니다.'
      );
    }

    const aiApiUrl = process.env.AI_API_URL || 'http://localhost:3003';
    console.log('🔄 AI API 호출:', `${aiApiUrl}/chat`);

    const res = await fetch(`${aiApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.AI_ROUTE_API_KEY || '',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify({
        message: body.message,
        model: body.model || 'gpt-4o-mini',
        max_tokens: body.max_tokens || 1000,
        temperature: body.temperature || 0.7,
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('❌ AI API 호출 실패:', res.status, errorData);
      return createErrorResponse(
        res.status,
        errorData?.message || errorData?.error || '채팅 메시지 전송에 실패했습니다.'
      );
    }

    const data = await res.json();
    console.log('✅ AI 채팅 메시지 전송 성공');
    
    // 3003번 포트 응답 형식을 우리 형식으로 매핑
    const mappedResponse = {
      id: data.id || `chat-${Date.now()}`,
      message: data.response || data.message || '응답을 받지 못했습니다.',
      model: data.model || 'gpt-4o-mini',
      tokens_used: data.usage?.total_tokens || 0,
      timestamp: new Date().toISOString(),
    };
    
    return createSuccessResponse(mappedResponse);
  } catch (error) {
    console.error('❌ AI API 오류:', error);
    return createErrorResponse(
      500,
      '서버 오류가 발생했습니다.'
    );
  }
} 