/**
 * Project pages: on the old site some paragraphs follow each other with only a
 * line break, others with a blank line between them. This joins paragraphs in
 * src/content/projects/is/*.mdoc with a hard line break ("\" at the end of the
 * line) wherever the old site had no blank line between them.
 *
 *   node scripts/match-paragraph-breaks.mjs <dump dir>           report only
 *   node scripts/match-paragraph-breaks.mjs <dump dir> --write   rewrite the files
 *
 * <dump dir> holds p-<slug>-live.txt: a text dump of each old page, one "| text"
 * line per paragraph under each text block, with "⏎" for an empty paragraph.
 * One-off tool, kept for reference.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src/content/projects/is');
const [dumpDir, flag] = process.argv.slice(2);
if (!dumpDir) throw new Error('Usage: node scripts/match-paragraph-breaks.mjs <dump dir> [--write]');
const norm = (s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`\\→•]/g, '').replace(/&nbsp;/g, ' ').replace(/[“”„"'‘’]/g, '').replace(/­/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const key = (s) => norm(s).slice(0, 32);

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.mdoc'))) {
  const slug = file.replace('.mdoc', '');
  const dump = path.join(dumpDir, `p-${slug}-live.txt`);
  if (!existsSync(dump)) { console.log(`${slug}: no dump`); continue; }
  // Pairs of paragraphs that follow each other in one text block without a blank line between them.
  const tight = new Set();
  let block = [];
  const flush = () => {
    for (let i = 0; i + 1 < block.length; i++) if (block[i] && block[i + 1]) tight.add(key(block[i]) + '>' + key(block[i + 1]));
    block = [];
  };
  for (const line of readFileSync(dump, 'utf8').split('\n')) {
    const p = line.match(/^\s+\| (.*)$/);
    if (!p) { flush(); continue; }
    const text = p[1].replace(/⏎/g, ' ').trim();
    // A paragraph that ends in a line break also leaves a blank line after it.
    block.push(text ? p[1] : '');
    if (/⏎\s*$/.test(p[1]) && text) block.push('');
  }
  flush();

  const source = readFileSync(path.join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const m = source.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) { console.log(`${slug}: front matter not found`); continue; }
  const blocks = m[2].split(/\n{2,}/);
  const isPlain = (b) => b && !/^(\{%|#|[-*+] |\d+\. |!\[|>|\|)/.test(b.trim()) && !/\{%/.test(b);
  const out = [];
  let joined = 0;
  for (const b of blocks) {
    const prev = out[out.length - 1];
    const prevLast = prev?.split('\\\n').pop();
    if (prev !== undefined && isPlain(prev) && isPlain(b) && tight.has(key(prevLast) + '>' + key(b))) {
      out[out.length - 1] = prev.replace(/\s+$/, '') + '\\\n' + b.trim();
      joined += 1;
    } else out.push(b);
  }
  const next = m[1] + out.join('\n\n');
  console.log(`${slug.padEnd(16)} tight pairs on the old site: ${String(tight.size).padStart(3)}, joined here: ${joined}`);
  if (flag === '--write' && next !== source) writeFileSync(path.join(DIR, file), next);
}
