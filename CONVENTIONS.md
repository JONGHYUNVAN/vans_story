# vans_story 코드 컨벤션

이 문서는 vans_story(Next.js 16 App Router, React 19, TypeScript 5, Tailwind 3, Redux Toolkit, vitest, Playwright)의 코드 규칙이다. 규칙은 도구가 강제하는 것과 사람이 지키는 것으로 나뉜다. **도구가 잡을 수 있는 것은 전부 도구에 맡긴다.** 서식은 Prettier, 코드 규칙은 ESLint, 타입은 `tsc`가 판정하며, 이 문서는 그 설정의 근거와 도구가 잡지 못하는 규칙을 적는다.

| 영역        | 도구                                                                                                       | 설정 파일                                | 명령                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| 서식        | Prettier 3 + prettier-plugin-tailwindcss                                                                   | `.prettierrc`, `.prettierignore`         | `npm run format`, `npm run format:check` |
| 코드 규칙   | ESLint 9 flat config (eslint-config-next 16 + typescript-eslint + unused-imports + eslint-config-prettier) | `eslint.config.mjs`                      | `npm run lint`, `npm run lint:fix`       |
| 타입        | TypeScript strict                                                                                          | `tsconfig.json`                          | `npm run typecheck`                      |
| 단위 테스트 | vitest 4                                                                                                   | `vitest.config.ts`                       | `npm test`                               |
| E2E         | Playwright                                                                                                 | `playwright.config.ts`                   | `npm run test:e2e`                       |
| 에디터      | EditorConfig, VS Code 저장 시 포맷·lint fix                                                                | `.editorconfig`, `.vscode/settings.json` | —                                        |
| 런타임      | Node ≥ 22.12 (로컬은 26)                                                                                   | `.nvmrc`, `package.json#engines`         | —                                        |
| 줄바꿈      | 저장소는 항상 LF                                                                                           | `.gitattributes`                         | —                                        |

커밋 전 한 번에 확인: `npm run check` (typecheck → lint → format:check → test).

---

## 1. 디렉터리 구조

Next.js App Router의 공식 구성 방식 중 **"프로젝트 파일을 `app` 밖(`src/`)에 두고, 라우트 전용 파일만 비공개 폴더(`_`)로 colocate"** 하는 방식을 따른다. `app/`은 라우팅 전용이다.

```
src/
├─ app/                        라우팅 전용. 라우트 파일 + 라우트 전용 비공개 폴더만 둔다
│  ├─ api/**/route.ts          BFF 라우트 핸들러 (백엔드 프록시)
│  ├─ <route>/page.tsx         page / layout / loading / error / not-found / template
│  ├─ <route>/_components/     그 라우트에서만 쓰는 클라이언트 컴포넌트 (예: StocksClient.tsx)
│  ├─ <route>/_hooks/          그 라우트에서만 쓰는 훅
│  ├─ <route>/_types/          그 라우트에서만 쓰는 타입
│  ├─ <route>/actions.ts       서버 액션
│  ├─ fonts/                   next/font 정의
│  └─ globals.css
├─ components/
│  ├─ ui/                      도메인을 모르는 범용 UI (window, AutocompleteInput, MarkdownModal, MermaidDiagram)
│  ├─ layout/                  header, sidebar 등 앱 골격
│  └─ features/<domain>/       도메인 컴포넌트. auth, games, home, post, projects, search, stocks
├─ hooks/                      두 도메인 이상에서 쓰는 공용 훅
├─ lib/                        공용 로직. 도메인별 하위 폴더: api/ auth/ errors/ stocks/ posts/ ai/ + i18n.ts, alerts.ts
├─ store/                      Redux Toolkit. slice 별 폴더(auth/, modal/, i18n/) + store.ts, hooks.ts, providers.tsx
├─ constants/                  상수·설정값 (apiConfig, apiUrl, games, mainCategories, categoryThemes, projects, stockRelations)
├─ types/                      전역 타입 (auth, category, post, project, stocks, api/)
└─ messages/                   i18n 메시지 JSON (ko/, en/, ko.json, en.json)
e2e/                           Playwright 테스트
```

### 어디에 둘지 정하는 기준

