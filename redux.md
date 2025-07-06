# Redux 상태 관리

## 구조

프로젝트의 Redux 상태 관리는 `src/store` 디렉토리에서 관리되며, 다음과 같은 구조로 구성되어 있습니다:

```
src/store/
├── auth/           # 인증 관련 상태 관리
├── i18n/           # 다국어 지원 상태 관리
├── modal/          # 모달 상태 관리
├── store.ts        # 스토어 설정
├── providers.tsx   # Redux Provider 설정
└── hooks.ts        # 타입 안전한 커스텀 훅
```

## 주요 기능

### 1. 인증 상태 관리 (auth)

- 사용자 인증 상태 관리
- 로그인/로그아웃 처리
- OAuth 인증 흐름 관리
- JWT 토큰 기반 인증 상태 유지

주요 상태:
```typescript
interface AuthState {
  user: { email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  oauthLoading: boolean;
  oauthProvider: OAuthProvider | null;
  oauthError: string | null;
}
```

### 2. 다국어 지원 (i18n)

- 한국어/영어 언어 설정 관리
- 언어 전환 기능

상태 구조:
```typescript
interface I18nState {
  locale: 'ko' | 'en';
}
```

### 3. 모달 상태 관리 (modal)

- 로그인 모달의 표시 상태 관리
- 모달 열기/닫기 액션 처리

상태 구조:
```typescript
interface ModalState {
  isLoginModalOpen: boolean;
}
```

## 타입 안전한 사용

프로젝트는 TypeScript와 함께 Redux를 사용하며, 타입 안전성을 보장하기 위한 커스텀 훅을 제공합니다:

```typescript
// 타입이 지정된 디스패치 훅
const useAppDispatch = () => useDispatch<AppDispatch>();

// 타입이 지정된 셀렉터 훅
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 사용 예시

```typescript
// 컴포넌트에서 사용
const Component = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  // 액션 디스패치
  const handleLogin = () => {
    dispatch(loginStart());
  };
  
  // 상태 사용
  if (user) {
    return <div>Welcome, {user.email}!</div>;
  }
  
  return <button onClick={handleLogin}>Login</button>;
};
```

## 주의사항

1. 상태 변경은 반드시 리듀서를 통해서만 수행
2. 비동기 작업은 컴포넌트나 커스텀 훅에서 처리
3. 민감한 정보(토큰 등)는 localStorage에 저장하고 상태에는 최소한의 정보만 유지 