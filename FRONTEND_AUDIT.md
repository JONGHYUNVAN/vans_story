# vans_story 프론트엔드 진단 보고서 (2026-10-26)

대상: `D:/blog/vans_story` (Next.js 16.1.6, React 19.2, TypeScript, Redux Toolkit, Tailwind 3, TipTap 3)
규모: `src/` 320개 TS/TSX 파일, 약 42,000줄. 그중 155개 파일이 `'use client'`.

---

## 1. 즉시 고쳐야 하는 것 (보안 · 동작 불능)

### 1-1. Refresh 토큰 플로우가 구조적으로 동작하지 않음

- `src/app/api/auth/(server)/login/route.ts` — Spring이 내려준 `Set-Cookie`(Refresh Token)를 브라우저로 **전달하지 않음**. 새 `NextResponse`에 `Authorization`만 복사한다.
- `src/app/api/auth/(server)/refresh/route.ts` — 서버→서버 fetch에 `credentials: 'include'`를 줘도 **브라우저 쿠키는 전달되지 않는다**. 들어온 요청의 `Cookie` 헤더를 읽어 Spring으로 넘기는 코드가 없다.
- 결과: Access 토큰(5시간) 만료 후 모든 인증 요청이 401 → refresh 항상 실패.
- 수정: login/callback 라우트에서 `res.headers.getSetCookie()`를 응답에 그대로 붙이고, refresh/logout 라우트에서 `request.headers.get('cookie')`를 백엔드로 전달. 아니면 Refresh 쿠키를 Next가 직접 `httpOnly`로 발급하도록 설계 변경.

### 1-2. 토큰 만료 후 "로그인 상태에 갇힘" + 무한 재귀 가능

- `src/components/features/auth/authService.ts:73` — `logout()`이 `ApiFetch.postWithAuth`를 쓴다. `authFetch`는 401이면 refresh → 실패 시 **다시 `authService.logout()` 호출** (`src/lib/apiFetch.ts:84`) → 다시 401 → … 재귀.
- `logout()`은 `!res.ok`면 throw하고 `tokenStorage.removeToken()`에 도달하지 않는다. `AuthButtons.tsx`는 catch에서 로그만 남기므로 Redux `logout()`도 dispatch되지 않는다.
- 결과: 서버 로그아웃이 실패하면 사용자는 영원히 "로그인됨"으로 보이고, 1-1과 결합되면 5시간 뒤 모든 로그인 사용자가 이 상태가 된다.
- 수정: 로그아웃은 토큰 없는 `basicPost`로 보내고, 서버 응답과 무관하게 `finally`에서 로컬 토큰 제거 + Redux 초기화.

### 1-3. 누구나 호출 가능한 BFF 라우트가 비용/저장소를 노출

- `src/app/api/imageUpload/(server)/route.ts` — 인증 검사도, `Authorization` 전달도 없다. 서버가 `X-API-Key`를 대신 붙여주므로 **인터넷상의 누구나 S3에 이미지를 업로드**할 수 있다.
- `src/app/api/ai/chat/route.ts` — 토큰이 없어도 통과시키며, `AiChatWindow.tsx:107`은 일부러 토큰 없는 `sendChatMessageDirect`를 쓴다. **누구나 OpenAI 비용을 발생**시킬 수 있다 (하류 3003 서비스가 막지 않는 한).
- 수정: 두 라우트 모두 `Authorization` 필수 + 백엔드로 전달, 또는 최소한 Rate limit.

### 1-4. 인증된 응답이 익명 사용자에게 캐시될 수 있음

- `src/app/api/posts/route.ts:19` — `Authorization` 헤더를 포함한 fetch에 `next: { revalidate: 60 }`. Next의 Data Cache는 **헤더를 캐시 키에 넣지 않으므로** 로그인 사용자 기준 응답(비공개/초안 포함 가능)이 60초간 모두에게 재사용될 수 있다. `src/app/api/search/route.ts:36`도 동일.
- 수정: 토큰이 있으면 `cache: 'no-store'`, 없을 때만 revalidate.

### 1-5. 죽어 있는 라우트: 서버 컴포넌트에서 상대경로 fetch

