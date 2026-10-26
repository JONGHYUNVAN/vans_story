# vans_story 재검토 보고서 (2026-10-28)

대상: `C:\Users\vmfort\Desktop\blog\vans_story` (Next 16.2.4 설치됨, Node 26.8.1, npm 11.19)
요청받은 세 가지 포인트를 기존 보고서(`FRONTEND_AUDIT.md`, `DEPENDENCY_PLAN.md`)와 대조해 실제 코드로 다시 확인했다.

| 포인트                                    | 결론                                                                                                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 의존성 최신화 · 미사용 제거            | `DEPENDENCY_PLAN.md`의 판정은 **전부 맞음**. `npm outdated`·`npm audit`·import 스캔으로 재확인. 단, 그 문서는 `D:/blog` 복사본 기준이라 "node_modules 불일치" 선행 단계는 이 복사본에선 **해당 없음** |
| 2. 같은 컴포넌트의 중복 · 파라미터 불일치 | `FRONTEND_AUDIT.md` 2-1이 파일 수는 짚었지만 **"파라미터가 다르다"는 부분은 거의 안 다뤘음**. 아래 2장에 구체적으로 정리                                                                              |
| 3. Next 프로젝트에 Vue가 있는 이유        | **Vue는 없다.** 설치도, import도, `.vue` 파일도 0. `package-lock.json`에 보이는 `vue`는 `@vercel/analytics`·`@vercel/speed-insights`의 *선택적 peerDependency 선언*일 뿐이다                          |

---

## 1. 의존성

### 1-1. 현재 상태 (이 복사본에서 직접 측정)

```
npm ls --depth=0   → invalid 없음 (lockfile과 node_modules 일치)
npm outdated       → 72개 중 65개가 구버전
npm audit          → 48건 (critical 6, high 25, moderate 9, low 8)
```

취약점이 있는 **직접** 의존성과 해결 버전:

| 심각도   | 패키지                                                    | 조치                                        |
| -------- | --------------------------------------------------------- | ------------------------------------------- |
| critical | `next` 16.2.4                                             | → 16.4.3                                    |
| critical | `storybook`, `@storybook/addon-vitest` 9.1.x              | → 10.6.3 (ESM-only 마이그레이션)            |
| critical | `vitest`, `@vitest/browser`, `@vitest/coverage-v8` 4.0.18 | → 4.1.12 (minor) 또는 5.0.5                 |
| high     | `@tiptap/core` 3.20.0                                     | → 3.32.0 (tiptap 16개 전부 같은 버전으로)   |
| high     | `axios`, `js-cookie`                                      | **미사용이므로 삭제**                       |
| high     | `postcss` 8.5.6                                           | → 8.5.31                                    |
| high     | `@storybook/nextjs`                                       | 수정 버전 없음 (storybook 10으로 가면 해소) |
| moderate | `mermaid` 10.9.5                                          | → 10.9.8 (patch), 12.x는 별도 확인          |

### 1-2. 미사용 의존성 (import 0건 재확인)

src/ · e2e/ · .storybook/ · 모든 설정 파일을 대상으로 `'패키지명'` / `'패키지명/…'` 문자열을 스캔했다.

| 분류                       | 패키지                                                                                                                                    | 비고                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 바로 삭제 (8)              | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `axios`, `js-cookie`, `@types/js-cookie`, `jotai`, `msw`, `@storybook/addon-links` | 어디서도 import 안 함. `@types/js-cookie`는 `dependencies`에 잘못 들어가 있음                                                         |
| TipTap 중복 (7)            | `@tiptap/extension-{blockquote, bold, dropcursor, heading, table-cell, table-header, table-row}`                                          | `starter-kit` / `extension-table`에 이미 포함                                                                                         |
| TipTap 프리릴리스 (1)      | `@tiptap/extension-font-size` `3.0.0-next.3`                                                                                              | `@tiptap/extension-text-style`가 `FontSize`를 export → import 한 줄 바꾸고 삭제                                                       |
| 설정만 있고 동작 안 함 (4) | `@storybook/nextjs-vite`, `@vitest/browser`, `@vitest/coverage-v8`, `@chromatic-com/storybook`                                            | `.storybook/vitest.setup.ts`가 **설치돼 있지 않은** `@storybook/experimental-nextjs-vite`를 import → 스토리 테스트는 지금도 실행 불가 |
| 연결 안 됨 (1)             | `autoprefixer`                                                                                                                            | `postcss.config.mjs`에 `tailwindcss`만 등록. Tailwind 4로 가면 내장이므로 삭제                                                        |
| 유지                       | `@tiptap/pm`                                                                                                                              | import 0이지만 `@tiptap/core`의 peerDependency                                                                                        |

