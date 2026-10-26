# vans_story 의존성 정리 계획 (2026-10-26)

대상: `package.json` dependencies 51개 + devDependencies 21개 = 72개
검증 방법: `src/`, `e2e/`, `.storybook/`, 설정 파일 전체에서 import / require / dynamic import / CSS import를 스캔해 패키지별 사용 파일 수를 셌고, 0건인 것은 peer dependency·설정 파일·번들 포함 여부까지 다시 확인했다.

## 0. 작업 전 선행 사항

- **node_modules가 lockfile과 어긋나 있다.** `package.json`은 `next ^16.2.4`, `package-lock.json`은 16.2.4인데 설치된 것은 16.1.6이다 (`npm ls`가 `invalid` 보고). 어떤 변경이든 `npm ci`로 먼저 동기화한다.
- Node 26.12.1 환경. `engines` 필드와 `.nvmrc`가 없다 → 정리하면서 `"engines": { "node": ">=22.12" }`와 `.nvmrc`(`26`) 추가 권장.
- 각 단계마다 `npx tsc --noEmit`, `npm run build`, `npx vitest run --config vitest.unit.config.ts`로 확인한다. 현재는 tsc 5건·vitest 16건이 이미 실패 상태이므로 **기준선을 먼저 기록**해 두고 "새로 생긴 실패"만 본다.

---

## 1. 삭제 계획 (미사용 확정) — 19개

### 1-A. 코드에서 import 0건, peer도 아님 → 바로 삭제 (8개)

| 패키지                          | 근거                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `@aws-sdk/client-s3`            | import 0. S3 업로드는 vans_devblog_image 서비스가 담당, 프론트는 `/api/imageUpload` 프록시만 |
| `@aws-sdk/s3-request-presigner` | 위와 동일                                                                                    |
| `axios`                         | import 0. 모든 요청이 `fetch`(`ApiFetch`)                                                    |
| `js-cookie`                     | import 0. 쿠키는 `ViewCountHandler.tsx`에서 `document.cookie` 직접 조작                      |
| `@types/js-cookie`              | 위 패키지 타입. 게다가 `dependencies`에 잘못 들어가 있음                                     |
| `jotai`                         | import 0. 상태관리는 Redux Toolkit 단일                                                      |
| `msw`                           | import 0. 스토리/테스트 어디서도 mock 서버 안 씀                                             |
| `@storybook/addon-links`        | import 0, `.storybook/main.ts` addons 목록에도 없음                                          |

```bash
npm uninstall @aws-sdk/client-s3 @aws-sdk/s3-request-presigner axios js-cookie @types/js-cookie jotai msw @storybook/addon-links
```

### 1-B. TipTap 중복 선언 — 다른 패키지에 이미 포함됨 (8개)

`@tiptap/starter-kit`가 `blockquote, bold, dropcursor, heading, underline, link, code-block, bullet-list, ordered-list, list-item, list` 를 모두 의존성으로 가지고 있고, `@tiptap/extension-table` v3가 `TableCell, TableHeader, TableRow`를 re-export 한다(코드도 이미 `from '@tiptap/extension-table'`로 가져온다).

