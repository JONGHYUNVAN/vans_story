/**
 * 카테고리 관련 타입 정의
 * vans_story_be_post API 응답과 호환되는 타입들
 */

/**
 * 서브 카테고리 타입
 */
export interface SubCategory {
  value: string;
  label: string;
  description?: string;
}

/**
 * 카테고리 타입 (API 응답)
 */
export interface Category {
  id: string;
  group: string;
  value: string;
  label: string;
  description?: string;
  iconName: string;
  color: string;
  path: string;
  subCategories: SubCategory[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 그룹별 카테고리 타입
 */
export interface GroupedCategories {
  [group: string]: Category[];
}

/**
 * 메인 카테고리 옵션 (기존 호환성)
 */
export interface MainCategoryOption {
  value: string;
  label: string;
}

/**
 * 서브 카테고리 옵션 (기존 호환성)
 */
export interface SubCategoryOption {
  value: string;
  label: string;
  description?: string;
  path?: string;
}

/**
 * 카테고리 API 응답 타입들
 */
export interface CategoryApiResponse {
  categories: Category[];
  total: number;
}

export interface GroupedCategoryApiResponse {
  [group: string]: Category[];
}

/**
 * 카테고리 로딩 상태
 */
export interface CategoryLoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}


