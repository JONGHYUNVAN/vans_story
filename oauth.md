# OAuth 구현 문서

## 개요

이 프로젝트는 OAuth 2.0 기반의 소셜 로그인 기능을 구현하고 있습니다. Kakao와 Google OAuth 제공자를 지원하며, 중간 서버를 통한 안전한 인증 플로우를 사용합니다.

## 지원 OAuth 제공자

- **Kakao**: 카카오 로그인
- **Google**: 구글 로그인

## 아키텍처

```
[프론트엔드] → [OAuth 중간 서버] → [백엔드 서버] → [OAuth 제공자]
```

### 인증 플로우

1. **로그인 시작**: 사용자가 OAuth 버튼 클릭
2. **중간 서버 리다이렉트**: OAuth 중간 서버로 이동
3. **OAuth 제공자 인증**: 사용자가 OAuth 제공자에서 인증
4. **임시 코드 발급**: 중간 서버가 임시 코드를 프론트엔드로 반환
5. **토큰 교환**: 프론트엔드가 임시 코드를 백엔드로 전송하여 JWT 토큰 획득
6. **로그인 완료**: JWT 토큰을 로컬 스토리지에 저장하고 인증 완료

## 파일 구조

### 핵심 파일들

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts           # OAuth 콜백 API
│   └── oauth/
│       └── callback/
│           └── page.tsx               # OAuth 콜백 페이지
├── components/
│   ├── features/
│   │   └── auth/
│   │       └── authService.ts         # 인증 서비스
│   └── ui/
│       └── auth/
│           ├── LoginModal.tsx         # 로그인 모달
│           └── OAuthAccountManager.tsx # OAuth 계정 관리
├── utils/
│   └── oauth.ts                       # OAuth 유틸리티
├── interfaces/
│   └── auth/
│       └── types.ts                   # 인증 타입 정의
├── store/
│   └── auth/
│       └── slice.ts                   # 인증 상태 관리
├── constants/
│   └── apiUrl.ts                      # API URL 상수
└── messages/
    ├── ko/
    │   └── auth.json                  # 한국어 메시지
    └── en/
        └── auth.json                  # 영어 메시지
