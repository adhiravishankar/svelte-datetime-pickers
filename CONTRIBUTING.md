# Contributing

Thanks for your interest in contributing! This document explains how to set up the repository, make changes and submit them.

## Repository layout

This is an npm workspaces monorepo.

| Path                                   | What it is                                                                |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `packages/svelte-datetimerange-picker` | The datetime range picker.                                                |
| `packages/svelte-datetime-input`       | Datetime input fields.                                                    |
| `packages/svelte-time-input`           | Time input fields.                                                        |
| `packages/svelte-date-input`           | Date input fields, and the segmented-input engine the other inputs share. |
| `packages/svelte-range-calendar`       | Calendar with range selection.                                            |
| `packages/svelte-analog-clock`         | Analog clock.                                                             |
| `packages/svelte-fit-action`           | `fit` and `portal` Svelte actions.                                        |
| `test`                                 | Test page with controls for every option of the picker.                   |
| `sample`                               | Minimal Astro usage example. Not a workspace; has its own `npm install`.  |
| `storybook`                            | Storybook with stories for the six component packages. Not a workspace.   |

Dependencies between packages are linked through the workspace, so a package must be built before the packages that use it can be tested or type-checked.

## Prerequisites

- Node.js `^22.18.0`, `^24.11.0` or `>=26.0.0` (required by Vitest 5)
- npm (the version pinned in `packageManager` in the root `package.json`)

## Getting started

```sh
npm install
npm run build
npm exec --workspace svelte-datetimerange-picker -- playwright install chromium-headless-shell   # once
```

Tests run in a real browser (Chromium through Playwright) because the components depend on layout, focus behaviour and `Intl`.

## Development workflow

```sh
npm run dev
```

This rebuilds every package on change and starts the test page. Open the URL it prints to try your changes.

Run a command in a single package with `--workspace`, for example:

```sh
npm run unit --workspace svelte-range-calendar
```

### Storybook

```sh
cd storybook
npm install   # once
npm run dev   # http://localhost:6006
```

Stories live in `storybook/stories/*.stories.svelte`, one file per component. Packages are resolved from their `src`, so there is no need to build first and changes show up live. Storybook has its own install, outside the workspaces, because it conflicts with the pinned `vite-plus` at the repo root. `svelte-fit-action` has no stories since it is not a component.

### Commands

| Command          | What it does                                                            |
| ---------------- | ----------------------------------------------------------------------- |
| `npm run build`  | Builds every package, in dependency order, and the test page.           |
| `npm run unit`   | Runs unit tests (`vp test`) in Chromium. Build first.                   |
| `npm run tsc`    | Type-checks with `svelte-check`.                                        |
| `npm run lint`   | Lints with Oxlint (`vp lint`).                                          |
| `npm run format` | Checks formatting with Oxfmt (`vp fmt --check`).                        |
| `npm test`       | Runs lint, type checking, format check and unit tests in every package. |

To fix formatting, run `npx vp fmt --write`. A pre-commit hook does this for staged files.

## Code style

- TypeScript is strict. Use separate `import type` statements.
- Components use Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`).
- Linting uses Oxlint and formatting uses Oxfmt, configured in the root `vite.config.ts`. Oxfmt does not support `.svelte` files, so format those by hand: 2-space indentation, single quotes, and a print width of about 100 characters.
- Class names follow BEM with the package prefix (`svelte-datetimerange-picker__…`, `svelte-calendar__…`, `svelte-clock__…`). Don't rename existing classes, since consumers style against them.
- Every user-facing prop needs a JSDoc comment. Document new props in the package README as well.

## Tests

- Put tests next to the code as `*.spec.ts`, using `vite-plus/test`, `vite-plus/test/browser` and `vitest-browser-svelte`. `render` is async, so always `await` it.
- Add or update tests for every behaviour change or bug fix.
- Prefer querying by role, label or the documented class names rather than internals.

## Making a change

1. Create a branch from `main`.
2. Make your change, with tests and documentation.
3. Run `npm test` and make sure it passes. CI runs the same checks.
4. Open a pull request that explains what changed and why. Link related issues.

Keep pull requests focused: one fix or feature per pull request makes review faster.

## Releasing

Releases are published by the `Publish` GitHub workflow when a GitHub release is published. It publishes every package in dependency order, with the `latest` tag for releases and `next` for prereleases. Bump versions in the affected `package.json` files (and the matching dependency ranges between packages) before creating a release.

## Reporting bugs

Please open an issue with a minimal reproduction, the package and version, your browser, and your locale if it's relevant.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