| 상황                                                      | 위치                                                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 한 라우트에서만 쓰는 컴포넌트·훅·타입                     | 그 라우트의 `_components/`, `_hooks/`, `_types/`                                          |
| 한 도메인에서 쓰는 컴포넌트                               | `components/features/<domain>/` (하위 폴더로 더 나눌 수 있음: `post/editor`, `post/form`) |
| 도메인을 모르는 UI 조각                                   | `components/ui/`                                                                          |
| 두 도메인 이상에서 쓰는 훅                                | `hooks/`                                                                                  |
| 컴포넌트가 아닌 로직(fetch 래퍼, 파서, 포맷터, 토큰 처리) | `lib/<domain>/`                                                                           |
| 값이 바뀌지 않는 데이터·설정                              | `constants/`                                                                              |
| 여러 모듈이 공유하는 타입                                 | `types/`                                                                                  |
| `interfaces/`, `utils/`, `config/`                        | **만들지 않는다.** 각각 `types/`, `lib/`, `constants/`에 흡수했다                         |

- `app/` 안에서 `page.tsx`·`layout.tsx` 등 Next 예약 파일이 아닌 파일은 반드시 `_` 폴더 안에 둔다. `_` 폴더는 라우팅에서 제외되므로 실수로 URL이 생기지 않는다.
- 배럴 파일(`index.ts`)은 만들지 않는다. 순환 참조와 번들 크기의 원인이 된다. 예외: 서드파티 호환이 필요한 경우.
- 포스트 카테고리 화면은 `app/post/view/[mainCategory]/` 동적 라우트 한 세트 + `components/features/post/view/*` 한 벌이다. 카테고리별 차이는 `constants/postThemes.ts`의 `POST_THEMES`에만 적는다. 새 카테고리는 테마 항목 하나 + `constants/mainCategories.ts`의 에디터 목록 + `public/` 이미지로 끝나며, 컴포넌트를 복사하지 않는다(키 집합 일치는 테스트가 검사한다).

## 2. 이름

| 대상                     | 규칙                                                                                 | 예                                                   |
| ------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| 디렉터리                 | 소문자. 여러 단어는 kebab-case. `app/` 라우트 세그먼트는 URL이므로 반드시 kebab-case | `about-van/`, `database-theory/`, `stock-dashboard/` |
| 컴포넌트 파일            | PascalCase.tsx, 파일명 = 컴포넌트명, 파일당 기본 export 컴포넌트 하나                | `StockCard.tsx`                                      |
| 훅 파일                  | `use` + PascalCase.ts, 파일명 = 훅 이름                                              | `useStocksData.ts`                                   |
| 그 외 모듈               | camelCase.ts                                                                         | `stockFormatting.ts`, `clientActions.ts`             |
| 테스트                   | 대상 옆 `__tests__/<대상 파일명>.test.ts(x)`. E2E는 `e2e/<기능>.spec.ts`             | `__tests__/StockCard.test.tsx`                       |
| 컴포넌트·타입·인터페이스 | PascalCase                                                                           | `PostCard`, `StockPrice`                             |
| Props 타입               | `<컴포넌트명>Props`                                                                  | `StockCardProps`                                     |
| 함수·변수                | camelCase. 이벤트 핸들러는 `handle<Event>`, 핸들러 prop은 `on<Event>`                | `handleSubmit`, `onGameEnd`                          |
| boolean                  | `is` / `has` / `can` / `should` 접두                                                 | `isLoading`, `hasError`                              |
| 모듈 수준 상수           | UPPER_SNAKE_CASE (리터럴·고정 테이블). 계산된 객체·함수는 camelCase                  | `KR_STOCKS`, `MAX_AGE`                               |
| 환경변수                 | UPPER_SNAKE_CASE. 브라우저 노출은 `NEXT_PUBLIC_` 접두가 붙은 것만                    | `AUTH_API_URL`, `NEXT_PUBLIC_OAUTH_SERVER_URL`       |
| i18n 키                  | `<영역>.<항목>` 점 표기, camelCase                                                   | `Header.aboutVan`                                    |

