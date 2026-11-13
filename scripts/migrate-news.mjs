/**
 * One-off migration of the news articles from the Framer site into Keystatic content files.
 *
 *   node scripts/migrate-news.mjs            fetch (cached) and write everything
 *   node scripts/migrate-news.mjs --refetch  ignore the HTML cache
 *
 * Writes:
 *   src/content/news/<slug>.mdoc
 *   src/assets/images/news/<slug>/*          cover and inline images
 *   public/skra/*                            PDFs and other linked files
 *   src/data/redirects.json                  old Framer URLs -> new URLs (news entries only)
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const ORIGIN = 'https://almannaromur.is';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = path.join(ROOT, '.migration-cache');
const NEWS_DIR = path.join(ROOT, 'src/content/news');
const IMG_DIR = path.join(ROOT, 'src/assets/images/news');
const FILES_DIR = path.join(ROOT, 'public/skra');
const REDIRECTS = path.join(ROOT, 'src/data/redirects.json');
const REFETCH = process.argv.includes('--refetch');
const UA = 'Mozilla/5.0 (site migration script)';
const MAX_IMAGE_WIDTH = 2048;

const warnings = [];
const warn = (slug, msg) => warnings.push(`${slug}: ${msg}`);

// ---------------------------------------------------------------- helpers

const TRANSLIT = { á: 'a', ð: 'd', é: 'e', í: 'i', ó: 'o', ú: 'u', ý: 'y', þ: 'th', æ: 'ae', ö: 'o' };

export function asciiSlug(s) {
  return s
    .toLowerCase()
    .replace(/[áðéíóúýþæö]/g, (c) => TRANSLIT[c])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const clean = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, maí: 5, jún: 6, júl: 7, ágú: 8, sep: 9, okt: 10, nóv: 11, des: 12 };

/** "20.10.26" or "07. okt. 2026" -> "2026-10-20" */
function parseDate(text) {
  const t = clean(text).toLowerCase();
  let m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  m = t.match(/^(\d{1,2})\.\s*([a-záéíóúýþæö]+)\.?\s*(\d{4})$/);
  if (m) {
    const month = MONTHS[m[2].slice(0, 3)];
    if (month) return `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  throw new Error(`Unrecognised date: "${text}"`);
}

const CATEGORY = { frétt: 'frett', verkefni: 'verkefni', viðburður: 'vidburdur', útgefið: 'utgefid', 'útgefið efni': 'utgefid' };

async function fetchHtml(urlPath) {
  await mkdir(CACHE, { recursive: true });
  const file = path.join(CACHE, `${encodeURIComponent(urlPath).slice(0, 180)}.html`);
  if (!REFETCH && existsSync(file)) return readFile(file, 'utf8');
  const res = await fetch(ORIGIN + encodeURI(urlPath), { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} for ${urlPath}`);
  const html = await res.text();
  await writeFile(file, html);
  return html;
}

