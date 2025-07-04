# API 문서

## 개요
이 문서는 블로그 애플리케이션의 API 엔드포인트들을 설명합니다.

## 인증 API

### 1. 로그인
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: 사용자 로그인 처리
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: 
  - **200**: 성공 시 `Authorization` 헤더에 JWT 토큰 포함
  - **401**: 인증 실패
  - **500**: 서버 오류

### 2. 로그아웃
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: 사용자 로그아웃 처리
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  - **200**: 성공
  - **500**: 서버 오류

### 3. 회원가입
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Description**: 새 사용자 회원가입
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200**: 성공 시 `{ "success": true }`
  - **400**: 유효성 검사 실패
  - **500**: 서버 오류

### 4. 토큰 갱신
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Description**: JWT 토큰 갱신
- **Response**:
  - **200**: 성공 시 `Authorization` 헤더에 새로운 JWT 토큰 포함
  - **401**: 토큰 갱신 실패
  - **500**: 서버 오류

### 5. OAuth 콜백
- **URL**: `/api/auth/callback`
- **Method**: `POST`
- **Description**: OAuth 임시 코드를 JWT 토큰으로 교환
- **Request Body**:
  ```json
  {
    "code": "string"
  }
  ```
- **Response**:
  - **200**: 성공 시
    ```json
    {
      "success": true,
      "token": "string",
      "message": "토큰 교환이 완료되었습니다."
    }
    ```
  - **400**: 임시 코드 누락
  - **500**: 서버 오류

## 포스트 관리 API

### 1. 포스트 목록 조회
- **URL**: `/api/posts`
- **Method**: `GET`
- **Description**: 게시물 목록 조회
- **Query Parameters** (선택사항):
  - `category`: 카테고리 필터
  - `page`: 페이지 번호
  - `limit`: 페이지당 항목 수
- **Headers**: `Authorization: Bearer <token>` (선택사항)
- **Response**:
  - **200**: 성공 시 게시물 목록 반환
  - **500**: 서버 오류

### 2. 포스트 생성
- **URL**: `/api/posts`
- **Method**: `POST`
- **Description**: 새 게시물 생성
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - **200**: 성공 시 생성된 게시물 정보 반환
  - **400**: 유효성 검사 실패
  - **401**: 인증 필요
  - **500**: 서버 오류

### 3. 포스트 상세 조회
- **URL**: `/api/posts/{id}`
- **Method**: `GET`
- **Description**: 특정 게시물 상세 조회
- **Headers**: `Authorization: Bearer <token>` (선택사항)
- **Response**:
  - **200**: 성공 시 게시물 상세 정보 반환
  - **404**: 게시물을 찾을 수 없음
  - **500**: 서버 오류

### 4. 포스트 수정
- **URL**: `/api/posts/{id}`
- **Method**: `PATCH`
- **Description**: 게시물 수정
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - **200**: 성공 시 수정된 게시물 정보 반환
  - **400**: 유효성 검사 실패
  - **401**: 인증 필요
  - **404**: 게시물을 찾을 수 없음
  - **500**: 서버 오류

### 5. 포스트 편집용 조회
- **URL**: `/api/posts/{id}/edit`
- **Method**: `GET`
- **Description**: 편집용 게시물 조회 (인증 필요)
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  - **200**: 성공 시 편집용 게시물 정보 반환
  - **401**: 인증 필요
  - **404**: 게시물을 찾을 수 없음
  - **500**: 서버 오류

## 이미지 업로드 API

### 1. 이미지 업로드
- **URL**: `/api/imageUpload`
- **Method**: `POST`
- **Description**: 이미지 파일 업로드
- **Content-Type**: `multipart/form-data`
- **Request Body**: 이미지 파일 데이터
- **Response**:
  - **200**: 성공 시 업로드된 이미지 정보 반환
    ```json
    {
      "url": "string",
      "filename": "string",
      "size": "number"
    }
    ```
  - **400**: 유효하지 않은 파일
  - **500**: 서버 오류

## AI 채팅 API

### 1. AI 채팅
- **URL**: `/api/ai/chat`
- **Method**: `POST`
- **Description**: AI와 채팅 메시지 전송
- **Headers**: `Authorization: Bearer <token>` (선택사항)
- **Request Body**:
  ```json
  {
    "message": "string",
    "model": "string",           // 선택사항, 기본값: gpt-4o-mini
    "max_tokens": "number",      // 선택사항, 기본값: 1000
    "temperature": "number"      // 선택사항, 기본값: 0.7
  }
  ```
- **Response**:
  - **200**: 성공 시
    ```json
    {
      "id": "string",
      "message": "string",
      "model": "string",
      "tokens_used": "number",
      "timestamp": "string"
    }
    ```
  - **400**: 메시지 내용 누락
  - **500**: 서버 오류

## 환경 변수

API가 제대로 작동하려면 다음 환경 변수들이 설정되어야 합니다:

- `AUTH_API_URL`: 인증 서버 URL (기본값: http://localhost:8080)
- `POST_API_URL`: 포스트 서버 URL (기본값: http://localhost:3001/api/v1)
- `IMAGE_API_URL`: 이미지 서버 URL (기본값: http://localhost:3002/api)
- `AI_API_URL`: AI 서버 URL
- `AI_ROUTE_API_KEY`: AI API 키
- `IMAGE_ROUTE_API_KEY`: 이미지 API 키

## 오류 처리

모든 API는 일관된 오류 응답 형식을 사용합니다:

```json
{
  "error": "오류 메시지",
  "code": "ERROR_CODE"
}
```

## 인증

대부분의 API는 JWT 토큰을 사용한 Bearer 인증을 지원합니다:

```
Authorization: Bearer <your_jwt_token>
```

인증이 필요한 API에 토큰 없이 접근하면 `401 Unauthorized` 응답을 받습니다. 