#!/usr/bin/env node
// Builds the two sites for GitHub Pages and puts them in one folder:
//
//   _site/index.html    a landing page that links to the sites
//   _site/sample/       the Astro sample page, built with its own base path
//   _site/storybook/    Storybook
//
// The sites are served from https://<owner>.github.io/<repository>/<site>/, so the sample is built
// with BASE_PATH=/<repository>/sample. Storybook uses relative paths and needs no base.
// Environment variables:
//   PAGES_REPO  the repository name, the first part of the path (default: svelte-datetime-pickers)
//   SITE_URL    the origin, for canonical links (default: https://adhiravishankar.github.io)
//
// `sample` and `storybook` are not workspaces: each has its own `npm install`, which this script
// runs when the folder has no node_modules.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const repo = process.env.PAGES_REPO ?? 'svelte-datetime-pickers';
const siteUrl = process.env.SITE_URL ?? 'https://adhiravishankar.github.io';
const out = join(root, '_site');

const SITES = [
  {
    slug: 'sample',
    title: 'Sample page',
    text: 'Every component on one Astro page: the picker, inputs, range calendar and clock.',
    folder: 'sample',
    dist: 'dist',
    env: { BASE_PATH: `/${repo}/sample`, SITE_URL: siteUrl },
  },
  {
    slug: 'storybook',
    title: 'Storybook',
    text: 'Stories for each component, with controls for every option.',
    folder: 'storybook',
    dist: 'storybook-static',
    env: {},
  },
];

const run = (command, cwd = root, env = {}) => {
  const result = spawnSync(command, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error(`\nFailed: ${command}`);
    process.exit(result.status ?? 1);
  }
};

// the sample resolves the picker through the root workspace symlink, so build the packages first
console.log('\n== Packages');
run('npm install');
run('npm run build');

// empty the folder rather than delete it: Windows refuses to delete a folder that a shell has open
mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) rmSync(join(out, entry), { force: true, recursive: true });

for (const site of SITES) {
  console.log(`\n== ${site.title}`);
  const cwd = join(root, site.folder);
  if (!existsSync(join(cwd, 'node_modules'))) run('npm install', cwd);
  run('npm run build', cwd, site.env);
  cpSync(join(cwd, site.dist), join(out, site.slug), { recursive: true });
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
    <title>svelte-datetimerange-picker</title>
    <meta name="description" content="Date, time and range pickers for Svelte 5." />
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
      <h1>svelte-datetimerange-picker</h1>
      <p class="lead">Date, time and range pickers for Svelte 5, plus the inputs, calendar and clock they are built from.</p>
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
