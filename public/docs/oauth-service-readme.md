# OAuth 중간 서버

![OAuth Diagram](/docs/Oauth_diagram.png)

## 개요

Next.js 15.3.3 기반의 OAuth 인증 중간 서버입니다. 프론트엔드와 백엔드 사이에서 OAuth 인증 플로우를 처리하며, 보안성과 확장성을 고려하여 설계되었습니다.

## 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [API 엔드포인트](#api-엔드포인트)
- [설치 및 설정](#설치-및-설정)
- [프로젝트 구조](#프로젝트-구조)
- [보안 기능](#보안-기능)
- [OAuth 제공자 설정](#oauth-제공자-설정)
- [인증 플로우](#인증-플로우)
- [테스트](#테스트)
- [성능 최적화](#성능-최적화)
- [배포](#배포)
- [트러블슈팅](#트러블슈팅)

## 주요 기능

- **OAuth 2.0 지원**: Google, Kakao OAuth 제공자 지원
- **보안 강화**: CSRF 방지를 위한 state 파라미터 검증
- **OAuth 토큰 보안**: OAuth 토큰 즉시 폐기로 토큰 유출 위험 제거
- **최소 정보 전달**: 사용자 ID만 백엔드로 전달하여 보안 최대화
- **에러 처리**: 포괄적인 에러 핸들링 및 로깅
- **CORS 지원**: 프론트엔드와의 원활한 통신
- **타입스크립트**: 완전한 타입 안전성
- **상세한 문서화**: JSDoc을 활용한 코드 문서화

## 기술 스택

- **Framework**: Next.js 15.3.3
- **Runtime**: React 19.0.0
- **Language**: TypeScript 5.6.0
- **HTTP Client**: Axios 1.7.0
- **JWT Handling**: JOSE 5.9.6

## API 엔드포인트

### 1. Google OAuth 로그인
```http
GET /api/auth/google/login?frontend_url={url}
```

**매개변수:**
- `frontend_url`: 인증 완료 후 리다이렉트할 프론트엔드 URL (선택사항)

**응답 예시:**
```json
{
  "authUrl": "https://accounts.google.com/oauth/authorize?...",
  "message": "Google OAuth URL generated successfully"
}
```

### 2. Kakao OAuth 로그인
```http
GET /api/auth/kakao/login?frontend_url={url}
```

**매개변수:**
- `frontend_url`: 인증 완료 후 리다이렉트할 프론트엔드 URL (선택사항)

**응답 예시:**
```json
{
  "authUrl": "https://kauth.kakao.com/oauth/authorize?...",
  "message": "Kakao OAuth URL generated successfully"
}
```

### 3. Google OAuth 콜백
```http
GET /api/auth/google/callback?code={code}&state={state}
```

Google OAuth 제공자로부터의 콜백을 처리합니다. 자동으로 프론트엔드로 리다이렉트됩니다.

### 4. Kakao OAuth 콜백
```http
GET /api/auth/kakao/callback?code={code}&state={state}
```

Kakao OAuth 제공자로부터의 콜백을 처리합니다. 자동으로 프론트엔드로 리다이렉트됩니다.

**OAuth 콜백 처리 과정:**
1. 인증 코드를 액세스 토큰으로 교환
2. OAuth 토큰으로 사용자 정보 조회
3. **OAuth 토큰 즉시 폐기** (보안 강화)
4. 백엔드 서버에 OAuth 제공자, 사용자 ID만 전달
5. 백엔드에서 사용자 식별 및 임시 코드 발급 (5분 만료, 일회용)
6. **중간 서버에서 직접 프론트엔드 `/auth/callback` 경로로 리다이렉트**
7. 프론트엔드에서 임시 코드로 실제 JWT 토큰 획득

### 5. 토큰 검증
```http
POST /api/auth/verify
```

**요청 본문:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답 예시 (성공):**
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

### 6. 토큰 갱신
```http
POST /api/auth/refresh
```

**요청 본문:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답 예시:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

## 설치 및 설정

### 1. 의존성 설치
```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성 후 다음 변수들을 설정하세요:

```env
# 필수 환경변수

# Google OAuth 설정 (Google Cloud Console에서 발급)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao OAuth 설정 (Kakao Developers에서 발급)
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# OAuth 공통 설정 (각 제공자별로 다른 콜백 URL)
# Google: http://localhost:3004/api/auth/google/callback
# Kakao: http://localhost:3004/api/auth/kakao/callback

# 서버 URL 설정
BACKEND_SERVER_URL=http://localhost:8000                   # 백엔드 API 서버 주소
FRONTEND_URL=http://localhost:3001                         # 프론트엔드 앱 주소

# 선택적 환경변수

# CORS 설정 (기본값: FRONTEND_URL 사용)
CORS_ORIGIN=http://localhost:3001                          # CORS 허용 도메인

# OAuth 제공자 도메인 (쉼표로 구분, 설정하지 않으면 OAuth 제공자 요청 차단)
OAUTH_PROVIDER_DOMAINS=https://accounts.google.com,https://oauth2.googleapis.com,https://www.googleapis.com,https://kauth.kakao.com,https://kapi.kakao.com
```

#### 환경변수 상세 설명

| 변수명 | 필수여부 | 설명 |
|--------|----------|------|
| `GOOGLE_CLIENT_ID` | 필수 | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | 필수 | Google OAuth 클라이언트 시크릿 |
| `KAKAO_CLIENT_ID` | 필수 | Kakao OAuth 클라이언트 ID |
| `KAKAO_CLIENT_SECRET` | 필수 | Kakao OAuth 클라이언트 시크릿 |
| `BACKEND_SERVER_URL` | 필수 | OAuth 로그인 요청을 처리할 백엔드 서버 주소 |
| `FRONTEND_URL` | 필수 | 인증 완료 후 리다이렉트할 프론트엔드 주소 |
| `CORS_ORIGIN` | 선택 | CORS 요청을 허용할 도메인 (기본값: `FRONTEND_URL`) |
| `OAUTH_PROVIDER_DOMAINS` | 선택 | OAuth 제공자 도메인들, 쉼표로 구분 (기본값: 빈 배열) |

#### 개발환경 예시
```env
# 개발환경 설정 예시
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuv
KAKAO_CLIENT_ID=abcdef1234567890abcdef1234567890
KAKAO_CLIENT_SECRET=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
BACKEND_SERVER_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

### 3. 개발 서버 실행
```bash
npm run dev
```

서버는 `http://localhost:3004`에서 실행됩니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── google/
│           │   ├── login/
│           │   └── callback/
│           ├── kakao/
│           │   ├── login/
│           │   └── callback/
│           ├── verify/
│           └── refresh/
├── lib/
│   ├── oauth-config.ts     # OAuth 설정 관리
│   ├── oauth-utils.ts      # OAuth 유틸리티 함수
│   └── types.ts            # 타입 정의
├── config/
│   └── cors.ts             # CORS 설정
└── utils/
    └── logger.ts           # 로깅 유틸리티
```

## 보안 기능

### 1. State 파라미터 검증
CSRF 공격을 방지하기 위해 모든 OAuth 요청에 state 파라미터를 사용하고 검증합니다.

```typescript
// State 생성
const state = generateSecureState({
  provider: 'google',
  timestamp: Date.now(),
  nonce: crypto.randomUUID()
});

// State 검증
const isValid = validateState(receivedState, expectedState);
```

### 2. OAuth 토큰 즉시 폐기
보안을 위해 OAuth 제공자로부터 받은 토큰은 사용자 정보 조회 후 즉시 폐기됩니다.

```typescript
// 사용자 정보 조회 후 토큰 폐기
const userInfo = await fetchUserInfo(accessToken);
await revokeToken(accessToken); // 토큰 즉시 폐기
```

### 3. 최소 정보 전달
백엔드 서버에는 OAuth 토큰이 아닌 최소한의 정보만 전달됩니다.

```typescript
// 백엔드로 전달되는 정보
const payload = {
  provider: 'google',
  providerId: userInfo.id
};
```

### 4. 임시 코드 시스템
5분 만료, 일회용 임시 코드를 사용하여 보안을 강화합니다.

## OAuth 제공자 설정

### Google Cloud Console 설정

1. **프로젝트 생성**: Google Cloud Console에서 새 프로젝트 생성
2. **OAuth 2.0 클라이언트 ID 생성**:
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: `http://localhost:3004/api/auth/google/callback`
3. **클라이언트 ID와 시크릿을 환경 변수에 설정**

### Kakao Developers 설정

1. **애플리케이션 등록**: Kakao Developers에서 애플리케이션 생성
2. **Redirect URI 설정**: `http://localhost:3004/api/auth/kakao/callback`
3. **동의항목 설정**: 필요한 사용자 정보 권한 설정
4. **REST API 키를 환경 변수에 설정**

## 인증 플로우

### 전체 플로우 다이어그램

```
사용자 클릭
    ↓
프론트엔드 → OAuth 중간 서버 → OAuth 제공자
    ↓                                    ↓
프론트엔드 ← OAuth 중간 서버 ← OAuth 제공자
    ↓
프론트엔드 → 백엔드 서버 (임시 코드 → JWT)
    ↓
로그인 완료
```

### 상세 단계

1. **로그인 요청**: 사용자가 OAuth 로그인 버튼 클릭
2. **OAuth 중간 서버로 리다이렉트**: 프론트엔드에서 중간 서버로 이동
3. **OAuth 제공자로 리다이렉트**: 중간 서버에서 OAuth 제공자로 이동
4. **사용자 인증**: 사용자가 OAuth 제공자에서 로그인
5. **인증 코드 전달**: OAuth 제공자가 중간 서버로 인증 코드 전달
6. **토큰 교환**: 중간 서버가 인증 코드를 액세스 토큰으로 교환
7. **사용자 정보 조회**: 액세스 토큰으로 사용자 정보 조회
8. **토큰 폐기**: 보안을 위해 OAuth 토큰 즉시 폐기
9. **백엔드 요청**: 중간 서버가 백엔드에 최소 정보만 전달
10. **임시 코드 발급**: 백엔드에서 임시 코드 생성 (5분 만료)
11. **프론트엔드 리다이렉트**: 임시 코드와 함께 프론트엔드로 리다이렉트
12. **JWT 토큰 교환**: 프론트엔드가 임시 코드를 JWT 토큰으로 교환
13. **로그인 완료**: 사용자 로그인 상태 업데이트

## 테스트

### 단위 테스트
```bash
npm run test
```

### 통합 테스트
```bash
npm run test:integration
```

### E2E 테스트
```bash
npm run test:e2e
```

### 수동 테스트

1. **Google 로그인 테스트**:
   ```bash
   curl -X GET "http://localhost:3004/api/auth/google/login?frontend_url=http://localhost:3001"
   ```

2. **Kakao 로그인 테스트**:
   ```bash
   curl -X GET "http://localhost:3004/api/auth/kakao/login?frontend_url=http://localhost:3001"
   ```

3. **토큰 검증 테스트**:
   ```bash
   curl -X POST "http://localhost:3004/api/auth/verify" \
     -H "Content-Type: application/json" \
     -d '{"token":"your_jwt_token"}'
   ```

## 성능 최적화

### 1. 응답 시간 최적화
- OAuth 제공자와의 통신 시간 단축
- 불필요한 API 호출 최소화
- 캐싱 전략 적용

### 2. 메모리 사용량 최적화
- OAuth 토큰 즉시 폐기로 메모리 사용량 감소
- 임시 데이터 자동 정리

### 3. 네트워크 최적화
- GZIP 압축 적용
- Keep-Alive 연결 사용

## 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Docker 배포
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3004
CMD ["npm", "start"]
```

### 환경 변수 설정
배포 시 환경 변수를 반드시 설정해야 합니다:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `BACKEND_SERVER_URL`
- `FRONTEND_URL`

## 트러블슈팅

### 자주 발생하는 문제

1. **환경 변수 누락**
   - 증상: "Missing environment variable" 에러
   - 해결: `.env.local` 파일에서 누락된 환경 변수 확인 및 설정

2. **CORS 에러**
   - 증상: "Access-Control-Allow-Origin" 에러
   - 해결: `CORS_ORIGIN` 환경 변수 확인 및 프론트엔드 도메인 설정

3. **OAuth 리다이렉트 URI 불일치**
   - 증상: "redirect_uri_mismatch" 에러
   - 해결: OAuth 제공자 콘솔에서 리다이렉트 URI 확인 및 수정

4. **토큰 교환 실패**
   - 증상: "Invalid authorization code" 에러
   - 해결: 인증 코드 만료 여부 확인, 백엔드 서버 연결 상태 확인

### 디버깅 방법

1. **로그 확인**: 서버 콘솔에서 상세한 로그 확인
2. **네트워크 탭**: 브라우저 개발자 도구에서 요청/응답 확인
3. **환경 변수 점검**: 모든 필수 환경 변수 설정 여부 확인
4. **OAuth 콘솔**: 각 제공자의 개발자 콘솔에서 설정 확인

### 로그 수준 설정
```env
LOG_LEVEL=debug  # debug, info, warn, error
```

디버그 모드에서는 더 상세한 로그가 출력됩니다.

## 라이선스

MIT License

---

**개발자**: Vans Dev Blog  
**버전**: 1.0.0  
**마지막 업데이트**: 2025년 6월 25일

