/**
 * URL 생성 유틸리티
 * API URL을 일관되고 안전하게 생성합니다.
 */

/**
 * 쿼리 파라미터 타입
 */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * 쿼리 파라미터를 URL 쿼리 문자열로 변환
 * @param params 쿼리 파라미터 객체
 * @returns URLSearchParams 객체
 */
export function buildQueryParams(params: QueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // undefined나 null은 제외
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
}

/**
 * 베이스 URL과 경로를 결합
 * @param baseUrl 베이스 URL
 * @param path 경로 (선택사항)
 * @returns 결합된 URL
 */
export function joinUrl(baseUrl: string, path?: string): string {
  if (!path) return baseUrl;

  // baseUrl 끝의 슬래시 제거
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // path 시작의 슬래시 확인
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * 완전한 API URL 생성
 * @param baseUrl 베이스 URL
 * @param path 경로
 * @param params 쿼리 파라미터 (선택사항)
 * @returns 완전한 URL
 */
export function buildApiUrl(
  baseUrl: string,
  path: string,
  params?: QueryParams
): string {
  const url = joinUrl(baseUrl, path);

  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = buildQueryParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * URLSearchParams에서 쿼리 파라미터 추출
 * @param searchParams URLSearchParams 객체
 * @returns 쿼리 파라미터 객체
 */
export function extractQueryParams(searchParams: URLSearchParams): QueryParams {
  const params: QueryParams = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * 경로 파라미터 치환
 * @param path 경로 템플릿 (예: '/posts/:id/comments/:commentId')
 * @param params 파라미터 값 (예: { id: '123', commentId: '456' })
 * @returns 치환된 경로
 */
export function buildPathWithParams(
  path: string,
  params: Record<string, string | number>
): string {
  let result = path;

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
    result = result.replace(`{${key}}`, String(value));
    result = result.replace(`[${key}]`, String(value));
  });

  return result;
}

/**
 * URL 파라미터 인코딩
 * @param value 인코딩할 값
 * @returns 인코딩된 문자열
 */
export function encodeUrlParam(value: string): string {
  return encodeURIComponent(value);
}

/**
 * URL 파라미터 디코딩
 * @param value 디코딩할 값
 * @returns 디코딩된 문자열
 */
export function decodeUrlParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    // 디코딩 실패 시 원본 반환
    return value;
  }
}

/**
 * API URL 빌더 클래스 (Fluent Interface)
 */
export class ApiUrlBuilder {
  private baseUrl: string;
  private pathSegments: string[] = [];
  private queryParams: QueryParams = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 경로 세그먼트 추가
   * @param segment 경로 세그먼트
   * @returns this
   */
  path(segment: string): this {
    this.pathSegments.push(segment);
    return this;
  }

  /**
   * 쿼리 파라미터 추가
   * @param key 파라미터 키
   * @param value 파라미터 값
   * @returns this
   */
  query(key: string, value: string | number | boolean): this {
    this.queryParams[key] = value;
    return this;
  }

  /**
   * 여러 쿼리 파라미터 한번에 추가
   * @param params 파라미터 객체
   * @returns this
   */
  queries(params: QueryParams): this {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * URL 생성
   * @returns 완전한 URL
   */
  build(): string {
    const path = this.pathSegments.length > 0 
      ? `/${this.pathSegments.join('/')}`
      : '';
    
    return buildApiUrl(this.baseUrl, path, this.queryParams);
  }

  /**
   * toString() 구현
   */
  toString(): string {
    return this.build();
  }
}

/**
 * 편의 함수: ApiUrlBuilder 인스턴스 생성
 * @param baseUrl 베이스 URL
 * @returns ApiUrlBuilder 인스턴스
 */
export function createUrlBuilder(baseUrl: string): ApiUrlBuilder {
  return new ApiUrlBuilder(baseUrl);
}

