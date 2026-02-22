/**
 * 중앙화된 Post 타입 시스템
 * 모든 Post 관련 타입들을 여기서 관리
 */

// ========== 기본 Post 데이터 구조 ==========

/**
 * 기본 Post 인터페이스 (모든 Post 타입의 베이스)
 */
export interface BasePost {
  // 필수 필드
  title: string
  content: any
  mainCategory: string    // 기존 theme (nextjs, spring, mariadb 등)
  subCategory: string     // 기존 category (introduction, installation 등)
  topic: string          // 사용자 정의 주제
  description: string
  tags: string[]
  thumbnail: string
  language: string
  
  // 메타데이터 (선택적)
  id?: string
  author?: string
  authorEmail?: string
  createdAt?: string
  updatedAt?: string
  viewCount?: number
  likeCount?: number
}

/**
 * 완전한 Post 정보 (DB에서 가져온 데이터)
 */
export interface Post extends Required<BasePost> {
  id: string
  author: string
  authorEmail: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
}

/**
 * 화면 표시용 Post 정보
 */
export interface PostInfo extends Post {
  // Post와 동일하지만 명시적으로 구분
}

// ========== 폼 관련 타입들 ==========

/**
 * Post 생성용 데이터
 */
export interface PostCreateData extends Omit<BasePost, 'id' | 'author' | 'authorEmail' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'> {
  // BasePost에서 메타데이터 제외
}

/**
 * Post 편집용 데이터
 */
export interface PostEditData extends PostCreateData {
  id: string
  subCategoryId?: string // 백엔드 호환성을 위한 필드
}

/**
 * Post 업데이트용 데이터 (부분 업데이트 지원)
 */
export interface PostUpdateData extends Partial<PostCreateData> {
  id: string
}

// ========== 카테고리 관련 타입들 ==========

/**
 * 메인 카테고리 옵션
 */
export interface MainCategoryOption {
  value: string
  label: string
  icon?: any  // IconType (react-icons) 또는 string (이미지 경로)
  color?: string
}

/**
 * 하위 카테고리 옵션
 */
export interface SubCategoryOption {
  value: string
  label: string
  description?: string
  path?: string
}

// ========== 컴포넌트 Props 타입들 ==========

/**
 * 뷰 모드
 */
export type ViewMode = 'edit' | 'preview'

/**
 * Post 폼 Props
 */
export interface PostFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<PostEditData>
  onSubmit?: (data: PostCreateData | PostEditData) => Promise<void>
  onTempSave?: (data: Partial<PostCreateData | PostEditData>) => void
  onSuccess?: (data: any) => void | Promise<void>
  onError?: (error: Error) => void
  redirectPath?: string | null  // null이면 리다이렉트 안함, undefined면 기본 동작
}

/**
 * Post 입력 필드 Props
 */
export interface PostFormInputsProps {
  data: Partial<BasePost>
  onChange: (field: keyof BasePost, value: any) => void
  availableSubCategories: SubCategoryOption[]
  selectedSubCategory: SubCategoryOption | null
  onSubCategoryChange: (subCategory: SubCategoryOption | null) => void
  errors?: Record<string, string>
  disabled?: boolean
}

/**
 * Post 미리보기 Props
 */
export interface PostPreviewProps {
  post: Partial<BasePost>
  isViewerMounted?: boolean
  showCard?: boolean
  showLayout?: boolean
}

// ========== 타입 변환 유틸리티 ==========

/**
 * BasePost를 PostInfo로 변환 (메타데이터 추가)
 */
export function toPostInfo(base: BasePost, metadata: {
  id: string
  author: string
  authorEmail: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
}): PostInfo {
  return {
    ...base,
    ...metadata
  } as PostInfo
}

// ========== 타입 가드 ==========

export function isPost(obj: any): obj is Post {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.title === 'string' &&
         typeof obj.mainCategory === 'string' &&
         typeof obj.subCategory === 'string' &&
         typeof obj.topic === 'string'
}

export function isPostCreateData(obj: any): obj is PostCreateData {
  return obj && 
         typeof obj.title === 'string' &&
         typeof obj.mainCategory === 'string' &&
         typeof obj.subCategory === 'string' &&
         typeof obj.topic === 'string' &&
         !obj.id
}

export function isPostEditData(obj: any): obj is PostEditData {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.title === 'string' &&
         typeof obj.mainCategory === 'string' &&
         typeof obj.subCategory === 'string' &&
         typeof obj.topic === 'string'
}
