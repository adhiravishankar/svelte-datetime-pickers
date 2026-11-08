# AGENTS.md

npm workspaces monorepo of Svelte 5 components (runes). See CONTRIBUTING.md for the full workflow.

## Layout

- `packages/*`: svelte-datetimerange-picker, svelte-datetime-input, svelte-time-input, svelte-date-input, svelte-range-calendar, svelte-analog-clock, svelte-fit-action (actions only, no components), svelte-date-utils (plain TypeScript date helpers; adapters for native Date, date-fns and Luxon, adapted from `@mui/x-date-pickers`).
- `scripts`: `build-pages.mjs` (GitHub Pages bundle of `sample` + `storybook` into `_site/`), `publish.mjs` (npm publish), `rehype-base.mjs`.
- `test`: workspace page with controls for every picker option.
- `sample`: Astro example. NOT a workspace; has its own `npm install`. Run `npm install` at the repo root first, because it resolves the picker through the root workspace symlink.
- `storybook`: Storybook 10. NOT a workspace; has its own `npm install`. Stories are in `storybook/stories/` and packages are aliased to their `src`. It must stay outside the workspaces because it conflicts with the pinned `vite-plus` override at the root.

## Commands (repo root)

- `npm run build`: builds every package in dependency order (`svelte-date-utils` first, then the rest through the workspace list). Build before `unit` or `tsc`: packages resolve each other through `dist/`, so `tsc` fails with "Cannot find module" until the dependency is built.
- `npm run unit`: Chromium tests (Playwright).
- `npm run tsc`, `npm run lint`, `npm run format`.
- `npm run dev`: watches the packages and starts the test page.
- `npm run build:pages`: builds `sample` and `storybook` into `_site/` for GitHub Pages. It runs `npm install` and `npm run build` at the root first.
- `npm run publish:dry`: builds, tests and type-checks every library, then does everything except upload. `npm run publish:all` publishes in dependency order and skips versions already on npm. It also takes `--otp`, `--tag` and `--skip-checks`, and you can pass package names to publish only some.

## Conventions

- Tests live next to the code as `*.spec.ts` (`vite-plus/test`, `vitest-browser-svelte`). `render` is async, so always `await` it.
- Oxfmt does not format `.svelte` files: format them by hand (2-space indentation, single quotes, about 100 columns).
- The root `overrides` pin `vite` to the vite-plus fork. Do not add tooling to the root that peers on stock Vite.
- New components need a story in `storybook/stories/`.
- Date math goes through `svelte-date-utils` (a replacement for `@wojtekmaj/date-utils`), not a direct dependency on date-fns or Luxon. All packages share one version number, and internal dependency ranges (`^0.2.0`) must be bumped together with it.
- `.npmrc` sets `min-release-age=14`, so dependencies must be at least 14 days old. `legacy-peer-deps=true` is set too.
- TypeScript targets `es2025` (`tsconfig.base.json`). Husky runs a pre-commit hook after `npm install`.
