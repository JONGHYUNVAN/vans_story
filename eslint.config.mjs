// ESLint 9+ flat config. 규칙의 근거와 예외는 CONVENTIONS.md 참고.
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'node_modules/**',
    'next-env.d.ts',
    'public/**',
  ]),

  // Next 공식 프리셋: react, react-hooks, jsx-a11y, @next/next, import, typescript-eslint
  ...nextVitals,
  ...nextTs,

  {
    name: 'vans-story/base',
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // ── 안전성 ────────────────────────────────────────────────
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'multi-line'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // ── TypeScript ────────────────────────────────────────────
      // any는 unknown + 좁히기로 대체한다. 기존 위반은 warn으로 두고 점진 제거.
      '@typescript-eslint/no-explicit-any': 'warn',
      // 안 쓰는 import는 자동 제거(--fix). 나머지 미사용 변수는 아래 no-unused-vars가 잡는다.
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      // `interface PostInfo extends Post {}` 처럼 이름만 구분하는 단일 상속은 허용
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],

      // ── import ────────────────────────────────────────────────
      // 다른 디렉터리의 모듈은 항상 @/ 별칭으로. 상대 경로는 같은 디렉터리(./)만 허용.
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['../*'],
              message: '상위 디렉터리 상대 경로 대신 @/ 별칭을 사용하세요.',
            },
          ],
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'ignore',
        },
      ],
      'import/no-duplicates': 'error',

      // ── React ─────────────────────────────────────────────────
      // 컴포넌트는 function 선언. 익명 콜백 컴포넌트만 화살표 허용.
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/no-unknown-property': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    name: 'vans-story/tests',
    files: ['**/__tests__/**', '**/*.test.{ts,tsx}', 'e2e/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    name: 'vans-story/config-files',
    files: [
      '*.config.{js,mjs,ts}',
      'eslint.config.mjs',
      'tailwind.config.js',
      'postcss.config.mjs',
    ],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Prettier가 담당하는 서식 규칙은 모두 끈다. 반드시 마지막.
  prettier,
]);
