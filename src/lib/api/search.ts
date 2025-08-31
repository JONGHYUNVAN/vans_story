import { SearchResponse } from '@/types/api/search';

const API_URL = process.env.NEXT_PUBLIC_SEARCH_API_URL || 'http://localhost:8000/api/v1/search';

/**
 * 검색 API를 호출하여 게시물을 검색합니다.
 * @param query 검색어
 * @returns 검색 결과 Promise
 */
export const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  const encodedQuery = encodeURIComponent(query);
  const url = `${API_URL}/posts?query=${encodedQuery}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // 1시간 캐시
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '검색 결과를 가져오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('Search API fetch error:', error);
    throw error;
  }
};
