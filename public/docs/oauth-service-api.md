# OAuth API 문서

이 문서는 OAuth 중간 서버의 API 엔드포인트에 대한 상세한 설명을 제공합니다.

## 개요

이 OAuth 서버는 프론트엔드와 백엔드 사이에서 OAuth 인증을 중개하는 역할을 합니다.
- **지원 제공자**: Google, Kakao
- **인증 플로우**: Authorization Code Grant
- **보안**: State 파라미터를 통한 CSRF 방지

## 기본 URL

- **개발환경**: `http://localhost:3004`
- **프로덕션**: `https://your-oauth-server.vercel.app`

## 환경변수

### 필수 환경변수

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

**성공시**: Google 로그인 페이지로 리다이렉트 (302)

```
Location: https://accounts.google.com/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&scope=openid%20email%20profile&state=...
```

**실패시**: JSON 응답 (500)

```json
{
  "error": "Google OAuth configuration is incomplete",
  "details": "Missing GOOGLE_CLIENT_ID environment variable"
}
```

---

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

**성공시**: Kakao 로그인 페이지로 리다이렉트 (302)

```
Location: https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&scope=profile_nickname%20profile_image%20account_email&state=...
```

**실패시**: JSON 응답 (500)

```json
{
  "error": "Kakao OAuth configuration is incomplete",
  "details": "Missing KAKAO_CLIENT_ID environment variable"
}
```

---

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

**성공시**: 프론트엔드로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/callback?code=oauth_temp_abc123def456...
```

**실패시**: 에러 페이지로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/error?error=invalid_state
```

---

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

