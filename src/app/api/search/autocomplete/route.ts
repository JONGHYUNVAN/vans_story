import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';
import { proxyGet } from '@/lib/apiProxy';
import { createSuccessResponse } from '@/lib/errorHandler';

/**
 * 자동완성 검색을 위한 API 라우트 핸들러 (BFF 프록시)
 * - 클라이언트의 요청을 받아 Django 자동완성 API로 전달하고 결과를 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // 너무 짧은 검색어는 자동완성하지 않음
  if (query && query.trim().length < API_CONFIG.SEARCH.MIN_QUERY_LENGTH) {
    return createSuccessResponse({
      suggestions: [],
      query: query.trim(),
      total: 0
    });
  }

  // query 파라미터가 있으면 URL 인코딩
  const encodedQuery = query ? encodeURIComponent(query.trim()) : '';
  const limit = searchParams.get('limit') || API_CONFIG.SEARCH.DEFAULT_LIMIT.toString();
  const language = searchParams.get('language') || API_CONFIG.SEARCH.DEFAULT_LANGUAGE;

  return proxyGet(request, {
    baseUrl: process.env.SEARCH_API_URL || API_CONFIG.ENV_DEFAULTS.SEARCH_API_URL,
    path: `/api/v1/search/autocomplete/?query=${encodedQuery}&language=${language}&limit=${limit}`,
    revalidate: API_CONFIG.CACHE.AUTOCOMPLETE,
    requireAuth: false,
    successLog: '자동완성 조회 성공',
    errorMessage: '자동완성 요청에 실패했습니다.',
  });
}
