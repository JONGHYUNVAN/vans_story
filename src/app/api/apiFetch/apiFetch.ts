import { API_URLS } from '../../../constants/apiUrl';
import { authService } from '../../../components/features/auth/authService';
import { tokenStorage } from '@/utils/token';

/**
 * API 요청을 위한 래퍼 클래스
 * 토큰 갱신 및 에러 처리를 자동으로 수행
 */
export class ApiFetch {
  /**
   * 토큰 없는 기본 요청 (로그인, 공개 API 등)
   * @param url - 요청 URL
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  private static async basicFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }

  /**
   * 파일 업로드용 (FormData + 토큰)
   * @param url - 요청 URL
   * @param formData - 업로드할 FormData
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  private static async fileFetch(url: string, formData: FormData, options: RequestInit = {}): Promise<Response> {
    const token = tokenStorage.getToken();
    
    return fetch(url, {
      method: 'POST',
      headers: {
        // Content-Type 설정하지 않음 (브라우저가 multipart/form-data로 자동 설정)
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      body: formData,
      ...options,
    });
  }

  /**
   * 인증 포함 요청 (토큰 포함 + 자동 갱신)
   * @param url - 요청 URL
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  private static async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = tokenStorage.getToken();
    
    // 기본 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // 첫 번째 요청 시도
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 에러 발생 시 토큰 갱신 시도
    if (response.status === 401) {
      try {
        const newToken = await authService.refresh();
        // 갱신된 토큰으로 재시도
        return fetch(url, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } catch (error: any) {
        // refresh 실패 시 서버 메시지 추출
        let errorMessage = '세션이 만료되었습니다. 다시 로그인해주세요.';
        if (error instanceof Error && error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && error.response) {
          // 서버에서 받은 에러 메시지 추출 시도
          try {
            const data = await error.response.json();
            if (data?.message) errorMessage = data.message;
          } catch {}
        }
        await authService.logout();
        throw new Error(errorMessage);
      }
    }

    return response;
  }

  // ==================== Basic 메서드들 (토큰 없음) ====================
  
  /**
   * Basic GET 요청 (토큰 없음)
   */
  static async basicGet(url: string, options: RequestInit = {}): Promise<Response> {
    return this.basicFetch(url, { ...options, method: 'GET' });
  }

  /**
   * Basic POST 요청 (토큰 없음)
   */
  static async basicPost(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
    return this.basicFetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ==================== File 메서드들 (파일 업로드) ====================
  
  /**
   * 파일 업로드 POST 요청
   */
  static async filePost(url: string, formData: FormData, options: RequestInit = {}): Promise<Response> {
    return this.fileFetch(url, formData, options);
  }

  // ==================== Auth 메서드들 (토큰 포함) ====================
  
  /**
   * Auth GET 요청 (토큰 포함)
   */
  static async get_withAuth(url: string, options: RequestInit = {}): Promise<Response> {
    return this.authFetch(url, { ...options, method: 'GET' });
  }

  /**
   * Auth POST 요청 (토큰 포함)
   */
  static async post_withAuth(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.authFetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Auth PATCH 요청 (토큰 포함)
   */
  static async patch_withAuth(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.authFetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Auth DELETE 요청 (토큰 포함)
   */
  static async delete_withAuth(url: string, options: RequestInit = {}): Promise<Response> {
    return this.authFetch(url, { ...options, method: 'DELETE' });
  }

  // ==================== Search 메서드들 ====================
  
  /**
   * 게시물 검색 (토큰 없음)
   * @param query 검색어
   * @param options 추가 옵션
   */
  static async searchPosts(query: string, options: RequestInit = {}): Promise<Response> {
    const encodedQuery = encodeURIComponent(query);
    return this.basicGet(`/api/search?query=${encodedQuery}`, options);
  }

  /**
   * 인기 검색어 조회 (토큰 없음)
   */
  static async getPopularSearches(options: RequestInit = {}): Promise<Response> {
    return this.basicGet('/api/search/popular', options);
  }

  /**
   * 자동완성 검색어 조회 (토큰 없음)
   * @param query 검색어 (최소 2글자)
   * @param limit 결과 개수 (기본값: 10)
   * @param options 추가 옵션
   */
  static async getAutocompleteSuggestions(
    query: string, 
    limit: number = 10, 
    options: RequestInit = {}
  ): Promise<Response> {
    if (!query || query.trim().length < 2) {
      // 클라이언트에서 빈 결과 반환
      return new Response(JSON.stringify({
        suggestions: [],
        query: query?.trim() || '',
        total: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const encodedQuery = encodeURIComponent(query.trim());
    return this.basicGet(`/api/search/autocomplete?query=${encodedQuery}&limit=${limit}`, options);
  }
} 