# vans_story 다음 작업 계획 (2026-10-26)

## 0. 현재 상태

| 항목      | 상태                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 의존성    | 72개 → 48개. next 16.4.3, react 19.3.1, @tiptap 3.32.0. `npm audit` 48건(critical 6) → 5건(Tailwind 4·mermaid 12 major 건만)                          |
| Storybook | 제거 완료 (devDeps 8개, `.storybook/`, `src/stories/`, `storybook-static/` 27MB)                                                                      |
| 테스트    | `npm test` 9파일 89개 전부 통과. 테스트 중 외부 네트워크 호출 없음                                                                                    |
| 타입·빌드 | `tsc --noEmit` 오류 0, `next build` 통과(정적 페이지 95개)                                                                                            |
| 린트·서식 | ESLint 9 flat config + Prettier 도입(2026-10-26). error 0 유지, warn 기준선은 CONVENTIONS.md 13장                                                     |
| 구조      | `interfaces/`·`utils/`·`config/` 흡수, `app/` 비공개 폴더(`_components` 등), `about-van` 라우트 등 표준화 완료(2026-10-26). 상세는 CONVENTIONS.md 1장 |
| 미처리    | REVIEW_RECHECK.md 4장의 4~7단계, FRONTEND_AUDIT.md 1장(인증·보안)·3장(성능)·2-5(i18n)                                                                 |

## 1. 우선순위 원칙

**동작 결함(인증·보안) → 도구(린트) → 구조(중복 통합) → 대규모 마이그레이션(Tailwind 4) → 성능·i18n.**
의존성 정리는 끝났으니, 사용자에게 직접 영향이 있는 결함을 먼저 잡고, 그다음 리팩토링 중 실수를 잡아줄 린트를 세운 뒤, 가장 큰 구조 작업으로 들어간다. Tailwind 4는 파일 수가 줄어든 뒤에 해야 수정 범위가 작다.

FRONTEND_AUDIT.md의 보안·동작 지적은 코드 정적 분석 결과라서, **각 항목은 재현으로 확인한 뒤 수정한다.** 재현되지 않으면 그 항목은 닫는다.

## 2. 단계별 계획

### A. 인증 플로우 검증·복구 — FRONTEND_AUDIT 1-1, 1-2, 1-7 (완료 2026-10-26)

| 구분      | 내용                                                                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 재현      | ① 로그인 후 Spring이 내려준 Refresh 쿠키가 브라우저에 저장되는지 ② access 만료 상태(토큰 exp 조작)에서 `/api/auth/refresh`가 성공하는지 ③ 서버 로그아웃이 401일 때 `authFetch → refresh → logout` 재귀가 실제로 발생하는지 ④ OAuth 콜백이 `state` 없이도 통과하는지, JWT 디코딩 실패 시 `user@example.com`으로 로그인되는지                                        |
| 수정      | `login`/`callback` 라우트에서 `res.headers.getSetCookie()`를 응답에 그대로 전달. `refresh`/`logout` 라우트에서 들어온 `Cookie` 헤더를 백엔드로 전달. `authService.logout()`은 토큰 없는 `basicPost`로 보내고 `finally`에서 로컬 토큰 제거 + Redux 초기화. `oauthUtils.generateState/validateState`를 로그인 시작·콜백에 연결. JWT 디코딩 실패는 로그인 실패로 처리 |
| 완료 기준 | access 만료 후 첫 인증 요청이 refresh를 거쳐 성공. 서버 로그아웃 실패에도 클라이언트는 로그아웃 상태. 잘못된 `state` 콜백은 거부. 네 라우트에 vitest 추가(쿠키 전달 여부를 mock fetch로 검증)                                                                                                                                                                      |
| 대상 파일 | `src/app/api/auth/(server)/{login,refresh,logout}/route.ts`, `src/app/api/auth/callback/route.ts`, `src/components/features/auth/authService.ts`, `src/lib/api/apiFetch.ts`, `src/lib/auth/oauth.ts`, `src/app/oauth/callback/page.tsx`                                                                                                                            |

### B. 열린 BFF 라우트 잠그기 — FRONTEND_AUDIT 1-3, 1-4, 1-5, 5장 주식 (완료 2026-10-26)