- `src/app/post/view/[id]/page.tsx:11` — `fetch('/api/posts/${id}')`. 서버 컴포넌트에서 상대 URL은 `Invalid URL`로 예외. `/post/view/<id>` 접근 시 항상 에러 페이지.

### 1-6. XSS 표면 + localStorage JWT

- `dangerouslySetInnerHTML` 4곳: `SearchResultItem.tsx:16, 27`(백엔드 하이라이트 HTML 그대로), `AutocompleteInput.tsx:249`, `MermaidDiagram.tsx:94`. sanitize 없음.
- 토큰이 `localStorage`(`src/utils/token.ts`)에 있으므로 XSS 한 건이 곧 세션 탈취.
- 수정: 검색 하이라이트는 `<em>`만 허용하는 토큰 파서로 교체(또는 DOMPurify), 토큰은 httpOnly 쿠키로 이동.

### 1-7. OAuth CSRF 방어 부재 · 가짜 사용자 로그인

- `oauthUtils.generateState / validateState`(`src/utils/oauth.ts`)는 **아무 데서도 호출되지 않는다**. 콜백은 `code`만 있으면 교환한다.
- `authService.exchangeCodeForToken`과 `src/app/oauth/callback/page.tsx:72` — JWT 디코딩 실패 시 `user@example.com / User`로 **로그인 성공 처리**.
- `src/app/api/auth/callback/route.ts:55` — `headers.get('Set-Cookie')`는 여러 쿠키를 콤마로 합친다. `getSetCookie()` 사용.

### 1-8. 조회수 로직이 서로 맞지 않음

- `ViewCountHandler.tsx`는 쿠키/세션에 본 글 목록을 **저장만** 한다.
- 서버 `getPostWithViewCount(id)`(`src/lib/posts/client-actions.ts:85`)는 9개 상세 페이지 모두에서 `hasViewed` 인자 없이 호출되어 `x-viewed: false` 고정. `cookies()`를 읽는 곳이 없다 → 새로고침마다 조회수 증가.

### 1-9. 의존성 취약점 48건 (critical 6)

`npm audit`: next 16.1.6(RSC DoS, Middleware/Proxy bypass), storybook, vitest, @tiptap/core, prosemirror-view(붙여넣기 XSS), dompurify, axios 등. `next 16.4.3`, `@tiptap/* 3.32`로 올리면 상당수 해소.

---

## 2. 구조 문제 (유지보수 비용의 근원)

### 2-1. 카테고리당 파일 복제 — 약 60개 파일이 사실상 같은 코드

- `src/app/post/view/{nextjs,nestjs,spring,mariadb,mongodb,docker,jwt,algorithm,database-theory}/` 각 5개 파일(`page`, `[id]/page`, `category/[category]/page`, `XxxLayout`, `XxxList`)
- `src/components/ui/post/postcard/*/PostCard.tsx` 10개, `src/components/layout/sidebar/post/*Sidebar.tsx` 9개
- `diff NextjsList.tsx SpringList.tsx`: 아이콘·링크 경로·정렬 UI 유무만 다름. Sidebar diff: 색상 props만 다름.
- 부작용: `main_categories`에 있는 `jest, cypress, git, junit5`는 **페이지가 없어 404**. 기능 하나 고치면 9~10곳을 고쳐야 함(최근 커밋 2건이 그 예).
- 수정: `src/app/post/view/[mainCategory]/…` 동적 세그먼트 1세트 + `THEME_CONFIG[mainCategory]`(아이콘, 색, 배경 영상) 객체.

### 2-2. 카테고리 "진실의 원천"이 4곳

`interfaces/post/categories.ts`(main_categories, THEME_SIDEBARS), `constants/mainCategories.ts`(CATEGORY_GROUPS), i18n `messages/*/tech/*.json`(하위 카테고리), 백엔드 `/api/categories`. `useSubCategories`는 i18n에서 읽고, 저장 시 `resolveCategoryIds`가 다시 API에 매핑한다. 최근 커밋(`bb0e518`, `211fdd0`)은 이 불일치의 땜질이다. 백엔드 API 하나로 통일해야 한다.

### 2-3. Rules of Hooks 위반 + 쓰지 않는 계산

