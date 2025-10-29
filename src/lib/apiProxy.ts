import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { API_CONFIG } from '@/config/apiConfig';
import { handleExternalApiError, handleException, createSuccessResponse } from './errorHandler';
import { buildApiUrl } from './urlBuilder';

/**
 * 프록시 설정 타입
 */
export type ProxyConfig = {
  /** 백엔드 API 기본 URL */
  baseUrl: string;
  /** API 경로 (예: '/categories') */
  path: string;
  /** 캐시 재검증 시간 (초) */
  revalidate?: number;
  /** 인증 필요 여부 */
  requireAuth?: boolean;
  /** 추가 헤더 */
  additionalHeaders?: HeadersInit;
  /** 성공 로그 메시지 */
  successLog?: string;
  /** 에러 발생 시 기본 메시지 */
  errorMessage?: string;
};

/**
 * 쿼리 파라미터를 포함한 전체 URL 생성
 */
function buildFullUrl(baseUrl: string, path: string, searchParams?: URLSearchParams): string {
  if (!searchParams || searchParams.toString().length === 0) {
    return buildApiUrl(baseUrl, path);
  }

  // URLSearchParams를 QueryParams 객체로 변환
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return buildApiUrl(baseUrl, path, params);
}

/**
 * 요청 헤더 생성
 */
async function buildHeaders(requireAuth: boolean, additionalHeaders?: HeadersInit): Promise<HeadersInit> {
  const baseHeaders: HeadersInit = {
    ...API_CONFIG.HEADERS.JSON,
  };

  if (requireAuth) {
    const headersList = await headers();
    const token = headersList.get('Authorization');
    if (token) {
      return {
        ...baseHeaders,
        Authorization: token,
        ...additionalHeaders,
      };
    }
  }

  return {
    ...baseHeaders,
    ...additionalHeaders,
  };
}

/**
 * GET 요청 프록시
 * @param request NextRequest
 * @param config ProxyConfig
 * @returns NextResponse
 */
export async function proxyGet(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const fullUrl = buildFullUrl(config.baseUrl, config.path, searchParams);

    console.log('🔄 API 호출:', fullUrl);

    const requestHeaders = await buildHeaders(config.requireAuth || false, config.additionalHeaders);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders,
      next: { revalidate: config.revalidate ?? 0 },
    });

    if (!response.ok) {
      console.error('❌ API 호출 실패:', response.status, response.statusText);
      return await handleExternalApiError(
        response,
        config.errorMessage || 'API 요청에 실패했습니다.'
      );
    }

    const data = await response.json();
    
    if (config.successLog) {
      console.log('✅', config.successLog);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('❌ API 오류:', error);
    return handleException(
      error,
      config.errorMessage || 'API 요청 중 오류가 발생했습니다.'
    );
  }
}

/**
 * POST 요청 프록시
 * @param request NextRequest
 * @param config ProxyConfig
 * @returns NextResponse
 */
export async function proxyPost(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  try {
    const fullUrl = buildFullUrl(config.baseUrl, config.path);
    const body = await request.text();

    console.log('🔄 POST API 호출:', fullUrl);

    const requestHeaders = await buildHeaders(config.requireAuth || false, config.additionalHeaders);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: requestHeaders,
      body,
      next: { revalidate: config.revalidate ?? 0 },
    });

    if (!response.ok) {
      console.error('❌ POST API 호출 실패:', response.status, response.statusText);
      return await handleExternalApiError(
        response,
        config.errorMessage || 'API 요청에 실패했습니다.'
      );
    }

    const data = await response.json();
    
    if (config.successLog) {
      console.log('✅', config.successLog);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('❌ POST API 오류:', error);
    return handleException(
      error,
      config.errorMessage || 'API 요청 중 오류가 발생했습니다.'
    );
  }
}

/**
 * PATCH 요청 프록시
 * @param request NextRequest
 * @param config ProxyConfig
 * @returns NextResponse
 */
export async function proxyPatch(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  try {
    const fullUrl = buildFullUrl(config.baseUrl, config.path);
    const body = await request.text();

    console.log('🔄 PATCH API 호출:', fullUrl);

    const requestHeaders = await buildHeaders(config.requireAuth || false, config.additionalHeaders);

    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: requestHeaders,
      body,
      next: { revalidate: config.revalidate ?? 0 },
    });

    if (!response.ok) {
      console.error('❌ PATCH API 호출 실패:', response.status, response.statusText);
      return await handleExternalApiError(
        response,
        config.errorMessage || 'API 요청에 실패했습니다.'
      );
    }

    const data = await response.json();
    
    if (config.successLog) {
      console.log('✅', config.successLog);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('❌ PATCH API 오류:', error);
    return handleException(
      error,
      config.errorMessage || 'API 요청 중 오류가 발생했습니다.'
    );
  }
}

/**
 * DELETE 요청 프록시
 * @param request NextRequest
 * @param config ProxyConfig
 * @returns NextResponse
 */
export async function proxyDelete(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  try {
    const fullUrl = buildFullUrl(config.baseUrl, config.path);

    console.log('🔄 DELETE API 호출:', fullUrl);

    const requestHeaders = await buildHeaders(config.requireAuth || false, config.additionalHeaders);

    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: requestHeaders,
      next: { revalidate: config.revalidate ?? 0 },
    });

    if (!response.ok) {
      console.error('❌ DELETE API 호출 실패:', response.status, response.statusText);
      return await handleExternalApiError(
        response,
        config.errorMessage || 'API 요청에 실패했습니다.'
      );
    }

    const data = await response.json().catch(() => null);
    
    if (config.successLog) {
      console.log('✅', config.successLog);
    }

    return createSuccessResponse(data || { success: true });
  } catch (error) {
    console.error('❌ DELETE API 오류:', error);
    return handleException(
      error,
      config.errorMessage || 'API 요청 중 오류가 발생했습니다.'
    );
  }
}

/**
 * 통합 프록시 함수 (HTTP 메서드 자동 판단)
 * @param request NextRequest
 * @param config ProxyConfig
 * @returns NextResponse
 */
export async function proxyRequest(
  request: NextRequest,
  config: ProxyConfig
): Promise<NextResponse> {
  const method = request.method.toUpperCase();

  switch (method) {
    case 'GET':
      return proxyGet(request, config);
    case 'POST':
      return proxyPost(request, config);
    case 'PATCH':
      return proxyPatch(request, config);
    case 'DELETE':
      return proxyDelete(request, config);
    default:
      return handleException(
        new Error(`Unsupported HTTP method: ${method}`),
        '지원하지 않는 HTTP 메서드입니다.'
      );
  }
}