| 구분      | 내용                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정      | `imageUpload`, `ai/chat` 라우트에 `Authorization` 필수 + 백엔드로 전달. `posts`, `search` 라우트는 토큰이 있으면 `cache: 'no-store'`, 없을 때만 `revalidate`. `post/view/[id]/page.tsx`의 상대경로 fetch는 공용 라우트를 D에서 통합하므로 여기서는 삭제 또는 절대 URL로 수정. 주식 라우트는 `symbol`을 `^\d{6}$` 또는 허용 목록으로 검증, 에러 응답에서 내부 `targetUrl` 제거, 상류 fetch에 `revalidate 30~60`, heatmap·KOSPI 선물 폴링은 `marketOpen`일 때만 |
| 완료 기준 | 토큰 없는 `imageUpload`/`ai/chat` 요청은 401. 심볼 주입(`..%2F`) 요청은 400. 라우트별 vitest 추가                                                                                                                                                                                                                                                                                                                                                             |
| 대상 파일 | `src/app/api/imageUpload/(server)/route.ts`, `src/app/api/ai/chat/route.ts`, `src/app/api/posts/route.ts`, `src/app/api/search/route.ts`, `src/app/api/stocks/kis/**`, `src/app/api/stocks/detail/route.ts`, `src/hooks/useSectorHeatmap.ts`, `src/components/features/stocks/KospiFuturesCard.tsx`                                                                                                                                                           |

결과: 재현(curl) → 토큰 없는 `imageUpload`/`ai/chat`가 하류로 그대로 전달, `kis/snapshot/..%2F..%2Fadmin`이 Django 경로에 삽입되고 에러 응답에 내부 URL 노출, `post/view/[id]`는 상대 경로 fetch. 수정 후 토큰 없음·만료·형식 불량 토큰은 401(`lib/api/requireAuth.ts`, 서명 검증은 백엔드 몫), 심볼 주입은 400(`lib/stocks/validateSymbol.ts`), 에러 응답에서 `url`·`details` 제거, posts·search는 토큰 있으면 `no-store`, 주식 상류 fetch는 `revalidate 30~60`, heatmap·KOSPI 선물 폴링은 장이 열렸을 때만. AI 채팅 창은 비로그인 시 "로그인 후 이용할 수 있습니다." 테스트 4파일 44개 추가.
남김: 하류(이미지·AI 서비스)는 여전히 X-API-Key만 보므로 BFF 가드가 유일한 문이다. JWT 서명까지 BFF에서 검증하려면 User BE에 introspection 엔드포인트가 필요하다(별도 과제).

### C. ESLint 9 flat config — REVIEW_RECHECK 4단계 (완료 2026-10-26)

| 구분      | 내용                                                                                                                                                                                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 수정      | `npm i -D eslint@9 eslint-config-next@16.4.3`, `eslint.config.mjs` 생성, `"lint": "eslint ."`로 교체(현재 `next lint`는 Next 16에서 제거된 명령). `import/no-extraneous-dependencies`로 선언 없는 패키지 사용 재발 방지. `package.json`에 `engines.node >= 22.12`, `.nvmrc` 추가 |
| 완료 기준 | `npm run lint`가 동작. 기존 위반(`any` 54곳, `console.log` 83곳)은 `warn`으로 시작하고 D 단계에서 통합되는 파일부터 정리                                                                                                                                                         |

### D. 카테고리 컴포넌트 통합 — REVIEW_RECHECK 2-3 (2~3일, 가장 큰 작업)

순서가 중요하다. 타입을 먼저 하나로 만들어야 뒤 단계에서 `Post`/`PostInfo` 불일치를 만나지 않는다.

1. **타입 통일**: `interfaces/post/types.ts`를 없애고 `types/post.ts` 하나로. `SubCategoryOption`(3곳), `MainCategoryOption`(2곳)도 한 곳으로. 11개 import 경로 수정
2. **`THEME_CONFIG[mainCategory]`** 객체 생성: 아이콘, 색상 hex, 배경 영상 경로, 링크 prefix, PostCard 대체 이미지, Sidebar 스타일 props. `interfaces/post/categories.ts`의 `main_categories`와 키를 맞춘다
3. **동적 라우트 1세트**: `app/post/view/[mainCategory]/page.tsx`, `[id]/page.tsx`, `category/[category]/page.tsx`. 모르는 `mainCategory`는 `notFound()`. `[id]`는 전 카테고리에서 ObjectId 검증 + `notFound()`
4. **단일 컴포넌트**: `PostLayout`(props `{ children, title?, isPreview? }`), `PostList`(정렬 select + 10개 slice 기본, JWT의 클라이언트 재fetch 제거), `PostCard`(테마는 `THEME_CONFIG`에서, `renderBadge?: (post) => ReactNode`로 통일), `PostSidebar`(`BaseSidebar` + `THEME_CONFIG`)
5. **소비자 교체**: `PostPreview.tsx`, `EditorPreview.tsx`가 9개씩 import하던 것을 단일 컴포넌트 + `THEME_CONFIG`로
6. **삭제**: `app/post/view/{nextjs,…,database-theory}/` 9개 디렉터리, `postcard/*/PostCard.tsx` 10개, `sidebar/post/*Sidebar.tsx` 9개, 공용 `view/[id]/page.tsx`와 `ViewPostHeader/Content`(3단계와 중복)
7. **죽은 코드**: `hooks/useCategories.ts`(import 0), `CursorRipple.tsx`·`AdvancedCursorRipple.tsx`(import 0), `Header.tsx`의 `isStorybook` prop, `SidebarWrapper`와 `useSidebarMargin` 중 하나, `utils/errorHandling.ts`를 `lib/errorHandler.ts`로 흡수
8. **`main_categories` 정리**: 라우트가 없는 `jest, cypress, git, junit5` 제거(또는 `THEME_CONFIG`에 추가해 페이지 생성)