- `NextjsLayout.tsx:14` 등 2곳: `isPreview ? {...} : useSidebarMargin()` — 조건부 훅 호출. 계산한 `shouldApplyMargin`은 JSX에서 쓰지도 않는다.
- `SidebarWrapper.tsx`와 `hooks/useSidebarMargin.ts`는 같은 로직의 중복.

### 2-4. 만들어 둔 공통 모듈을 안 씀

- `src/lib/apiProxy.ts`(proxyGet/Post/Patch/Delete, 에러 핸들러 포함)가 있지만 **어떤 API 라우트도 사용하지 않고** 각자 fetch를 복붙했다. 에러 응답 형식도 라우트마다 다르다(`null` body / `{error}` / `{success:false,error:{message}}`).
- `API_CONFIG.ENV_DEFAULTS.AUTH_API_URL = 'http://localhost:3000/api'`(자기 자신) 등 죽은 설정.
- `API_URLS.OAUTH.BACKEND_UNLINK/LINKED = '/api/v1/oauth/…'`는 Next에 존재하지 않는 경로 → 항상 404 (사용처 `OAuthAccountManager`도 미사용).

### 2-5. i18n이 반쪽

- `src/messages/ko.json`, `en.json`은 **미사용** 중복(실제는 `messages/ko/*.json`).
- locale이 Redux에만 있어 SSR/URL/`<html lang>`에 반영되지 않음(`layout.tsx`는 `lang="ko"` 고정). 서버 컴포넌트 페이지(`[id]/page.tsx`의 "작성자/주제/조회수")와 `Header.tsx`의 "주가/게임", `error.tsx`, `usePost` 검증 메시지 등은 한국어 하드코딩.

### 2-6. 기타 코드 품질

- `any` 54곳, `console.log` 83곳(API 라우트 16곳 포함 — 요청 본문/응답 데이터를 프로덕션 로그에 남김), `@ts-ignore/eslint-disable` 10곳.
- `usePost.ts` 407줄 god hook; `TypingGame.tsx` 1,875줄.
- `ApiFetch.basicFetch`(`apiFetch.ts:20`) — `...options`를 `headers` 뒤에 spread하여 `options.headers`가 있으면 `Content-Type`이 사라진다.
- `getPostList`는 모든 에러를 삼키고 `[]`를 반환 → 백엔드 장애 시 "게시글이 없습니다"가 60초 캐시된다.
- `error.tsx`는 메시지에 `'404'`가 들어가면 "준비 중 / 열심히 개발 중" 화면을 보여준다 → 없는 포스트, 백엔드 404가 모두 "개발 중"으로 표시. 그 화면의 `/post` 링크도 존재하지 않는 경로.
- `Redux store`가 모듈 싱글턴(`store/store.ts`) → SSR 요청 간 공유. `checkAuth` 리듀서가 `localStorage`를 직접 읽음(리듀서 안의 부수효과).
- `'use client'`가 320개 중 155개. 포스트 상세 같은 콘텐츠 페이지도 사실상 전부 클라이언트 렌더.

---

## 3. 성능

- **배경 영상**: 홈 3.2MB, 회원가입 3.6MB, 카테고리 페이지마다 0.9~1.7MB `webm`을 `autoPlay`로 로드. `public/`이 38MB. `preload="none"` + `poster`, 모바일/`prefers-reduced-motion`에서 비활성 필요.
- **폰트**: `src/app/post/layout.tsx`가 Google 모노스페이스 폰트 **8종**을 포스트 전 페이지(뷰어 포함)에 로드. 에디터에서만 필요.
- **뷰어가 에디터 번들을 통째로 포함**: `Viewer.tsx:24`가 `EditorExtensions`(ResizableDraggableImage, AiDiffBlock, Youtube, Table…)를 그대로 쓰고, highlight.js 20개 언어를 `Viewer.tsx`와 `EditorExtensions.tsx` 양쪽에서 정적 import. 읽기 전용 뷰어는 별도 경량 extension 세트가 맞다.
- `Header.tsx:62`의 `<img src="/favicon.ico">`, PostCard의 `<img>` — `next/image` 미사용.
- 아이콘 라이브러리 2개 혼용: `react-icons` 44파일, `lucide-react` 11파일.

---

## 4. 툴링 · 레포 위생

