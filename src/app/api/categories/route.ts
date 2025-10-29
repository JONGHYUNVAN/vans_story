import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/apiConfig';
import { proxyGet } from '@/lib/apiProxy';

/**
 * 카테고리 API 라우트 핸들러 (BFF 프록시)
 * vans_story_be_post의 카테고리 API를 프록시합니다.
 */

// GET /api/categories - 카테고리 목록 조회
export async function GET(request: NextRequest) {
  return proxyGet(request, {
    baseUrl: process.env.POST_API_URL || API_CONFIG.ENV_DEFAULTS.POST_API_URL,
    path: '/categories',
    revalidate: API_CONFIG.CACHE.CATEGORY,
    successLog: '카테고리 데이터 조회 성공',
    errorMessage: '카테고리 목록 조회에 실패했습니다.',
  });
}