반대로 **선언 없이 쓰는 패키지**(phantom) 4개가 `EditorExtensions.tsx`에 있다: `@tiptap/extension-code-block`, `-bullet-list`, `-ordered-list`, `-list-item`. 지금은 starter-kit의 하위 의존성으로 우연히 설치돼 있을 뿐이다.

### 1-3. 최신화 범주

| 범주                          | 패키지                                                                                                                                                                                                                                                                                                                                              | 메모                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Minor/Patch (바로)            | `next` 16.4.3, `react`/`react-dom` 19.3.1, `@types/react*` 19.3.0, tiptap 16개 3.32.0, `highlight.js` 11.12, `@reduxjs/toolkit` 2.13, `react-redux` 9.3, `react-icons` 5.7, `react-hook-form` 7.91, `@headlessui/react` 2.2.10, `sweetalert2`, `flag-icons` 7.6, `playwright` 1.64, `postcss` 8.5.31, `emoji-picker-react` 4.22.3, `mermaid` 10.9.8 | 위험 낮음                                    |
| Major (사용처 작아 영향 적음) | `lucide-react` 0.575 → 1.61 (쓰는 24개 아이콘 전부 일반 아이콘), `@types/node` 22 → 26 (런타임이 Node 26), `jsdom` 27 → 30                                                                                                                                                                                                                          |                                              |
| Major (마이그레이션)          | `tailwindcss` 3 → 4 (`!important` 접두 문법 139곳), `storybook` 9 → 10 (ESM-only), `vitest` 4 → 5                                                                                                                                                                                                                                                   | 별도 단계                                    |
| 보류                          | `typescript` 5.9.3 → 7.0.2                                                                                                                                                                                                                                                                                                                          | Go 네이티브 컴파일러. Next 공식 지원 확인 후 |
| 삭제로 대체                   | `typewriter-effect` (자체 `useTypewriter` 훅 존재), `framer-motion` (ContextMenu 1곳, CSS로 대체 가능), `@storybook/blocks` 9.0.0-alpha.17 (폐기됨, `@storybook/addon-docs/blocks`로 import 변경)                                                                                                                                                   |                                              |

### 1-4. 툴링 공백 (의존성 정리에 포함해야 할 것)

- `"lint": "next lint"` — Next 16에서 제거된 명령이고 `eslint`도 설치돼 있지 않다. 린트가 없다.
- `test` 스크립트 없음. `vitest.config.ts`(storybook용)와 `vitest.unit.config.ts`가 따로 있다.
- `engines` 필드·`.nvmrc` 없음.

### 1-5. 기존 `DEPENDENCY_PLAN.md`와 다른 점

- 그 문서 0장 "node_modules가 lockfile과 어긋나 있다(16.1.6 설치)"는 `D:/blog` 복사본 얘기다. 이 복사본은 16.2.4가 정상 설치돼 있어 `npm ci` 선행이 필요 없다.
- 그 외 삭제 목록·목표 버전·실행 순서는 그대로 유효하다. 결정이 필요한 것은 하나다: **Storybook 스토리 테스트(addon-vitest)를 살릴지**. 스토리는 6개뿐이고 지금도 import 에러로 안 돌아가므로 삭제를 권한다.

---

## 2. 같은 컴포넌트의 중복과 파라미터 불일치

### 2-1. 카테고리별 5종 세트 — 64개 파일, 4,575줄

