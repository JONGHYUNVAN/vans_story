/**
 * JWT 토큰을 디코딩하여 사용자 정보를 추출하는 함수
 * @param {string} token - 디코딩할 JWT 토큰
 * @returns {{ email: string; role: string } | null} - 사용자 정보 객체 또는 null
 * @description 
 * 주어진 JWT 토큰에서 페이로드를 추출하고, 
 * 이메일과 역할 정보를 포함하는 객체를 반환합니다. 
 * 
 * - 토큰은 '.'으로 구분된 세 부분으로 구성되어 있으며, 
 *   두 번째 부분(페이로드)을 Base64로 디코딩하여 JSON으로 변환합니다.
 * - 변환 과정에서 오류가 발생하면 null을 반환합니다.
 */
export const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        role: payload.auth,
      };
    } catch (error) {
      return null;
    }
  };