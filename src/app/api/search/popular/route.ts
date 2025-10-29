import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';
import { proxyGet } from '@/lib/apiProxy';

/**
 * 인기 검색어를 가져오는 API 라우트 핸들러 (BFF 프록시)
 * - Django 검색 API에서 인기 검색어를 가져와 반환합니다.
 * @param request NextRequest
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, {
    baseUrl: process.env.SEARCH_API_URL || API_CONFIG.ENV_DEFAULTS.SEARCH_API_URL,
    path: '/api/v1/search/popular/',
    revalidate: API_CONFIG.CACHE.POPULAR_SEARCH,
    requireAuth: false,  // 인기 검색어는 공개 API
    successLog: '인기 검색어 조회 성공',
    errorMessage: '인기 검색어 조회에 실패했습니다.',
  });
}
