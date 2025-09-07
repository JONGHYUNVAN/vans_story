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
