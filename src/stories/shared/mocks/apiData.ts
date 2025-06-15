/**
 * API 응답 모의 데이터 인터페이스
 */
export interface MockApiResponse {
  data: any;
  status: number;
  error?: string | null;
  loading?: boolean;
}

/**
 * HTTP 메서드별 API 응답 데이터
 */
export const createApiResponse = {
  /**
   * GET 요청 성공 응답
   */
  getSuccess: (data: any): MockApiResponse => ({
    data,
    status: 200,
    error: null,
    loading: false
  }),

  /**
   * POST 요청 성공 응답
   */
  postSuccess: (data: any): MockApiResponse => ({
    data: {
      ...data,
      createdAt: new Date().toISOString()
    },
    status: 201,
    error: null,
    loading: false
  }),

  /**
   * PATCH 요청 성공 응답
   */
  patchSuccess: (data: any): MockApiResponse => ({
    data: {
      ...data,
      updatedAt: new Date().toISOString()
    },
    status: 200,
    error: null,
    loading: false
  }),

  /**
   * DELETE 요청 성공 응답
   */
  deleteSuccess: (): MockApiResponse => ({
    data: { 
      success: true, 
      message: '성공적으로 삭제되었습니다.' 
    },
    status: 204,
    error: null,
    loading: false
  }),

  /**
   * 로딩 중 상태
   */
  loading: (): MockApiResponse => ({
    data: null,
    status: 0,
    error: null,
    loading: true
  }),

  /**
   * 에러 응답
   */
  error: (message: string, status: number = 500): MockApiResponse => ({
    data: null,
    status,
    error: message,
    loading: false
  }),

  /**
   * 인증 에러 응답
   */
  authError: (): MockApiResponse => ({
    data: null,
    status: 401,
    error: '인증이 필요합니다.',
    loading: false
  }),

  /**
   * 권한 에러 응답
   */
  permissionError: (): MockApiResponse => ({
    data: null,
    status: 403,
    error: '권한이 없습니다.',
    loading: false
  }),

  /**
   * 찾을 수 없음 에러 응답
   */
  notFoundError: (): MockApiResponse => ({
    data: null,
    status: 404,
    error: '요청한 리소스를 찾을 수 없습니다.',
    loading: false
  })
};

/**
 * 포스트 API 모의 데이터
 */
export const mockPostApi = {
  /**
   * 단일 포스트 조회 응답
   */
  getSingle: createApiResponse.getSuccess({
    "_id": "507f1f77bcf86cd799439011",
    "title": "게시글 제목",
    "content": "게시글 내용입니다.",
    "theme": "dark",
    "authorEmail": "user@example.com",
    "author": "닉네임",
    "createdAt": "2024-03-19T09:00:00.000Z",
    "updatedAt": "2024-03-19T09:00:00.000Z",
    "description": "게시글 설명입니다.",
    "tags": ["태그1", "태그2"],
    "viewCount": 0,
    "likeCount": 0,
    "category": "introduction",
    "thumbnail": "thumbnail.jpg",
    "language": "ko",
    "topic": "Java 알고리즘"
  }),

  /**
   * 포스트 목록 조회 응답
   */
  getList: createApiResponse.getSuccess([
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "첫 번째 게시글",
      "description": "첫 번째 게시글 설명",
      "tags": ["React", "Next.js"],
      "viewCount": 125,
      "likeCount": 15
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "두 번째 게시글",
      "description": "두 번째 게시글 설명",
      "tags": ["Spring", "Java"],
      "viewCount": 89,
      "likeCount": 7
    }
  ]),

  /**
   * 포스트 생성 응답
   */
  create: createApiResponse.postSuccess({
    "_id": "507f1f77bcf86cd799439013",
    "title": "새로운 게시글",
    "content": "새로운 게시글 내용",
    "author": "작성자"
  }),

  /**
   * 포스트 수정 응답
   */
  update: createApiResponse.patchSuccess({
    "_id": "507f1f77bcf86cd799439011",
    "title": "수정된 게시글 제목",
    "content": "수정된 게시글 내용"
  }),

  /**
   * 포스트 삭제 응답
   */
  delete: createApiResponse.deleteSuccess()
};

/**
 * 로그인 API 모의 데이터
 */
export const mockAuthApi = {
  /**
   * 로그인 성공 응답
   */
  loginSuccess: createApiResponse.postSuccess({
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "nickname": "사용자닉네임"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_example"
    }
  }),

  /**
   * 로그인 실패 응답
   */
  loginFailure: createApiResponse.error("이메일 또는 비밀번호가 잘못되었습니다.", 401),

  /**
   * 로그아웃 성공 응답
   */
  logoutSuccess: createApiResponse.postSuccess({
    "message": "성공적으로 로그아웃되었습니다."
  }),

  /**
   * 토큰 갱신 성공 응답
   */
  refreshSuccess: createApiResponse.postSuccess({
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_example"
  })
}; 