| 항목           | 상태                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint` | `next lint`는 Next 16에서 제거됨 + eslint 미설치 → **린트가 아예 없음**                                                          |
| `npm test`     | 스크립트 없음 (vitest/playwright 설정 파일만 존재). 직접 실행 시 **16 failed / 58 passed** — 5장 참조                            |
| `tsc --noEmit` | **실패** — `stocks/__tests__/MacroPanel.test.tsx`, `MarketStatusBadge.test.tsx` 5건 (테스트가 현재 컴포넌트 props와 불일치)      |
| git 추적       | `storybook-static/` 261파일 27MB, `test-results/`, `.idea/` 커밋됨 → `.gitignore` 추가 후 `git rm --cached`                      |
| 미사용 의존성  | `jotai`, `axios`, `js-cookie`(+types), `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `flag-icons` — 코드에서 import 0건 |
| 버전           | Node 26 환경에 `@types/node` 22; `@storybook/blocks` 9.0.0-alpha.17 고정; Tailwind 3(4 미이행)                                   |
| 로컬 env       | `.env.local`에 `DJANGO_API_URL` 중복 정의                                                                                        |

---

## 5. 주식 대시보드 · 게임 영역

### 주식 (`src/app/api/stocks/**`, `src/app/stocks/**`, `components/features/stocks/**`)

- **열린 프록시**: 11개 라우트 모두 인증·Rate limit·캐시 없음(전부 `cache: 'no-store'`). 대시보드 1회 로드에 Yahoo/CNN/Google/Naver 상류 호출 약 57건, 이후 heatmap·KOSPI 선물이 장 마감 여부와 무관하게 **60초마다 24시간 폴링**(`useSectorHeatmap.ts:36`, `KospiFuturesCard.tsx:41`). 익명 사용자가 Yahoo/Naver 프록시로 쓸 수 있다. → 상류 fetch에 `revalidate 30~60`, 폴링은 `marketOpen`일 때만, `symbol`은 허용 목록으로 제한.
- **경로 주입**: `kis/stream/[symbol]/route.ts:26`, `kis/snapshot/[symbol]/route.ts:11`, `detail/route.ts:120,147,176` — URL의 `symbol`을 검증 없이 Django/Naver 경로에 그대로 삽입(`..%2F` 가능). 에러 응답에 내부 `targetUrl`도 노출. → `^\d{6}$` 검증, 내부 URL 응답 제거.
- `kis/stream`과 `kis/snapshot`의 `DJANGO_API_URL` 기본값이 서로 다름(`:8000` vs `:8001`).
- `useKisRealtime.ts:74-83` — 서버가 `event: error` 프레임을 보내면 named listener와 `onerror`가 **둘 다** 발화 → 상류 에러 메시지 하나에 연결이 끊기고 백오프 재접속 시작. 이벤트 이름을 바꿔야 한다.
- `useStockDetail.ts`, `PriceChart.tsx`, `NewsSection.tsx` — 심볼/기간 빠른 전환 시 늦게 온 이전 응답이 최신 상태를 덮어씀(AbortController 없음).
- `marketHours.ts`와 `types/stocks.ts`에 `MarketState` 타입이 2개, `useStocksData.ts`가 장 시간 판정을 다시 구현(초기값과 1분 tick의 KR PRE 처리가 서로 다름). 휴장일 처리 전무.
- `detail/route.ts:371` — Naver 응답에 `closePrice` 없으면 `.replace` 예외로 전체 500; 모든 종목에 `.KS` 접미(KOSDAQ 오류).
- `stocks/[symbol]/page.tsx:46` — 모르는 심볼에 200으로 "not found" 렌더(`notFound()` 미사용).
- `DART_API_KEY`는 쿼리스트링으로 전송(서버 전용이라 영향은 낮음), fetch 타임아웃 없음.

### 게임 (`src/app/games/**`, `components/features/games/**`)