9개 카테고리(`nextjs, nestjs, spring, mariadb, mongodb, docker, jwt, algorithm, database-theory`)마다 `XxxLayout`, `XxxList`, `page.tsx`, `[id]/page.tsx`, `category/[category]/page.tsx`가 있고, 여기에 `PostCard` 10개, `XxxSidebar` 9개가 붙는다. 의도된 차이는 아이콘·색상·배경 영상·링크 경로뿐인데, 복사 과정에서 **props와 동작이 갈라졌다.**

#### Layout (9개) — props 형태가 두 갈래

| 그룹 | 카테고리                                   | props                                                              |
| ---- | ------------------------------------------ | ------------------------------------------------------------------ |
| A    | nextjs, nestjs, mongodb, jwt               | `{ children, title?: string, isPreview? }`                         |
| A'   | mariadb                                    | `{ children, title: string, isPreview? }` — `title` 필수           |
| B    | spring, docker, algorithm, database-theory | `{ children, title: string, showHeader?, isPreview?, className? }` |

- `isPreview`를 선언만 하고 구조 분해조차 안 하는 곳: `NestjsLayout`, `MariadbLayout`.
- `NextjsLayout`, `NestjsLayout`, `JWTLayout`은 `isPreview ? {...} : useSidebarMargin()`으로 **훅을 조건부 호출**하고, 계산한 값을 JSX에서 쓰지 않는다.
- 소비자(`PostPreview.tsx:122`, `EditorPreview.tsx`)는 전부 `<Layout title={...} isPreview>`로만 호출한다. 그룹 B의 `showHeader`, `className`은 **어느 호출처에서도 넘기지 않는** 죽은 prop이다.

#### List (9개) — 타입 두 가지, 동작 세 가지

| 항목       | 내용                                                                                                                                                                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| props 타입 | `posts: Post[]` (nextjs, mongodb, algorithm, database-theory) vs `posts: PostInfo[]` (nestjs, spring, mariadb, docker, jwt). 둘 다 `@/interfaces/post/types`인데 `Post`에는 `id`가 없어서 `NextjsList`는 `interface Post extends PostInfo { _id: string }`를 로컬로 다시 선언한다 |
| 동작 A     | 정렬 select + 10개 slice: nextjs, nestjs, mariadb, mongodb, algorithm, database-theory                                                                                                                                                                                            |
| 동작 B     | 정렬 없이 grid만: spring, docker (37줄)                                                                                                                                                                                                                                           |
| 동작 C     | `JWTList`만 서버가 넘겨준 `posts`를 초기값으로 쓰고 마운트 후 `/api/posts?mainCategory=jwt&page=1&limit=10`을 **다시 fetch**해 덮어쓴다 (`revalidate: 0`, `_id → id` 매핑 포함)                                                                                                   |

같은 "카테고리 글 목록"인데 어떤 카테고리는 정렬이 되고 어떤 카테고리는 안 되며, JWT만 네트워크 요청이 한 번 더 나간다.

#### PostCard (10개) — 베이스가 "타입"뿐

| 항목   | 내용                                                                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 공통   | 8개가 `PostCardProps<T extends BasePost>` 제네릭을 import. 그러나 `BasePost.tsx`는 **인터페이스 파일**이고 컴포넌트가 아니다. 호버·타이핑 애니메이션 200여 줄이 8번 복사돼 있다                        |
| 이탈   | `algorithm/PostCard`는 자체 `PostCardProps { post: PostInfo }`를 export. `database-theory/PostCard`(55줄)는 `renderBadge?: () => ReactNode` — 다른 9개는 `(post) => ReactNode`로 **시그니처가 다르다** |
| 차이량 | nextjs ↔ nestjs 19줄(색상 hex, 대체 이미지, `h-24`↔`h-28`, `object-cover`↔`object-contain`). nextjs ↔ spring 228줄(사실상 재작성). `new/PostCard`는 Storybook 스토리에서만 사용                        |

#### Sidebar (9개) — 유일하게 제대로 된 패턴

전부 `BaseSidebar`에 props만 넘기는 26~49줄 래퍼다. 이 구조는 맞다. 다만 `BaseSidebar`가 받는 prop이 18개라서, 카테고리별 파일 대신 `THEME_CONFIG[category]` 객체 하나로 접을 수 있다.

#### `[id]/page.tsx` (9개 + 공용 1개)

