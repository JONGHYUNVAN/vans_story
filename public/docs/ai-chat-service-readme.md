# AI 채팅 서비스

## 개요

Next.js 15와 OpenAI API를 사용한 ChatGPT 챗봇 API 서버입니다. OpenAPI/Swagger 문서화가 포함되어 있으며, 현대적인 웹 기술 스택을 활용하여 안정적이고 확장 가능한 AI 채팅 서비스를 제공합니다.

## 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [API 키 설정](#api-키-설정)
- [API 엔드포인트](#api-엔드포인트)
- [API 문서](#api-문서)
- [ChatGPT API 사용법](#chatgpt-api-사용법)
- [API 파라미터](#api-파라미터)
- [Next.js 15 특징](#nextjs-15-특징)
- [설정](#설정)
- [배포](#배포)
- [보안 고려사항](#보안-고려사항)

## 기술 스택

- **Framework**: Next.js 15
- **Runtime**: React 19
- **Language**: TypeScript
- **AI API**: OpenAI API
- **Documentation**: JSDoc
- **Styling**: Tailwind CSS

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 OpenAI API 키를 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## API 키 설정

### OpenAI API 키 발급

1. [OpenAI 플랫폼](https://platform.openai.com/api-keys)에 접속하여 계정을 생성합니다.
2. API 키를 발급받습니다.
3. 프로젝트 루트에 `.env.local` 파일을 생성합니다.
4. 다음과 같이 API 키를 설정합니다:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## API 엔드포인트

### ChatGPT API
- **POST /api/chat** - ChatGPT와 대화하기

## API 문서

서버를 실행한 후 `http://localhost:3000`에서 API 사용법을 확인할 수 있습니다. 모든 API 엔드포인트는 JSDoc으로 문서화되어 있습니다.

## ChatGPT API 사용법

### 기본 사용
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "안녕하세요! Next.js에 대해 설명해주세요."
  }'
```

### 고급 옵션 사용
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "창의적인 시를 써주세요.",
    "model": "gpt-4",
    "max_tokens": 1500,
    "temperature": 1.2
  }'
```

### 응답 예시
```json
{
  "response": "안녕하세요! Next.js는 React 기반의 풀스택 웹 프레임워크입니다...",
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

## API 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `message` | string | 필수 | - | ChatGPT에게 보낼 메시지 |
| `model` | string | 선택 | gpt-4o-mini | 사용할 OpenAI 모델 |
| `max_tokens` | number | 선택 | 1000 | 응답 최대 토큰 수 |
| `temperature` | number | 선택 | 0.7 | 응답의 창의성 (0-2) |

### 지원하는 모델
- `gpt-4o-mini` (기본값, 빠르고 효율적)
- `gpt-4o` (고성능, 복잡한 작업)
- `gpt-4` (안정적인 성능)
- `gpt-3.5-turbo` (경제적)

### Temperature 설정 가이드
- **0-0.3**: 정확하고 일관된 답변 (FAQ, 번역)
- **0.4-0.7**: 균형잡힌 창의성 (일반 대화)
- **0.8-1.2**: 창의적인 답변 (글쓰기, 브레인스토밍)
- **1.3-2.0**: 매우 창의적 (실험적 용도)

## Next.js 15 특징

이 프로젝트는 Next.js 15의 다음 기능들을 활용합니다:

### 성능 개선
- **향상된 성능**: 최적화된 패키지 임포트
- **빠른 새로고침**: 개발 환경에서 빠른 코드 변경 반영

### React 19 호환성
- **최신 React 기능**: React 19의 새로운 기능 활용
- **서버 컴포넌트**: 향상된 서버 사이드 렌더링

### 개발자 경험
- **타입 안전성**: 향상된 TypeScript 지원
- **자동 최적화**: 빌드 시간 단축 및 번들 크기 최적화

### API 개선
- **CORS 지원**: 자동 CORS 헤더 설정
- **미들웨어 강화**: 향상된 API 미들웨어 시스템

## 설정

### 환경 변수
```env
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# 서버 설정 (선택사항)
PORT=3000
NODE_ENV=production

# API 제한 설정 (선택사항)
MAX_TOKENS_LIMIT=4000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
```

### Next.js 설정
`next.config.ts`에서 CORS 및 기타 설정을 수정할 수 있습니다:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig
```

## 배포

### Vercel 배포
이 프로젝트는 Vercel에 최적화되어 있습니다:

```bash
npm run build
vercel --prod
```

배포 시 환경 변수 `OPENAI_API_KEY`를 설정하는 것을 잊지 마세요!

### 기타 플랫폼 배포
- **Netlify**: 정적 배포 지원
- **Railway**: 컨테이너 기반 배포
- **DigitalOcean**: App Platform 배포
- **AWS**: Lambda 또는 EC2 배포

### Docker 배포
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 보안 고려사항

### API 키 보안
- **클라이언트 사이드 노출 금지**: API 키는 절대 클라이언트 사이드에 노출하지 마세요
- **환경 변수 사용**: `.env.local` 파일을 사용하여 안전하게 관리
- **버전 관리 제외**: `.gitignore`에 환경 변수 파일 추가

### 사용량 제한
프로덕션 환경에서는 다음과 같은 제한을 설정하세요:

```typescript
// API 사용량 제한 예시
const rateLimiter = {
  requests: 100,        // 시간당 요청 수
  tokens: 10000,        // 시간당 토큰 수
  window: 3600          // 시간 창 (초)
}
```

### 인증 미들웨어
필요에 따라 인증 미들웨어를 추가하세요:

```typescript
// 간단한 API 키 인증 예시
export async function middleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey || !isValidApiKey(apiKey)) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  return NextResponse.next()
}
```

### 입력 검증
사용자 입력에 대한 검증을 수행하세요:

```typescript
// 입력 검증 예시
function validateInput(message: string) {
  if (!message || message.length > 4000) {
    throw new Error('Invalid message length')
  }
  
  // 악성 코드 패턴 검사
  const dangerousPatterns = [/<script>/i, /javascript:/i]
  if (dangerousPatterns.some(pattern => pattern.test(message))) {
    throw new Error('Potentially dangerous content detected')
  }
  
  return true
}
```

### 에러 처리
민감한 정보가 노출되지 않도록 에러를 적절히 처리하세요:

```typescript
try {
  // OpenAI API 호출
} catch (error) {
  console.error('OpenAI API Error:', error)
  return new Response('Internal server error', { status: 500 })
}
```

## 라이선스

MIT License