- **음소거가 게임 내 효과음에 적용 안 됨**: 각 게임이 `useSound()` 인스턴스를 따로 만들고(`SnakeGame.tsx:92` 등 12곳) 훅은 마운트 시 `localStorage`를 한 번만 읽음. 레이아웃의 토글은 다른 인스턴스를 바꾼다. → 전역 상태(context/`useSyncExternalStore`)로 승격.
- **번들**: `GamePageClient.tsx:11-22`가 12개 게임을 정적 import(TypingGame만 dynamic) → `/games/*` 어디서나 약 6천 줄 + highlight.js 로드. 전부 `dynamic()`으로.
- `useBGM.ts:574` — 사용자 제스처 없이 마운트 400ms 후 자동 재생 시도 → 대개 무음인 채로 30ms `setTimeout` 루프가 suspended 컨텍스트에 오실레이터를 계속 생성. `useSound`/`useBGM`이 `AudioContext`를 각각 생성(브라우저 동시 컨텍스트 상한).
- `useScreenShake.ts` — rAF 루프 언마운트 시 미취소, `'use client'` 누락. `useGameSize.ts:20`(180px) vs `GameOverlayController.tsx:229`(200px) 높이 불일치로 모바일에서 캔버스가 패드와 겹침.
- `TypingGame.tsx` 1,875줄: 스니펫 데이터 ~500줄, 키보드 가이드 컴포넌트, 15 `useState`/13 `useEffect`가 한 파일. 시작/게임오버 오버레이는 12개 파일에 각자 구현. `GameComponentProps`를 모든 게임이 page 파일에서 import(순환).
- 한/영 문구 혼재(`MarketStatusBadge` 장중/Open, `FlappyGame` GAME OVER 등).

### 테스트 실행 결과 (`npx vitest run --config vitest.unit.config.ts`, PowerShell)

```
Test Files  5 failed | 4 passed (9)
     Tests  16 failed | 58 passed (74)
```

실패 16건은 모두 **코드가 바뀐 뒤 갱신되지 않은 테스트**: Yahoo v7 mock(라우트는 v8만 사용), 뉴스 기본 limit 5→8, MACRO_SYMBOLS 7→9, `MarketStatusBadge` props `isOpen`→`state/market`. `news.test.ts`는 mock이 첫 fetch만 덮어 나머지는 실제 네트워크를 호출한다.

### 범위에 대한 메모

증권사 스타일 대시보드(14 라우트, KIS 실시간, DART, Naver 스크래핑)와 아케이드 게임 13종은 기술 블로그와 무관한 큰 표면이다. 클라이언트 번들을 두 배로 키우고, 인증 없이 외부 API를 치는 유일한 영역이기도 하다. 별도 앱 또는 최소한 자체 레이아웃·예산을 가진 라우트 그룹으로 분리하는 편이 낫다.

### 잘 된 점

- 주식 라우트는 `StocksApiResponse` 판별 유니온으로 일관되게 응답하고 `Promise.allSettled`로 부분 실패를 흡수한다.
- `useGameLoop`/`useGameTimer`는 ref-callback 패턴과 rAF/interval 정리가 올바르다.
- `GamePageClient.tsx:113-130`은 점수 리렌더를 프레임당 1회로 제한하고 언마운트 시 rAF를 취소한다.
- `PriceChart.tsx:146`은 부모 콜백을 ref에 두어 effect가 `symbol`/`range`에서만 재실행된다.

---

## 6. 권장 순서

1. **인증 플로우 복구** (1-1, 1-2, 1-7): 쿠키 전달, 로그아웃 토큰 제거, state 검증. 하루 작업.
2. **열린 라우트 잠그기** (1-3, 1-4, 5장 주식): imageUpload/ai 인증 필수, 토큰 있는 fetch는 `no-store`, 주식 라우트는 symbol 검증 + 상류 캐시 + 장중에만 폴링.
3. `next`·`@tiptap` 업그레이드 + `npm audit fix`, ESLint 9 flat config 도입, `test` 스크립트 추가, tsc 실패 5건 수정, git에서 빌드 산출물 제거.
4. **카테고리 라우트 통합** (2-1, 2-2): `[mainCategory]` 동적 라우트 + 테마 설정 객체, 카테고리는 API 단일 소스. 약 60파일 → 10파일 내외.
5. 영상/폰트/뷰어 번들 다이어트 (3).
6. i18n을 `next-intl` 같은 라우팅 기반으로 교체하거나, 최소한 하드코딩 문자열 정리.