- ObjectId 형식 검증 후 `notFound()`를 호출하는 것은 **nextjs만**. 나머지 8개는 없는 글에 200으로 "찾을 수 없습니다"를 렌더한다.
- algorithm, database-theory는 작성자·주제·조회수 헤더와 태그 영역을 통째로 뺐다.
- jwt만 `utils/errorHandling`의 `showNotFound`를 쓴다.
- `app/post/view/[id]/page.tsx` + `ViewPostHeader`/`ViewPostContent`는 **10번째 구현**인데 어디서도 링크하지 않는다.

#### `main_categories`의 라우트 없는 항목

`interfaces/post/categories.ts`가 `jest`, `cypress`, `git`, `junit5` 경로를 선언하지만 `app/post/view/` 아래에 해당 디렉터리가 없다 → 헤더/홈에서 클릭하면 404.

### 2-2. 카테고리 밖의 중복

| 중복                      | 파일                                                                                                                                               | 상태                                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Post 타입 2종             | `types/post.ts` (Post/PostInfo에 `id`, `description`, `language` 있음) vs `interfaces/post/types.ts` (`Post`에 `id`·`description`·`language` 없음) | 9 vs 11 파일이 각각 import. `lib/posts/client-actions.ts`는 **둘 다** import                                                                                      |
| `SubCategoryOption` 3종   | `types/post.ts:92`, `types/category.ts:52`, `hooks/useFrameworkCategories.ts:7`                                                                    | 필드도 조금씩 다름                                                                                                                                                |
| `MainCategoryOption` 2종  | `types/post.ts:82`, `types/category.ts:44`                                                                                                         |                                                                                                                                                                   |
| 카테고리 훅 4개 (408줄)   | `useCategory.ts`, `useCategories.ts`(216줄), `useFrameworkCategories.ts`, `useSubCategories.ts`                                                    | `useCategories.ts`는 **import 0건(죽은 코드)**. `useCategory`가 두 파일에 다른 시그니처로 2개, `useCategories`도 2개(`useSubCategories.ts:80`이 alias로 재export) |
| 에러 헬퍼 3개             | `lib/errorHandler.ts`(API 라우트), `lib/errorExtractor.ts`, `utils/errorHandling.ts`(jwt 페이지 2곳만)                                             | 역할 중첩                                                                                                                                                         |
| 타이핑 효과 3개           | `hooks/useTypewriter.ts` + `TypewriterText.tsx`(홈), npm `typewriter-effect`(회원가입 1곳)                                                         | 훅 하나로 통일하면 패키지 삭제                                                                                                                                    |
| 사이드바 마진 2개         | `SidebarWrapper.tsx`, `hooks/useSidebarMargin.ts`                                                                                                  | `1280 < width < 1536` 동일 로직                                                                                                                                   |
| `BackgroundVideo.tsx` 2개 | `app/signup/`, `components/features/home/`                                                                                                         | 이름만 같고 내용은 다른 별개 컴포넌트                                                                                                                             |
| 커서 리플 2개 (411줄)     | `CursorRipple.tsx`, `AdvancedCursorRipple.tsx`                                                                                                     | **둘 다 import 0건(죽은 코드)**                                                                                                                                   |

### 2-3. 정리 방향

`FRONTEND_AUDIT.md` 2-1의 제안(`app/post/view/[mainCategory]/…` 동적 세그먼트 1세트 + `THEME_CONFIG`)이 맞다. 여기에 다음을 더해야 한다.

