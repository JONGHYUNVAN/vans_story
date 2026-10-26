/**
 * 폼의 카테고리 value(nextjs / introduction)를 백엔드 카테고리 문서의 ObjectId로 바꾼다.
 *
 * Post BE(vans_story_be_post)의 게시글 생성·수정 DTO는 `mainCategoryId` / `subCategoryId`(Mongo ObjectId)만 받고,
 * 문자열 value를 보내면 400으로 거부한다. 화면의 하위 카테고리 목록은 i18n 메시지(`src/messages/*.json`)에서 오므로
 * 그 key가 백엔드 value와 다를 수 있다 — key 다음으로 path의 마지막 세그먼트(`project-structure`)로도 맞춰 본다.
 */

import { API_URLS } from '@/constants/apiUrl';
import { ApiFetch } from '@/lib/api/apiFetch';

/** `GET /api/categories` 응답 한 건 중 여기서 쓰는 필드 */
interface CategoryRecord {
  id: string;
  parentId: string | null;
  value: string;
}

export interface CategoryIds {
  mainCategoryId: string;
  subCategoryId: string;
}

/** 카테고리 목록을 받아온다 (BFF가 캐시한다) */
async function fetchCategories(): Promise<CategoryRecord[]> {
  const response = await ApiFetch.basicGet(API_URLS.CATEGORY.LIST);
  if (!response.ok) {
    throw new Error(`카테고리 목록을 불러오지 못했습니다. (상태 코드: ${response.status})`);
  }
  const body = await response.json();
  const list: unknown = Array.isArray(body) ? body : body?.data;
  if (!Array.isArray(list)) {
    throw new Error('카테고리 목록 응답 형식이 올바르지 않습니다.');
  }
  return list as CategoryRecord[];
}

/**
 * 메인/하위 카테고리 value를 백엔드 카테고리 id로 바꾼다.
 *
 * @param mainCategoryValue 메인 카테고리 value (예: `nextjs`)
 * @param subCategoryCandidates 하위 카테고리로 시도할 value 목록 (앞에서부터 처음 맞는 것을 쓴다)
 * @throws 백엔드에 해당 카테고리가 없으면 사용자에게 보여줄 메시지로 throw
 */
export async function resolveCategoryIds(
  mainCategoryValue: string,
  subCategoryCandidates: string[],
): Promise<CategoryIds> {
  const categories = await fetchCategories();

  const main = categories.find(
    (category) => !category.parentId && category.value === mainCategoryValue,
  );
  if (!main) {
    throw new Error(`백엔드에 메인 카테고리 '${mainCategoryValue}'가 없습니다.`);
  }

  const candidates = subCategoryCandidates.filter(Boolean);
  const subs = categories.filter((category) => category.parentId === main.id);
  const sub = candidates
    .map((candidate) => subs.find((category) => category.value === candidate))
    .find((found) => found !== undefined);
  if (!sub) {
    const available = subs.map((category) => category.value).join(', ') || '없음';
    throw new Error(
      `백엔드의 '${mainCategoryValue}' 카테고리에 하위 카테고리 '${candidates[0] ?? ''}'가 없습니다. ` +
        `(등록된 하위 카테고리: ${available}) 카테고리를 먼저 추가해주세요.`,
    );
  }

  return { mainCategoryId: main.id, subCategoryId: sub.id };
}

/** 하위 카테고리 path(`/post/view/nextjs/category/project-structure`)의 마지막 세그먼트 */
export function lastPathSegment(path?: string): string | undefined {
  if (!path) return undefined;
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1];
}