- 기존 `app/api/` 하위의 camelCase 세그먼트(`imageUpload`, `apiFetch` 등)는 외부에서 호출하는 URL이라 호환을 위해 유지한다. 신규 API 경로는 kebab-case로 만든다.
- 약어도 일반 단어처럼 쓴다: `Jwt`, `Api`, `Url` (단, 기존 `JWTLayout` 등은 D단계 통합 때 정리).

## 3. 서식 (Prettier가 결정)

`.prettierrc`가 유일한 기준이다. 손으로 맞추지 말고 저장 시 포맷에 맡긴다.

| 항목                 | 값                              | 근거                                                          |
| -------------------- | ------------------------------- | ------------------------------------------------------------- |
| 들여쓰기             | 2칸                             | 기존 코드의 다수 관행, 자매 저장소(vans_story_be_post)와 동일 |
| 세미콜론             | 사용                            | 기존 코드 81%가 사용                                          |
| 따옴표               | 작은따옴표. JSX 속성은 큰따옴표 | 기존 코드 97%                                                 |
| 줄 길이              | 100                             | 80은 Tailwind className이 있는 JSX에서 지나치게 세로로 길어짐 |
| 후행 쉼표            | all                             | diff 최소화                                                   |
| 화살표 함수 괄호     | 항상                            | `(x) => x`                                                    |
| 줄바꿈               | LF                              | `.gitattributes`로 강제                                       |
| Tailwind 클래스 순서 | 플러그인이 정렬                 | `clsx`, `cn`, `cva` 호출 안도 정렬                            |

## 4. TypeScript

- `strict: true`. `any`는 쓰지 않는다. 모르는 값은 `unknown`으로 받고 좁힌다. 외부 응답은 타입 가드나 최소한의 인터페이스로 받는다. (현재 남은 `any`는 warn이며 D단계에서 제거)
- 객체 형태는 `interface`, 유니언·교차·별칭은 `type`. (`consistent-type-definitions`)
- 타입만 쓰는 import는 `import type`. 값과 섞이면 `import { a, type B }`가 아니라 별도 줄로 분리한다. (`consistent-type-imports`, 자동 수정)
- 배열은 `T[]`. `Array<T>`는 쓰지 않는다. (`array-type`)
- `enum`은 쓰지 않는다. 문자열 유니언이나 `as const` 객체를 쓴다.
- non-null 단언(`!`)은 "왜 null이 아닌지" 주석 없이는 쓰지 않는다. 가능하면 조기 반환으로 좁힌다.
- `@ts-ignore` 금지. 꼭 필요하면 `@ts-expect-error`에 이유를 붙인다.
- 안 쓰는 import는 lint가 자동 삭제한다. 의도적으로 안 쓰는 매개변수·catch 바인딩은 `_` 접두를 붙인다. (`no-unused-vars`)
- 공개 함수(export)는 매개변수 타입을 명시한다. 반환 타입은 추론이 불명확하거나 공개 API 계약일 때 명시한다.
- `tsconfig`의 `baseUrl`은 쓰지 않는다 (TS 7에서 제거됨). 별칭은 `paths`의 `@/*` 하나만 쓴다.

## 5. React / Next.js

