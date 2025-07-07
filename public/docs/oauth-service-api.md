# OAuth 서비스 API 문서

![OAuth Diagram](/docs/Oauth_diagram.png)

## 개요

이 문서는 OAuth 중간 서버의 API 엔드포인트에 대한 상세한 설명을 제공합니다. 이 OAuth 서버는 프론트엔드와 백엔드 사이에서 OAuth 인증을 중개하는 역할을 합니다.

## 목차

- [개요](#개요)
- [기본 정보](#기본-정보)
- [환경 변수](#환경-변수)
- [API 엔드포인트](#api-엔드포인트)
- [인증 플로우](#인증-플로우)
- [에러 처리](#에러-처리)
- [보안 고려사항](#보안-고려사항)
- [개발 가이드](#개발-가이드)

## 기본 정보

### 지원 제공자
- **Google**: OAuth 2.0 인증
- **Kakao**: OAuth 2.0 인증

### 인증 플로우
Authorization Code Grant 방식을 사용합니다.

### 보안 기능
- State 파라미터를 통한 CSRF 방지
- OAuth 토큰 즉시 폐기
- 최소한의 정보만 백엔드로 전달

### 서버 URL

- **개발환경**: `http://localhost:3004`
- **프로덕션**: `https://your-oauth-server.vercel.app`

## 환경 변수

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | `GOCSPX-abcdefghijklmnop` |
| `KAKAO_CLIENT_ID` | Kakao OAuth 클라이언트 ID | `abcdef1234567890` |
| `KAKAO_CLIENT_SECRET` | Kakao OAuth 클라이언트 시크릿 | `abcdefghijklmnopqrstuvwx` |
| `BACKEND_SERVER_URL` | OAuth 로그인 요청을 처리할 백엔드 서버 URL | `http://localhost:8080` |
| `FRONTEND_URL` | 프론트엔드 URL | `http://localhost:3001` |
| `NEXT_PUBLIC_URL` | 현재 OAuth 서버 URL | `http://localhost:3004` |
| `OAUTH_REDIRECT_URI` | OAuth 콜백 URI | `http://localhost:3004/api/auth/{provider}/callback` |

## API 엔드포인트

### 1. Google OAuth 로그인 시작

**엔드포인트**: `GET /api/auth/google/login`

Google OAuth 인증을 시작합니다. 사용자를 Google 로그인 페이지로 리다이렉트합니다.

#### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `frontend_url` | string | 선택 | 인증 완료 후 리다이렉트할 프론트엔드 URL |

#### 요청 예시

```bash
GET /api/auth/google/login?frontend_url=http://localhost:3001
```

#### 응답

**성공 시**: Google 로그인 페이지로 리다이렉트 (302)

```
Location: https://accounts.google.com/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&scope=openid%20email%20profile&state=...
```

**실패 시**: JSON 응답 (500)

```json
{
  "error": "Google OAuth configuration is incomplete",
  "details": "Missing GOOGLE_CLIENT_ID environment variable"
}
```

### 2. Kakao OAuth 로그인 시작

**엔드포인트**: `GET /api/auth/kakao/login`

Kakao OAuth 인증을 시작합니다. 사용자를 Kakao 로그인 페이지로 리다이렉트합니다.

#### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `frontend_url` | string | 선택 | 인증 완료 후 리다이렉트할 프론트엔드 URL |

#### 요청 예시

```bash
GET /api/auth/kakao/login?frontend_url=http://localhost:3001
```

#### 응답

**성공 시**: Kakao 로그인 페이지로 리다이렉트 (302)

```
Location: https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&scope=profile_nickname%20profile_image%20account_email&state=...
```

**실패 시**: JSON 응답 (500)

```json
{
  "error": "Kakao OAuth configuration is incomplete",
  "details": "Missing KAKAO_CLIENT_ID environment variable"
}
```

### 3. Google OAuth 콜백

**엔드포인트**: `GET /api/auth/google/callback`

Google에서 리다이렉트된 인증 코드를 처리합니다.

#### 요청 파라미터 (Google에서 자동 전달)

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `code` | string | 필수 | Google OAuth 인증 코드 |
| `state` | string | 필수 | CSRF 방지용 상태 파라미터 |
| `error` | string | 선택 | OAuth 에러 코드 |
| `error_description` | string | 선택 | OAuth 에러 설명 |

#### 처리 과정

1. **인증 코드 검증**: `code`와 `state` 파라미터 확인
2. **토큰 교환**: 인증 코드를 액세스 토큰으로 교환
3. **사용자 정보 조회**: 액세스 토큰으로 Google 사용자 정보 획득
4. **OAuth 토큰 폐기**: 보안을 위해 OAuth 토큰 즉시 폐기
5. **백엔드 로그인 요청**: OAuth 제공자, 사용자 ID만 백엔드 서버에 전송
6. **임시 코드 발급**: 백엔드에서 사용자 식별, 임시 코드 발급 (5분 만료, 일회용)
7. **중간 서버 리다이렉트**: 중간 서버에서 직접 프론트엔드 `/auth/callback` 경로로 리다이렉트

#### 응답

**성공 시**: 프론트엔드로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/callback?code=oauth_temp_abc123def456...
```

**실패 시**: 에러 페이지로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/error?error=invalid_state
```

### 4. Kakao OAuth 콜백

**엔드포인트**: `GET /api/auth/kakao/callback`

Kakao에서 리다이렉트된 인증 코드를 처리합니다.

#### 요청 파라미터 (Kakao에서 자동 전달)

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `code` | string | 필수 | Kakao OAuth 인증 코드 |
| `state` | string | 필수 | CSRF 방지용 상태 파라미터 |
| `error` | string | 선택 | OAuth 에러 코드 |
| `error_description` | string | 선택 | OAuth 에러 설명 |

#### 처리 과정

1. **인증 코드 검증**: `code`와 `state` 파라미터 확인
2. **토큰 교환**: 인증 코드를 액세스 토큰으로 교환
3. **사용자 정보 조회**: 액세스 토큰으로 Kakao 사용자 정보 획득
4. **OAuth 토큰 폐기**: 보안을 위해 OAuth 토큰 즉시 폐기
5. **백엔드 로그인 요청**: OAuth 제공자, 사용자 ID만 백엔드 서버에 전송
6. **임시 코드 발급**: 백엔드에서 사용자 식별, 임시 코드 발급 (5분 만료, 일회용)
7. **중간 서버 리다이렉트**: 중간 서버에서 직접 프론트엔드 `/auth/callback` 경로로 리다이렉트

#### 응답

**성공 시**: 프론트엔드로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/callback?code=oauth_temp_abc123def456...
```

**실패 시**: 에러 페이지로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/error?error=invalid_state
```

### 5. 토큰 검증

**엔드포인트**: `POST /api/auth/verify`

JWT 토큰의 유효성을 검증합니다.

#### 요청 헤더

```http
Authorization: Bearer <jwt_token>
```

#### 요청 본문

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 응답

**성공 시** (200):

```json
{
  "valid": true,
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "name": "사용자명"
  },
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**실패 시** (401):

```json
{
  "valid": false,
  "error": "Invalid token"
}
```

### 6. 토큰 갱신

**엔드포인트**: `POST /api/auth/refresh`

Refresh Token을 사용하여 새로운 Access Token을 발급합니다.

#### 요청 본문

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 응답

**성공 시** (200):

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

**실패 시** (401):

```json
{
  "success": false,
  "error": "Invalid refresh token"
}
```

## 인증 플로우

### 전체 인증 플로우

```
1. 사용자가 OAuth 로그인 버튼 클릭
2. 프론트엔드가 OAuth 중간 서버로 리다이렉트
3. 중간 서버가 OAuth 제공자로 리다이렉트
4. 사용자가 OAuth 제공자에서 인증
5. OAuth 제공자가 중간 서버로 리다이렉트 (인증 코드 포함)
6. 중간 서버가 인증 코드를 액세스 토큰으로 교환
7. 중간 서버가 사용자 정보를 조회
8. 중간 서버가 OAuth 토큰을 폐기
9. 중간 서버가 백엔드에 OAuth 제공자와 사용자 ID 전송
10. 백엔드가 임시 코드 발급 (5분 만료)
11. 중간 서버가 프론트엔드로 리다이렉트 (임시 코드 포함)
12. 프론트엔드가 임시 코드를 JWT 토큰으로 교환
13. 로그인 완료
```

### 보안 특징

- **OAuth 토큰 즉시 폐기**: 중간 서버에서 사용자 정보 조회 후 토큰 즉시 삭제
- **최소 정보 전달**: 백엔드에는 OAuth 토큰이 전달되지 않음
- **임시 코드 사용**: 5분 만료, 일회용 임시 코드로 보안 강화
- **State 파라미터**: CSRF 공격 방지

## 에러 처리

### 공통 에러 코드

| 에러 코드 | 설명 | HTTP 상태 |
|-----------|------|-----------|
| `invalid_request` | 잘못된 요청 | 400 |
| `invalid_client` | 잘못된 클라이언트 | 401 |
| `invalid_grant` | 잘못된 인증 코드 | 400 |
| `unauthorized_client` | 권한이 없는 클라이언트 | 401 |
| `unsupported_grant_type` | 지원하지 않는 인증 타입 | 400 |
| `invalid_scope` | 잘못된 권한 범위 | 400 |
| `access_denied` | 사용자가 인증 거부 | 400 |
| `server_error` | 서버 오류 | 500 |
| `temporarily_unavailable` | 일시적으로 사용 불가 | 503 |

### 에러 응답 형식

```json
{
  "error": "invalid_request",
  "error_description": "Missing required parameter: code",
  "error_uri": "https://tools.ietf.org/html/rfc6749#section-4.1.2.1"
}
```

## 보안 고려사항

### 1. OAuth 토큰 관리

- OAuth 액세스 토큰은 사용자 정보 조회 후 즉시 폐기
- 백엔드에는 OAuth 토큰이 전달되지 않음
- 임시 코드는 5분 만료, 일회용으로 보안 강화

### 2. State 파라미터 검증

- 모든 OAuth 요청에 대해 state 파라미터 검증
- CSRF 공격 방지를 위한 무작위 state 생성
- 세션 또는 쿠키에 state 저장하여 검증

### 3. 환경 변수 보안

- 클라이언트 시크릿은 서버 환경에만 저장
- 프로덕션 환경에서는 HTTPS 필수
- 환경 변수 파일은 버전 관리에서 제외

### 4. 리다이렉트 URI 검증

- OAuth 제공자에 등록된 리다이렉트 URI만 허용
- 동적 리다이렉트 URI 사용 금지
- 화이트리스트 기반 URI 검증

## 개발 가이드

### 로컬 개발 환경 설정

1. **환경 변수 설정**
   - `.env.local` 파일에 필요한 환경 변수 설정
   - OAuth 제공자에서 발급받은 클라이언트 ID/시크릿 입력

2. **OAuth 애플리케이션 등록**
   - Google: [Google Cloud Console](https://console.cloud.google.com/)
   - Kakao: [Kakao Developers](https://developers.kakao.com/)

3. **리다이렉트 URI 설정**
   - Google: `http://localhost:3004/api/auth/google/callback`
   - Kakao: `http://localhost:3004/api/auth/kakao/callback`

### 새로운 OAuth 제공자 추가

1. **환경 변수 추가**
   ```env
   PROVIDER_CLIENT_ID=your_client_id
   PROVIDER_CLIENT_SECRET=your_client_secret
   ```

2. **API 엔드포인트 추가**
   - `/api/auth/provider/login`
   - `/api/auth/provider/callback`

3. **사용자 정보 매핑**
   - 제공자별 사용자 정보 구조에 맞게 매핑
   - 공통 사용자 정보 형식으로 변환

### 테스트 방법

1. **로컬 서버 실행**
   ```bash
   npm run dev
   ```

2. **OAuth 로그인 테스트**
   ```bash
   curl -X GET "http://localhost:3004/api/auth/google/login?frontend_url=http://localhost:3001"
   ```

3. **토큰 검증 테스트**
   ```bash
   curl -X POST "http://localhost:3004/api/auth/verify" \
     -H "Content-Type: application/json" \
     -d '{"token":"your_jwt_token"}'
   ```

### 디버깅 팁

- 브라우저 개발자 도구의 네트워크 탭에서 요청/응답 확인
- 서버 로그에서 OAuth 제공자와의 통신 상태 확인
- 환경 변수 설정 여부 확인
- OAuth 제공자 콘솔에서 애플리케이션 설정 확인