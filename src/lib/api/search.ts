import { SearchResponse } from '@/types/api/search';

// 서버 사이드에서 내부 API 호출 시 전체 주소가 필요합니다.
// 이 값은 환경 변수로 관리하는 것이 가장 좋습니다. (e.g., process.env.NEXT_PUBLIC_APP_URL)
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/search`;

/**
 * 내부 검색 API 라우트를 호출하여 게시물을 검색합니다.
 * @param query 검색어
 * @returns 검색 결과 Promise
 */
export const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  if (!query) {
    // 빈 검색어에 대해서는 API 호출 없이 빈 결과를 반환
    return {
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
      results: [],
      aggregations: {},
    };
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `${API_URL}?query=${encodedQuery}`;

  try {
    // 서버 컴포넌트에서 fetch를 사용하면 자동으로 서버 간 통신이 됩니다.
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // 1시간 캐시
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '검색 결과를 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('🔍 Search API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Search API fetch error:', error);
    throw error;
  }
};
