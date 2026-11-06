import { defineConfig } from 'vite-plus';

// Root configuration for `vp lint`, `vp fmt` and `vp staged`.
// Packages have their own vite.config.ts for building and testing.
export default defineConfig({
  staged: {
    '*': 'vp fmt --no-error-on-unmatched-pattern --write',
  },
  lint: {
    ignorePatterns: ['**/dist/**', '**/.svelte-kit/**', '**/.vitest/**', '**/coverage/**'],
    plugins: ['typescript'],
    rules: {
      curly: 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'typescript/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
    },
    overrides: [
      {
        files: ['**/vite.config.ts', '**/vite.config.js'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
  },
  fmt: {
    ignorePatterns: ['**/dist/**', '**/.svelte-kit/**', '**/.vitest/**', '**/coverage/**'],
    printWidth: 100,
    singleQuote: true,
  },
});