| 패키지                           | 근거                                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tiptap/extension-blockquote`   | import 0, starter-kit 포함                                                                                                                                                                                          |
| `@tiptap/extension-bold`         | import 0, starter-kit 포함                                                                                                                                                                                          |
| `@tiptap/extension-dropcursor`   | import 0, starter-kit 포함                                                                                                                                                                                          |
| `@tiptap/extension-heading`      | import 0, starter-kit 포함                                                                                                                                                                                          |
| `@tiptap/extension-table-cell`   | import 0, extension-table가 export                                                                                                                                                                                  |
| `@tiptap/extension-table-header` | import 0, extension-table가 export                                                                                                                                                                                  |
| `@tiptap/extension-table-row`    | import 0, extension-table가 export                                                                                                                                                                                  |
| `@tiptap/extension-font-size`    | **`3.0.0-next.3` 프리릴리스 고정.** v3에서 `FontSize`는 `@tiptap/extension-text-style`가 export 한다 → `EditorExtensions.tsx:10`의 import를 `import { FontSize } from '@tiptap/extension-text-style'`로 바꾸고 삭제 |

```bash
npm uninstall @tiptap/extension-blockquote @tiptap/extension-bold @tiptap/extension-dropcursor @tiptap/extension-heading @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-table-row @tiptap/extension-font-size
```

반대로 **선언 없이 쓰는 TipTap 패키지(phantom dependency)** 가 4개 있다: `EditorExtensions.tsx`가 `@tiptap/extension-code-block`, `-bullet-list`, `-ordered-list`, `-list-item`을 직접 import 하지만 `package.json`에 없다(starter-kit의 하위 의존성으로 우연히 설치됨). npm hoisting이 바뀌면 빌드가 깨진다. 두 가지 중 하나:

- (권장) `StarterKit.configure`에서 `codeBlock/bulletList/orderedList/listItem: false`로 끄고 따로 import 하는 대신, starter-kit 옵션으로 설정하고 CodeBlock만 `CodeBlockLowlight`로 교체 → 4개 import 자체를 제거
- 또는 4개를 `package.json`에 명시 (`npm i @tiptap/extension-code-block @tiptap/extension-list`)

### 1-C. Storybook 테스트 스택 — 설정이 서로 맞지 않아 어차피 동작 안 함 (3개 + 결정 1건)

현재 상태:

- framework는 `@storybook/nextjs`(webpack)인데 `@storybook/addon-vitest`는 Vite 기반 framework(`@storybook/nextjs-vite`)를 요구한다.
- `.storybook/vitest.setup.ts`가 `@storybook/experimental-nextjs-vite`를 import 하는데 **이 패키지는 설치돼 있지 않다**(SB 9에서 `@storybook/nextjs-vite`로 정식 승격되며 이름이 바뀜) → `vitest.config.ts`의 storybook 프로젝트는 import 에러로 실행 불가.
- `@storybook/nextjs-vite`는 선언만 돼 있고 아무 데서도 안 쓴다.
- `@chromatic-com/storybook`은 addons에 등록돼 있지만 Chromatic 프로젝트 설정이 없어 "Visual tests" 패널만 빈 채로 뜬다.
- `@vitest/browser`는 browser mode 설정이 없어 미사용, `@vitest/coverage-v8`는 coverage 설정/스크립트가 없어 미사용.

결정: **Storybook 스토리 테스트(addon-vitest)를 살릴 것인가?** 스토리는 6개뿐이다.

- **안 살린다(권장)**: 삭제 → `@storybook/addon-vitest`, `@storybook/nextjs-vite`, `@vitest/browser`, `@chromatic-com/storybook`. `vitest.config.ts`와 `.storybook/vitest.setup.ts`도 삭제하고 `vitest.unit.config.ts`를 `vitest.config.ts`로 승격. `.storybook/main.ts` addons에서 두 항목 제거.
- **살린다**: framework를 `@storybook/nextjs-vite`로 바꾸고 `@storybook/nextjs`를 삭제, `vitest.setup.ts`의 import를 `@storybook/nextjs-vite`로 수정, `@vitest/browser` + `playwright`로 browser mode 설정. 작업량이 훨씬 크다.

`@vitest/coverage-v8`는 `"test:coverage": "vitest run --coverage"` 스크립트를 추가해서 쓰든지, 아니면 삭제.

```bash
# "안 살린다" 선택 시
npm uninstall @storybook/addon-vitest @storybook/nextjs-vite @vitest/browser @chromatic-com/storybook
```

### 1-D. 교체로 없앨 수 있는 것 (선택, 3개)

| 패키지              | 현재 사용처                                                               | 대안                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `typewriter-effect` | `signup/ValidationMessage.tsx` 1곳                                        | 이미 자체 `hooks/useTypewriter.ts`가 있고 홈/aboutVan에서 쓰고 있다. 같은 훅으로 교체하면 삭제 가능                        |
| `framer-motion`     | `ui/window/ContextMenu.tsx` 1곳 (`motion.div` + `AnimatePresence` 페이드) | CSS transition 10줄로 대체 가능. 유지한다면 2-C 참조                                                                       |
| `@storybook/blocks` | `src/Introduction.mdx`의 `Meta` import 1곳                                | SB 9부터 폐기(최신 stable이 8.6.14, 설치본은 9.0.0-alpha.17). `@storybook/addon-docs/blocks`에서 import 하도록 바꾸고 삭제 |

### 1-E. 설정이 빠져서 "선언만 돼 있는" 것 (1개)

- `autoprefixer`: `postcss.config.mjs`에 `tailwindcss` 플러그인만 있고 autoprefixer가 없다 → 지금은 실행되지 않는다. Tailwind 3를 유지하면 postcss 설정에 추가하고, Tailwind 4로 가면 내장이므로 삭제.

---

## 2. 업데이트 계획 (사용 중 확정) — 50개

범례: **Patch/Minor** = `npm update`로 안전, **Major** = 마이그레이션 필요, **보류** = 지금 올리지 않음.

### 2-A. 코어 프레임워크 (Minor, 1단계로 먼저)

| 패키지                              | 현재                           | 목표                  | 비고                                                                                                                                                                                           |
| ----------------------------------- | ------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                              | 16.1.6 (설치) / ^16.2.4 (선언) | **16.4.3**            | critical 취약점 2건(RSC DoS, Middleware/Proxy bypass) 해소. `next lint` 제거는 이미 반영돼 있어야 함(아래 2-F)                                                                                 |
| `react` / `react-dom`               | 19.2.4                         | 19.3.1                | Minor                                                                                                                                                                                          |
| `@types/react` / `@types/react-dom` | 19.2.x                         | 19.3.0                | react와 함께                                                                                                                                                                                   |
| `@types/node`                       | 22.19.11                       | **26.6.5**            | 런타임이 Node 26인데 타입은 22. Major지만 타입 패키지라 코드 영향 거의 없음                                                                                                                    |
| `typescript`                        | 5.9.3                          | **5.9.x 유지 (보류)** | 7.0은 Go 네이티브 컴파일러로 완전히 새 구현. `tsconfig`의 `plugins: [{ name: "next" }]`(language service plugin) 지원과 MDX 등 생태계 호환이 아직 불확실. Next가 공식 지원을 밝힌 뒤 별도 작업 |

```bash
npm i next@16.4.3 react@19.3.1 react-dom@19.3.1
npm i -D @types/react@19.3.0 @types/react-dom@19.3.0 @types/node@26
```

### 2-B. TipTap 에디터 (Minor, 2단계)

`@tiptap/core, pm, react, starter-kit, extension-{bubble-menu, code-block-lowlight, color, font-family, highlight, image, link, table, text-align, text-style, underline, youtube}` 16개 — 3.20.0 → **3.32.0**. 모두 같은 버전으로 맞춘다(한 패키지만 올리면 peer 충돌).

- `@tiptap/pm`은 import 0건이지만 `@tiptap/core`/`@tiptap/react`의 **peerDependency**이므로 반드시 유지.
- 보안: `@tiptap/core`(mergeAttributes `__proto__`, ReDoS), `prosemirror-view`(붙여넣기 XSS) 취약점이 이 업데이트로 해소되는지 `npm audit`로 확인.
- `lowlight` 3.3.0, `highlight.js` 11.11.1 → 11.12.0: Minor.
- 함께 1-B의 FontSize import 교체와 phantom dependency 정리를 한다.

```bash
npm i @tiptap/core@3.32.0 @tiptap/pm@3.32.0 @tiptap/react@3.32.0 @tiptap/starter-kit@3.32.0 @tiptap/extension-bubble-menu@3.32.0 @tiptap/extension-code-block-lowlight@3.32.0 @tiptap/extension-color@3.32.0 @tiptap/extension-font-family@3.32.0 @tiptap/extension-highlight@3.32.0 @tiptap/extension-image@3.32.0 @tiptap/extension-link@3.32.0 @tiptap/extension-table@3.32.0 @tiptap/extension-text-align@3.32.0 @tiptap/extension-text-style@3.32.0 @tiptap/extension-underline@3.32.0 @tiptap/extension-youtube@3.32.0 highlight.js@11.12.0
```

### 2-C. UI 라이브러리

| 패키지                   | 현재     | 목표                  | 종류          | 비고                                                                                                                                                                                                                                                                              |
| ------------------------ | -------- | --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@reduxjs/toolkit`       | 2.11.2   | 2.13.0                | Minor         |                                                                                                                                                                                                                                                                                   |
| `react-redux`            | 9.2.0    | 9.3.0                 | Minor         |                                                                                                                                                                                                                                                                                   |
| `react-icons`            | 5.5.0    | 5.7.0                 | Minor         | 44개 파일에서 사용. `lucide-react`(10개 파일)와 아이콘 라이브러리 2개 혼용 중 — 장기적으로 하나로 통일 권장                                                                                                                                                                       |
| `lucide-react`           | 0.575.0  | **1.61.0**            | Major         | v1 변경: 브랜드 아이콘 삭제, UMD 빌드 삭제, `aria-hidden` 기본값. 현재 쓰는 24개 아이콘(AlertCircle, Bold, Bot, ChevronDown, Edit3, Eye, FileText, Italic, Loader2, Moon, Sun, Trash2, X, Zap 등)은 **전부 일반 아이콘**이라 영향 없음 → 올려도 됨                                |
| `@headlessui/react`      | 2.2.9    | 2.2.10                | Patch         | `LanguageSelector` 1곳                                                                                                                                                                                                                                                            |
| `react-hook-form`        | 7.71.2   | 7.91.0                | Minor         | signup 3개 파일                                                                                                                                                                                                                                                                   |
| `sweetalert2`            | 11.26.20 | 11.26.25              | Patch         |                                                                                                                                                                                                                                                                                   |
| `emoji-picker-react`     | 4.18.0   | 4.22.3 → 5.1.4        | Minor → Major | `EditorMenuBar` 1곳. 5.x 변경 내역을 공개 자료에서 확인하지 못함 → 4.22.3까지 올리고, 5.x는 저장소 릴리스 노트 확인 후 수동 테스트(이모지 삽입)                                                                                                                                   |
| `framer-motion`          | 12.34.3  | 12.43.0 → `motion`@14 | Minor → Major | 공식 경로는 패키지를 `motion`으로 교체하고 `motion/react`에서 import(`npm un framer-motion && npm i motion`). 사용처 1곳이라 1-D처럼 CSS로 바꾸고 삭제하는 쪽이 번들에 유리                                                                                                       |
| `react-markdown`         | 10.1.0   | 10.1.0                | -             | 최신                                                                                                                                                                                                                                                                              |
| `remark-gfm`             | 4.0.1    | 4.0.1                 | -             | 최신                                                                                                                                                                                                                                                                              |
| `mermaid`                | 10.9.5   | 10.9.8 → **12.2.0**   | Patch → Major | `MermaidDiagram.tsx`가 이미 v10 async API(`initialize` + `await render`)를 쓰므로 v11 호환. v11은 ELK 레이아웃이 별도 패키지로 분리(사용 안 함 → 영향 없음). v12 변경점은 공개 자료에서 확인 못 함 → 10.9.8로 패치 후, 12는 CHANGELOG 확인 + projects 페이지 다이어그램 수동 확인 |
| `flag-icons`             | 7.5.0    | 7.6.0                 | Minor         | CSS만 import                                                                                                                                                                                                                                                                      |
| `typewriter-effect`      | 2.22.0   | (삭제 권장)           | -             | 1-D                                                                                                                                                                                                                                                                               |
| `@vercel/analytics`      | 2.0.1    | 2.0.1                 | -             | 최신                                                                                                                                                                                                                                                                              |
| `@vercel/speed-insights` | 2.0.0    | 2.0.0                 | -             | 최신                                                                                                                                                                                                                                                                              |

