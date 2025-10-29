import { ApiFetch } from '@/lib/apiFetch';

export type ChatRequest = {
  message: string;
  model?: string;        // 선택사항, 기본값: gpt-4o-mini
  max_tokens?: number;   // 선택사항, 기본값: 1000
  temperature?: number;  // 선택사항, 기본값: 0.7 (0=일관적, 2=창의적)
};

export type ChatResponse = {
  id: string;
  message: string;
  model: string;
  tokens_used: number;
  timestamp: string;
};

/**
 * AI 채팅 메시지 전송 (인증 토큰 포함)
 * @param chatData 전송할 채팅 데이터
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessage(chatData: ChatRequest): Promise<ChatResponse> {
  const response = await ApiFetch.postWithAuth('/api/ai/chat', chatData);
  
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || '채팅 메시지 전송에 실패했습니다.');
  }
  
  return response.json();
}

/**
 * AI 채팅 메시지 전송 (토큰 없이)
 * @param chatData 전송할 채팅 데이터
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessageDirect(chatData: ChatRequest): Promise<ChatResponse> {
  const response = await ApiFetch.basicPost('/api/ai/chat', chatData);
  
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || '채팅 메시지 전송에 실패했습니다.');
  }
  
  return response.json();
}
