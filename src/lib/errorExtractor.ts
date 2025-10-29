/**
 * 에러 메시지 추출 유틸리티
 * 다양한 타입의 에러에서 의미있는 메시지를 추출합니다.
 */

/**
 * 알 수 없는 에러에서 메시지 추출
 * @param error 발생한 에러 (any 타입)
 * @param defaultMessage 기본 메시지
 * @returns 추출된 에러 메시지
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = '오류가 발생했습니다.'
): string {
  // Error 객체
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // 문자열
  if (typeof error === 'string') {
    return error || defaultMessage;
  }
  
  // Response 객체가 포함된 에러
  if (error && typeof error === 'object' && 'response' in error) {
    try {
      const response = (error as any).response;
      if (response && typeof response.json === 'function') {
        // 비동기지만 이미 JSON을 읽은 경우
        const data = (error as any).data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
  }
  
  // 객체에 message 속성이 있는 경우
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as any).message;
    if (typeof message === 'string') {
      return message || defaultMessage;
    }
  }
  
  // 객체에 error 속성이 있는 경우
  if (error && typeof error === 'object' && 'error' in error) {
    const errorMsg = (error as any).error;
    if (typeof errorMsg === 'string') {
      return errorMsg || defaultMessage;
    }
  }
  
  return defaultMessage;
}

/**
 * Response 객체에서 에러 정보 추출
 * @param response Response 객체
 * @returns 에러 정보 객체
 */
export async function extractResponseError(
  response: Response
): Promise<{ message: string; code?: string }> {
  let message = `HTTP ${response.status} 오류가 발생했습니다.`;
  let code: string | undefined;

  try {
    const data = await response.json();
    
    // message 필드 확인
    if (data?.message && typeof data.message === 'string') {
      message = data.message;
    }
    
    // error 필드 확인
    if (data?.error) {
      if (typeof data.error === 'string') {
        message = data.error;
      } else if (typeof data.error === 'object' && data.error.message) {
        message = data.error.message;
      }
    }
    
    // code 필드 확인
    if (data?.code && typeof data.code === 'string') {
      code = data.code;
    }
    
    // error_code 필드 확인 (Django 스타일)
    if (data?.error_code && typeof data.error_code === 'string') {
      code = data.error_code;
    }
  } catch {
    // JSON 파싱 실패 시 HTTP 상태 텍스트 사용
    message = response.statusText || message;
  }

  return { message, code };
}

/**
 * 에러 스택 트레이스 추출 (개발 환경용)
 * @param error Error 객체
 * @returns 스택 트레이스 정보
 */
export function extractErrorStack(error: unknown): { name?: string; stack?: string } | null {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      stack: error.stack,
    };
  }

  return null;
}

/**
 * 여러 에러를 하나의 메시지로 결합
 * @param errors 에러 배열
 * @param separator 구분자 (기본: '\n')
 * @returns 결합된 에러 메시지
 */
export function combineErrorMessages(
  errors: unknown[],
  separator: string = '\n'
): string {
  return errors
    .map(error => extractErrorMessage(error, ''))
    .filter(msg => msg.length > 0)
    .join(separator);
}

/**
 * Fetch 에러인지 확인
 * @param error 확인할 에러
 * @returns Fetch 에러 여부
 */
export function isFetchError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return message.includes('fetch') || message.includes('network');
  }
  return false;
}

/**
 * 타임아웃 에러인지 확인
 * @param error 확인할 에러
 * @returns 타임아웃 에러 여부
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('timeout') || message.includes('timed out');
  }
  return false;
}

/**
 * 인증 관련 에러인지 확인
 * @param error 확인할 에러
 * @returns 인증 에러 여부
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('unauthorized') ||
      message.includes('authentication') ||
      message.includes('token') ||
      message.includes('세션') ||
      message.includes('로그인')
    );
  }
  return false;
}

