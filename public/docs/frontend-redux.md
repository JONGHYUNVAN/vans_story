# Redux 상태 관리

## 📋 목차

- [상태 구조](#상태-구조)
  - [인증 상태](#인증-상태)
  - [다국어 상태](#다국어-상태)
  - [모달 상태](#모달-상태)
- [액션과 리듀서](#액션과-리듀서)
  - [인증 액션](#인증-액션)
  - [다국어 액션](#다국어-액션)
  - [모달 액션](#모달-액션)
- [선택자 함수](#선택자-함수)
- [커스텀 훅](#커스텀-훅)
- [상태 지속성](#상태-지속성)
- [주의사항](#주의사항)

---

## 상태 구조

### 인증 상태

#### 구현 위치
```
src/store/auth/
├── types.ts
│   ├── User            # user 객체 타입 정의
│   ├── UserRole        # 권한 타입 정의
│   ├── UserPreferences # 사용자 설정 타입
│   ├── AuthState       # 인증 상태 타입
│   └── OAuthState      # OAuth 상태 타입
└── reducer.ts          # 초기 상태 정의
```

#### user 객체 구조 및 설명

| 속성명           | 설명                                      | 구현 위치                        |
|------------------|-------------------------------------------|----------------------------------|
| **email**        | 사용자 이메일, 로그인/알림/프로필          | `types.ts`의 `User` 인터페이스   |
| **username**     | 사용자 표시 이름, 멘션 등                  | `types.ts`의 `User` 인터페이스   |
| **roles**        | 권한 목록, 접근 제어/기능 활성화           | `types.ts`의 `UserRole` 타입     |
| **preferences**  | 사용자 설정(테마, 알림 등)                 | `types.ts`의 `UserPreferences`   |

**roles 가능한 값:**
- `admin`: 전체 관리자 권한
- `editor`: 콘텐츠 관리 권한
- `user`: 일반 사용자 권한
- `moderator`: 콘텐츠 검토 권한

#### 인증 상태 플래그 및 기타

| 속성명             | 설명                                         | 구현 위치                        |
|--------------------|----------------------------------------------|----------------------------------|
| **isAuthenticated**| 로그인 여부, 보호 라우트/기능 활성화         | `reducer.ts`                     |
| **isLoading**      | 인증 작업 중 로딩 상태                       | `reducer.ts`                     |
| **error**          | 인증 오류 정보(코드, 메시지 등)              | `types.ts`의 `AuthError` 타입    |
| **oauthLoading**   | OAuth 인증 진행 중 여부                      | `reducer.ts`                     |
| **oauthProvider**  | 현재 OAuth 제공자(kakao, google 등)          | `types.ts`의 `OAuthProvider` 타입|
| **oauthError**     | OAuth 인증 오류                              | `types.ts`의 `OAuthError` 타입   |
| **lastLoginAt**    | 마지막 로그인 시간(ISO 8601 문자열)           | `types.ts`의 `AuthState`         |

### 다국어 상태

#### 구현 위치
```
src/store/i18n/
  types.ts      # I18nState, LocaleInfo, Translations 타입 정의
  reducer.ts    # 다국어 상태 초기값 및 리듀서
```

#### 다국어 상태 구조 및 설명

| 속성명             | 설명                                         | 구현 위치                        |
|--------------------|----------------------------------------------|----------------------------------|
| **locale**         | 현재 선택된 언어(ko, en 등)                   | `types.ts`의 `I18nState`         |
| **fallbackLocale** | 번역 누락 시 기본 언어                        | `types.ts`의 `I18nState`         |
| **availableLocales**| 지원 언어 목록, 코드/이름/포맷 등             | `types.ts`의 `LocaleInfo`        |
| **loadedNamespaces**| 로드된 번역 네임스페이스                      | `reducer.ts`                     |

**주요 네임스페이스:**
- `common`: 공통 텍스트
- `auth`: 인증 관련
- `post`: 게시물 관련
- `settings`: 설정 관련

### 모달 상태

#### 구현 위치
```
src/store/modal/
  types.ts      # ModalState, LoginModalProps, SignupModalProps, UserSettingsProps 등 타입 정의
  reducer.ts    # 모달 상태 초기값 및 리듀서
```

#### 모달 상태 구조 및 설명

| 속성명                | 설명                                         | 구현 위치                        |
|-----------------------|----------------------------------------------|----------------------------------|
| **isOpen**            | 모달 표시 여부                               | `types.ts`의 `ModalState`        |
| **initialTab**        | 로그인 모달의 초기 탭(email, oauth)           | `types.ts`의 `LoginModalProps`   |
| **redirectUrl**       | 로그인 후 이동 경로                           | `types.ts`의 `LoginModalProps`   |
| **prefilledEmail**    | 회원가입 모달의 미리 입력된 이메일            | `types.ts`의 `SignupModalProps`  |
| **activeSection**     | 설정 모달의 활성 섹션(profile, notifications, theme) | `types.ts`의 `UserSettingsProps` |

**모달 종류:**
- 로그인 모달: 로그인/소셜 로그인/리다이렉트 등
- 회원가입 모달: 이메일, OAuth 회원가입 등
- 사용자 설정 모달: 프로필, 알림, 테마 등

## 액션과 리듀서

### 인증 액션 및 리듀서

#### 구현 위치
```
src/store/auth/
  actions.ts    # 인증 관련 액션 정의
  reducer.ts    # 인증 리듀서
```

| 구분      | 설명                        | 구현 위치         |
|-----------|-----------------------------|------------------|
| 로그인    | 로그인 시작/성공/실패 액션  | actions.ts       |
| OAuth     | OAuth 시작/성공/실패 액션   | actions.ts       |
| 리듀서    | 인증 상태 변경 로직         | reducer.ts       |

**주요 액션:**
- loginStart, loginSuccess, loginFailure
- oauthStart, oauthSuccess, oauthFailure

---

### 다국어 액션 및 리듀서

#### 구현 위치
```
src/store/i18n/
  actions.ts    # 다국어 관련 액션 정의
  reducer.ts    # 다국어 리듀서
```

| 구분      | 설명                        | 구현 위치         |
|-----------|-----------------------------|------------------|
| 언어설정  | setLocale, addLoadedNamespace, setTranslations | actions.ts |
| 리듀서    | 다국어 상태 변경 로직        | reducer.ts       |

**주요 액션:**
- setLocale, addLoadedNamespace, setTranslations

---

### 모달 액션 및 리듀서

#### 구현 위치
```
src/store/modal/
  actions.ts    # 모달 관련 액션 정의
  reducer.ts    # 모달 리듀서
```

| 구분      | 설명                        | 구현 위치         |
|-----------|-----------------------------|------------------|
| 모달제어  | openModal, closeModal, updateModalProps | actions.ts |
| 리듀서    | 모달 상태 변경 로직          | reducer.ts       |

**주요 액션:**
- openModal, closeModal, updateModalProps

---

## 선택자 함수

#### 구현 위치
```
src/store/
  auth/selectors.ts   # 인증 관련 선택자
  i18n/selectors.ts   # 다국어 관련 선택자
  modal/selectors.ts  # 모달 관련 선택자
```

| 구분      | 설명                        | 구현 위치                |
|-----------|-----------------------------|-------------------------|
| 인증      | 사용자, 인증상태, 로딩 등    | auth/selectors.ts       |
| 다국어    | 현재 언어, 지원 언어 등      | i18n/selectors.ts       |
| 모달      | 모달 상태                   | modal/selectors.ts      |

**주요 선택자:**
- selectUser, selectIsAuthenticated, selectAuthLoading, selectUserPreferences
- selectCurrentLocale, selectAvailableLocales, selectLoadedNamespaces
- selectModalState

---

## 커스텀 훅

#### 구현 위치
```
src/store/
  auth/hooks.ts   # 인증 관련 훅
  i18n/hooks.ts   # 다국어 관련 훅
  modal/hooks.ts  # 모달 관련 훅
```

| 훅 이름      | 설명                        | 구현 위치         |
|--------------|-----------------------------|------------------|
| useAuth      | 인증 관련 기능 제공          | auth/hooks.ts    |
| useI18n      | 다국어 지원 기능 제공        | i18n/hooks.ts    |
| useModal     | 모달 제어 기능 제공          | modal/hooks.ts   |

---

## 상태 지속성

#### 구현 위치
```
src/store/
  store.ts      # 상태 지속성 설정(persistConfig)
  auth/utils.ts # 토큰 관리(setToken, getToken, removeToken)
```

| 구분          | 설명                        | 구현 위치         |
|---------------|-----------------------------|------------------|
| persistConfig | 상태 지속성(로컬스토리지 등) | store.ts         |
| 토큰 관리     | 토큰 저장/조회/제거          | auth/utils.ts    |

**주요 함수:**
- setToken, getToken, removeToken

---
