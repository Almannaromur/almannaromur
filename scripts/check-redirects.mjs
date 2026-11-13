/**
 * Checks that every address of the old (Framer) site still leads somewhere on the new one:
 * either the same address exists, or it redirects to a page that exists.
 *
 *   npm run build && npm run check:redirects          checks the build output (.vercel/output)
 *   npm run check:redirects -- https://example.com    checks a deployed site over the network
 *
 * The old addresses are in scripts/old-urls.json: the old site's sitemap plus every internal
 * link on its pages, collected on 13 November 2026. Redirects are defined in src/data/redirects.json.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const oldUrls = JSON.parse(readFileSync(join(import.meta.dirname, 'old-urls.json'), 'utf8'));
const base = process.argv[2]?.replace(/\/$/, '');

/** Follows redirects in the build output. `request` is the path as a client sends it. */
function resolveInBuild(request) {
  const output = join(root, '.vercel', 'output');
  const routes = JSON.parse(readFileSync(join(output, 'config.json'), 'utf8')).routes.filter(
    (route) => route.src && route.status >= 300 && route.status < 400 && route.headers?.Location,
  );
  let path = request;
  const hops = [];
  for (let i = 0; i < 5; i++) {
    const route = routes.find((r) => new RegExp(r.src).test(path));
    if (!route) break;
    path = path.replace(new RegExp(route.src), route.headers.Location);
    hops.push(path);
  }
  const file = decodeURI(path);
  const exists =
    file === '/'
      ? existsSync(join(output, 'static', 'index.html'))
      : [join(file, 'index.html'), `${file}.html`].some((candidate) => existsSync(join(output, 'static', candidate)));
  return { final: path, hops: hops.length, ok: exists, status: exists ? 200 : 404 };
}

/** Follows redirects on a deployed site. */
async function resolveOnSite(request) {
  let url = base + request;
  let hops = 0;
  for (; hops < 6; hops++) {
    const response = await fetch(url, { redirect: 'manual' });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      url = new URL(location, url).href;
      continue;
    }
    return { final: decodeURI(new URL(url).pathname), hops, ok: response.status === 200, status: response.status };
  }
  return { final: url, hops, ok: false, status: 'too many redirects' };
}

if (!base && !existsSync(join(root, '.vercel', 'output', 'config.json'))) {
  console.error('No build output found. Run "npm run build" first, or pass the address of a deployed site.');
  process.exit(1);
}

console.log(`Checking ${oldUrls.length} old addresses against ${base ?? 'the build output'}\n`);
let same = 0;
let redirected = 0;
const problems = [];
for (const old of oldUrls) {
  // Browsers send Icelandic letters percent-encoded; some tools write the codes in lower case or
  // send the letters as they are. All spellings must work, with and without a trailing slash.
  const encoded = encodeURI(old);
  const lower = encoded.replace(/%[0-9A-F]{2}/g, (code) => code.toLowerCase());
  const spellings = [...new Set([encoded, lower, old, old === '/' ? old : `${encoded}/`])];
  const results = [];
  for (const spelling of base ? [encoded, lower] : spellings) {
    results.push(base ? await resolveOnSite(spelling) : resolveInBuild(spelling));
  }
  const first = results[0];
  const agree = results.every((r) => r.ok === first.ok && decodeURI(r.final) === decodeURI(first.final));
  if (!first.ok || !agree) {
    problems.push(`${old}  ->  ${first.final}  (${agree ? first.status : 'the encoded and plain spellings lead to different places'})`);
  } else if (first.hops === 0) {
    same++;
  } else {
    redirected++;
    console.log(`${old}\n   -> ${decodeURI(first.final)}${first.hops > 1 ? `  (${first.hops} redirects)` : ''}`);
  }
}
console.log(`\n${same} addresses are unchanged, ${redirected} redirect to a page that exists, ${problems.length} problem(s).`);
if (problems.length) {
  console.log('\nProblems:\n' + problems.join('\n'));
  if (base && problems.some((p) => p.includes('(401)'))) {
    console.log('\n401 means the deployment is password-protected (Vercel deployment protection), not that the page is missing.');
  }
  process.exit(1);
}
