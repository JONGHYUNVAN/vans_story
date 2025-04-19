import { redirect, notFound } from 'next/navigation';

/**
 * 게시글이나 카테고리가 없을 때 Not Found 페이지를 표시합니다.
 * 
 * 404 대신 Not Found 페이지를 표시하여 사용자 경험을 개선합니다.
 * 
 * @example
 * ```typescript
 * if (!post) {
 *   showNotFound();
 * }
 * ```
 */
export const showNotFound = () => {
  notFound();
};

/**
 * API 호출이 실패했을 때 서버 에러 페이지로 리디렉션합니다.
 * 
 * @example
 * ```typescript
 * try {
 *   const data = await fetchData();
 * } catch (error) {
 *   redirectToServerError();
 * }
 * ```
 */
export const redirectToServerError = () => {
  redirect('/error');
};

/**
 * 데이터가 비어있을 때 Not Found 페이지를 표시할지 여부를 결정합니다.
 * 
 * @param data 확인할 데이터 배열
 * @param shouldShowNotFound Not Found 페이지 표시 여부 (기본값: true)
 * @returns 데이터가 있으면 원래 데이터를, 없으면 Not Found 페이지를 표시합니다.
 * 
 * @example
 * ```typescript
 * const posts = handleEmptyData(await getPosts(category));
 * ```
 */
export const handleEmptyData = <T>(data: T[], shouldShowNotFound = true): T[] => {
  if (data.length === 0 && shouldShowNotFound) {
    showNotFound();
  }
  return data;
}; 