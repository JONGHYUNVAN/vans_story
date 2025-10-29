import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';
import { extractResponseError, extractErrorStack } from './errorExtractor';

/**
 * 표준 에러 응답 형식
 */
export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
};

/**
 * 표준 성공 응답 형식
 */
export type SuccessResponse<T = any> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
  };
};

/**
 * HTTP 상태 코드에 따른 기본 에러 메시지 반환
 */
function getDefaultErrorMessage(status: number): string {
  const message = API_CONFIG.ERROR_MESSAGES[status as keyof typeof API_CONFIG.ERROR_MESSAGES];
  return message || API_CONFIG.ERROR_MESSAGES.DEFAULT;
}

/**
 * 통일된 에러 응답 생성
 * @param status HTTP 상태 코드
 * @param message 에러 메시지 (없으면 기본 메시지 사용)
 * @param code 에러 코드 (선택사항)
 * @param details 추가 상세 정보 (개발 환경에서만 포함)
 */
export function createErrorResponse(
  status: number,
  message?: string,
  code?: string,
  details?: any
): NextResponse<ErrorResponse> {
  const errorMessage = message || getDefaultErrorMessage(status);
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: errorMessage,
      ...(code && { code }),
      ...(process.env.NODE_ENV === 'development' && details && { details })
    }
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * 통일된 성공 응답 생성
 * @param data 응답 데이터
 * @param meta 메타 정보 (페이지네이션 등)
 * @param status HTTP 상태 코드 (기본: 200)
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
  },
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  const successResponse: SuccessResponse<T> = {
    success: true,
    data,
    ...(meta && { meta })
  };

  return NextResponse.json(successResponse, { status });
}

/**
 * 외부 API 에러를 표준 형식으로 변환
 * @param response 외부 API Response
 * @param defaultMessage 기본 에러 메시지
 */
export async function handleExternalApiError(
  response: Response,
  defaultMessage?: string
): Promise<NextResponse<ErrorResponse>> {
  const { message, code } = await extractResponseError(response);
  const finalMessage = defaultMessage || message || getDefaultErrorMessage(response.status);

  return createErrorResponse(response.status, finalMessage, code);
}

/**
 * 예외를 표준 에러 응답으로 변환
 * @param error 발생한 에러
 * @param defaultMessage 기본 에러 메시지
 */
export function handleException(
  error: unknown,
  defaultMessage?: string
): NextResponse<ErrorResponse> {
  console.error('Exception occurred:', error);

  let message = defaultMessage || '내부 서버 오류가 발생했습니다.';
  
  if (error instanceof Error) {
    message = error.message || message;
  } else if (typeof error === 'string') {
    message = error || message;
  }

  const stackInfo = extractErrorStack(error);

  return createErrorResponse(500, message, 'INTERNAL_ERROR', stackInfo);
}

