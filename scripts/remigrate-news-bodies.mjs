/**
 * Rebuilds the body of every migrated news article from a block-by-block
 * harvest of the old site, so that spacing, headings, lists, quotes, expandable
 * rows, captions, buttons and side boxes match it.
 *
 *   node scripts/remigrate-news-bodies.mjs <harvest dir>          report only
 *   node scripts/remigrate-news-bodies.mjs <harvest dir> --write  rewrite src/content/news/*.mdoc
 *
 * <harvest dir> holds one <slug>.json per article (title, side boxes and the
 * list of body blocks as read from the old site in a browser). Front matter
 * (title, date, category, summary, cover) and the image and PDF files that the
 * first migration downloaded are kept; only the body and the two side boxes
 * are replaced. This is a one-off tool, kept for reference.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEWS = path.join(ROOT, 'src/content/news');
const [harvestDir, flag] = process.argv.slice(2);
if (!harvestDir) throw new Error('Usage: node scripts/remigrate-news-bodies.mjs <harvest dir> [--write]');
const WRITE = flag === '--write';

const redirects = JSON.parse(readFileSync(path.join(ROOT, 'src/data/redirects.json'), 'utf8'));
const redirectTo = (p) => { const hit = redirects[p]; return hit ? (typeof hit === 'string' ? hit : hit.destination) : null; };
const warnings = [];
const norm = (s) => s.replace(/[*_`\\]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/** Links as they were rewritten by the first migration (PDFs under /skra/, internal paths). */
function oldLinks(body) {
  const byText = new Map();
  for (const m of body.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) byText.set(norm(m[1]), m[2]);
  return byText;
}

