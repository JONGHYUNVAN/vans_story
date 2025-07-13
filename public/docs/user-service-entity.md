# User Service Entity 구조 (ERD)

## 📋 개요

User Service의 데이터베이스 엔티티 구조와 관계를 정의합니다.

## 🏗️ 엔티티 관계도 (ERD)

### Mermaid ERD
![user_entity.png](/docs/user_entity.png)


### 관계 설명

- **USERS.id ↔ USER_OAUTHS.user_id**: 1:N 관계
  - 한 사용자(USERS.id)는 여러 OAuth 계정(USER_OAUTHS.user_id)을 연결할 수 있음
  - 외래키 제약조건: `USER_OAUTHS.user_id` → `USERS.id`
  - Google, Kakao 등 다중 OAuth 제공자 지원

## 📊 엔티티 상세 정보

### 1. USERS 테이블

사용자 기본 정보를 저장하는 메인 테이블

| 필드명       | 타입      | 제약조건    | 설명                |
|-------------|-----------|-------------|-------------------|
| id          | bigint    | PK, 자동생성 | 사용자 고유 식별자    |
| password    | varchar   | NOT NULL    | 암호화된 비밀번호     |
| email       | varchar   | UK, NOT NULL| 이메일 주소 (유니크)  |
| nickname    | varchar   | UK, NOT NULL| 닉네임 (유니크)      |
| role        | enum      | NOT NULL    | 사용자 권한 (USER/ADMIN) |
| created_at  | datetime  | NOT NULL    | 계정 생성 시간       |
| updated_at  | datetime  | NOT NULL    | 정보 수정 시간       |

### 2. USER_OAUTHS 테이블

OAuth 연동 정보를 저장하는 테이블

| 필드명       | 타입      | 제약조건    | 설명                |
|-------------|-----------|-------------|-------------------|
| id          | bigint    | PK, 자동생성 | OAuth 연동 고유 식별자 |
| user_id     | bigint    | FK, NOT NULL| Users 테이블 참조     |
| provider    | varchar   | NOT NULL    | OAuth 제공자 (google, kakao) |
| provider_id | varchar   | NOT NULL    | OAuth 제공자 사용자 ID |
| created_at  | datetime  | NOT NULL    | 연동 생성 시간       |
| updated_at  | datetime  | NOT NULL    | 연동 수정 시간       |

**복합 유니크 제약조건**: `(provider, provider_id)`
- 동일한 OAuth 계정은 하나의 사용자에만 연결 가능

### 3. ROLE 열거형

사용자 권한을 정의하는 열거형

| 값    | 설명        |
|-------|------------|
| USER  | 일반 사용자  |
| ADMIN | 관리자      |

## 🔒 제약조건 및 인덱스

### 유니크 제약조건
- `USERS.email`: 이메일 중복 방지
- `USERS.nickname`: 닉네임 중복 방지
- `USER_OAUTHS(provider, provider_id)`: 동일 OAuth 계정 중복 연결 방지

### 외래키 제약조건
- `USER_OAUTHS.user_id` → `USERS.id`: 사용자 참조 무결성

## 📦 DTO (Data Transfer Object)

### 1. UserDto 클래스

사용자 정보 전송을 위한 DTO 클래스들

#### UserDto.CreateRequest
사용자 생성 요청 DTO

| 필드명     | 타입      | 필수 | 검증 규칙                                      |
|-----------|-----------|------|-----------------------------------------------|
| email     | String    | ✅   | 유효한 이메일 형식                              |
| password  | String    | ✅   | 8자 이상, 영문/숫자/특수문자 조합               |
| nickname  | String    | ✅   | 2-50자                                        |

#### UserDto.UpdateRequest
사용자 정보 수정 요청 DTO

| 필드명     | 타입      | 필수 | 검증 규칙                                      |
|-----------|-----------|------|-----------------------------------------------|
| email     | String    | ❌   | 유효한 이메일 형식                              |
| password  | String    | ❌   | 8자 이상, 영문/숫자/특수문자 조합               |
| nickname  | String    | ❌   | 2-50자                                        |
| role      | Role      | ❌   | USER, ADMIN                                   |

#### UserDto.Response
사용자 정보 응답 DTO

| 필드명      | 타입      | 설명                                          |
|------------|-----------|-----------------------------------------------|
| id         | Long      | 사용자 고유 식별자                             |
| email      | String    | 이메일 주소                                   |
| nickname   | String    | 사용자 닉네임                                 |
| role       | Role      | 사용자 권한 (USER/ADMIN)                      |
| createdAt  | String    | 생성 시간 (yyyy-MM-dd HH:mm:ss)               |
| updatedAt  | String    | 수정 시간 (yyyy-MM-dd HH:mm:ss)               |

### 2. OAuthDto 클래스

OAuth 관련 데이터 전송을 위한 DTO 클래스들

#### OAuthDto.LoginRequest
OAuth 로그인 요청 DTO

| 필드명      | 타입      | 필수 | 검증 규칙                                      |
|------------|-----------|------|-----------------------------------------------|
| provider   | String    | ✅   | 50자 이하 (google, kakao)                     |
| providerId | String    | ✅   | 100자 이하                                    |

#### OAuthDto.LinkRequest
OAuth 계정 연결 요청 DTO

| 필드명      | 타입      | 필수 | 검증 규칙                                      |
|------------|-----------|------|-----------------------------------------------|
| provider   | String    | ✅   | 50자 이하 (google, kakao)                     |
| providerId | String    | ✅   | 100자 이하                                    |

#### OAuthDto.UnlinkRequest
OAuth 계정 연결 해제 요청 DTO

| 필드명      | 타입      | 필수 | 검증 규칙                                      |
|------------|-----------|------|-----------------------------------------------|
| provider   | String    | ✅   | 50자 이하 (google, kakao)                     |

#### OAuthDto.CodeResponse
OAuth 임시 코드 응답 DTO

| 필드명      | 타입      | 설명                                          |
|------------|-----------|-----------------------------------------------|
| code       | String    | 임시 인증 코드 (5분 후 만료)                   |

#### OAuthDto.ExchangeRequest
임시 코드를 JWT 토큰으로 교환 요청 DTO

| 필드명      | 타입      | 필수 | 설명                                          |
|------------|-----------|------|-----------------------------------------------|
| code       | String    | ✅   | 임시 인증 코드                                |

#### OAuthDto.Response
OAuth 연동 정보 응답 DTO

| 필드명      | 타입           | 설명                                          |
|------------|---------------|-----------------------------------------------|
| id         | Long          | OAuth 연동 ID                                 |
| userId     | Long          | 사용자 ID                                     |
| provider   | String        | OAuth 제공업체                                |
| providerId | String        | OAuth 제공업체 사용자 ID                       |
| createdAt  | LocalDateTime | 연동 생성 시간                                |
| updatedAt  | LocalDateTime | 연동 수정 시간                                |

#### OAuthDto.LinkedAccountsResponse
연결된 OAuth 계정 목록 응답 DTO

| 필드명          | 타입                  | 설명                                          |
|----------------|----------------------|-----------------------------------------------|
| linkedAccounts | List<LinkedAccount>  | 연결된 OAuth 계정 목록                         |

**LinkedAccount 내부 구조:**

| 필드명      | 타입           | 설명                                          |
|------------|---------------|-----------------------------------------------|
| provider   | String        | OAuth 제공업체                                |
| createdAt  | LocalDateTime | 연동 생성 시간                                |

