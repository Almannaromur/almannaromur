/**
 * Validates every Markdoc file (news and project pages) against the tags in
 * markdoc.config.mjs and reports anything Markdoc flags, plus a few things it
 * does not flag but that render wrongly (emphasis markers left as text).
 *
 *   node scripts/check-markdoc.mjs            all files
 *   node scripts/check-markdoc.mjs <filter>   files whose path contains <filter>
 *
 * Exit code 1 when something is found.
 */
import Markdoc from '@markdoc/markdoc';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filter = process.argv[2];
const { default: astroConfig } = await import(pathToFileURL(path.join(ROOT, 'markdoc.config.mjs')).href);
// Only the tag definitions matter for validation; "render" may be an Astro component reference.
const config = { tags: Object.fromEntries(Object.entries(astroConfig.tags ?? {}).map(([name, tag]) => [name, { ...tag, render: typeof tag.render === 'string' ? tag.render : name }])) };

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdoc') ? [p] : []; });
const files = walk(path.join(ROOT, 'src/content')).filter((f) => !filter || f.includes(filter));

const text = (node) => (node.type === 'text' ? node.attributes.content ?? '' : (node.children ?? []).map(text).join(''));
let problems = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = source.match(/^---\n[\s\S]*?\n---\n?/);
  const offset = m ? m[0].split('\n').length - 1 : 0;
  const body = m ? source.slice(m[0].length) : source;
  const ast = Markdoc.parse(body);
  const found = [];
  for (const e of Markdoc.validate(ast, config)) found.push(`line ${(e.lines?.[0] ?? 0) + offset + 1}: [${e.error.level}] ${e.error.id}: ${e.error.message}`);
  // Markers that stayed in the text: unparsed emphasis, stray backslashes, entities, tag syntax.
  for (const node of ast.walk()) {
    if (node.type !== 'text') continue;
    const t = node.attributes.content ?? '';
    const line = (node.lines?.[0] ?? 0) + offset + 1;
    if (/\*\*|(^|\s)\*\S|\S\*(\s|$)/.test(t)) found.push(`line ${line}: emphasis marker left as text: "${t.slice(Math.max(0, t.search(/\*/) - 25), t.search(/\*/) + 25)}"`);
    if (/\\/.test(t)) found.push(`line ${line}: backslash left as text: "${t.slice(Math.max(0, t.indexOf('\\') - 25), t.indexOf('\\') + 25)}"`);
    if (/&[a-z]+;|&#\d+;/i.test(t)) found.push(`line ${line}: entity left as text: "${t.match(/.{0,20}&[a-z#0-9]+;.{0,20}/i)[0]}"`);
    if (/\{%|%\}|\{\{/.test(t)) found.push(`line ${line}: tag syntax left as text: "${t.slice(0, 60)}"`);
    if (/\]\(|\[[^\]]*\]$/.test(t)) found.push(`line ${line}: link syntax left as text: "${t.match(/.{0,25}(\]\(|\[[^\]]*\]$).{0,25}/)[0]}"`);
  }
  if (found.length) {
    problems += found.length;
    console.log(`\n${path.relative(ROOT, file).replace(/\\/g, '/')}`);
    for (const f of [...new Set(found)]) console.log('  ' + f);
  }
}
console.log(`\n${files.length} files checked, ${problems} problem(s)`);
process.exit(problems ? 1 : 0);
