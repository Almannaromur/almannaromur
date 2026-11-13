/**
 * One-off: download page images from the old Framer site's CDN.
 *   node scripts/fetch-page-assets.mjs
 * Existing files are left alone, so it is safe to re-run.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CDN = 'https://framerusercontent.com/images/';
const MAX = 2048;

// [file on the CDN, original width (0 = unknown, fetch as is), destination under src/assets/images]
const FILES = [
  // Homepage and about
  ['Qklg4Rxw3i41tndPWe6DuGMEEw.png', 4096, 'pages/home-hero.png'],
  ['TSflk9yGQFxR5eV4Wl2DJnh2Ls.png', 744, 'pages/stada-gervigreindar.png'],
  ['p2L1QtnvCx8TSVTvuBSBoDh441E.png', 2752, 'pages/stofnadilar.png'],

  ['6UA9mBw3SjYyJ5xfzJF9skzw00.png', 2750, 'pages/lausnir-hero.png'],
  ['LhzIGWDIOZ2ysTqmlc9qyVVfrZQ.png', 3328, 'pages/malbankinn.png'],
  ['fFTM2QjzDguEnsYX0KtefPbn3g.png', 1200, 'pages/github.png'],
  ['naqOZbsvsjig34nYBBJKdTBMHhM.png', 2700, 'pages/hugging-face.png'],
  ['s03aWEXQ3IocLvOExQO7ozofMw.png', 842, 'pages/stjorn.png'],

  // Project cards (Verkefni overview and menus)
  ['cwboU8eIAYc6UuF66tyTImBZYSo.png', 2704, 'projects/kveikja.png'],
  ['86LhqWFTv4k2Mc0M9nyftzjVSAk.png', 2704, 'projects/glod.png'],
  ['SCaEs9U5w1TKU79t7z9Uctz0kI.png', 2704, 'projects/new-nordics.png'],
  ['znaQbHA0Nv1l5cW8fHA8GIdBSq8.png', 2712, 'projects/thin-islenska.png'],
  ['1Nl4JaigblcIRd4lSnj7wIrX2Jo.png', 3248, 'projects/maltaekni.png'],
  ['K31CSk1WYNxpBsbnWvpVqR3v14.png', 2704, 'projects/skerfur.png'],
  ['y6xBhShUMcOz13BYpfqCMc2Bkew.png', 1280, 'projects/unesco.png'],
  ['qgk554wi5TMsaGH8C3RNbyv4.png', 3840, 'projects/islenska.png'],

  // Project pages: wide image under the hero
  ['4yMWX0mx4ZN7R0ggHhAcHLIXU80.png', 1920, 'projects/kveikja-hero.png'],
  ['HQVaZMBdci6jKRZx6gsbCPKQaRg.png', 2752, 'projects/glod-hero.png'],
  ['AVN1r4srkOVflPpqKBohBAudamQ.png', 4080, 'projects/new-nordics-hero.png'],
  ['30xhSubDjUIFhdlUMhlBj3d5CqE.png', 2700, 'projects/thin-islenska-hero.png'],
  ['Yils5s9hcAJI4gRetkzpWLxzF5I.png', 2752, 'projects/skerfur-hero.png'],
  ['jSDsHVE0LeDzbOOLnYzt84MmmE.png', 1295, 'projects/unesco-hero.png'],
  ['f3MK6AKyfpS37Y9Tft6IXB1mbOA.png', 2752, 'projects/islenska-hero.png'],

  // Project pages: images inside the content
  ['EEziUzKcXsNjEHEQFVWFuS7ozGY.png', 2704, 'projects/glod-framtidarsyn.png'],
  ['2ojXWauE0GuCTIltiuJhql5ja9A.png', 2696, 'projects/glod-hlutverk.png'],
  ['a1brAaVIJYLcldqE8W08n0eGP0I.png', 1768, 'projects/new-nordics-innleiding.png'],
  ['qs9PLwMeeq6VxF1mt68QW9fE.png', 1768, 'projects/new-nordics-samstarf.png'],
  ['j6ZH47ImXNvRrUQ0QOvLCQ2sAM.png', 1768, 'projects/new-nordics-stefna.png'],
  ['j2FQgL1IXGiddmPZGpV07f62VI.png', 1060, 'projects/unesco-fundur.png'],
  ['jHRBU4SJLCQ7WsxGDDvq0VU118.jpg', 1137, 'projects/islenska-openai.jpg'],

  // Partner logos
  ['iMxislR4s9n9PdpEt7b9dgKo.png', 504, 'logos/haskolinn-i-reykjavik.png'],
  ['buSkAa6Uajrj5u2v7W8QGqwfPMk.png', 512, 'logos/haskoli-islands.png'],
  ['ug1EaFjM9Bsiuigcd6WarXfprs.png', 145, 'logos/visindagardar.png'],
  ['gBilAKjq0yYWgYwbMEcQi06y0Fs.png', 157, 'logos/arnastofnun.png'],
  ['QKkmk7bhsAPEKrtMgJSrJK7lOc.png', 424, 'logos/vedurstofa-islands.png'],
  ['4oGKkkUoZkWq6HEiJZS1FAIWF4.png', 432, 'logos/audna.png'],
  ['EfasphgbtCBUbb1ffabkbi9PKh4.png', 568, 'logos/rannis.png'],
  ['vIzV4PmEnPrhdbUawjVY5dUUs0.png', 712, 'logos/eu-co-funded.png'],
  ['C6e890ymbqfJiO6mxGtBYpvgiPk.png', 400, 'logos/ai-sweden.png'],
  ['0rfnGG0LF7NCtNIOaTk3aNZ8YmE.png', 968, 'logos/ai-finland.png'],
  ['WDONKGIV9MxVGprP1k3KaEkzmk.png', 1592, 'logos/tek-norge.png'],
  ['GVkILUPNXEfoz5GrxLmRZzhUAmE.png', 338, 'logos/digital-dogme.png'],
  ['3SF7IUlog5BdVP8Mdec0oUBk.png', 96, 'logos/meta.png'],

  // Staff
  ['GQhWRd7pXgRwky8kN3MXHi9Nhyg.png', 1304, 'staff/lilja-dogg-jonsdottir/photo.png'],
  ['SHgiJbXTlmDE6If0oBgtus2ZhH8.png', 1304, 'staff/ottar-kolbeinsson-proppe/photo.png'],
  ['fnF7U16XjNOOixPle4U02AFUls.jpg', 1955, 'staff/atli-thor-johannsson/photo.jpg'],
  ['n8RMCObLlmZgQpyYLlxcMMigJw.png', 1304, 'staff/marin-jonsdottir/photo.png'],
  ['44bqK95iNwz2aviRzaFuo1meva0.png', 1276, 'staff/anna-margret-gunnarsdottir/photo.png'],
  ['vFNFLO7ZsglnJ8hYRnNOWyH0rc.webp', 1600, 'staff/gisli-ragnar-gudmundsson/photo.webp'],

];

for (const [file, width, dest] of FILES) {
  const out = path.join(ROOT, 'src/assets/images', dest);
  if (existsSync(out)) continue;
  const url = CDN + file + (width > MAX ? `?scale-down-to=${MAX}` : '');
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (site migration script)' } });
  if (!res.ok) {
    console.error(`${res.status} ${url}`);
    process.exitCode = 1;
    continue;
  }
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log('saved', dest);
}