async function download(url, dest) {
  if (existsSync(dest)) return;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

/** Download a Framer CDN image, capped at MAX_IMAGE_WIDTH. Returns the file name. */
async function saveImage(src, slug, baseName) {
  const url = new URL(src);
  const ext = path.extname(url.pathname).toLowerCase() || '.jpg';
  const width = Number(url.searchParams.get('width') ?? 0);
  const fetchUrl = new URL(url.origin + url.pathname);
  if (width > MAX_IMAGE_WIDTH) fetchUrl.searchParams.set('scale-down-to', String(MAX_IMAGE_WIDTH));
  const name = `${baseName}${ext}`;
  await download(fetchUrl.href, path.join(IMG_DIR, slug, name));
  return name;
}

/** Internal links in article bodies that are already broken on the live site. */
const LINK_FIXES = {
  '/thin-islenska-er-malid': '/verkefni/thin-islenska',
};

/** Internal site paths get the same ASCII treatment as the new slugs. */
function rewriteInternalPath(p) {
  const [pathname, hash = ''] = decodeURI(p).split('#');
  const out = pathname
    .split('/')
    .map((seg) => (seg ? asciiSlug(seg) : seg))
    .join('/');
  return (out || '/') + (hash ? `#${hash}` : '');
}

async function rewriteHref(href, slug) {
  if (!href) return href;
  href = href.trim().replace(/^mailto:\s+/, 'mailto:');
  if (/^(mailto:|tel:|#)/.test(href)) return href;
  const url = new URL(href, `${ORIGIN}/a-dofinni/x`);
  const isSite = url.hostname.replace(/^www\./, '') === 'almannaromur.is';
  // Files on Framer's CDN or the previous site's Prismic CDN: bring them into the repo.
  const isFramerAsset =
    (url.hostname === 'framerusercontent.com' && url.pathname.startsWith('/assets/')) ||
    url.hostname.endsWith('.cdn.prismic.io');
  if (isSite && url.pathname.startsWith('/skra/')) {
    const name = decodeURIComponent(path.basename(url.pathname));
    await download(url.href, path.join(FILES_DIR, name));
    return `/skra/${name}`;
  }
  if (isFramerAsset) {
    const name = decodeURIComponent(path.basename(url.pathname));
    try {
      await download(url.href, path.join(FILES_DIR, name));
    } catch (err) {
      warn(slug, `linked file could not be downloaded (${err.message}); link left as it was`);
      return url.href;
    }
    warn(slug, `file from ${url.hostname} saved as /skra/${name}`);
    return `/skra/${name}`;
  }
  if (isSite) {
    const fixed = LINK_FIXES[decodeURI(url.pathname)];
    if (fixed) {
      warn(slug, `link to ${decodeURI(url.pathname)} is a 404 on the live site; pointed at ${fixed}`);
      return fixed;
    }
    return rewriteInternalPath(url.pathname + url.hash);
  }
  return url.href;
}

// ---------------------------------------------------------------- body conversion

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  emDelimiter: '*',
  hr: '---',
});
// Links whose only content is bold text: keep the link, drop the redundant emphasis markers inside it.
turndown.addRule('boldLink', {
  filter: (node) =>
    node.nodeName === 'A' &&
    node.childNodes.length === 1 &&
    ['STRONG', 'B'].includes(node.firstChild.nodeName),
  replacement: (_content, node) => `**[${clean(node.textContent)}](${node.getAttribute('href')})**`,
});

/** Split an element at runs of 2+ <br> into sibling elements of the same tag; trim stray <br>. */
function splitOnBreaks($, el) {
  const $el = $(el);
  const tag = el.tagName;
  // Framer writes <br class="framer-text">; normalise before splitting.
  const parts = ($el.html() ?? '')
    .replace(/<br\b[^>]*>/gi, '<br>')
    .split(/(?:\s*<br>\s*){2,}/)
    .map((h) => h.replace(/^(?:\s*<br>\s*)+|(?:\s*<br>\s*)+$/g, '').trim())
    .filter((h) => clean(cheerio.load(h).text()) !== '' || /<img/i.test(h));
  if (parts.length === 0) return $el.remove();
  // Inside headings a single <br> cannot survive as Markdown: treat it as a space.
  const isHeading = /^h[1-6]$/.test(tag);
  $el.replaceWith(
    parts.map((h) => `<${tag}>${isHeading ? h.replace(/<br>/g, ' ') : h}</${tag}>`).join(''),
  );
}

async function convertBody($, body, slug) {
  const $body = $(body);

  $body.find('iframe, video, table, script, form').each((_i, el) => {
    warn(slug, `body contains <${el.tagName}>, needs manual handling (${$(el).attr('src') ?? ''})`);
  });

  // Inline images.
  let n = 0;
  for (const img of $body.find('img').toArray()) {
    const src = $(img).attr('src');
    if (!src) continue;
    n += 1;
    const name = await saveImage(src, slug, `mynd-${n}`);
    $(img).attr('src', `../../assets/images/news/${slug}/${name}`);
    $(img).removeAttr('srcset').removeAttr('sizes');
  }

  // Links.
  for (const a of $body.find('a').toArray()) {
    $(a).attr('href', await rewriteHref($(a).attr('href'), slug));
  }

  $body.find('h1, h2, h3, h4, h5, h6, p').each((_i, el) => splitOnBreaks($, el));
  // Framer styled pull quotes as h6: make them real quotes.
  $body.find('h6').each((_i, el) => {
    el.tagName = 'blockquote';
  });
  // The article title is the page's h1: body headings start at h2.
  $body.find('h1').each((_i, el) => {
    el.tagName = 'h2';
  });

  const md = turndown
    .turndown($body.html() ?? '')
    .replace(/ /g, ' ')
    .replace(/[ \t]+$/gm, (m) => (m.length >= 2 ? '  ' : ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (md.includes('{%')) warn(slug, 'body contains "{%", which Markdoc reads as a tag');
  return md;
}

// ---------------------------------------------------------------- main

const yamlString = (s) => JSON.stringify(s);

async function main() {
  const list$ = cheerio.load(await fetchHtml('/a-dofinni'));
  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`, { headers: { 'user-agent': UA } })).text();
  const sitemapPaths = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeURI(new URL(m[1]).pathname)),
  );

  // Cards on the list page: category, date, title, summary, image.
  const cards = new Map();
  list$('a[href*="a-dofinni/"]').each((_i, el) => {
    const legacyPath = decodeURI(new URL(list$(el).attr('href'), `${ORIGIN}/`).pathname);
    if (cards.has(legacyPath)) return;
    const texts = list$(el)
      .find('[data-framer-component-type="RichTextContainer"]')
      .map((_j, t) => clean(list$(t).text()))
      .get();
    if (texts.length < 3) return;
    const [category, date, title, summary = ''] = texts;
    cards.set(legacyPath, { legacyPath, category, date, title, summary, image: list$(el).find('img').attr('src') });
  });
  console.log(`Found ${cards.size} articles on the list page.`);

  const redirects = existsSync(REDIRECTS) ? JSON.parse(await readFile(REDIRECTS, 'utf8')) : {};
  for (const key of Object.keys(redirects)) if (key.startsWith('/a-dofinni/')) delete redirects[key];

  await mkdir(NEWS_DIR, { recursive: true });
  const usedSlugs = new Set();

  for (const card of cards.values()) {
    const legacySlug = card.legacyPath.split('/').pop();
    const slug = asciiSlug(legacySlug);
    if (usedSlugs.has(slug)) throw new Error(`Duplicate slug ${slug}`);
    usedSlugs.add(slug);

    const $ = cheerio.load(await fetchHtml(card.legacyPath));
    const title = clean($('[data-framer-name="Article title"]').first().text()) || card.title;
    const dateText = clean($('[data-framer-name="Date"]').first().text()) || card.date;
    const categoryText = clean($('[data-framer-name="Content type label"]').first().text()) || card.category;
    const date = parseDate(dateText);
    const category = CATEGORY[categoryText.toLowerCase()];
    if (!category) throw new Error(`${slug}: unknown category "${categoryText}"`);
    if (title !== clean(card.title)) warn(slug, `title differs between list ("${card.title}") and article ("${title}")`);

    // Cover: the article's lead image, else the list card image.
    const coverSrc = $('[data-framer-name="Lead image"] img').first().attr('src') ?? card.image;
    const cover = coverSrc ? await saveImage(coverSrc, slug, 'cover') : null;
    if (!cover) warn(slug, 'no cover image');

    const body = $('[data-framer-name="Article body"]').first();
    if (body.length === 0) warn(slug, 'no article body found');
    const content = body.length ? await convertBody($, body, slug) : '';

    if (clean(card.summary).length < 20) warn(slug, `summary looks like a placeholder: "${card.summary}"`);

    const frontmatter = [
      '---',
      `title: ${yamlString(title)}`,
      `date: ${date}`,
      `category: ${category}`,
      `summary: ${yamlString(clean(card.summary))}`,
      ...(cover ? [`cover: ../../assets/images/news/${slug}/${cover}`] : []),
      `coverAlt: ""`,
      '---',
    ].join('\n');
    await writeFile(path.join(NEWS_DIR, `${slug}.mdoc`), `${frontmatter}\n${content}\n`);

    // Redirects: the old named URL (if it changed) and the older date-style URL.
    const newPath = `/a-dofinni/${slug}`;
    if (card.legacyPath !== newPath) redirects[card.legacyPath] = newPath;
    const [y, m, d] = date.split('-');
    const datePath = `/a-dofinni/${d}.${m}.${y.slice(2)}`;
    if (sitemapPaths.has(datePath)) {
      const old$ = cheerio.load(await fetchHtml(datePath));
      const oldTitle = clean(old$('[data-framer-name="Article title"]').first().text() || old$('h1').first().text());
      if (oldTitle && oldTitle !== title) warn(slug, `${datePath} has a different title: "${oldTitle}"`);
      redirects[datePath] = newPath;
    }
    console.log(`  ${date}  ${category.padEnd(9)}  ${slug}`);
  }

  for (const p of sitemapPaths) {
    if (p.startsWith('/a-dofinni/') && !cards.has(p) && !redirects[p]) warnings.push(`sitemap URL not migrated: ${p}`);
  }

  await writeFile(REDIRECTS, `${JSON.stringify(redirects, null, 2)}\n`);
  console.log(`\nWrote ${usedSlugs.size} articles and ${Object.keys(redirects).length} redirects.`);
  if (warnings.length) console.log(`\nTo check by hand (${warnings.length}):\n- ${warnings.join('\n- ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
