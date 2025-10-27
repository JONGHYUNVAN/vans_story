/**
 * 검색 API 응답 타입 정의
 */

export interface Author {
  user_id: string;
  username: string;
  display_name: string;
  profile_image: string;
}

export interface Highlight {
  title?: string[];
  description?: string[];
  content?: string[];
  summary?: string[];
}

export interface SearchResult {
  post_id: string;
  title: string;
  content: string;
  summary: string;
  theme: string;        // 실제 데이터에 있는 필드
  category: string;
  tags: string[];
  author: Author;
  updated_date: string;
  view_count: number;
  like_count: number;
  language: string;
  reading_time: number;
  featured_image: string;
  score: number;
  highlight: Highlight;
}

export interface SearchResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: SearchResult[];
  aggregations: Record<string, any>;
}

/**
 * 자동완성 제안 항목 (프론트엔드에서 사용)
 */
export interface AutocompleteSuggestion {
  text: string;
  type: 'query' | 'title' | 'category' | 'tag';
  score: number;
  highlight?: string;
}

/**
 * 백엔드 자동완성 API 응답 (실제 응답 구조)
 */
export interface AutocompleteApiResponse {
  suggestions: string[];
  query: string;
}

/**
 * 프론트엔드에서 사용하는 자동완성 응답 (변환된 구조)
 */
export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
  query: string;
  total: number;
}