1. **타입 먼저 통일**: `interfaces/post/types.ts`를 없애고 `types/post.ts` 하나로. `SubCategoryOption`/`MainCategoryOption`도 한 곳으로.
2. **Layout 하나**: props는 `{ children, title?, isPreview? }`로 고정(그룹 A). `showHeader`/`className`은 호출처가 없으므로 버린다. `useSidebarMargin` 조건부 호출 제거.
3. **List 하나**: 정렬 + slice를 기본으로. JWT의 클라이언트 재fetch는 서버 컴포넌트가 이미 데이터를 넘기므로 삭제.
4. **PostCard 하나**: 테마(색상 hex, 대체 이미지, 아이콘)를 prop 또는 `THEME_CONFIG`에서 받는다. `renderBadge` 시그니처는 `(post) => ReactNode`로 통일.
5. **`[id]/page.tsx` 하나**: ObjectId 검증 + `notFound()`를 전 카테고리에 적용. 공용 `view/[id]/page.tsx`와 `ViewPostHeader/Content`는 삭제하거나 이것을 기준으로 삼는다.
6. **죽은 코드 삭제**: `hooks/useCategories.ts`, `CursorRipple.tsx`, `AdvancedCursorRipple.tsx`, `postcard/new/PostCard.tsx`(스토리만 옮기면).
7. `main_categories`에서 라우트 없는 4개(jest, cypress, git, junit5) 제거 또는 페이지 생성.

예상 규모: 64개 파일 → 10개 내외. 한 카테고리 추가가 "설정 객체 한 줄"로 바뀐다.

---

## 3. Vue

| 확인 항목                                                                                              | 결과                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json` dependencies/devDependencies                                                            | `vue` 계열 없음                                                                                                                                                                                           |
| `npm ls vue`                                                                                           | `(empty)` — 설치되지 않음                                                                                                                                                                                 |
| `*.vue` 파일 (node_modules 포함, blog 전체)                                                            | 0개                                                                                                                                                                                                       |
| 소스·설정에서 `vue` import/문자열                                                                      | 0건                                                                                                                                                                                                       |
| `package-lock.json`의 `"vue"` 8건                                                                      | **전부 `@vercel/analytics`와 `@vercel/speed-insights`의 `peerDependencies` + `peerDependenciesMeta { optional: true }`** — 이 두 패키지가 Vue/Nuxt 앱도 지원한다는 선언이지, Vue를 설치하라는 뜻이 아니다 |
| `storybook-static/` 안의 `vue`                                                                         | Storybook 런타임이 지원 프레임워크 목록으로 가진 문자열 + `.webm` 바이너리의 우연한 바이트. 빌드 산출물이며 git에서 빼야 할 디렉터리                                                                      |
| blog 폴더의 다른 4개 Next 프로젝트 (`vans_devblog_ai_route`, `vans_devblog_oauth`, `vans_story_image`) | 역시 없음                                                                                                                                                                                                 |

결론: **제거할 Vue가 없다.** 어젯밤 보고서 두 편이 Vue를 언급하지 않은 것은 누락이 아니라 실제로 없기 때문이다. 혹시 `vite`를 보셨다면 그건 `vitest`·`@vitest/*`·`@storybook/nextjs-vite`에서 온 것으로, Vue와 무관한 번들러/테스트 러너다 (그중 `@storybook/nextjs-vite`는 1-2에서 삭제 대상).

---

## 4. 권장 실행 순서

| 단계 | 내용                                                                                                                                                                 | 위험                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1    | 미사용 8개 + TipTap 중복 7개 + `font-size` 삭제, phantom 4개를 starter-kit 옵션으로 정리, `autoprefixer` 결정                                                        | 낮음                      |
| 2    | `next` 16.4.3, `react` 19.3.1, tiptap 3.32, 나머지 minor 일괄 → `npm audit` 재확인                                                                                   | 낮음                      |
| 3    | Storybook 테스트 스택 삭제(`addon-vitest`, `nextjs-vite`, `@vitest/browser`, `chromatic`), `vitest.unit.config.ts`를 `vitest.config.ts`로 승격, `test` 스크립트 추가 | 낮음                      |
| 4    | `eslint@9` + `eslint-config-next` flat config 도입, `lint` 스크립트 교체                                                                                             | 낮음                      |
| 5    | 2-3의 타입 통일 → `[mainCategory]` 라우트 통합 → 죽은 코드 삭제                                                                                                      | 중간 (페이지별 시각 확인) |
| 6    | `lucide-react` 1.x, `@types/node` 26, `jsdom` 30, Storybook 10                                                                                                       | 중간                      |
| 7    | Tailwind 4 (별도 브랜치)                                                                                                                                             | 높음                      |
| 보류 | TypeScript 7                                                                                                                                                         | —                         |
