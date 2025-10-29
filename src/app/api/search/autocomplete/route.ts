import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { API_CONFIG } from '@/config/apiConfig';
import { handleExternalApiError, handleException, createSuccessResponse, createErrorResponse } from '@/lib/errorHandler';

/**
 * 자동완성 검색을 위한 API 라우트 핸들러 (BFF 프록시)
 * - 클라이언트의 요청을 받아 Django 자동완성 API로 전달하고 결과를 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  try {
    const [headersList, { searchParams }] = await Promise.all([
      headers(),
      Promise.resolve(new URL(request.url))
    ]);
    
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || API_CONFIG.SEARCH.DEFAULT_LIMIT.toString();
    const language = searchParams.get('language') || API_CONFIG.SEARCH.DEFAULT_LANGUAGE;
    const token = headersList.get('Authorization');

    if (!query || query.trim().length === 0) {
      return createErrorResponse(400, '검색어가 필요합니다.');
    }

    // 너무 짧은 검색어는 자동완성하지 않음
    if (query.trim().length < API_CONFIG.SEARCH.MIN_QUERY_LENGTH) {
      return createSuccessResponse({
        suggestions: [],
        query: query.trim(),
        total: 0
      });
    }

    // 환경변수 설정 (다른 API들과 동일한 패턴)
    const searchApiUrl = process.env.SEARCH_API_URL || API_CONFIG.ENV_DEFAULTS.SEARCH_API_URL;
    const encodedQuery = encodeURIComponent(query.trim());
    const fullUrl = `${searchApiUrl}/api/v1/search/autocomplete/?query=${encodedQuery}&language=${language}&limit=${limit}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        ...API_CONFIG.HEADERS.JSON,
        ...(token && { Authorization: token }),
      },
      next: { revalidate: API_CONFIG.CACHE.AUTOCOMPLETE }
    });

    if (!response.ok) {
      return await handleExternalApiError(response, '자동완성 요청에 실패했습니다.');
    }

    const data = await response.json();
    return createSuccessResponse(data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return handleException(error, '자동완성 검색 중 오류가 발생했습니다.');
  }
}
