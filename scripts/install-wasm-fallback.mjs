/**
 * Windows only, and only if needed.
 *
 * Astro depends on `satteri`, which ships a native binary. On machines where
 * Windows Application Control (Smart App Control) blocks that binary, Astro
 * fails to start with "An Application Control policy has blocked this file".
 * The package also ships a WebAssembly build, which npm skips by default.
 * This installs that build, matching the installed satteri version.
 *
 *   npm run setup:wasm
 *
 * It is not saved to package.json (it would break installs on other systems),
 * so run it again after every `npm install`.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
  readFileSync(new URL('../node_modules/satteri/package.json', import.meta.url), 'utf8'),
);
const pkg = `@bruits/satteri-wasm32-wasi@${version}`;
console.log(`Installing ${pkg} (not saved to package.json)`);
execSync(`npm install --no-save --force ${pkg}`, { stdio: 'inherit' });