- 컴포넌트는 `function` 선언으로 쓴다. 이름 없는 콜백 컴포넌트만 화살표 함수. (`function-component-definition`)
- 컴포넌트 안에서 컴포넌트를 정의하지 않는다. 모듈 스코프로 올린다. (`react-hooks/static-components`)
- 기본은 서버 컴포넌트. `'use client'`는 상태·이벤트·브라우저 API가 필요한 가장 작은 잎 컴포넌트에만 붙인다. 페이지(`page.tsx`)에는 붙이지 않고 `_components/XxxClient.tsx`로 분리한다.
- `useEffect` 안에서 동기적으로 `setState`하지 않는다. 파생 값은 렌더 중 계산하고, "X가 바뀌면 초기화"는 `key`나 렌더 중 상태 조정 패턴을 쓴다. 외부 시스템과 동기화할 때만 effect를 쓴다. (`react-hooks/set-state-in-effect`)
- 렌더 중에 `ref.current`를 읽거나 쓰지 않는다. `Math.random()`, `Date.now()` 같은 비순수 호출도 렌더 밖(`useState` 초기화 함수, effect, 핸들러)으로 옮긴다. (`react-hooks/refs`, `react-hooks/purity`)
- props·state를 제자리에서 변경하지 않는다. 복사해서 바꾼다. (`react-hooks/immutability`)
- boolean prop은 `<X open />`처럼 값 없이 쓴다. 자식 없는 요소는 self-closing. JSX 문자열 prop에 불필요한 `{'...'}`를 쓰지 않는다.
- 이미지는 `next/image`. `<img>`는 외부 도메인 설정이 불가능한 경우에만 쓰고 주석을 단다. (현재 warn)
- 큰 클라이언트 전용 모듈(게임, 에디터, 차트)은 `next/dynamic`으로 분리한다.
- 인라인 `style={{}}`은 런타임 계산값(좌표·퍼센트·색상 토큰)에만 쓴다. 정적 스타일은 Tailwind.
- 상태 위치: 서버 데이터는 서버 컴포넌트에서 fetch → props. 전역 UI 상태(인증, 모달, 언어)는 Redux slice. 나머지는 컴포넌트 로컬 state. 새 전역 상태를 추가하기 전에 prop으로 충분한지 먼저 확인한다.
- 폼은 `react-hook-form`. 알림은 `lib/alerts.ts`의 래퍼만 호출한다(sweetalert2 직접 호출 금지).

## 6. import

순서(`import/order`가 자동 정렬):

1. Node 내장 (`node:fs`)
2. 외부 패키지 (`react`, `next/*`, 라이브러리)
3. 내부 별칭 (`@/...`)
4. 상대 경로 (`./`)

규칙:

- 다른 디렉터리의 모듈은 항상 `@/` 별칭으로 가져온다. `../`는 쓰지 않는다. (`no-restricted-imports`)
- 같은 디렉터리의 모듈만 `./`로 가져온다.
- 같은 모듈을 두 줄로 나눠 import하지 않는다. (`import/no-duplicates`)
- 부수 효과 import(`import './globals.css'`)는 파일 최상단, 가장 먼저.

## 7. API 라우트 (BFF)

`src/app/api/**/route.ts`는 브라우저와 백엔드 사이의 프록시다.

- 핸들러는 `export async function GET/POST/...` 이름 있는 함수로 쓴다.
- 응답은 `NextResponse.json(body, { status })`. 성공은 데이터 그대로, 실패는 `{ error: string }`. `lib/api/errorHandler.ts`의 `createErrorResponse`/`createSuccessResponse`를 쓴다.
- 입력은 쓰기 전에 검증한다 (쿼리·경로 파라미터·body). 검증 실패는 400.
- 백엔드 URL·내부 호스트·스택은 응답에 넣지 않는다. 서버 로그(`console.error`)에만 남긴다.
- 백엔드로 전달해야 하는 헤더(`Authorization`, `Cookie`)와 돌려줘야 하는 헤더(`Set-Cookie`, `Authorization`)는 명시적으로 복사한다. `fetch`의 `credentials: 'include'`는 서버 사이드에서 아무 효과가 없다.
- 캐시는 라우트별로 명시한다: 공개 데이터는 `next: { revalidate: n }`, 인증된 요청은 `cache: 'no-store'`.
- `process.env.*`는 서버 코드에서만 읽는다. 클라이언트에 필요한 값만 `NEXT_PUBLIC_`으로 노출한다. 비밀키·내부 API 키는 절대 `NEXT_PUBLIC_`이 아니다.
- 외부 API 호출에는 타임아웃(`AbortSignal.timeout`)을 건다.

## 8. 에러 처리와 로깅

- `console.log`는 쓰지 않는다. 서버의 실패 기록은 `console.error`, 복구 가능한 이상은 `console.warn`. (`no-console`, 현재 warn)
- `catch (error)`의 `error`는 `unknown`이다. 메시지는 `lib/errors/errorExtractor.ts`의 `extractErrorMessage`로 뽑는다.
- 사용자에게 보여줄 메시지와 로그에 남길 원인은 분리한다. 사용자 메시지는 i18n 키로.
- 빈 `catch {}`는 쓰지 않는다. 무시해도 되는 예외라면 왜 무시하는지 한 줄 주석을 쓴다.
- 클라이언트의 인증 실패(401)는 `lib/api/apiFetch.ts`의 `authFetch`가 refresh → 재시도까지 책임진다. 각 호출처에서 다시 처리하지 않는다.

