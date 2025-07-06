# Frontend API 문서

Van's Dev Blog 프론트엔드에서 제공하는 API 엔드포인트들을 설명합니다.

## 📋 목차

- [기본 정보](#기본-정보)
  - [Base URL](#base-url)
  - [Content-Type](#content-type)
  - [API 버전](#api-버전)
- [인증 시스템](#인증-시스템)
  - [인증 방식](#인증-방식)
  - [토큰 사용법](#토큰-사용법)
  - [토큰 만료](#토큰-만료)
- [API 엔드포인트](#api-엔드포인트)
  - [인증 API](#인증-api)
    - [사용자 로그인](#사용자-로그인)
    - [사용자 로그아웃](#사용자-로그아웃)
    - [회원가입](#회원가입)
    - [토큰 갱신](#토큰-갱신)
    - [OAuth 콜백 처리](#oauth-콜백-처리)
  - [포스트 관리 API](#포스트-관리-api)
    - [포스트 목록 조회](#포스트-목록-조회)
    - [포스트 상세 조회](#포스트-상세-조회)
    - [포스트 생성](#포스트-생성)
    - [포스트 수정](#포스트-수정)
    - [포스트 편집용 조회](#포스트-편집용-조회)
  - [이미지 업로드 API](#이미지-업로드-api)
    - [이미지 파일 업로드](#이미지-파일-업로드)
  - [AI 채팅 API](#ai-채팅-api)
    - [AI와 채팅](#ai와-채팅)
- [환경 설정](#환경-설정)
  - [필수 환경 변수](#필수-환경-변수)
  - [개발 환경](#개발-환경)
- [오류 처리](#오류-처리)
  - [표준 오류 응답 형식](#표준-오류-응답-형식)
  - [일반적인 HTTP 상태 코드](#일반적인-http-상태-코드)
  - [인증 오류](#인증-오류)


---


## 기본 정보

### Base URL
```
https://vansdevblog.online
```

### Content-Type
```
application/json
```

### API 버전
현재 버전: `v1`


---


## 인증 시스템

### 인증 방식
JWT (JSON Web Token) 기반 Bearer 인증을 사용합니다.

### 토큰 사용법
```http
Authorization: Bearer <your_jwt_token>
```

### 토큰 만료
- **Access Token**: 5시간
- **Refresh Token**: 7일 (HTTP-Only 쿠키)


---


## API 엔드포인트

## 🔐 인증 API

### 사용자 로그인
사용자 인증을 처리하고 JWT 토큰을 발급합니다.

```http
POST /api/auth/login
```

**요청**
```json
{
  "username": "string",
  "password": "string"
}
```

**응답**
- ✅ **200 OK**: JWT 토큰이 `Authorization` 헤더에 포함 (빈 응답 본문)
- ❌ **401 Unauthorized**: 인증 실패
- ❌ **500 Internal Server Error**: 서버 오류


---


### 사용자 로그아웃
현재 세션을 종료하고 토큰을 무효화합니다.

```http
POST /api/auth/logout
```

**헤더**
```http
Authorization: Bearer <token>
```

**응답**
- ✅ **200 OK**: 로그아웃 성공 (빈 응답 본문)
- ❌ **500 Internal Server Error**: 서버 오류


---


### 회원가입
새로운 사용자 계정을 생성합니다.

```http
POST /api/auth/signup
```

**요청**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**응답**
- ✅ **200 OK**: `{ "success": true }`
- ❌ **400 Bad Request**: 유효성 검사 실패
- ❌ **500 Internal Server Error**: 서버 오류


---


### 토큰 갱신
만료된 Access Token을 새로운 토큰으로 갱신합니다.

```http
POST /api/auth/refresh
```

**응답**
- ✅ **200 OK**: 새로운 JWT 토큰이 `Authorization` 헤더에 포함 (빈 응답 본문)
- ❌ **401 Unauthorized**: 토큰 갱신 실패
- ❌ **500 Internal Server Error**: 서버 오류


---


### OAuth 콜백 처리
OAuth 임시 코드를 JWT 토큰으로 교환합니다.

```http
POST /api/auth/callback
```

**요청**
```json
{
  "code": "string"
}
```

**응답**
```json
{
  "success": true,
  "token": "string",
  "message": "토큰 교환이 완료되었습니다."
}
```

- ✅ **200 OK**: 토큰 교환 성공
- ❌ **400 Bad Request**: 임시 코드 누락
- ❌ **500 Internal Server Error**: 서버 오류


---


## 📝 포스트 관리 API

### 포스트 목록 조회
블로그 포스트 목록을 조회합니다. (인증 선택사항)

```http
GET /api/posts?category=tech&page=1&limit=10
```

**쿼리 파라미터**
| 파라미터 | 타입 | 설명 | 기본값 |
|----------|------|------|--------|
| `category` | string | 카테고리 필터 | 전체 |
| `page` | number | 페이지 번호 | 1 |
| `limit` | number | 페이지당 항목 수 | 10 |

**응답**
- ✅ **200 OK**: 게시물 목록 반환
- ❌ **500 Internal Server Error**: 서버 오류


---


### 포스트 상세 조회
특정 포스트의 상세 정보를 조회합니다.

```http
GET /api/posts/{id}
```

**응답**
- ✅ **200 OK**: 게시물 상세 정보 반환
- ❌ **404 Not Found**: 게시물을 찾을 수 없음
- ❌ **500 Internal Server Error**: 서버 오류


---


### 포스트 생성
새로운 블로그 포스트를 생성합니다. (인증 필요)

```http
POST /api/posts
Authorization: Bearer <token>
```

**요청**
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"]
}
```

**응답**
- ✅ **200 OK**: 생성된 게시물 정보 반환
- ❌ **400 Bad Request**: 유효성 검사 실패
- ❌ **401 Unauthorized**: 인증 필요
- ❌ **500 Internal Server Error**: Internal server error


---


### 포스트 수정
기존 포스트를 수정합니다. (인증 필요)

```http
PATCH /api/posts/{id}
Authorization: Bearer <token>
```

**요청**
```json
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"]
}
```

**응답**
- ✅ **200 OK**: 수정된 게시물 정보 반환
- ❌ **400 Bad Request**: 유효성 검사 실패
- ❌ **401 Unauthorized**: 인증 필요
- ❌ **404 Not Found**: 게시물을 찾을 수 없음
- ❌ **500 Internal Server Error**: Internal server error


---


### 포스트 편집용 조회
포스트 편집을 위한 데이터를 조회합니다. (인증 필요)

```http
GET /api/posts/{id}/edit
Authorization: Bearer <token>
```

**응답**
- ✅ **200 OK**: 편집용 게시물 정보 반환
- ❌ **401 Unauthorized**: 인증 필요
- ❌ **404 Not Found**: 게시물을 찾을 수 없음
- ❌ **500 Internal Server Error**: 서버 오류


---


## 🖼️ 이미지 업로드 API

### 이미지 파일 업로드
이미지 파일을 업로드하고 URL을 반환합니다.

```http
POST /api/imageUpload
Content-Type: multipart/form-data
```

**요청**
- 이미지 파일 데이터 (FormData)

**응답**
```json
{
  "url": "string",
  "filename": "string",
  "size": "number"
}
```

- ✅ **200 OK**: 업로드된 이미지 정보 반환
- ❌ **400 Bad Request**: 유효하지 않은 파일
- ❌ **500 Internal Server Error**: 이미지 업로드 중 오류가 발생했습니다


---


## 🤖 AI 채팅 API

### AI와 채팅
AI 채팅 서비스를 통해 AI와 대화합니다. (인증 선택사항)

```http
POST /api/ai/chat
```

**요청**
```json
{
  "message": "string",
  "model": "gpt-4o-mini",      // 선택사항
  "max_tokens": 1000,          // 선택사항
  "temperature": 0.7           // 선택사항
}
```

**요청 파라미터**
| 파라미터 | 타입 | 설명 | 기본값 |
|----------|------|------|--------|
| `message` | string | 사용자 메시지 | 필수 |
| `model` | string | AI 모델명 | gpt-4o-mini |
| `max_tokens` | number | 최대 토큰 수 | 1000 |
| `temperature` | number | 창의성 수준 (0-1) | 0.7 |

**응답**
```json
{
  "id": "string",
  "message": "string",
  "model": "string",
  "tokens_used": "number",
  "timestamp": "string"
}
```

- ✅ **200 OK**: AI 응답 반환
- ❌ **400 Bad Request**: 메시지 내용이 필요합니다
- ❌ **500 Internal Server Error**: 서버 오류가 발생했습니다


---


## 환경 설정

### 필수 환경 변수

```env
# 백엔드 서비스 URL
AUTH_API_URL=http://localhost:8080
POST_API_URL=http://localhost:3001/api/v1
IMAGE_API_URL=http://localhost:3002/api
AI_API_URL=http://localhost:3003/api

# API 키
AI_ROUTE_API_KEY=your_openai_api_key
IMAGE_ROUTE_API_KEY=your_image_service_key
```

### 개발 환경
- **인증 서버**: http://localhost:8080
- **포스트 서버**: http://localhost:3001/api/v1
- **이미지 서버**: http://localhost:3002/api
- **AI 서버**: http://localhost:3003/api


---


## 오류 처리

### 표준 오류 응답 형식
```json
{
  "error": "오류 메시지",
  "code": "ERROR_CODE"
}
```

### 일반적인 HTTP 상태 코드
| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 필요 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 내부 오류 |

### 인증 오류
인증이 필요한 API에 토큰 없이 접근하거나 유효하지 않은 토큰으로 접근할 경우:

```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```