| 완료 기준 | 9개 카테고리 × 3페이지(목록·카테고리별 목록·상세) 시각 확인, 정렬·notFound 동작이 전 카테고리 동일, 파일 64개 → 10개 내외. `THEME_CONFIG` 키 집합 = `main_categories` 경로 집합을 검증하는 테스트 추가 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 위험      | 중간. 카테고리별 배경 영상·색상 회귀. 통합 전 각 페이지 스크린샷을 기준선으로 남긴다(Playwright `e2e/`에 추가)                                                                                         |

### E. 의존성 major — REVIEW_RECHECK 6단계, Storybook 제외 (반나절)

| 패키지                                        | 메모                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `lucide-react` 0.575 → 1.61                   | 사용 중 24개 아이콘 전부 일반 아이콘, 영향 없음                       |
| `@types/node` 22 → 26                         | 런타임이 Node 26                                                      |
| `jsdom` 27 → 30                               | 컴포넌트 테스트 4개만 사용                                            |
| `emoji-picker-react` 4 → 5, `mermaid` 10 → 12 | 릴리스 노트 확인 후. 이모지 삽입·projects 페이지 다이어그램 수동 확인 |

각각 `tsc` + `npm test` + 해당 화면 확인.

### F. Tailwind 4 — REVIEW_RECHECK 7단계 (별도 브랜치, 1일)

`npx @tailwindcss/upgrade` → `tailwind.config.js`의 keyframes/animation/fontFamily를 `globals.css`의 `@theme`로 → `@tailwindcss/postcss`로 교체, `autoprefixer` 삭제 → `!important` 접두 문법 139곳 결과 확인 → 전 페이지 시각 확인. **D 이후에** 해야 수정 대상 파일이 적다.

### G. 성능·i18n — FRONTEND_AUDIT 3장, 2-5 (이후)

- 배경 영상 `preload="none"` + `poster`, `prefers-reduced-motion`에서 비활성. `public/` 38MB 정리
- 에디터용 Google 폰트 8종을 `post/new`·`post/edit`에만 로드
- Viewer는 에디터 extension 대신 읽기 전용 경량 세트, highlight.js 언어는 한 곳에서만 등록
- 게임 12개 `dynamic()` import, 음소거 상태를 전역으로
- i18n: `next-intl` 같은 라우팅 기반으로 교체하거나 최소한 하드코딩 문자열 정리, `src/messages/ko.json`·`en.json`은 `constants/mainCategories.ts`가 하위 카테고리 목록에 사용 중(미사용 아님). `messages/<lang>/*.json`과 중복이므로 한쪽으로 통합

### 보류

- **TypeScript 7**: 아래 5장 조사 결과 참조. C(ESLint)·D(통합) 이후 별도 브랜치에서 진행
- **Storybook 재도입**: D가 끝나 공유 UI가 정리된 뒤 필요하면 Storybook 10 + `@storybook/nextjs-vite`로 새로 구성

## 3. 진행 순서 요약

| 순서 | 단계             | 예상   | 위험 | 확인                                            |
| ---- | ---------------- | ------ | ---- | ----------------------------------------------- |
| 1    | A 인증 복구      | 1일    | 중간 | 로그인·만료·로그아웃·OAuth 수동 + 라우트 vitest |
| 2    | B 라우트 잠그기  | 1일    | 낮음 | 401/400 응답 vitest, 주식 대시보드 수동         |
| 3    | C ESLint         | 반나절 | 낮음 | `npm run lint`                                  |
| 4    | D 컴포넌트 통합  | 2~3일  | 중간 | 27페이지 시각 확인, 파일 수                     |
| 5    | E major 업데이트 | 반나절 | 낮음 | tsc·test·해당 화면                              |
| 6    | F Tailwind 4     | 1일    | 높음 | 전 페이지 시각 확인                             |
| 7    | G 성능·i18n      | 이후   | 낮음 | Lighthouse, 번들 크기                           |

