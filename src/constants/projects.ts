import { Project } from '@/interfaces/project';

/**
 * 주가 대시보드 프로젝트 데이터
 */
export const stockDashboardProject: Project = {
  id: 'stock-dashboard',
  title: '실시간 주가 대시보드',
  description: 'KIS OpenAPI와 Yahoo Finance를 연동해 국내·미국 주가을 한 화면에서 보여주는 실시간 대시보드.\n\n국내주가는 Django SSE 파이프라인으로 폴링 없이 실시간 전달, 미국주가는 Next.js BFF를 통해 장 운영 시간에만 폴링.',
  deployUrl: 'https://vansdevblog.online/stocks',
  githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
  status: 'Deployed',
  date: '2025.03',
  category: '개인',
  services: [
    {
      name: '프론트엔드 (Next.js)',
      description: '국내·미국 워치리스트, 섹터 히트맵, 거시지표 패널, 종목 상세 페이지를 하나의 화면에 담음.\n\n시장 개장 여부를 1분마다 체크해 장 마감 시 폴링을 자동으로 멈추고, 심야에는 외부 요청 없음.',
      tech: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'SSE (EventSource)',
      ],
      features: [
        'KRX 국내 대형주 3종목과 NYSE·NASDAQ 미국 테크주 8종목 워치리스트. 현재가·등락률·시장 상태 실시간 표시.',
        'Squarified Treemap 알고리즘 기반 섹터 히트맵. 셀 면적은 시가총액에 비례, 색상은 당일 등락률 표시. 시총 데이터 없을 시 사전 정의 비중으로 대체.',
        '원/달러 환율·미국 10년 국채·KOSPI·KOSDAQ·나스닥·S&P 500·필라델피아 반도체 지수·WTI 유가 8개 거시지표를 통화·채권·지수·원자재 카테고리로 분류. 마운트 시 1회만 로드해 중복 요청 없음.',
        'KOSPI 현물 지수와 야간 KOSPI 200 지수를 60초 주기로 갱신. 색상으로 방향을 구분해 야간 시장 흐름 파악.',
        '국내 주가 시세를 체결가·10호가 포함 SSE 스트림으로 수신. 연결 실패 시 지수 백오프로 최대 5회 재시도, 마운트 시 REST 스냅샷을 병렬 요청해 스트림 연결 전에도 화면 채움.',
        '미국 주가는 프리마켓·정규장·애프터마켓 전 구간에서 30초 주기로 폴링. 거래소 마감 시 폴링 자동 중단, 상세 페이지에 정규·시간 외 가격 모두 표시.',
        'IANA 타임존 기반으로 KRX(09:00–15:30 KST)와 NYSE(09:30–16:00 ET) 장 운영 여부를 1분마다 재판별. 두 시장 모두 마감 시 외부 요청 완전 차단.',
        '종목 상세 페이지에 가격 차트·핵심 지표·펀더멘털(PER·PBR·EPS·배당수익률·외국인 보유비율)·애널리스트 목표주가·외국인·기관·개인 투자자 동향·DART 공시·뉴스 통합.',
      ],
    },
    {
      name: '백엔드 (Django + Next.js BFF)',
      description: 'KIS OpenAPI WebSocket 연결을 Django 프로세스 싱글톤으로 유지하고, SSE로 실시간 체결가·호가를 각 브라우저에 중계.\n\nKIS 자격증명이 없어도 나머지 대시보드 기능은 정상 동작.',
      tech: ['Django', 'Python', 'KIS OpenAPI', 'websockets', 'SSE', 'PyCryptodome', 'Next.js', 'TypeScript'],
      features: [
        '스레드 락으로 KIS WebSocket 연결을 프로세스당 하나만 유지. 비동기 I/O는 별도 백그라운드 스레드에서 처리해 Django 동기 핸들러가 파이프라인을 막지 않음.',
        '참조 카운트로 구독 관리. 첫 클라이언트 요청 시 KIS 구독을 보내고, 마지막 클라이언트 해제 시 취소. 불필요한 구독 누적 없음.',
        '실시간 프레임을 구독 핸드셰이크에서 받은 채널별 키·IV로 서버에서 AES-256-CBC 복호화. 브라우저에는 순수 JSON만 전달되고 암호화 키 노출 없음.',
        'SSE 연결 즉시 캐시된 체결가·호가 스냅샷 전송. 클라이언트별 유한 큐로 느린 연결의 초과 이벤트를 드롭해 파이프라인 막힘 없음.',
        'WebSocket 끊김 시 5초 간격으로 최대 10회 자동 재연결. 재연결 성공 시 활성 구독 목록 전체 즉시 재전송.',
        'Next.js BFF 프록시는 핸드셰이크 단계에만 30초 타임아웃을 적용, 응답 헤더 수신 즉시 해제. 스트림 중간 연결 끊김 없음.',
        'KIS 자격증명 없을 시 SSE 엔드포인트는 킵얼라이브 핑 스트림, 스냅샷 엔드포인트는 미사용 응답 반환. 나머지 대시보드 기능 영향 없음.',
      ],
    }
  ],
  architecture: {
    description: '국내 주가는 KIS WebSocket → Django SSE → 브라우저 파이프라인으로 폴링 없이 실시간 전달.\n\n미국 시세·거시지표·섹터 히트맵·KOSPI 선물은 Next.js BFF가 Yahoo Finance를 30초 주기로 폴링. KRX와 NYSE 모두 마감 시 모든 요청 자동 중단.',
    imagePath: '/StockDashboard_Architecture.svg',
    benefits: [
      'KIS WebSocket 연결을 프로세스당 하나만 유지해 동일 API 키 충돌 방지',
      '참조 카운트로 구독 관리. 시청자가 있을 때만 KIS 구독을 유지해 불필요한 연결 비용 없음',
      '실시간 프레임을 서버에서 복호화해 암호화 키가 브라우저에 노출되지 않음',
      'SSE 연결 즉시 캐시 스냅샷 전송으로 스트림 준비 전에도 화면이 비지 않음',
      '클라이언트별 유한 큐로 느린 연결의 초과 이벤트를 드롭해 파이프라인 막힘 없음',
      'KIS 자격증명 없어도 킵얼라이브 응답으로 대체해 나머지 대시보드 정상 동작',
      '브라우저 SSE 클라이언트가 지수 백오프로 자동 재연결, 마운트 시 스냅샷을 병렬 요청해 화면 즉시 채움',
      '장 운영 시간을 1분마다 재평가해 두 시장 모두 마감 시 외부 요청 자동 차단',
    ]
  },
  impact: 'KIS WebSocket → Django SSE → 브라우저로 이어지는 국내 주가 실시간 파이프라인 직접 구축. Yahoo Finance 폴링 기반 미국 시장 데이터와 결합해 국내·미국 통합 주가 대시보드 완성.',
  totalTech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Django', 'Python', 'KIS OpenAPI', 'Yahoo Finance API', 'DART API', 'websockets', 'SSE', 'PyCryptodome']
};

