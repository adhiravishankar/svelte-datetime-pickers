import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

// BASE_PATH and SITE_URL are set by scripts/build-pages.mjs for GitHub Pages.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  site: process.env.SITE_URL,
  integrations: [svelte()],
});