단계마다 커밋을 나누고, 매 단계 끝에 `npm test`와 `npm run build`를 통과시킨다.

## 4. 바로 다음 작업 (A 시작 체크리스트)

### 4-1. 재현 결과 (2026-10-26, mock Spring + `next dev`)

로컬 Spring 대신 `AuthService.kt`와 같은 헤더·쿠키 형식(`Set-Cookie: refreshToken=…; Path=/api/v1/auth/refresh; Secure; HttpOnly; SameSite=Strict`)을 돌려주는 mock을 `localhost:8080`에 띄우고, `.env`의 `AUTH_API_URL=http://localhost:8080/api/v1` 그대로 `next dev`를 통해 재현했다. mock은 받은 요청의 `Authorization`·`Cookie` 헤더를 기록한다.

| #   | 항목                                                     | 결과                      | 근거                                                                                                                                                                                                                                                                                                                                                     |
| --- | -------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ①   | 로그인 후 Refresh 쿠키가 브라우저에 저장되는가           | **재현 (저장 안 됨)**     | `POST /api/auth/login` 응답에 `authorization`만 있고 `set-cookie` 없음. 라우트가 `Set-Cookie`를 복사하지 않는다                                                                                                                                                                                                                                          |
| ①'  | OAuth 교환(`/api/auth/callback`) 쿠키                    | **재현 (저장돼도 못 씀)** | `set-cookie`는 전달되지만 `Path=/api/v1/auth/refresh`(백엔드 경로) 그대로라 프론트의 `/api/auth/refresh` 요청에는 브라우저가 붙이지 않는다                                                                                                                                                                                                               |
| ②   | access 만료 → `/api/auth/refresh` 성공하는가             | **재현 (항상 400)**       | 브라우저가 쿠키를 보내도 refresh 라우트가 `Cookie` 헤더를 백엔드로 넘기지 않음. mock 로그: `POST /api/v1/auth/refresh cookie: null` → Spring `@CookieValue` 누락으로 400. 따라서 어떤 401이든 refresh 실패 → 강제 로그아웃                                                                                                                               |
| ③   | 서버 로그아웃 401 시 `authFetch → refresh → logout` 재귀 | **조건부 재현**           | mock 로그아웃을 401로 두고 헤더의 로그아웃 클릭 → 3초 만에 logout 396회 + refresh 395회 무한 반복, 콘솔에 `logout → authFetch → logout …` 스택. 단, 현재 Spring은 `/api/v1/auth/logout`이 `permitAll` + `JwtFilter` 스킵이라 401을 내지 않으므로 **운영에서는 트리거되지 않는 잠재 결함**. 로그아웃 실패 시 로컬 토큰·Redux도 그대로 남는 것은 별도 문제 |
| ④   | OAuth 콜백이 `state` 없이 통과하는가                     | **재현 (통과)**           | `/oauth/callback?code=good` 만으로 로그인 완료. `oauthUtils.generateState/validateState`는 호출처 0곳. OAuth 중간 서버(`vans_devblog_oauth`)는 자기↔Google/Kakao 사이 state만 검증하고 프론트로는 `?code=`만 리다이렉트하므로, 프론트↔중간 서버 사이 CSRF 방어가 없다. `provider`도 안 넘어와서 항상 "카카오 로그인이 완료되었습니다"로 표시됨           |
| ④'  | JWT 디코딩 실패 시 `user@example.com`으로 로그인         | **재현**                  | 백엔드가 `not.a.jwt`를 돌려주면 `localStorage.accessToken='not.a.jwt'`, 환영 문구 "환영합니다, User님", Redux `isAuthenticated=true`. 새로고침 후 `checkAuth`는 실패하지만 깨진 토큰은 남아 모든 인증 요청에 `Bearer not.a.jwt`로 붙는다                                                                                                                 |

부수 관찰: dev(StrictMode)에서 `/oauth/callback` effect가 두 번 실행돼 `/oauth/exchange`가 같은 code로 2회 호출된다. 운영(일회용 코드)에서는 1회지만 effect에 가드가 없다.

### 4-2. 수정 결과 (2026-10-26 완료, mock Spring + 브라우저로 재검증)

