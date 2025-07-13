# User Service API 가이드

## 목차
- [개요](#개요)
- [아키텍처 설계](#아키텍처-설계)
- [인증 시스템](#인증-시스템)
- [OAuth 통합](#oauth-통합)
- [API 설계 원칙](#api-설계-원칙)
- [에러 처리](#에러-처리)
- [보안 고려사항](#보안-고려사항)
- [개발 가이드](#개발-가이드)

## 개요

User Service는 VansDevBlog의 사용자 인증과 권한 관리를 담당하는 핵심 백엔드 서비스입니다.

### 주요 기능
- 🔐 **사용자 인증**: 이메일/비밀번호 기반 로그인
- 🔑 **JWT 토큰 관리**: Access Token / Refresh Token 발급 및 갱신
- 🌐 **OAuth 소셜 로그인**: Google, Kakao, Naver 등 연동
- 👤 **사용자 정보 관리**: 프로필 조회 및 수정
- 🛡️ **권한 관리**: 역할 기반 접근 제어

### 기술 스택
- **언어**: Kotlin 1.9.22
- **프레임워크**: Spring Boot 3.5.0
- **ORM**: Exposed ORM 0.45.0 (JPA가 아님!)
- **데이터베이스**: MariaDB
- **보안**: Spring Security + JWT (jjwt 0.12.6)
- **문서화**: SpringDoc OpenAPI 3.0 (Swagger)
- **빌드 도구**: Gradle + Kotlin DSL
- **테스트**: Kotest + MockK
- **로깅**: kotlin-logging-jvm
- **환경 설정**: spring-dotenv

## 아키텍처 설계

### 레이어드 아키텍처

```mermaid
graph TD
    subgraph "🎯 실제 프로젝트 구조 (blog.vans_story_be)"
        A[Controller Layer<br/>📡 REST API 엔드포인트]
        A --> A1[UserController<br/>사용자 CRUD API]
        A --> A2[AuthController<br/>JWT 인증 API]
        A --> A3[OAuthController<br/>OAuth 연동 API]
    end
    
    subgraph "🏢 Service Layer"
        B["Service Layer - 🏢 비즈니스 로직"]
        B --> B1["UserService - 사용자 비즈니스 로직"]
        B --> B2["AuthService - JWT 토큰 관리"]
        B --> B3["OAuthService - OAuth 연동 로직"]
    end
    
    subgraph "🗃️ Repository Layer"
        C["Repository Layer - 🗃️ 데이터 접근 (Exposed ORM)"]
        C --> C1["UserRepository - Exposed DAO 기반"]
        C --> C2["UserOAuthRepository - OAuth 연동 데이터"]
    end
    
    subgraph "🏛️ Entity Layer"
        D["Entity Layer - 🏛️ Exposed 엔티티"]
        D --> D1["User + Users - 사용자 엔티티 + 테이블"]
        D --> D2["UserOAuth + UserOAuths - OAuth 연동 엔티티 + 테이블"]
        D --> D3["Role - 권한 Enum"]
    end
    
    subgraph "⚙️ Configuration"
        E["Config Layer - ⚙️ 설정 관리"]
        E --> E1["SecurityConfig - Spring Security"]
        E --> E2["DatabaseConfig - Exposed 설정"]
        E --> E3["CorsConfig - CORS 정책"]
        E --> E4["SwaggerConfig - API 문서화"]
    end
    
    subgraph "🌐 Global Components"
        F["Global Layer - 🌐 전역 컴포넌트"]
        F --> F1["ApiResponse - 통합 응답 형식"]
        F --> F2["CustomException - 예외 처리"]
        F --> F3["GlobalMapper - 객체 변환"]
    end
    
    A --> B
    B --> C
    C --> D
    A -.-> E
    B -.-> F
    
    classDef controllerClass fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef serviceClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef repositoryClass fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef entityClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef configClass fill:#ffebee,stroke:#f44336,stroke-width:2px
    classDef globalClass fill:#f9f9f9,stroke:#757575,stroke-width:2px
    
    class A,A1,A2,A3 controllerClass
    class B,B1,B2,B3 serviceClass
    class C,C1,C2 repositoryClass
    class D,D1,D2,D3 entityClass
    class E,E1,E2,E3,E4 configClass
    class F,F1,F2,F3 globalClass
```

### 도메인 모델
- **User**: 사용자 정보 (이메일, 비밀번호, 프로필)
- **OAuthAccount**: OAuth 계정 연동 정보
- **Role**: 사용자 권한 (ADMIN, USER)
- **RefreshToken**: 토큰 갱신을 위한 정보

## 인증 시스템

### JWT 토큰 전략
User Service는 이중 토큰 전략을 사용합니다:

#### Access Token
- **용도**: API 요청 인증
- **전송 방식**: Authorization Bearer 헤더
- **만료 시간**: 5시간 (18000초)
- **저장 위치**: 클라이언트 메모리 (보안)

#### Refresh Token
- **용도**: Access Token 갱신
- **전송 방식**: HTTP-Only 쿠키
- **만료 시간**: 7일 (604800초)
- **저장 위치**: 서버 데이터베이스 + 클라이언트 쿠키

### 인증 플로우
```
1. 사용자 로그인 → 2. 토큰 발급 → 3. API 요청 → 4. 토큰 검증
     ↓                    ↓                ↓               ↓
5. 토큰 만료 → 6. 갱신 요청 → 7. 새 토큰 발급 → 8. 계속 사용
```

```mermaid
sequenceDiagram
    participant C as 클라이언트
    participant S as 서버
    participant DB as 데이터베이스
    
    Note over C,S: 로그인 및 토큰 발급
    C->>S: 1. 로그인 요청 (email, password)
    S->>DB: 2. 사용자 인증 확인
    DB-->>S: 3. 사용자 정보 반환
    S->>S: 4. Access Token 생성 (5시간 유효)
    S->>S: 5. Refresh Token 생성 (7일 유효)
    S->>DB: 6. Refresh Token 저장
    S-->>C: 7. 토큰 발급 (Authorization 헤더 + 쿠키)
    
    Note over C,S: API 사용 및 토큰 검증
    C->>S: 8. API 요청 (Bearer Token)
    S->>S: 9. Access Token 검증
    S->>DB: 10. 사용자 정보 조회
    S-->>C: 11. API 응답
    
    Note over C,S: 토큰 갱신 플로우
    C->>S: 12. 토큰 갱신 요청 (Refresh Token)
    S->>DB: 13. Refresh Token 검증
    DB-->>S: 14. 토큰 유효성 확인
    S->>S: 15. 새 Access Token 생성
    S->>S: 16. 새 Refresh Token 생성
    S->>DB: 17. 새 Refresh Token 저장
    S-->>C: 18. 새 토큰 발급
    
    rect rgb(255, 240, 240)
    Note over C,S: 토큰 만료 또는 오류 처리
    C->>S: 19. 만료된 토큰으로 요청
    S-->>C: 20. 401 Unauthorized
    end
```

## OAuth 통합

### 지원 제공업체
- **Google**: Google OAuth 2.0
- **Kakao**: Kakao Login API

### OAuth 보안 정책
- **연동 우선**: 기존 계정에 OAuth 연동만 가능
- **자동 가입 불가**: 새로운 OAuth 계정으로 자동 가입 미지원
- **임시 코드 시스템**: OAuth 로그인 → 임시 코드 → JWT 토큰 교환

### OAuth 플로우
```
1. OAuth 로그인 → 2. 임시 코드 발급 → 3. 코드 교환 → 4. JWT 토큰 발급
   (5분 만료)         (providerId 확인)      (실제 인증)      (정상 사용)
```

```mermaid
sequenceDiagram
    participant U as 사용자
    participant F as 프론트엔드
    participant M as 중간 서버
    participant O as OAuth 제공자<br/>(Google/Kakao)
    participant B as 백엔드 서버
    participant DB as 데이터베이스
    
    Note over U,DB: OAuth 소셜 로그인 플로우
    U->>F: 1. OAuth 로그인 버튼 클릭
    F->>M: 2. 중간 서버로 리다이렉트
    M->>O: 3. OAuth 제공자로 리다이렉트 (client_id, scope)
    O->>U: 4. 로그인 페이지 표시
    U->>O: 5. 로그인 인증
    O->>M: 6. 임시 코드 반환 (authorization_code)
    M->>M: 7. 임시 코드 생성 및 저장 (5분 만료)
    M->>F: 8. 임시 코드와 함께 리다이렉트
    
    F->>B: 9. JWT 토큰 교환 요청 (provider, code)
    B->>M: 10. 임시 코드 검증
    M-->>B: 11. providerId 반환
    B->>DB: 12. OAuth 연동 정보 조회 (provider + providerId)
    
    alt 기존 연동 계정 존재
        DB-->>B: 13a. 연동된 사용자 정보 반환
        B->>B: 14a. JWT 토큰 생성
        B-->>F: 15a. 토큰 발급 성공
        F->>U: 16a. 로그인 완료
    else 연동되지 않은 계정
        DB-->>B: 13b. 연동 정보 없음
        B-->>F: 14b. 연동 필요 오류 (400 Bad Request)
        F->>U: 15b. 연동 필요 안내
    end
    
    rect rgb(240, 248, 255)
    Note over U,DB: 보안: 사전 계정 연동이 필요한 정책
    end
```

## API 설계 원칙

### RESTful 설계
- **리소스 중심**: `/users`, `/oauth`, `/auth`
- **HTTP 메서드**: GET, POST, PUT, DELETE 적절히 활용
- **상태 코드**: 200, 201, 204, 400, 401, 403, 500 등

### 일관된 응답 형식
모든 API는 다음 형식을 따릅니다:
```json
{
  "success": boolean,
  "data": object | null,
  "message": string | null
}
```

### 버전 관리
- **URL 경로**: `/api/v1/...`
- **하위 호환성**: 기존 API 유지
- **점진적 업그레이드**: 새 버전 병렬 운영

## 에러 처리

### 표준화된 에러 응답
```json
{
  "success": false,
  "data": null,
  "message": "구체적인 에러 메시지"
}
```

### 주요 에러 카테고리
- **인증 에러** (401): 토큰 만료, 잘못된 인증 정보
- **권한 에러** (403): 접근 권한 부족
- **검증 에러** (400): 입력 값 검증 실패
- **서버 에러** (500): 내부 서버 오류

```mermaid
flowchart TD
    A[API 요청] --> B{토큰 검증}
    B -->|유효| C{권한 확인}
    B -->|만료/무효| D["401 Unauthorized - 토큰 재발급 필요"]
    
    C -->|권한 있음| E{입력 값 검증}
    C -->|권한 없음| F["403 Forbidden - 접근 권한 부족"]
    
    E -->|검증 성공| G[비즈니스 로직 실행]
    E -->|검증 실패| H["400 Bad Request - 입력 값 오류"]
    
    G -->|성공| I["200 OK - 정상 응답"]
    G -->|비즈니스 오류| J["400 Bad Request - 비즈니스 규칙 위반"]
    G -->|시스템 오류| K["500 Internal Server Error - 서버 내부 오류"]
    
    subgraph "에러 응답 형식"
        L["{ 'success': false, 'data': null, 'message': '구체적인 에러 메시지' }"]
    end
    
    D --> L
    F --> L
    H --> L
    J --> L
    K --> L
    
    classDef successClass fill:#e8f5e8,stroke:#4caf50,stroke-width:2px
    classDef authErrorClass fill:#ffebee,stroke:#f44336,stroke-width:2px
    classDef validationErrorClass fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef serverErrorClass fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef processClass fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    
    class I successClass
    class D,F authErrorClass
    class H,J validationErrorClass
    class K serverErrorClass
    class A,B,C,E,G processClass
```

## 보안 고려사항

### 토큰 보안
- **HTTP-Only 쿠키**: Refresh Token XSS 공격 방지
- **Secure 플래그**: HTTPS 환경에서만 쿠키 전송
- **SameSite 속성**: CSRF 공격 방지

### 비밀번호 보안
- **bcrypt 해싱**: 안전한 비밀번호 저장
- **복잡성 검증**: 8자 이상, 영문/숫자/특수문자 조합
- **브루트 포스 방지**: 로그인 시도 제한

### CORS 설정
- **허용 오리진**: 특정 도메인만 허용
- **자격 증명 포함**: 쿠키 전송 허용
- **허용 메서드**: GET, POST, PUT, DELETE

---

## 📋 상세 API 명세

구체적인 API 엔드포인트, 요청/응답 형식, 파라미터 등은 **[Swagger API 문서](./user-swagger/)** 를 참조하세요.

Swagger UI에서 다음 기능을 사용할 수 있습니다:
- 📖 전체 API 목록 및 상세 설명
- 📝 요청/응답 예시
- 🔍 스키마 정의 확인 