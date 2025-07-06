# Next.js 15 ChatGPT API 서버

Next.js 15와 OpenAI API를 사용한 ChatGPT 챗봇 API 서버입니다. OpenAPI/Swagger 문서화가 포함되어 있습니다.

## 목차
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

- **Next.js 15** - 최신 버전의 React 프레임워크
- **React 19** - 최신 React 버전
- **TypeScript** - 타입 안정성
- **OpenAI API** - ChatGPT 챗봇 기능
- **JSDoc** - 코드 문서화
- **Tailwind CSS** - UI 스타일링

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
# .env.local 파일을 생성하고 OpenAI API 키를 설정하세요
OPENAI_API_KEY=your_openai_api_key_here

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## API 키 설정

1. [OpenAI 플랫폼](https://platform.openai.com/api-keys)에서 API 키를 발급받으세요
2. 프로젝트 루트에 `.env.local` 파일을 생성하세요
3. 다음과 같이 API 키를 설정하세요:

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

### 고급 옵션
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
| `message` | string | ✅ | - | ChatGPT에게 보낼 메시지 |
| `model` | string | ❌ | gpt-4o-mini | 사용할 OpenAI 모델 |
| `max_tokens` | number | ❌ | 1000 | 응답 최대 토큰 수 |
| `temperature` | number | ❌ | 0.7 | 응답의 창의성 (0-2) |

## Next.js 15 특징

이 프로젝트는 Next.js 15의 다음 기능들을 활용합니다:

- **향상된 성능**: 최적화된 패키지 임포트
- **React 19 호환성**: 최신 React 기능 활용
- **타입 안전성**: 향상된 TypeScript 지원
- **CORS 지원**: 자동 CORS 헤더 설정

## 설정

### 지원하는 OpenAI 모델
- `gpt-4o-mini` (기본값)
- `gpt-4o`
- `gpt-4`
- `gpt-3.5-turbo`
- 기타 OpenAI 채팅 모델

### CORS 설정
`next.config.ts`에서 CORS 설정을 수정할 수 있습니다.

## 배포

이 프로젝트는 Vercel, Netlify, 또는 기타 Next.js 호환 플랫폼에 배포할 수 있습니다.

배포 시 환경변수 `OPENAI_API_KEY`를 설정하는 것을 잊지 마세요!

## 보안 고려사항

- API 키는 절대 클라이언트 사이드에 노출하지 마세요
- 프로덕션 환경에서는 API 사용량 제한을 설정하세요
- 필요에 따라 인증 미들웨어를 추가하세요

## 라이선스

MIT License
