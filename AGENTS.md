# AGENTS.md

npm workspaces monorepo of Svelte 5 components (runes). See CONTRIBUTING.md for the full workflow.

## Layout

- `packages/*`: svelte-datetimerange-picker, svelte-datetime-input, svelte-time-input, svelte-date-input, svelte-range-calendar, svelte-analog-clock, svelte-fit-action (actions only, no components).
- `test`: workspace page with controls for every picker option.
- `sample`: Astro example. NOT a workspace; has its own `npm install`. Run `npm install` at the repo root first, because it resolves the picker through the root workspace symlink.
- `storybook`: Storybook 10. NOT a workspace; has its own `npm install`. Stories are in `storybook/stories/` and packages are aliased to their `src`. It must stay outside the workspaces because it conflicts with the pinned `vite-plus` override at the root.

## Commands (repo root)

- `npm run build`: builds every package in dependency order. Build before `unit` or `tsc`.
- `npm run unit`: Chromium tests (Playwright).
- `npm run tsc`, `npm run lint`, `npm run format`.
- `npm run dev`: watches the packages and starts the test page.

## Conventions

- Tests live next to the code as `*.spec.ts` (`vite-plus/test`, `vitest-browser-svelte`). `render` is async, so always `await` it.
- Oxfmt does not format `.svelte` files: format them by hand (2-space indentation, single quotes, about 100 columns).
- The root `overrides` pin `vite` to the vite-plus fork. Do not add tooling to the root that peers on stock Vite.
- New components need a story in `storybook/stories/`.