**성공시**: 프론트엔드로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/callback?code=oauth_temp_abc123def456...
```

**실패시**: 에러 페이지로 리다이렉트 (302)

```
Location: http://localhost:3000/auth/error?error=invalid_state
```

---

### 5. 토큰 검증

**엔드포인트**: `POST /api/auth/verify`

JWT 토큰의 유효성을 검증합니다.

#### 요청 헤더

```
Content-Type: application/json
```

#### 요청 본문

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 응답

**성공시** (200):

```json
{
  "valid": true,
  "payload": {
    "userId": "123456789",
    "email": "user@example.com",
    "name": "홍길동",
    "provider": "google",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

**실패시** (401):

```json
{
  "valid": false,
  "error": "Invalid token"
}
```

---

### 6. 토큰 갱신

**엔드포인트**: `POST /api/auth/refresh`

리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.

#### 요청 헤더

```
Content-Type: application/json
```

#### 요청 본문

```json
{
  "refreshToken": "1//0GeSYNAKqhBHyCgYIARAAGA...",
  "provider": "google"
}
```

#### 응답

**성공시** (200):

```json
{
  "accessToken": "ya29.a0ARrdaM-new-access-token...",
  "refreshToken": "1//0GeSYNAKqhBHyCgYIARAAGA...",
  "expiresIn": 3600
}
```

**실패시** (401):

```json
{
  "error": "Invalid refresh token"
}
```

## 에러 코드

### 일반적인 에러

| 에러 코드 | 설명 |
|-----------|------|
| `missing_parameters` | 필수 파라미터 누락 |
| `invalid_state` | 잘못되거나 만료된 state 파라미터 |
| `server_configuration` | 서버 설정 오류 (환경변수 누락) |
| `callback_processing` | 콜백 처리 중 오류 |

### OAuth 제공자별 에러

| 에러 코드 | 설명 |
|-----------|------|
| `google_oauth_access_denied` | Google OAuth 접근 거부 |
| `kakao_oauth_access_denied` | Kakao OAuth 접근 거부 |

## 백엔드 서버 연동

### 백엔드로 전송되는 데이터

OAuth 인증 완료 후 백엔드 서버의 `/api/v1/oauth/login` 엔드포인트로 다음 데이터가 전송됩니다:

```json
{
  "provider": "google",
  "providerId": "123456789"
}
```

### 백엔드에서 반환해야 하는 응답 형식

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "code": "oauth_temp_abc123def456789..."
  },
  "message": "임시 코드가 발급되었습니다."
}
```

> **중요**: 백엔드에서 임시 코드를 발급하면, 중간 서버에서 이 코드를 사용하여 프론트엔드로의 리다이렉트 URL을 생성합니다. 임시 코드는 5분 후 자동 만료되며, 일회용입니다. 프론트엔드에서 이 임시 코드로 `/api/v1/oauth/exchange` 엔드포인트를 호출하여 실제 JWT 토큰을 획득합니다.

## CORS 설정

모든 엔드포인트는 CORS를 지원하며, `OPTIONS` 메서드를 통한 preflight 요청을 처리합니다.

## 보안 고려사항

### State 파라미터

- **생성**: Base64로 인코딩된 JSON 객체
- **내용**: `{ provider, frontendUrl, timestamp }`
- **만료시간**: 1시간
- **용도**: CSRF 공격 방지

### 환경변수 보안

- 모든 민감한 정보는 환경변수로 관리
- 클라이언트 시크릿은 서버에서만 사용
- 프로덕션 환경에서는 HTTPS 필수

## 디버깅

### 환경변수 확인 로그

각 API 호출 시 콘솔에 환경변수 로딩 상태가 출력됩니다:

```
🔍 [Google Login] 환경변수 로딩 상태:
  - FRONTEND_URL: ✅ 설정됨 (값: http://localhost:3001)
  - NEXT_PUBLIC_URL: ✅ 설정됨 (값: http://localhost:3004)
  - GOOGLE_CLIENT_ID: ✅ 설정됨 (길이: 82자)
  - 생성된 redirectUri: http://localhost:3004/api/auth/google/callback
  - 전달받은 frontendUrl: http://localhost:3001
```

### 일반적인 문제 해결

1. **환경변수 누락**: 콘솔 로그에서 ❌ 표시 확인
2. **리다이렉트 URI 불일치**: OAuth 제공자 설정과 `NEXT_PUBLIC_URL` 확인
3. **CORS 에러**: 프론트엔드 도메인이 CORS 설정에 포함되어 있는지 확인
4. **State 파라미터 에러**: 시간 동기화 및 만료시간 확인

## 예시 사용법

### 프론트엔드에서 OAuth 시작

```javascript
// Google 로그인
window.location.href = 'http://localhost:3004/api/auth/google/login?frontend_url=' + 
  encodeURIComponent(window.location.origin);

// Kakao 로그인
window.location.href = 'http://localhost:3004/api/auth/kakao/login?frontend_url=' + 
  encodeURIComponent(window.location.origin);
```

### 임시 코드 수신 및 토큰 교환

```javascript
// URL에서 임시 코드 추출
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  // 임시 코드로 실제 JWT 토큰 교환
  exchangeCodeForToken(code);
  
  // URL에서 코드 파라미터 제거
  window.history.replaceState({}, document.title, window.location.pathname);
}

// 토큰 교환 함수
async function exchangeCodeForToken(code) {
  try {
    const response = await fetch('http://localhost:8080/api/v1/oauth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code }),
      credentials: 'include' // 쿠키 포함
    });

    if (response.ok) {
      // Authorization 헤더에서 JWT 토큰 추출
      const authHeader = response.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        localStorage.setItem('authToken', token);
        console.log('로그인 성공!');
        
        // 메인 페이지로 이동
        window.location.href = '/dashboard';
      }
    } else {
      console.error('토큰 교환 실패:', await response.text());
    }
  } catch (error) {
    console.error('토큰 교환 오류:', error);
  }
}
```

## 🔒 보안 강화된 OAuth 플로우

### ✅ 개선된 보안 효과

1. **JWT 토큰 직접 노출 방지**
  - 기존: `?token=eyJhbGciOiJIUzI1NiIs...` (위험)
  - 개선: `?code=oauth_temp_abc123...` (안전)

2. **OAuth 토큰 즉시 폐기**
  - OAuth 제공자 토큰은 사용자 정보 조회 후 즉시 폐기
  - 백엔드로 OAuth 토큰이 전달되지 않음
  - 중간 서버에서 토큰 저장/전달 위험 제거

3. **자동 만료 시스템**
  - 임시 코드는 5분 후 자동 만료
  - 일회용 코드로 재사용 불가

4. **서버 로그 보안**
  - 브라우저/서버 로그에 JWT 토큰 기록 방지
  - Referer 헤더를 통한 토큰 유출 차단

5. **XSS 공격 방지**
  - 임시 코드는 단기간만 유효
  - 실제 JWT는 안전한 교환 과정을 거쳐 획득

### 토큰 검증

```javascript
async function verifyToken(token) {
  const response = await fetch('http://localhost:8080/api/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```