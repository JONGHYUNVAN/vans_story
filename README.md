# Van's Dev Blog

개발 경험과 결과물을 담는 개인 기술 블로그입니다.  
배포 주소 : https://vansdevblog.online/

## 🚀 주요 기능

- 타이핑 효과가 있는 인터랙티브한 홈페이지
- 기술 스택 별 블로그 포스팅
- 반응형 디자인

## 🛠 기술 스택

- **Frontend**: React, Next.js
- **Styling**: Tailwind CSS
- **Backend**: Spring Boot (예정)
- **Deploy**: Vercel

## 🏃‍♂️ 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/JONGHYUNVAN/vans_story.git
```

2. 의존성 설치
```bash
npm install
# or
yarn install
```

3. 개발 서버 실행
```bash
npm run dev
# or
yarn dev
```

4. 브라우저에서 확인
```
http://localhost:3000
```

## 📂 프로젝트 구조

```
src/
├── app/          # 페이지 컴포넌트
├── components/   # 재사용 가능한 컴포넌트
├── hooks/        # 커스텀 훅
└── styles/       # 스타일 파일
```

## 📝 추가 예정 기능

- [ ] 블로그 포스팅 기능
- [ ] 댓글 시스템
- [ ] 검색 기능
- [ ] 카테고리 분류

## 📜 라이센스

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 🤝 기여하기

이슈와 풀 리퀘스트는 언제나 환영합니다!

## 👨‍💻 제작자

- John Van ([@JONGHYUNVAN](https://github.com/JONGHYUNVAN))

## 🔐 Authentication

### 핵심 파일 구조
```
src/
├── store/
│   ├── auth/
│   │   ├── api.ts        # 인증 API 함수
│   │   ├── slice.ts      # 인증 상태 관리
│   │   └── types.ts      # 타입 정의
│   └── index.ts          # Redux 스토어 설정
├── utils/
│   └── token.ts          # 토큰 관리 유틸리티
└── components/
    └── header/
        └── AuthButtons.tsx # 로그인/로그아웃 UI
```

## 상태 관리 (Redux)

### 1. 인증 상태 정의 (`auth/types.ts`)

#### AuthState 인터페이스 : 사용자의 인증 상태를 관리하기 위한 전역 상태 인터페이스
- `user`: 현재 로그인한 사용자의 정보 (User | null)
- `isAuthenticated`: 사용자의 로그인 여부를 나타내는 불리언 값
- `isLoading`: API 요청 중임을 나타내는 로딩 상태
- `error`: 인증 과정에서 발생한 에러 메시지

#### User 인터페이스 : 로그인한 사용자의 기본 정보를 정의하는 인터페이스
- `id`: 사용자의 고유 식별자
- `email`: 사용자의 이메일 주소
- `name`: 사용자의 이름

#### LoginRequest 인터페이스 : 로그인 요청 시 필요한 데이터 구조
- `email`: 로그인에 사용되는 이메일
- `password`: 사용자 비밀번호

#### LoginResponse 인터페이스 : 로그인 성공 시 서버로부터 받는 응답 데이터 구조
- `user`: 사용자 정보 (User 타입)
- `accessToken`: JWT 인증 토큰

### 2. 상태 관리 (`store/auth/slice.ts`)
#### 초기 상태
```typescript
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
```

#### 리듀서 함수들
인증 상태를 변경하기 위한 액션들을 정의합니다.

1. `setUser(user: User)`
   - 로그인 성공 시 사용자 정보 저장
   - `isAuthenticated`를 true로 설정

2. `logout()`
   - 로그아웃 시 모든 인증 상태 초기화
   - 사용자 정보, 에러 메시지 제거

3. `setLoading(isLoading: boolean)`
   - API 요청 중 로딩 상태 관리
   - 로딩 인디케이터 표시에 사용

4. `setError(error: string | null)`
   - 인증 과정에서 발생한 에러 메시지 저장
   - 사용자에게 에러 피드백 제공

#### 사용 예시

`로그인 성공 시`
```typescript
dispatch(setUser(userData));
```

`로그아웃`
```typescript
dispatch(logout());
```

`로딩 상태 설정`
```typescript
dispatch(setLoading(true));
```

`에러 설정`
```typescript
dispatch(setError('로그인 실패'));
```

### API 통신 (`auth/api.ts`)

백엔드 서버와의 인증 관련 통신을 담당하는 함수들입니다.

#### `login({ email, password })`
- 사용자 로그인 요청을 처리
- **요청**: POST `/api/auth/login`
- **파라미터**: 
  - `email`: 사용자 이메일
  - `password`: 사용자 비밀번호
- **응답**: `{ user: User, accessToken: string }`
- 성공 시 받은 토큰은 자동으로 `tokenStorage`에 저장

#### `logout()`
- 현재 로그인된 사용자의 로그아웃 처리
- **요청**: POST `/api/auth/logout`
- **헤더**: `Authorization: Bearer ${token}`
- 성공 시 저장된 토큰 자동 삭제

#### `refresh()`
- 만료된 액세스 토큰 갱신
- **요청**: POST `/api/auth/refresh`
- **응답**: `{ accessToken: string }`
- 새로운 토큰으로 자동 교체

### 토큰 관리 (`utils/token.ts`)

브라우저의 `localStorage`를 통한 토큰 관리 유틸리티입니다.

#### `getToken()`
- 저장된 액세스 토큰 조회
- 토큰이 없으면 `null` 반환
- API 요청 시 인증 헤더에 사용

#### `setToken(token: string)`
- 새로운 액세스 토큰 저장
- 로그인 성공 시 자동 호출
- 토큰 갱신 시에도 사용

#### `removeToken()`
- 저장된 액세스 토큰 삭제
- 로그아웃 시 자동 호출
- 인증 초기화에 사용

### 인증 흐름

1. **로그인 프로세스**
   - 사용자가 로그인 폼 제출
   - `authApi.login()` 호출
   - 성공 시:
     1. `tokenStorage.setToken()`으로 토큰 저장
     2. `dispatch(setUser())`로 Redux 상태 업데이트
     3. 사용자 리다이렉트

2. **인증 상태 확인**
   - Redux의 `isAuthenticated` 상태로 확인
   - `useSelector((state) => state.auth.isAuthenticated)`

3. **API 요청 시 인증**
   - `tokenStorage.getToken()`으로 토큰 가져옴
   - Authorization 헤더에 토큰 추가

4. **로그아웃 프로세스**
   - `authApi.logout()` 호출
   - 성공 시:
     1. `tokenStorage.removeToken()`으로 토큰 제거
     2. `dispatch(logout())`으로 Redux 상태 초기화
     3. 홈페이지로 리다이렉트

### 상태 저장 위치

1. **브라우저 저장소**
   - `localStorage`: Access Token
   - 새로고침해도 유지

2. **Redux Store**
   - 사용자 정보 (`user`)
   - 인증 상태 (`isAuthenticated`)
   - 로딩 상태 (`isLoading`)
   - 에러 메시지 (`error`)
   - 새로고침 시 초기화

3. **API 응답 구조**

    `로그인 응답`
    ```typescript
    interface LoginResponse {
    user: User;
    accessToken: string;
    }
    ```

    `토큰 갱신 응답`
    ```typescript
    interface RefreshResponse {
    accessToken: string;
    }
    ```
