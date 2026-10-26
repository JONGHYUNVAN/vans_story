/**
 * API 설정 상수
 * 매직 넘버와 하드코딩된 값들을 중앙에서 관리
 */

export const API_CONFIG = {
  /**
   * 검색 관련 설정
   */
  SEARCH: {
    /** 자동완성 최소 검색어 길이 */
    MIN_QUERY_LENGTH: 2,
    /** 기본 검색 결과 개수 */
    DEFAULT_LIMIT: 10,
    /** 기본 언어 설정 */
    DEFAULT_LANGUAGE: 'all' as const,
  },

  /**
   * 캐시 설정 (초 단위)
   */
  CACHE: {
    /** 카테고리 캐시 시간 (5분) */
    CATEGORY: 300,
    /** 게시물 목록 캐시 시간 (1분) */
    POST_LIST: 60,
    /** 게시물 상세 캐시 시간 (캐시 없음) */
    POST_DETAIL: 0,
    /** 검색 결과 캐시 시간 (1분) */
    SEARCH: 60,
    /** 자동완성 캐시 시간 (5분) */
    AUTOCOMPLETE: 300,
    /** 인기 검색어 캐시 시간 (5분) */
    POPULAR_SEARCH: 300,
  },

  /**
   * 공통 HTTP 헤더
   */
  HEADERS: {
    JSON: {
      'Content-Type': 'application/json',
    } as const,
  },

  /**
   * HTTP 상태 코드 메시지
   */
  ERROR_MESSAGES: {
    400: '잘못된 요청입니다.',
    401: '인증이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    500: '내부 서버 오류가 발생했습니다.',
    DEFAULT: '알 수 없는 오류가 발생했습니다.',
  } as const,

  /**
   * API 환경 변수 기본값
   */
  ENV_DEFAULTS: {
    POST_API_URL: 'http://localhost:3001/api/v1',
    SEARCH_API_URL: 'http://localhost:8000',
    IMAGE_API_URL: 'http://localhost:3002/api',
    AUTH_API_URL: 'http://localhost:3000/api',
  } as const,
} as const;

