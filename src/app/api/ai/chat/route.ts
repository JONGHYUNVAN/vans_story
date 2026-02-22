import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createErrorResponse, createSuccessResponse } from '@/lib/errorHandler';

export type ChatRequest = {
  message: string;
  model?: string;        // 선택사항, 기본값: gpt-4.1-nano
  max_tokens?: number;   // 선택사항, 기본값: 1000
  temperature?: number;  // 선택사항, 기본값: 0.7 (0=일관적, 2=창의적)
  reasoning_effort?: 'low' | 'medium' | 'high'; // 선택사항, 추론 깊이
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
    const timeoutMs = Number(process.env.AI_API_TIMEOUT_MS || 60000);
    const selectedModel = body.model || 'gpt-4.1-nano';

    // 요청 본문 구성
    const requestBody: any = {
      message: body.message,
      model: selectedModel,
      max_tokens: body.max_tokens || 1000,
      temperature: body.temperature || 0.7,
    };

    // reasoning_effort가 있으면 추가
    if (body.reasoning_effort) {
      requestBody.reasoning_effort = body.reasoning_effort;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${aiApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.AI_ROUTE_API_KEY || '',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after') || undefined;
      const errorData = await res.json().catch(() => null);
      const baseMessage = errorData?.message || errorData?.error || '요청이 많습니다.';
      const retryHint = retryAfter
        ? ` ${retryAfter}초 후 다시 시도해주세요.`
        : ' 잠시 후 다시 시도해주세요.';
      return NextResponse.json(
        {
          success: false,
          error: { message: `${baseMessage}${retryHint}` },
        },
        {
          status: 429,
          headers: retryAfter ? { 'Retry-After': retryAfter } : undefined,
        }
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return createErrorResponse(
        res.status,
        errorData?.message || errorData?.error || `채팅 메시지 전송에 실패했습니다. (모델: ${selectedModel})`
      );
    }

    const data = await res.json();
    
    // 3003번 포트 응답 형식을 우리 형식으로 매핑
    const mappedResponse = {
      id: data.id || `chat-${Date.now()}`,
      message: data.response || data.message || '응답을 받지 못했습니다.',
      model: data.model || selectedModel,
      tokens_used: data.usage?.total_tokens || 0,
      timestamp: new Date().toISOString(),
      usage: data.usage ? {
        prompt_tokens: data.usage.prompt_tokens || 0,
        completion_tokens: data.usage.completion_tokens || 0,
        total_tokens: data.usage.total_tokens || 0,
      } : undefined,
    };
    
    return createSuccessResponse(mappedResponse);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return createErrorResponse(504, '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    return createErrorResponse(
      500,
      '서버 오류가 발생했습니다.'
    );
  }
} 