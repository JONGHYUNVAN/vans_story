# Van's Dev Blog

개발 경험과 결과물을 담는 개인 기술 블로그입니다.  
**배포 주소**: https://vansdevblog.online/

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
  - [Frontend](#frontend)
  - [Backend Services](#backend-services)
  - [Database & Storage](#database--storage)
  - [DevOps](#devops)
- [빠른 시작](#빠른-시작)
- [프로젝트 구조](#프로젝트-구조)
- [관련 문서](#관련-문서)
- [개발 환경](#개발-환경)
- [라이센스](#라이센스)
- [제작자](#제작자)

---

## 주요 기능

- **마이크로서비스 아키텍처**: 각 기능별로 독립적인 서비스 운영
- **OAuth 소셜 로그인**: Google, Kakao 로그인 지원
- **블로그 포스팅**: 카테고리별 포스트 관리 시스템
- **이미지 업로드**: WebP 최적화 및 S3 스토리지 연동
- **AI 채팅**: OpenAI API 기반 AI 상담 기능
- **반응형 디자인**: 모바일/데스크톱 최적화
- **다국어 지원**: 한국어/영어 지원

## 기술 스택

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: JWT + OAuth 2.0

### Backend Services
- **User Service**: Spring Boot (Kotlin)
- **Post Service**: NestJS (TypeScript)
- **OAuth Service**: Next.js (API Routes)
- **Image Service**: Next.js (API Routes)
- **AI Chat Service**: Next.js (API Routes)

### Database & Storage
- **User Service**: H2 Database
- **Post Service**: MongoDB
- **File Storage**: AWS S3

### DevOps
- **Deploy**: Vercel (Frontend), Individual service deployments
- **Monitoring**: Built-in logging and error tracking

## 빠른 시작

1. **저장소 클론**
```bash
git clone https://github.com/JONGHYUNVAN/vans_story.git
cd vans_story
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env.local
# 필요한 환경 변수들을 설정하세요
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:3000
```

## 프로젝트 구조

```
vans_story/
├── src/
│   ├── app/              # Next.js 앱 라우터
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── store/           # Redux 상태 관리
│   ├── utils/           # 유틸리티 함수
│   ├── hooks/           # 커스텀 훅
│   ├── interfaces/      # TypeScript 타입 정의
│   └── constants/       # 상수 정의
├── public/              # 정적 파일
└── docs/               # 문서 파일들
```

## 관련 문서

- **[API 문서](api.md)**: 모든 API 엔드포인트 및 사용법
- **[OAuth 구현 문서](oauth.md)**: OAuth 인증 시스템 상세 가이드
- **[프로젝트 페이지](https://vansdevblog.online/projects)**: 상세한 아키텍처 및 서비스 구성

## 개발 환경

- **Node.js**: 18.x 이상
- **npm**: 8.x 이상
- **TypeScript**: 5.x

## 라이센스

MIT License - 자세한 내용은 [LICENSE.md](LICENSE.md) 파일을 참조하세요.

## 제작자

**John Van** ([@JONGHYUNVAN](https://github.com/JONGHYUNVAN))
- Email: whdgus808@naver.com
- Blog: https://vansdevblog.online/
