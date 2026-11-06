import { fileURLToPath } from 'node:url';

import { mergeConfig } from 'vite';

import type { StorybookConfig } from '@storybook/svelte-vite';

const packagesDir = fileURLToPath(new URL('../../packages', import.meta.url));

// Resolve the sibling packages from source so changes show up without rebuilding `dist`.
const packageNames = [
  'svelte-analog-clock',
  'svelte-date-input',
  'svelte-datetime-input',
  'svelte-datetimerange-picker',
  'svelte-fit-action',
  'svelte-range-calendar',
  'svelte-time-input',
];

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.svelte'],
  addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs'],
  framework: '@storybook/svelte-vite',
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      resolve: {
        alias: Object.fromEntries(
          packageNames.map((name) => [name, `${packagesDir}/${name}/src/index.ts`]),
        ),
        dedupe: ['svelte'],
      },
      server: { fs: { allow: ['..'] } },
    });
  },
};

export default config;
