// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// Old Framer URLs -> new URLs. Written by scripts/migrate-news.mjs, safe to edit by hand.
const redirectList = JSON.parse(
  readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8'),
);

// Many old URLs contain Icelandic characters. Browsers send those percent-encoded
// (%C3%BE), a few tools write the codes in lower case (%c3%be), and some send the
// letters as they are, so register each such URL in all three forms.
/** @type {Record<string, string>} */
const redirects = {};
for (const [from, to] of Object.entries(redirectList)) {
  redirects[from] = to;
  const encoded = encodeURI(from);
  if (encoded !== from) {
    redirects[encoded] = to;
    redirects[encoded.replace(/%[0-9A-F]{2}/g, (code) => code.toLowerCase())] = to;
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://almannaromur.is',
  // Same URL shape as the old Framer site: no trailing slashes.
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
      i18n: { defaultLocale: 'is', locales: { is: 'is-IS', en: 'en' } },
    }),
    keystatic(),
  ],
  vite: { plugins: [tailwindcss()] },
  i18n: {
    locales: ['is', 'en'],
    defaultLocale: 'is',
    routing: { prefixDefaultLocale: false },
  },
  redirects,
});
