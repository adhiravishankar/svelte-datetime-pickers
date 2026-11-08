#!/usr/bin/env node
// Builds the four docs sites for GitHub Pages and puts them in one folder:
//
//   _site/index.html                  a landing page that links to the sites
//   _site/material-tanstack/          each site, built with its own base path
//   _site/shadcn-tanstack/
//   _site/material-headless/
//   _site/shadcn-headless/
//
// The sites are served from https://<owner>.github.io/<repository>/<site>/, so each one is built with
// BASE_PATH=/<repository>/<site>. Environment variables:
//   PAGES_REPO  the repository name, the first part of the path (default: svelte-tables)
//   SITE_URL    the origin, for canonical links and the sitemap (default: https://adhiravishankar.github.io)
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const repo = process.env.PAGES_REPO ?? 'svelte-tables';
const siteUrl = process.env.SITE_URL ?? 'https://adhiravishankar.github.io';
const out = join(root, '_site');

const SITES = [
  {
    slug: 'material-tanstack',
    title: 'Material TanStack',
    text: 'Svelte Material UI on TanStack Table v9. The full feature set.',
    docs: 'material-svelte-tanstack-table-docs',
    lib: 'material-svelte-tanstack-table',
    folder: 'material-tanstack-table-docs',
  },
  {
    slug: 'shadcn-tanstack',
    title: 'shadcn TanStack',
    text: 'shadcn-svelte and Tailwind on TanStack Table v9. The full feature set.',
    docs: 'shadcn-svelte-tanstack-table-docs',
    lib: 'shadcn-svelte-tanstack-table',
    folder: 'shadcn-tanstack-table-docs',
  },
  {
    slug: 'material-headless',
    title: 'Material headless',
    text: 'Svelte Material UI on Svelte Headless Table. Plugin based and smaller.',
    docs: 'material-svelte-headless-table-docs',
    lib: 'material-svelte-headless-table',
    folder: 'material-headless-table-docs',
  },
  {
    slug: 'shadcn-headless',
    title: 'shadcn headless',
    text: 'shadcn-svelte and Tailwind on Svelte Headless Table. Plugin based and smaller.',
    docs: 'shadcn-svelte-headless-table-docs',
    lib: 'shadcn-svelte-headless-table',
    folder: 'shadcn-headless-table-docs',
  },
];

const run = (command, env = {}) => {
  const result = spawnSync(command, {
    cwd: root,
    env: { ...process.env, ...env },
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error(`\nFailed: ${command}`);
    process.exit(result.status ?? 1);
  }
};

// empty the folder rather than delete it: Windows refuses to delete a folder that a shell has open
mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) rmSync(join(out, entry), { force: true, recursive: true });

for (const site of SITES) {
  console.log(`\n== ${site.title}`);
  run(`npm run build -w ${site.lib}`);
  run(`npm run build -w ${site.docs}`, {
    BASE_PATH: `/${repo}/${site.slug}`,
    SITE_URL: siteUrl,
  });
  cpSync(join(root, 'apps', site.folder, 'dist'), join(out, site.slug), { recursive: true });
}

const cards = SITES.map(
  (site) => `      <a class="card" href="./${site.slug}/">
        <h2>${site.title}</h2>
        <p>${site.text}</p>
      </a>`,
).join('\n');

writeFileSync(
  join(out, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Svelte Tables</title>
    <meta name="description" content="Data tables for Svelte 5 in four flavors." />
    <style>
      :root { color-scheme: light dark; --bg: #fff; --fg: #1a1a1a; --muted: #666; --border: #ddd; --accent: #3b6df0; }
      @media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; --muted: #aaa; --border: #333; --accent: #7ea2ff; } }
      body { background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; margin: 0; }
      main { margin: 0 auto; max-width: 52rem; padding: 3rem 1rem; }
      h1 { font-size: 2rem; margin: 0 0 0.25rem; }
      .lead { color: var(--muted); margin: 0 0 2rem; }
      .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
      .card { border: 1px solid var(--border); border-radius: 0.5rem; color: inherit; padding: 1rem 1.25rem; text-decoration: none; }
      .card:hover { border-color: var(--accent); }
      .card h2 { font-size: 1.1rem; margin: 0 0 0.25rem; }
      .card p { color: var(--muted); font-size: 0.9rem; margin: 0; }
      footer { color: var(--muted); font-size: 0.9rem; margin-top: 2rem; }
      footer a { color: var(--accent); }
    </style>
  </head>
  <body>
    <main>
      <h1>Svelte Tables</h1>
      <p class="lead">Data tables for Svelte 5, with Material or shadcn-svelte components, on TanStack Table or Svelte Headless Table.</p>
      <div class="grid">
${cards}
      </div>
      <footer><a href="https://github.com/adhiravishankar/${repo}">Source on GitHub</a></footer>
    </main>
  </body>
</html>
`,
);
// no Jekyll processing: it would drop the folders that start with an underscore (_astro)
writeFileSync(join(out, '.nojekyll'), '');

console.log(`\nBuilt ${SITES.length} sites into ${out}`);