- [x] `login`·`callback` 라우트: 백엔드 `Set-Cookie`를 `getSetCookie()`로 전부 전달하되 `Path`를 `/api/auth/refresh`로 바꿔서 전달 (`Secure`는 localhost 예외로 dev에서도 동작)
- [x] `refresh`·`logout` 라우트: 들어온 `Cookie` 헤더를 백엔드로 전달, 백엔드 `Set-Cookie`(갱신·만료)도 같은 규칙으로 전달
- [x] `authService.logout()`: `basicPost`(401 → refresh 경로 없음) + `finally`에서 `tokenStorage.removeToken()`; `AuthButtons`는 실패해도 `dispatch(logout())`
- [x] `exchangeCodeForToken`·`oauth/callback/page.tsx`: JWT 디코딩 실패 = 로그인 실패(토큰 저장 안 함). 중복 구현 두 벌을 하나로
- [x] OAuth `state`: 프론트가 생성해 `sessionStorage`에 두고 중간 서버로 넘김 → 중간 서버가 `/oauth/callback?code=&state=&provider=`로 되돌려줌 → 프론트가 검증. **`vans_devblog_oauth` 변경 필요**(별도 커밋)
- [x] 네 라우트 + `authService.logout` vitest (mock fetch로 쿠키 전달·재귀 없음 검증)

검증: BFF 경유 로그인·OAuth 교환 응답에 `Path=/api/auth`로 바뀐 refreshToken 쿠키가 실림 → 브라우저가 `/api/auth/refresh`에 쿠키를 보내고 백엔드가 받음(200, 새 토큰). state 없는 `/oauth/callback?code=`는 거부, 일치하는 state는 로그인 성공(provider 표시도 정확). 서버 로그아웃 401에서도 logout 요청 1회로 끝나고 클라이언트는 로그아웃 상태. 헬퍼 `lib/auth/refreshCookie.ts`, 테스트 4파일 31개 추가.
**배포 순서**: `vans_devblog_oauth`(state 통과) 먼저, 그다음 `vans_story`. 프론트가 먼저 나가면 중간 서버가 state를 안 돌려줘 모든 OAuth 로그인이 거부된다.

## 5. TypeScript 7 조사 결과 (2026-10-26)

| 확인 항목                 | 결과                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TS 7 패키지 구성          | Go로 다시 쓴 네이티브 컴파일러. `typescript@7.0.2`는 플랫폼별 바이너리 20개 + `bin/tsc` 로더만 포함. JS 컴파일러 API(`lib/typescript.js`)와 tsserver JS가 없음                                                                                                                                                                                                                                                         |
| Next 16.4.3 빌드 타입체크 | `node_modules/next/dist/lib/typescript/runTypeCheck.js`가 `typescript.createProgram` / `getPreEmitDiagnostics`(JS API)를 호출. TS 7 설치 시 `TypeScript 7.0.2 does not provide the compiler API required by Next.js. Set experimental.useTypeScriptCli back to true…` 에러. 우회: `next.config.ts`에 `experimental.useTypeScriptCli: true`(tsc 프로세스로 검사). Next의 자동 설치 권장 범위는 아직 `typescript@^6.0.0` |
| 이 프로젝트 tsconfig      | `npx -p typescript@7.0.2 tsc --noEmit` → `TS5102: Option 'baseUrl' has been removed` 즉시 실패. `npx -p typescript@6.0.3 tsc --noEmit` → `TS5101: 'baseUrl' is deprecated and will stop functioning in 7.0`. `paths`가 이미 `./src/*` 상대 경로라 `baseUrl` 한 줄만 지우면 됨                                                                                                                                          |
| 미확인                    | `plugins: [{ name: "next" }]` 언어 서비스 플러그인이 네이티브 tsserver에서 동작하는지. C단계에서 넣을 typescript-eslint(JS API 의존)의 TS 7 호환 여부                                                                                                                                                                                                                                                                  |
| 속도                      | 같은 프로젝트 `tsc --noEmit`: TS 5.9.3 약 32초, TS 7.0.2 약 17초(npx 다운로드 포함)                                                                                                                                                                                                                                                                                                                                    |

진행 순서:

1. (언제든) `tsconfig.json`에서 `baseUrl` 제거 — 5.9에서도 무해, 6·7 전환의 선행 조건
2. (E단계에 포함) `typescript@6.0.3`으로 브리지 전환 — 기존 JS 엔진 그대로, 7에서 사라질 옵션만 경고
3. (C·D 이후, 별도 브랜치) `typescript@7` + `experimental.useTypeScriptCli: true` → `next build`, `next dev`(에디터 플러그인), `npm run lint`를 한 번에 검증
