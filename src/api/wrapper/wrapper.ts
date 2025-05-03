import { API_URLS } from '../constants/apiUrl';
import { authApi } from '../auth/authApi';
import { tokenStorage } from '@/utils/token';

/**
 * API 요청을 위한 래퍼 클래스
 * 토큰 갱신 및 에러 처리를 자동으로 수행
 */
export class ApiWrapper {
  /**
   * API 요청을 수행하는 메서드
   * @param url - 요청 URL
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
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
        const newToken = await authApi.refresh();
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
        await authApi.logout();
        throw new Error(errorMessage);
      }
    }

    return response;
  }

  /**
   * GET 요청을 수행하는 메서드
   * @param url - 요청 URL
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  static async get(url: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST 요청을 수행하는 메서드
   * @param url - 요청 URL
   * @param data - 요청 데이터
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  static async post(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH 요청을 수행하는 메서드
   * @param url - 요청 URL
   * @param data - 요청 데이터
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  static async patch(url: string, data: any, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 요청을 수행하는 메서드
   * @param url - 요청 URL
   * @param options - fetch 옵션
   * @returns Promise<Response>
   */
  static async delete(url: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'DELETE',
    });
  }
} 