#!/usr/bin/env node
// Logs in to npm if needed, then builds, tests and publishes the libraries.
//
//   npm run publish:all                      publish every library
//   npm run publish:dry                      do everything except upload
//   npm run publish:all -- svelte-date-input only some libraries
//   npm run publish:all -- --otp 123456      one-time password for 2FA
//   npm run publish:all -- --tag next        publish under a dist-tag
//   npm run publish:all -- --skip-checks     skip the tests and tsc
//
// A version that is already on npm is skipped, so the script can be re-run.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// In dependency order: a package is published after the ones it depends on.
const LIBRARIES = [
  'svelte-fit-action',
  'svelte-analog-clock',
  'svelte-range-calendar',
  'svelte-date-input',
  'svelte-time-input',
  'svelte-datetime-input',
  'svelte-datetimerange-picker',
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const dryRun = flag('--dry-run');
const skipChecks = flag('--skip-checks');
const otp = option('--otp');
const tag = option('--tag');
const wanted = args.filter(
  (arg, index) => !arg.startsWith('--') && !['--otp', '--tag'].includes(args[index - 1]),
);

const libraries = LIBRARIES.map((folder) => {
  const pkg = JSON.parse(readFileSync(join(root, 'packages', folder, 'package.json'), 'utf8'));
  return { folder, name: pkg.name, version: pkg.version };
}).filter(
  (library) =>
    wanted.length === 0 || wanted.includes(library.name) || wanted.includes(library.folder),
);

if (libraries.length === 0) {
  console.error(`No library matches ${wanted.join(', ')}. Choose from: ${LIBRARIES.join(', ')}`);
  process.exit(1);
}

// `npm` is npm.cmd on Windows, which needs a shell.
const command = (npmArgs) => ['npm', ...npmArgs].join(' ');
const npm = (npmArgs) => spawnSync(command(npmArgs), { cwd: root, shell: true, stdio: 'inherit' });
const npmQuiet = (npmArgs) =>
  spawnSync(command(npmArgs), { cwd: root, encoding: 'utf8', shell: true });

const step = (message) => console.log(`\n\u001b[1m${message}\u001b[0m`);
const fail = (message) => {
  console.error(`\n\u001b[31m${message}\u001b[0m`);
  process.exit(1);
};

// ---- login
if (dryRun) {
  step('Dry run: nothing is uploaded, so no login is needed');
} else {
  step('Checking the npm login');
  let who = npmQuiet(['whoami']);
  if (who.status !== 0) {
    console.log('Not logged in. Starting `npm login`...');
    if (npm(['login']).status !== 0) fail('npm login failed.');
    who = npmQuiet(['whoami']);
    if (who.status !== 0) fail('Still not logged in.');
  }
  console.log(`Logged in as ${who.stdout.trim()}`);
}

// ---- what is already published
const published = (library) => {
  const result = npmQuiet(['view', `${library.name}@${library.version}`, 'version']);
  return result.status === 0 && result.stdout.trim() === library.version;
};

const todo = [];
for (const library of libraries) {
  if (published(library)) {
    console.log(`- ${library.name}@${library.version} is already on npm, skipping`);
  } else {
    todo.push(library);
  }
}
if (todo.length === 0) {
  console.log('\nNothing to publish.');
  process.exit(0);
}

// ---- build, check, publish
for (const library of todo) {
  const spec = `${library.name}@${library.version}`;
  step(`${spec}: build`);
  if (npm(['run', 'build', '-w', library.name]).status !== 0)
    fail(`The build of ${library.name} failed.`);

  if (!skipChecks) {
    step(`${spec}: tsc`);
    if (npm(['run', 'tsc', '-w', library.name]).status !== 0)
      fail(`tsc of ${library.name} failed.`);
    step(`${spec}: tests`);
    if (npm(['run', 'unit', '-w', library.name]).status !== 0)
      fail(`The tests of ${library.name} failed.`);
  }
}

for (const library of todo) {
  const spec = `${library.name}@${library.version}`;
  step(`${spec}: ${dryRun ? 'dry run' : 'publish'}`);
  const publishArgs = ['publish', '-w', library.name, '--access', 'public'];
  if (dryRun) publishArgs.push('--dry-run');
  if (tag) publishArgs.push('--tag', tag);
  if (otp) publishArgs.push('--otp', otp);
  if (npm(publishArgs).status !== 0) fail(`Publishing ${spec} failed.`);
}

console.log(
  `\n\u001b[32m${dryRun ? 'Dry run finished' : 'Published'}: ${todo.map((l) => `${l.name}@${l.version}`).join(', ')}\u001b[0m`,
);