```bash
npm i @reduxjs/toolkit@2.13.0 react-redux@9.3.0 react-icons@5.7.0 lucide-react@1.61.0 @headlessui/react@2.2.10 react-hook-form@7.91.0 sweetalert2@11.26.25 emoji-picker-react@4.22.3 mermaid@10.9.8 flag-icons@7.6.0
```

### 2-D. Tailwind (Major, 별도 단계)

| 패키지         | 현재    | 목표        | 비고                                                                                                                                                                                                                                                     |
| -------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwindcss`  | 3.4.19  | **4.3.3**   | CSS-first 설정으로 전환. `tailwind.config.js`의 `keyframes/animation/fontFamily`를 `globals.css`의 `@theme` + `@keyframes`로 이동, `@tailwind base/components/utilities` 3줄 → `@import "tailwindcss"`, PostCSS 플러그인을 `@tailwindcss/postcss`로 교체 |
| `postcss`      | 8.5.6   | 8.5.31      | Patch. v4에서는 Next 내장으로 충분하지만 명시해도 무방                                                                                                                                                                                                   |
| `autoprefixer` | 10.4.24 | (v4면 삭제) | 1-E                                                                                                                                                                                                                                                      |

- **위험 요소**: 코드 전반에서 `!important` 접두 문법(`[&_*]:!text-white` 류)을 **139곳** 쓰는데 v4는 접미(`text-white!`)로 바뀌었다. `npx @tailwindcss/upgrade`가 대부분 자동 변환하지만 `[&_...]` arbitrary variant와 결합된 것은 결과를 눈으로 확인해야 한다. 기본 border 색·ring 두께 등 v4 기본값 변경도 있다.
- 권장 순서: 2-A~2-C가 끝나고 별도 브랜치에서 `npx @tailwindcss/upgrade` → 전 페이지 시각 확인.

### 2-E. 테스트 도구

| 패키지                | 현재   | 목표               | 종류          | 비고                                                                                                                                        |
| --------------------- | ------ | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `vitest`              | 4.0.18 | 4.1.12 → **5.0.5** | Minor → Major | v5: `clearMocks` 기본 true, await 없는 async assertion 실패, Node ≥22.12 / Vite ≥6.4. 현재 테스트는 9파일뿐이라 영향 작음. 단 1-C 결정 후에 |
| `@vitest/coverage-v8` | 4.0.18 | vitest와 동일 버전 | -             | 유지 시 coverage 스크립트 추가, 아니면 삭제                                                                                                 |
| `jsdom`               | 27.0.1 | 27.4.0 → 30.1.3    | Minor → Major | 컴포넌트 테스트 4개가 `@vitest-environment jsdom` 사용. 30 변경점 확인 필요하나 DOM 테스트 범위가 작아 위험 낮음                            |
| `playwright`          | 1.58.2 | 1.64.1             | Minor         | e2e 1개 파일 + config. `npx playwright install` 재실행 필요                                                                                 |

### 2-F. Storybook (Major, 1-C 결정과 묶어서)

| 패키지                  | 현재           | 목표   | 비고                                                         |
| ----------------------- | -------------- | ------ | ------------------------------------------------------------ |
| `storybook`             | 9.1.19         | 10.6.3 | **ESM-only**가 핵심 변경. 10.3부터 Next.js 16.2 공식 지원    |
| `@storybook/nextjs`     | 9.1.19         | 10.6.3 | framework 유지 시                                            |
| `@storybook/addon-docs` | 9.1.19         | 10.6.3 |                                                              |
| `@storybook/blocks`     | 9.0.0-alpha.17 | 삭제   | 1-D, `@storybook/addon-docs/blocks`로 import 변경            |
| `overrides.storybook`   | `$storybook`   | 유지   | 하위 addon이 다른 storybook 버전을 끌어오지 못하게 하는 역할 |

`npx storybook@latest upgrade`가 config/import 마이그레이션 대부분을 자동 처리한다. 스토리 6개 + MDX 1개가 전부라 수동 수정량도 적다.

### 2-G. 린트 (현재 없음 → 신규)

`"lint": "next lint"`는 Next 16에서 제거된 명령이고 eslint도 설치돼 있지 않다. 의존성 정리의 일부로:

```bash
npm i -D eslint@9 eslint-config-next@16.4.3
```

`eslint.config.mjs`(flat config)를 만들고 `"lint": "eslint ."`로 교체. 1-B의 phantom dependency 같은 문제는 `eslint-plugin-import`의 `no-extraneous-dependencies` 규칙으로 재발을 막을 수 있다.

---

## 3. 실행 순서 요약

| 단계 | 내용                                                                                                | 위험     | 확인                                             |
| ---- | --------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| 0    | `npm ci`로 node_modules 동기화, tsc/vitest 기준선 기록                                              | -        | -                                                |
| 1    | 1-A 미사용 8개 삭제 + 1-B TipTap 중복 8개 삭제 + FontSize import 교체 + phantom 4개 정리            | 낮음     | tsc, build, 에디터 수동(글꼴 크기·목록·코드블록) |
| 2    | 2-A 코어(next 16.4.3, react 19.3.1, types)                                                          | 낮음     | build, 주요 페이지                               |
| 3    | 2-B TipTap 3.32 + highlight.js                                                                      | 낮음     | 에디터·뷰어, `npm audit`                         |
| 4    | 2-C UI 라이브러리 Minor 일괄 + lucide-react 1.x                                                     | 낮음     | 에디터 메뉴바·AI 모달 아이콘                     |
| 5    | 1-C 결정 → Storybook 테스트 스택 삭제(또는 vite 전환) + 2-F Storybook 10 + `@storybook/blocks` 제거 | 중간     | `npm run storybook`                              |
| 6    | 2-E vitest 5 / jsdom 30 / playwright 1.64, `test` 스크립트 추가, 기존 실패 16건 수정                | 중간     | vitest, e2e                                      |
| 7    | 2-G eslint 9 flat config 도입                                                                       | 낮음     | `npm run lint`                                   |
| 8    | 2-D Tailwind 4 (별도 브랜치)                                                                        | **높음** | 전 페이지 시각 확인                              |
| 9    | 1-D 선택 교체(typewriter-effect, framer-motion), emoji-picker 5, mermaid 12                         | 낮음     | 해당 화면                                        |
| 보류 | typescript 7                                                                                        | -        | Next 공식 지원 후                                |

예상 결과: 의존성 72개 → **약 50개**(1-C "안 살린다" + 1-D 전부 적용 시 ~47개), `npm audit` critical 6건 중 next·storybook·vitest 계열 해소, `node_modules`에서 AWS SDK·axios·jotai·msw·storybook-vite·chromatic 제거.

---

## 부록. 패키지별 사용 파일 수 (스캔 결과)

| 패키지                                                                                                                                                                           | 파일 수         | 판정                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| react                                                                                                                                                                            | 137             | 사용                                               |
| next                                                                                                                                                                             | 82              | 사용                                               |
| react-icons                                                                                                                                                                      | 44              | 사용                                               |
| vitest                                                                                                                                                                           | 12              | 사용                                               |
| lucide-react                                                                                                                                                                     | 10              | 사용                                               |
| react-redux                                                                                                                                                                      | 7               | 사용                                               |
| react-dom                                                                                                                                                                        | 6               | 사용                                               |
| @tiptap/core                                                                                                                                                                     | 5               | 사용                                               |
| @reduxjs/toolkit                                                                                                                                                                 | 4               | 사용                                               |
| @tiptap/react, highlight.js, lowlight, react-hook-form                                                                                                                           | 3               | 사용                                               |
| playwright                                                                                                                                                                       | 2               | 사용                                               |
| @tiptap/starter-kit, bubble-menu, code-block-lowlight, color, font-family, font-size, highlight, image, link, table, text-align, text-style, underline, youtube                  | 1               | 사용 (font-size는 text-style로 대체)               |
| @headlessui/react, @vercel/analytics, @vercel/speed-insights, emoji-picker-react, flag-icons, framer-motion, mermaid, react-markdown, remark-gfm, sweetalert2, typewriter-effect | 1               | 사용 (framer-motion·typewriter-effect는 교체 가능) |
| @storybook/addon-vitest, @storybook/blocks, @storybook/nextjs, tailwindcss                                                                                                       | 1 (설정/MDX)    | 사용                                               |
| @tiptap/pm                                                                                                                                                                       | 0               | **peer dep → 유지**                                |
| @types/node, @types/react, @types/react-dom, typescript, postcss, jsdom                                                                                                          | 0 (암묵적 사용) | 유지                                               |
| autoprefixer                                                                                                                                                                     | 0               | postcss 설정에 없음 → 추가 또는 삭제               |
| @vitest/browser, @vitest/coverage-v8, @chromatic-com/storybook, @storybook/nextjs-vite, @storybook/addon-docs, storybook                                                         | 0 (설정으로만)  | addon-docs·storybook 유지, 나머지 1-C 결정         |
| @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, axios, js-cookie, @types/js-cookie, jotai, msw, @storybook/addon-links                                                        | 0               | **삭제**                                           |
| @tiptap/extension-blockquote, bold, dropcursor, heading, table-cell, table-header, table-row                                                                                     | 0               | **삭제** (starter-kit / extension-table 포함)      |
