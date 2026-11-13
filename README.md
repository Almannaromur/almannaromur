# almannaromur.is

The Almannarómur website: Astro, with Keystatic as the CMS for news (Á döfinni) and staff. Hosted on Vercel.

## Run it

```sh
npm install
npm run dev        # http://127.0.0.1:4321, CMS at /keystatic
npm run build      # production build
npm run check      # type and template checks
```

Node 22.23 or newer. If Astro fails to start on Windows with "An Application Control policy has blocked this file", run `npm run setup:wasm` (and again after each `npm install`); see `scripts/install-wasm-fallback.mjs`.

## Where things live

| What | Where |
|---|---|
| News articles (Keystatic) | `src/content/news/*.mdoc`, images in `src/assets/images/news/<slug>/` |
| Staff (Keystatic) | `src/content/staff/*.yaml`, photos in `src/assets/images/staff/<slug>/` |
| CMS fields | `keystatic.config.ts` (mirrored in `src/content.config.ts`) |
| Project pages | `src/content/projects/is/` and `en/` (same file name in both languages) |
| Page copy (home, about, solutions) | `src/data/*.ts`, Icelandic and English side by side |
| Navigation labels and other UI text, page URLs | `src/i18n/index.ts` |
| Contact details, newsletter endpoint | `src/data/site.ts` |
| Design tokens and text styles (from Figma) | `src/styles/global.css` |
| Components, one per Figma component | `src/components/` |
| Logos | `src/assets/brand/symbol.svg`, `wordmark.svg`; `wordmark-en.svg` is the English logo (Almannarómur with "AI Iceland"), shown in the header and footer of the English pages |
| Old Framer URLs → new URLs | `src/data/redirects.json` |
| Downloadable files (PDFs) | `public/skra/` |

## Languages

Icelandic is the default and lives at the root (`/`, `/verkefni`, `/lausnir`, `/a-dofinni`, `/um-okkur`). English is under `/en` (`/en/projects`, `/en/solutions`, `/en/about`). News is Icelandic only.

Each route file in `src/pages/` is a thin wrapper around a template in `src/views/` that takes the language as a prop.

### English text

The English text is the professional translation received in November 2026, word for word. Where that translation has no text, headings and short labels are left in Icelandic and body text is placeholder text ("Lorem ipsum …"). To find what is still waiting for a translation, search `src/` for `Lorem ipsum`, `PLACEHOLDER` and `untranslated`.

## Links

A link to another website opens in a new tab; a link within the site stays in the same tab. This is automatic for links written in articles and project pages (`markdoc.config.mjs`). In components, use `externalLinkAttrs(href)` from `src/lib/links.ts`.

## Old addresses

Addresses of the old Framer site that changed are redirected (`src/data/redirects.json`); most of them held Icelandic letters and now use plain ones. `scripts/old-urls.json` lists every address the old site had on 13 November 2026 (its sitemap and every internal link).

```sh
npm run build && npm run check:redirects                       # checks the build output
npm run check:redirects -- https://your-preview.vercel.app     # checks a deployed site
```

Run the second form against the Vercel preview before switching DNS. In Vercel, add both `almannaromur.is` and `www.almannaromur.is` to the project and let one redirect to the other.

## Keystatic

Locally Keystatic edits the files in this folder. In production it commits to GitHub: set the variables in `.env.example` in Vercel. Every editor needs a GitHub account with write access to the repository. A saved change triggers a Vercel rebuild and is live about a minute later.

### News articles

Besides text, headings, lists, images and tables, the article editor offers these blocks (the "+" menu):

| Block | Use |
|---|---|
| Tilvitnun | Pull quote with the speaker's name and title underneath |
| Fellilisti | Expandable row: a title, and text that opens under it |
| Örvalisti | A list drawn with arrows instead of dots |
| Myndatexti | Caption under an image |
| Mjó mynd | An image shown narrower than the text column |
| Hnappur | A centred yellow button with a link |
| Blár kassi | Pale blue box with a bold first line, for example around a table of grants |
| Línubil í fyrirsögn | A line break inside a heading |

Fields beside the text: "Ábending við hlið greinar" (yellow box, with an optional link) and "Texti í ramma" (bold text in a bordered box) sit to the left of the text on desktop. "Brennipunktur myndar" sets which part of the cover stays visible when it is cropped.

`npm run check:content` validates every article and project page against the block definitions and reports anything that would not render. Run it after editing `.mdoc` files by hand. The dev server reads the block definitions (`markdoc.config.mjs`) and the content fields (`src/content.config.ts`) only when it starts: restart `astro dev` after changing either, or pages using a new block fail with "Undefined tag".

An empty-looking paragraph that holds a non-breaking space (`&nbsp;`) is a deliberate gap carried over from the old site.

### Staff

"Lýsing" is the text shown over a person's portrait on hover (on tap on phones), together with the email address.

## One-off migration scripts

- `scripts/migrate-news.mjs` pulled the news articles from the old Framer site.
- `scripts/remigrate-news-bodies.mjs` rebuilt the article bodies block by block from the old site (spacing, quotes, expandable rows, side boxes).
- `scripts/match-paragraph-breaks.mjs` matched paragraph spacing on the project pages to the old site.
- `scripts/fetch-page-assets.mjs` pulled page images and staff photos.

They, and the `cheerio` and `turndown` dev dependencies, can be deleted once the migrated content has been signed off.