## 9. 주석과 문서

- 주석은 한국어로 쓴다. 코드가 "무엇"을 하는지가 아니라 **"왜"** 그렇게 했는지를 쓴다.
- JSDoc은 export되는 함수·훅·서비스 객체에만 쓴다. 매개변수 이름을 되풀이하는 `@param` 나열은 쓰지 않는다. 한 줄 설명 + 주의사항이면 충분하다.
- 미결 사항은 `// TODO(이름): 내용` 형식. 이슈가 있으면 번호를 쓴다.
- 코드를 주석으로 남겨두지 않는다. git이 기억한다.
- 사용하지 않는 파일은 삭제한다. "나중에 쓸지도"는 보관 사유가 아니다.

## 10. 테스트

- 단위 테스트는 vitest, 대상 파일 옆 `__tests__/`에 둔다. 컴포넌트 테스트는 파일 첫 줄에 `// @vitest-environment jsdom`.
- 테스트 중 외부 네트워크 호출 금지. `fetch`는 `vi.spyOn(globalThis, 'fetch')`로 mock한다.
- API 라우트 테스트는 `Request`를 만들어 핸들러를 직접 호출하고 상태 코드·헤더·body를 검증한다.
- `describe`/`it` 설명은 한국어로 "무엇을 하면 어떻게 된다"를 쓴다.
- 버그 수정 커밋에는 그 버그를 재현하는 테스트를 함께 넣는다.
- 테스트 파일에서는 `no-console`, `no-explicit-any`를 끈다 (`eslint.config.mjs`의 tests 블록).

## 11. i18n

- 화면 문자열은 `lib/i18n.ts`의 `useTranslation`과 `messages/`의 키로 쓴다. 신규 코드에 한국어·영어 문자열을 하드코딩하지 않는다.
- 메시지 파일은 `messages/<lang>/<영역>.json`. 두 언어의 키 집합은 항상 같아야 한다.

## 12. Git

- 커밋 제목: `type(scope): 한국어 요약` (Conventional Commits). scope는 선택.
  - `feat` 기능, `fix` 버그, `refactor` 동작 변화 없는 구조 변경, `perf`, `test`, `docs`, `style` 서식만, `chore` 의존성·설정, `build`, `ci`
  - 예: `fix(auth): refresh 라우트가 Cookie 헤더를 백엔드로 전달하지 않던 문제 수정`
- 제목은 72자 이내, 마침표 없음. 본문에는 "왜"와 영향 범위를 쓴다.
- 한 커밋에 한 주제. 서식만 바꾼 커밋(`style:`)과 로직 커밋을 섞지 않는다. 대규모 서식 커밋의 해시는 `.git-blame-ignore-revs`에 추가한다.
- 브랜치: `feat/<주제>`, `fix/<주제>`, `refactor/<주제>` kebab-case.
- `main`에 올리기 전 `npm run check`가 통과해야 한다.

## 13. 단계적 적용 상태

2026-10-26 도입 시점의 기준선이다. **error는 0이 유지돼야 하고, warn은 파일을 건드릴 때 그 파일에서 없앤다.** 한 규칙의 warn이 0이 되면 `eslint.config.mjs`에서 error로 올린다.

| 규칙                                 | 현재 | 남은 건수 | 올리는 조건                          |
| ------------------------------------ | ---- | --------- | ------------------------------------ |
| `no-console`                         | warn | 81        | D단계(카테고리 통합) 후              |
| `@typescript-eslint/no-explicit-any` | warn | 61        | 주식·포스트 타입 정리 후             |
| `@next/next/no-img-element`          | warn | 26        | G단계(성능)에서 `next/image` 전환 후 |
| `react-hooks/exhaustive-deps`        | warn | 7         | 각 파일 수정 시                      |
| `no-restricted-imports` (`../` 금지) | warn | 0         | 0이므로 다음 정리 때 error로         |
| `import/order`                       | warn | 2         | 0이 되면 error로                     |

그 외 모든 규칙은 error이며 현재 0건이다.