function rewriteHref(href, text, ctx) {
  if (!href) return href;
  let h = href.trim();
  const origin = /^https?:\/\/(www\.)?almannaromur\.is/i;
  if (origin.test(h)) h = h.replace(origin, '') || '/';
  if (/^\.\.?\//.test(h)) h = '/' + h.replace(/^(\.\.?\/)+/, '');
  if (h.startsWith('/')) {
    let p = h;
    try { p = decodeURIComponent(h); } catch {}
    const [pathOnly, hash = ''] = p.split('#');
    const clean = pathOnly.length > 1 ? pathOnly.replace(/\/$/, '') : pathOnly;
    return (redirectTo(clean) ?? clean) + (hash ? '#' + hash : '');
  }
  if (/framerusercontent\.com\/assets\//.test(h)) {
    const old = ctx.links.get(norm(text));
    if (old && old.startsWith('/skra/')) return old;
    warnings.push(`${ctx.slug}: file link kept on the old host: "${text.slice(0, 40)}" -> ${h}`);
  }
  return h;
}

/** Inline Markdown from the harvest -> Markdoc text for one paragraph. */
function inline(md, ctx) {
  let s = md.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, text, href) => `[${text.replace(/\n/g, ' ')}](${rewriteHref(href, text, ctx)})`);
  // Bold or italic around punctuation only (a stray "**.**") is not valid Markdown emphasis: drop
  // those markers. Markers are paired in order (1st with 2nd, 3rd with 4th), so the end of one
  // bold run is never matched with the start of the next.
  for (const [marker, pattern] of [['**', /\*\*/g], ['*', /(?<!\*)\*(?!\*)/g]]) {
    const at = [...s.matchAll(pattern)].map((hit) => hit.index);
    const drop = [];
    for (let i = 0; i + 1 < at.length; i += 2) {
      if (!/[\p{L}\p{N}]/u.test(s.slice(at[i] + marker.length, at[i + 1]))) drop.push(at[i], at[i + 1]);
    }
    for (const i of drop.reverse()) s = s.slice(0, i) + s.slice(i + marker.length);
  }
  // Line breaks inside the paragraph. Blank lines at its start or end were visible gaps on the old
  // site (one line per break at the start, one per break after the first at the end): keep them as
  // lines holding a non-breaking space.
  let lines = s.split('\n').map((line) => line.trim());
  // Emphasis may not run across a line break in Markdoc: close it at the end of the line and
  // open it again on the next line that has text.
  for (const [marker, pattern] of [['**', /\*\*/g], ['*', /(?<!\*)\*(?!\*)/g]]) {
    let open = false;
    lines = lines.map((line) => {
      if (!line) return line;
      let out = open ? marker + line : line;
      const odd = (out.match(pattern) ?? []).length % 2 === 1;
      if (odd) out += marker;
      open = odd;
      return out;
    });
  }
  // An opening marker directly followed by a closing one (left by the step above) holds nothing.
  // Only "****" is removed: "** **" is the end of one bold run and the start of the next.
  lines = lines.map((line) => line.replace(/\*{4}/g, '').trim());
  let lead = 0;
  while (lines.length && !lines[0]) { lines.shift(); lead += 1; }
  let trail = 0;
  while (lines.length && !lines[lines.length - 1]) { lines.pop(); trail += 1; }
  s = [...Array(lead).fill('&nbsp;'), ...lines.map((line) => line || '&nbsp;'), ...Array(Math.max(0, trail - 1)).fill('&nbsp;')].join('\\\n');
  // Keep text that only looks like Markdown structure as text.
  s = s.replace(/^(\d+)\. /, '$1\\. ').replace(/^([-+*>#]) /, '\\$1 ').replace(/\{%/g, '{ %');
  // Non-breaking spaces typed by the authors decide where lines wrap: keep them, visibly.
  s = s.replace(/\u00a0/g, '&nbsp;');
  return s;
}
const attr = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim() + '"';
const plain = (md) => md.replace(/\u00a0/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/(^|[\s(„"])\*([^*\n]+)\*/g, '$1$2').split('\n').map((l) => l.trim()).join('\n').trim();

function renderBlocks(blocks, ctx) {
  const out = [];
  let arrows = null;
  const flushArrows = () => { if (arrows) { out.push('{% arrows %}\n' + arrows.map((t) => '- ' + t).join('\n') + '\n{% /arrows %}'); arrows = null; } };
  for (const b of blocks) {
    if (b.kind !== 'arrow') flushArrows();
    if (b.tag === 'p' || b.tag === 'blockquote') {
      if (b.empty) out.push('&nbsp;');
      else out.push((b.tag === 'blockquote' ? '> ' : '') + inline(b.md, ctx));
    } else if (/^h[1-6]$/.test(b.tag)) {
      if (b.empty) continue;
      const level = Math.min(4, Math.max(2, Number(b.tag[1])));
      // A heading is one line in Markdown. Blank lines inside it, after the text, were visible on
      // the old site: each becomes a line break followed by a non-breaking space.
      const trailing = (b.md.match(/\s*$/)[0].match(/\n/g) ?? []).length;
      const leading = (b.md.match(/^\s*/)[0].match(/\n/g) ?? []).length;
      let text = inline(b.md.trim(), ctx).replace(/\\\n/g, '{% br /%}');
      // The old site set some headings bold through their style. Markdown has to say so.
      const weight = Number(b.style?.match(/ w(\d+)/)?.[1] ?? 0);
      const base = { 2: 500, 3: 600, 4: 700 }[level];
      if (weight > base && !/\*\*/.test(text)) text = `**${text}**`;
      out.push('#'.repeat(level) + ' ' + '&nbsp;{% br /%}'.repeat(leading) + text + '{% br /%}&nbsp;'.repeat(Math.max(0, trailing - 1)));
    } else if (b.tag === 'ul' || b.tag === 'ol') {
      const start = Number(b.start ?? 1) || 1;
      out.push(b.items.map((item, i) => (b.tag === 'ol' ? `${start + i}. ` : '- ') + item.split(/\n\n+/).map((p) => inline(p, ctx).replace(/^(\d+)\\\. /, '$1. ')).join('\n\n  ')).join('\n'));
    } else if (b.tag === 'img') {
      const local = ctx.images.shift();
      if (!local) { warnings.push(`${ctx.slug}: no local file for image ${String(b.src).split('/').pop().slice(0, 40)}`); continue; }
      const alt = (local.alt || b.alt || '').replace(/[\[\]]/g, '');
      const md = `![${alt}](${local.src})`;
      const w = b.w ?? Number(b.attr?.[0]);
      out.push(w && w < 660 ? `{% narrow width=${Math.round(w)} %}\n${md}\n{% /narrow %}` : md);
    } else if (b.kind === 'quote') {
      const part = (name) => b.parts.find((p) => p.name === name)?.blocks.map((x) => x.md ?? '').join(' ').trim() ?? '';
      const attrs = [part('Nafn') && `name=${attr(plain(part('Nafn')))}`, part('Starfsheiti') && `role=${attr(plain(part('Starfsheiti')))}`].filter(Boolean).join(' ');
      out.push(`{% quote${attrs ? ' ' + attrs : ''} %}\n${inline(part('Tilvitnun'), ctx)}\n{% /quote %}`);
    } else if (b.kind === 'accordion') {
      const title = plain(b.parts[0]?.blocks[0]?.md ?? b.text);
      const inner = (b.open?.parts ?? []).flatMap((p) => p.blocks);
      if (!inner.length) warnings.push(`${ctx.slug}: expandable row "${title}" has no content`);
      out.push(`{% accordion title=${attr(title)} %}\n${renderBlocks(inner, ctx) || '&nbsp;'}\n{% /accordion %}`);
    } else if (b.kind === 'arrow') {
      const text = b.parts.filter((p) => !/^→$/.test(p.blocks[0]?.md ?? '')).flatMap((p) => p.blocks.map((x) => inline(x.md ?? '', ctx).replace(/\\\n/g, ' '))).join(' ');
      (arrows ??= []).push(text);
    } else if (b.kind === 'caption') {
      out.push(`{% caption %}\n${b.parts.flatMap((p) => p.blocks.map((x) => inline(x.md ?? '', ctx))).join('\n\n')}\n{% /caption %}`);
    } else if (b.kind === 'button') {
      const link = b.links[0];
      out.push(`{% button href=${attr(rewriteHref(link.href, link.text, ctx))} label=${attr(link.text)} /%}`);
    } else if (b.kind === 'other' && ctx.table) {
      // The list of grants: a pale blue box with a bold first line, then name/description and amount.
      const heading = plain(b.parts[0]?.blocks[0]?.md ?? '');
      out.push(`{% panel${heading ? ' heading=' + attr(heading) : ''} %}\n${ctx.table}\n{% /panel %}`);
      ctx.table = null;
    } else {
      warnings.push(`${ctx.slug}: block not converted (${b.tag}/${b.kind}): "${(b.text ?? '').slice(0, 50)}"`);
    }
  }
  flushArrows();
  return out.join('\n\n');
}

const yaml = (s) => JSON.stringify(s);
let changed = 0;
for (const file of readdirSync(NEWS).filter((f) => f.endsWith('.mdoc'))) {
  const slug = file.replace('.mdoc', '');
  const jsonPath = path.join(harvestDir, slug + '.json');
  if (!existsSync(jsonPath)) { warnings.push(`${slug}: no harvest file`); continue; }
  const live = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const source = readFileSync(path.join(NEWS, file), 'utf8').replace(/\r\n/g, '\n');
  const m = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { warnings.push(`${slug}: front matter not found`); continue; }
  const [, front, oldBody] = m;
  const title = (front.match(/^title:\s*(.*)$/m)?.[1] ?? '').replace(/^"|"$/g, '');
  if (norm(title) !== norm(live.title ?? '')) warnings.push(`${slug}: title differs: "${title}" vs live "${live.title}"`);

  const ctx = {
    slug,
    links: oldLinks(oldBody),
    images: [...oldBody.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((x) => ({ alt: x[1], src: x[2] })),
    table: oldBody.match(/\{% table %\}[\s\S]*?\{% \/table %\}/)?.[0] ?? null,
  };
  const liveImages = live.blocks.filter((b) => b.tag === 'img').length + live.blocks.filter((b) => b.open).flatMap((b) => b.open.parts.flatMap((p) => p.blocks)).filter((b) => b.tag === 'img').length;
  if (liveImages !== ctx.images.length) warnings.push(`${slug}: ${liveImages} images on the old site, ${ctx.images.length} local files`);

  // Gap paragraphs at the very end are kept too: they were part of the space above the footer.
  const body = renderBlocks(live.blocks, ctx).trim() + '\n';

  // Side boxes: yellow (centred, may link) and plain (bordered, bold).
  const yellow = live.boxes.find((b) => /249, 236, 127/.test(b.bg));
  const bordered = live.boxes.find((b) => !/249, 236, 127/.test(b.bg));
  // The yellow box's own link is the authored one; the wrapper's default link is ignored when the text carries none.
  const yellowLink = yellow ? (yellow.md.match(/\]\(([^)]+)\)/)?.[1] ?? null) : null;
  let fm = front.split('\n').filter((line) => !/^(calloutText|calloutLink|sideText):/.test(line)).join('\n');
  if (yellow) { fm += `\ncalloutText: ${yaml(plain(yellow.md))}`; if (yellowLink) fm += `\ncalloutLink: ${yaml(rewriteHref(yellowLink, plain(yellow.md), ctx))}`; }
  if (bordered) fm += `\nsideText: ${yaml(plain(bordered.md))}`;

  const next = `---\n${fm}\n---\n${body}`;
  const kinds = {};
  for (const b of live.blocks) { const k = b.kind ?? (b.empty ? 'gap' : b.tag); kinds[k] = (kinds[k] ?? 0) + 1; }
  console.log(`${next === source ? 'same   ' : 'changed'} ${slug.slice(0, 46).padEnd(46)} ${JSON.stringify(kinds)}${yellow ? ' +yellow' + (yellowLink ? '(link)' : '') : ''}${bordered ? ' +box' : ''}`);
  if (next !== source) { changed += 1; if (WRITE) writeFileSync(path.join(NEWS, file), next); }
}
console.log(`\n${changed} article(s) ${WRITE ? 'rewritten' : 'would change'}; ${warnings.length} warning(s)`);
for (const w of warnings) console.log('  ! ' + w);
