import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/errorHandler';
import { getBearerToken, unauthorizedResponse } from '@/lib/api/requireAuth';

export interface ChatRequest {
  message: string;
  model?: string; // 선택사항, 기본값: gpt-4.1-nano
  max_tokens?: number; // 선택사항, 기본값: 1000
  temperature?: number; // 선택사항, 기본값: 0.7 (0=일관적, 2=창의적)
  reasoning_effort?: 'low' | 'medium' | 'high'; // 선택사항, 추론 깊이
}

interface UpstreamChatRequest {
  message: string;
  model: string;
  max_tokens: number;
  temperature: number;
  reasoning_effort?: ChatRequest['reasoning_effort'];
}

/**
 * POST /api/ai/chat - 채팅 메시지 전송 BFF.
 * AI 서비스는 X-API-Key만 검사하므로 로그인 여부는 여기서 거른다(안 그러면 누구나 OpenAI 비용을 발생시킨다).
 */
export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const body: ChatRequest = await request.json();

    if (!body.message || body.message.trim() === '') {
      return createErrorResponse(400, '메시지 내용이 필요합니다.');
    }

    const aiApiUrl = process.env.AI_API_URL || 'http://localhost:3003';
    const timeoutMs = Number(process.env.AI_API_TIMEOUT_MS || 60000);
    const selectedModel = body.model || 'gpt-4.1-nano';

    const requestBody: UpstreamChatRequest = {
      message: body.message,
      model: selectedModel,
      max_tokens: body.max_tokens || 1000,
      temperature: body.temperature || 0.7,
      ...(body.reasoning_effort && { reasoning_effort: body.reasoning_effort }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${aiApiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.AI_ROUTE_API_KEY || '',
        Authorization: `Bearer ${token}`,
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
        },
      );
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return createErrorResponse(
        res.status,
        errorData?.message ||
          errorData?.error ||
          `채팅 메시지 전송에 실패했습니다. (모델: ${selectedModel})`,
      );
    }

    const data = await res.json();

    // AI 서비스 응답 형식을 우리 형식으로 매핑
    const mappedResponse = {
      id: data.id || `chat-${Date.now()}`,
      message: data.response || data.message || '응답을 받지 못했습니다.',
      model: data.model || selectedModel,
      tokens_used: data.usage?.total_tokens || 0,
      timestamp: new Date().toISOString(),
      usage: data.usage
        ? {
            prompt_tokens: data.usage.prompt_tokens || 0,
            completion_tokens: data.usage.completion_tokens || 0,
            total_tokens: data.usage.total_tokens || 0,
          }
        : undefined,
    };

    return createSuccessResponse(mappedResponse);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return createErrorResponse(504, '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }
    return createErrorResponse(500, '서버 오류가 발생했습니다.');
  }
}