/**
 * VansDevBlog 프로젝트 데이터
 */
export const vansDevBlogProject: Project = {
  id: 'vansdevblog',
  title: 'VansDevBlog - 마이크로서비스 기반 풀스택 블로그',
  description: '현재 배포 중인 개인 기술 블로그입니다. 마이크로서비스 아키텍처를 적용하여 6개의 독립적인 서비스로 구성되어 있습니다.',
  deployUrl: 'https://vansdevblog.online/',
  githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
  status: 'Deployed',
  date: '2024.12',
  category: '개인',
  services: [
    {
      name: '프론트엔드 (Next.js)',
      description: 'React, Next.js 기반 프론트엔드',
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
      features: [
        '타이핑 효과가 있는 인터랙티브 홈페이지',
        'JWT 기반 사용자 인증 시스템',
        'Tiptap 에디터를 활용한 마크다운 작성',
        '다국어 지원 (한국어/영어)',
        'Storybook을 활용한 컴포넌트 문서화',
        '반응형 디자인'
      ]
    },
    {
      name: '백엔드 - 유저 서비스 (Spring Boot)',
      description: 'Kotlin 기반 사용자 관리 및 인증 서비스',
      tech: ['Spring Boot', 'Kotlin', 'MariaDB', 'JWT', 'Spring Security'],
      features: [
        'JWT 기반 사용자 인증 및 권한 관리',
        'Spring Security를 활용한 보안 설정',
        'MariaDB 기반 사용자 데이터 관리',
        'CORS 지원 및 API 로깅'
      ]
    },
    {
      name: '백엔드 - 게시글 서비스 (NestJS)',
      description: 'TypeScript 기반 게시글 관리 서비스',
      tech: ['NestJS', 'TypeScript', 'MongoDB', 'Mongoose', 'JWT'],
      features: [
        '게시글 CRUD 및 페이지네이션',
        'MongoDB 기반 게시글 데이터 관리',
        'JWT 기반 인증 가드',
        '테마 및 카테고리별 게시글 분류'
      ]
    },
    {
      name: 'OAuth 인증 서버',
      description: 'OAuth 2.0 기반 소셜 로그인 중간 서버',
      tech: ['Next.js', 'TypeScript', 'OAuth 2.0', 'JWT', 'JOSE'],
      features: [
        'Google, Kakao OAuth 2.0 지원',
        'CSRF 방지를 위한 state 파라미터 검증',
        'OAuth 토큰 즉시 폐기로 보안 강화',
        '최소 정보 전달 (사용자 ID만)',
        '포괄적인 에러 핸들링',
        'CORS 지원'
      ]
    },
    {
      name: '이미지 처리 서비스',
      description: 'AWS S3 기반 이미지 업로드 및 처리 서비스',
      tech: ['Next.js', 'Sharp', 'AWS S3', 'WebP', 'TypeScript'],
      features: [
        'Sharp 라이브러리를 사용한 WebP 변환',
        'AWS S3 멀티파트 업로드',
        '이미지 품질 최적화 (80-85%)',
        '메타데이터 추출 (너비, 높이, 포맷)',
        '고유 파일명 생성으로 중복 방지',
        '최대 5MB 파일 크기 제한'
      ]
    },
    {
      name: 'AI 채팅 서비스',
      description: 'OpenAI API 기반 AI 채팅 서비스',
      tech: ['Next.js', 'OpenAI API', 'TypeScript', 'React'],
      features: [
        'OpenAI GPT-4o-mini 모델 사용',
        'ChatGPT API 연동',
        '사용자 맞춤형 응답 생성',
        'CORS 지원'
      ]
    },
    {
      name: '백엔드 - 검색 서비스 (Django)',
      description: 'Django 기반 고성능 검색 엔진 서비스',
      tech: ['Django', 'Python', 'Elasticsearch', 'Redis', 'MongoDB'],
      features: [
        'Elasticsearch 기반 전문 검색 (Full-text search)',
        'Nori 한국어 분석기 지원으로 정확한 한국어 검색',
        '실시간 자동완성 및 검색 제안 시스템',
        'Redis 캐시를 통한 고성능 검색 결과 제공',
        '카테고리, 태그, 날짜 범위 기반 스마트 필터링',
        '인기 검색어 트래킹 및 통계 수집',
        'Swagger/OpenAPI 자동 문서화',
        '마이크로서비스 아키텍처로 독립적 배포'
      ]
    }
  ],
  architecture: {
    description: '마이크로서비스 아키텍처로 각 서비스가 독립적으로 배포되며 직접 통신합니다.',
    benefits: [
      '각 서비스별 독립적인 배포 및 관리 (각 백엔드 서버 및 db, 프론트엔드 서버, 각 api 라우트 서버)',
      '다양한 기술 스택 학습 및 적용 (Spring Boot, NestJS, Django, Next.js)',
      '한 서버 장애 발생시에도 나머지 서비스는 정상 동작',
      '서비스별 최적화된 데이터베이스 선택 (MariaDB, MongoDB, Elasticsearch)',
      '기능별 코드 분리로 유지보수성 향상',
      '개인 프로젝트 내에서 풀스택 개발 경험 확장'
    ]
  },
  impact: '마이크로서비스 아키텍처 설계 및 구현, 독립적인 서비스 배포, 확장성 있는 시스템 구축',
  totalTech: ['Next.js', 'Spring Boot', 'Kotlin', 'NestJS', 'Django', 'Python', 'TypeScript', 'MariaDB', 'MongoDB', 'Elasticsearch', 'Redis', 'AWS S3', 'OpenAI API', 'JWT', 'OAuth 2.0', 'Tailwind CSS', 'Sharp', 'Storybook']
}; 