```

## 주요 컴포넌트

### 1. OAuth 유틸리티 (`src/utils/oauth.ts`)

OAuth 관련 유틸리티 함수들을 제공합니다.

#### 주요 함수:
- `generateState()`: OAuth 상태 파라미터 생성
- `validateState()`: OAuth 상태 파라미터 검증
- `extractCallbackData()`: URL 파라미터에서 콜백 데이터 추출 (Query Parameter 방식)
- `extractCallbackDataFromFragment()`: Fragment에서 콜백 데이터 추출 (Fragment 방식)
- `extractCallbackDataUnified()`: Query Parameter + Fragment 방식 통합 처리
- `getProviderDisplayName()`: 제공자 표시명 반환
- `getErrorMessage()`: 에러 메시지 생성
- `buildRedirectUrl()`: 리다이렉트 URL 생성
- `buildFragmentRedirectUrl()`: Fragment 방식 리다이렉트 URL 생성
- `buildOAuthUrl()`: OAuth 중간 서버 URL 생성

### 2. 인증 서비스 (`src/components/features/auth/authService.ts`)

OAuth 로그인 및 계정 관리 기능을 제공합니다.

#### 주요 함수:
- `kakaoLogin()`: 카카오 로그인 시작
- `googleLogin()`: 구글 로그인 시작
- `exchangeCodeForToken()`: 임시 코드를 JWT 토큰으로 교환
- `unlinkOAuthAccount()`: OAuth 계정 연결 해제
- `getLinkedOAuthAccounts()`: 연결된 OAuth 계정 목록 조회

### 3. OAuth 콜백 처리 (`src/app/oauth/callback/page.tsx`)

OAuth 제공자에서 리다이렉트된 사용자를 처리합니다.

#### 처리 과정:
1. URL 파라미터와 Fragment에서 OAuth 콜백 데이터 추출 (`extractCallbackDataUnified` 사용)
2. 에러 체크 및 처리
3. 모드 확인 (로그인/계정연결)
4. 임시 코드를 JWT 토큰으로 교환 (로그인 모드)
5. 토큰 저장 및 로그인 상태 업데이트
6. 환영 메시지 표시 및 메인 페이지로 리다이렉트

### 4. OAuth 콜백 API (`src/app/api/auth/callback/route.ts`)

프론트엔드에서 받은 임시 코드를 백엔드로 전달하여 JWT 토큰을 획득합니다.

#### 처리 과정:
1. 클라이언트에서 임시 코드 수신
2. 백엔드 서버로 임시 코드 전송
3. 백엔드에서 JWT 토큰 수신
4. 토큰을 클라이언트에 반환

### 5. 로그인 모달 (`src/components/ui/auth/LoginModal.tsx`)

OAuth 로그인 UI를 제공합니다.

#### 기능:
- 카카오/구글 로그인 버튼
- 로딩 상태 표시
- 에러 메시지 표시
- 일반 로그인 폼

### 6. OAuth 계정 관리 (`src/components/ui/auth/OAuthAccountManager.tsx`)

연결된 OAuth 계정 관리 기능을 제공합니다.

#### 기능:
- 연결된 계정 목록 표시 (`getLinkedOAuthAccounts()` 사용)
- 새로운 계정 연결 시도 (OAuth 중간 서버로 리다이렉트, 하지만 실제 연결은 미구현)
- 기존 계정 연결 해제 (`unlinkOAuthAccount()` 사용)
- 제공자별 아이콘 표시

#### 실제 동작:
- **계정 연결**: `handleLinkAccount()` 함수는 OAuth 중간 서버로 리다이렉트만 합니다.
- **계정 해제**: `handleUnlinkAccount()` 함수는 실제로 `authService.unlinkOAuthAccount()`를 호출합니다.
- **계정 연결 완료**: OAuth 콜백 페이지에서 계정 연결 모드는 "아직 미구현"으로 처리됩니다.

## 타입 정의

### OAuth 제공자 타입
```typescript
export type OAuthProvider = 'kakao' | 'google';
```

### OAuth 콜백 데이터
```typescript
export interface OAuthCallbackData {
  token?: string;           // 기존 방식 (JWT 토큰)
  code?: string;            // 새로운 방식 (임시 코드)
  error?: string;
  provider?: OAuthProvider;
  state?: string;
}
```

### 연결된 OAuth 계정
```typescript
export interface LinkedOAuthAccount {
  provider: OAuthProvider;
  providerEmail?: string;
  createdAt: string;
}
```

## 상태 관리

Redux Toolkit을 사용하여 OAuth 상태를 관리합니다.

### 상태 구조
```typescript
interface AuthState {
  // OAuth 관련 상태
  oauthLoading: boolean;
  oauthProvider: OAuthProvider | null;
  oauthError: string | null;
}
```

### 액션들
- `oauthStart`: OAuth 로그인 시작
- `oauthSuccess`: OAuth 로그인 성공
- `oauthFailure`: OAuth 로그인 실패
- `oauthFinish`: OAuth 로그인 완료

## 환경 변수

```env
NEXT_PUBLIC_OAUTH_SERVER_URL=https://oauth-server.example.com
AUTH_API_URL=http://localhost:8080
```

## API 엔드포인트

### 프론트엔드 API
- `POST /api/auth/callback`: OAuth 콜백 처리 (임시 코드 → JWT 토큰)

### 백엔드 API
- `POST /oauth/exchange`: 임시 코드를 JWT 토큰으로 교환 (프론트엔드 API를 통해 간접 호출)
- `DELETE /api/v1/oauth/unlink`: OAuth 계정 연결 해제
- `GET /api/v1/oauth/linked`: 연결된 OAuth 계정 목록 조회

### OAuth 중간 서버 API
- `GET /api/auth/kakao/login`: 카카오 로그인 시작
- `GET /api/auth/google/login`: 구글 로그인 시작

## 다국어 지원

한국어와 영어 메시지를 지원합니다.

### 메시지 파일
- `src/messages/ko/auth.json`: 한국어 메시지
- `src/messages/en/auth.json`: 영어 메시지

## 보안 고려사항

1. **상태 파라미터 검증**: CSRF 공격 방지를 위한 상태 파라미터 사용
2. **임시 코드 방식**: 직접 토큰 노출 방지를 위한 임시 코드 교환 방식
3. **토큰 만료 시간**: 1시간 제한으로 보안 강화
4. **쿠키 보안**: HttpOnly 쿠키를 통한 리프레시 토큰 관리

## 에러 처리

### 일반적인 에러 코드
- `access_denied`: 사용자가 로그인 취소
- `invalid_request`: 잘못된 요청
- `invalid_client`: 클라이언트 설정 오류
- `invalid_grant`: 인증 코드 무효
- `expired_token`: 토큰 만료
- `server_error`: 서버 오류
- `temporarily_unavailable`: 서비스 일시 중단

### 에러 메시지 처리
OAuth 유틸리티의 `getErrorMessage()` 함수를 통해 사용자 친화적인 에러 메시지를 제공합니다.

## 개발 가이드

### 현재 구현 상태

#### 구현 완료된 기능:
- OAuth 로그인 (Kakao, Google)
- JWT 토큰 교환
- 상태 관리 (Redux)
- 에러 처리
- 다국어 지원
- 토큰 저장 및 인증 상태 관리

#### 미구현 기능:
- OAuth 계정 연결 기능 완료 (UI와 리다이렉트는 구현되었지만, 콜백 처리에서 실제 연결 로직은 미구현)

#### 구현 완료된 기능:
- OAuth 계정 연결 해제 (UI와 API 호출 완전 구현됨)
- OAuth 계정 목록 조회 (UI와 API 호출 완전 구현됨)
- 다중 OAuth 계정 관리 UI (실제 연결 완료는 미구현)

### 새로운 OAuth 제공자 추가

1. **타입 정의 수정**
   ```typescript
   export type OAuthProvider = 'kakao' | 'google' | 'naver';
   ```

2. **OAuth 유틸리티 함수 수정**
   - `getProviderDisplayName()`: 새 제공자 표시명 추가
   - `buildOAuthUrl()`: 새 제공자 엔드포인트 추가

3. **UI 컴포넌트 수정**
   - 로그인 모달에 새 제공자 버튼 추가
   - 아이콘 이미지 추가

4. **API 서비스 수정**
   - `authService`에 새 제공자 로그인 함수 추가

### 개발 시 주의사항

#### 실제 구현된 플로우:
1. **로그인**: `kakaoLogin()` / `googleLogin()` → OAuth 중간 서버 → 콜백 페이지 → `exchangeCodeForToken()` → 완료
2. **계정 연결**: `handleLinkAccount()` → OAuth 중간 서버 → 콜백 페이지 → "미구현" 메시지
3. **계정 해제**: `handleUnlinkAccount()` → `unlinkOAuthAccount()` → 완료
4. **계정 조회**: `fetchLinkedAccounts()` → `getLinkedOAuthAccounts()` → 완료

### 로컬 개발 환경 설정

1. **환경 변수 설정**
   ```env
   NEXT_PUBLIC_OAUTH_SERVER_URL=http://localhost:3001
   AUTH_API_URL=http://localhost:8080
   ```

2. **OAuth 중간 서버 실행**
   OAuth 중간 서버를 별도로 실행해야 합니다.

3. **백엔드 서버 실행**
   JWT 토큰 교환을 위한 백엔드 서버를 실행해야 합니다.

## 트러블슈팅

### 자주 발생하는 문제들

1. **CORS 에러**
   - OAuth 서버에서 프론트엔드 도메인 허용 확인
   - 백엔드 서버에서 CORS 설정 확인

2. **토큰 교환 실패**
   - 임시 코드 유효성 확인
   - 백엔드 서버 연결 상태 확인

3. **상태 파라미터 검증 실패**
   - 시간 동기화 확인
   - 상태 파라미터 생성 로직 확인

4. **리다이렉트 URL 불일치**
   - OAuth 제공자 설정에서 리다이렉트 URL 확인
   - 환경 변수 설정 확인

## 참고 자료

- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [Kakao Developers OAuth](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication](https://nextjs.org/docs/authentication) 