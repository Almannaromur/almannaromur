import { collection, config, fields } from '@keystatic/core';
import { block, inline, wrapper } from '@keystatic/core/content-components';

/**
 * Storage: local files while developing, GitHub once
 * PUBLIC_KEYSTATIC_GITHUB_REPO ("owner/repo") is set in the environment.
 */
const githubRepo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

export const NEWS_CATEGORIES = [
  { label: 'Frétt', value: 'frett' },
  { label: 'Verkefni', value: 'verkefni' },
  { label: 'Viðburður', value: 'vidburdur' },
  { label: 'Útgefið efni', value: 'utgefid' },
] as const;

export default config({
  storage: githubRepo ? { kind: 'github', repo: githubRepo } : { kind: 'local' },
  ui: {
    brand: { name: 'Almannarómur' },
    navigation: ['news', 'staff'],
  },
  collections: {
    news: collection({
      label: 'Á döfinni',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Titill', validation: { isRequired: true } },
          slug: {
            label: 'Slóð',
            description:
              'Síðasti hluti vefslóðarinnar (/a-dofinni/…). Notið aðeins a–z, tölustafi og bandstrik.',
          },
        }),
        date: fields.date({
          label: 'Dagsetning',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Tegund',
          options: [...NEWS_CATEGORIES],
          defaultValue: 'frett',
        }),
        summary: fields.text({
          label: 'Útdráttur',
          description: 'Stuttur texti sem birtist á yfirlitssíðu og forsíðu.',
          multiline: true,
        }),
        cover: fields.image({
          label: 'Mynd',
          directory: 'src/assets/images/news',
          publicPath: '../../assets/images/news/',
        }),
        coverPosition: fields.text({
          label: 'Brennipunktur myndar',
          description:
            'Hvaða hluti myndarinnar helst sýnilegur þegar hún er skorin, t.d. "50% 100%" fyrir neðri hlutann. Autt = miðja.',
        }),
        coverAlt: fields.text({
          label: 'Lýsing á mynd (alt-texti)',
          description: 'Lýsir myndinni fyrir þau sem sjá hana ekki. Má vera autt ef myndin er skraut.',
        }),
        calloutText: fields.text({
          label: 'Ábending við hlið greinar',
          description: 'Stuttur texti í gulum reit við hlið meginmáls, t.d. hvatning til að senda inn umsögn. Má vera autt.',
          multiline: true,
        }),
        calloutLink: fields.url({
          label: 'Hlekkur ábendingar',
          description: 'Slóðin sem guli reiturinn vísar á. Má vera autt.',
        }),
        sideText: fields.text({
          label: 'Texti í ramma',
          description: 'Feitletraður texti í ramma vinstra megin við meginmálið (fyrir neðan gula reitinn ef hann er til staðar).',
          multiline: true,
        }),
        content: fields.markdoc({
          label: 'Meginmál',
          options: {
            image: {
              directory: 'src/assets/images/news',
              publicPath: '../../assets/images/news/',
            },
          },
          // Einingar sem hægt er að setja inn í meginmálið (sjá markdoc.config.mjs).
          components: {
            quote: wrapper({
              label: 'Tilvitnun',
              schema: {
                name: fields.text({ label: 'Nafn' }),
                role: fields.text({ label: 'Starfsheiti' }),
              },
            }),
            accordion: wrapper({
              label: 'Fellilisti',
              schema: { title: fields.text({ label: 'Titill', validation: { isRequired: true } }) },
            }),
            arrows: wrapper({ label: 'Örvalisti', schema: {} }),
            caption: wrapper({ label: 'Myndatexti', schema: {} }),
            narrow: wrapper({
              label: 'Mjó mynd',
              schema: {
                width: fields.integer({ label: 'Breidd í pixlum', defaultValue: 480, validation: { isRequired: true } }),
              },
            }),
            br: inline({ label: 'Línubil í fyrirsögn', schema: {} }),
            panel: wrapper({
              label: 'Blár kassi (t.d. listi yfir styrkhafa)',
              schema: { heading: fields.text({ label: 'Fyrirsögn' }) },
            }),
            button: block({
              label: 'Hnappur',
              schema: {
                href: fields.text({ label: 'Slóð', validation: { isRequired: true } }),
                label: fields.text({ label: 'Texti', validation: { isRequired: true } }),
              },
            }),
          },
        }),
      },
    }),

    staff: collection({
      label: 'Starfsfólk',
      slugField: 'name',
      path: 'src/content/staff/*',
      format: { data: 'yaml' },
      columns: ['name', 'titleIs', 'order'],
      schema: {
        name: fields.slug({
          name: { label: 'Nafn', validation: { isRequired: true } },
          slug: { label: 'Auðkenni', description: 'Skráarheiti færslunnar. Þarf sjaldan að breyta.' },
        }),
        titleIs: fields.text({ label: 'Starfsheiti (íslenska)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Starfsheiti (enska)' }),
        noteIs: fields.text({ label: 'Stutt lýsing (íslenska)', multiline: true }),
        noteEn: fields.text({ label: 'Stutt lýsing (enska)', multiline: true }),
        bioIs: fields.text({
          label: 'Lýsing (íslenska)',
          description: 'Birtist yfir myndinni þegar bendillinn er yfir henni (eða þegar ýtt er á hana í síma).',
          multiline: true,
        }),
        bioEn: fields.text({ label: 'Lýsing (enska)', multiline: true }),
        email: fields.text({ label: 'Netfang' }),
        photo: fields.image({
          label: 'Mynd',
          directory: 'src/assets/images/staff',
          publicPath: '../../assets/images/staff/',
        }),
        order: fields.integer({
          label: 'Röðun',
          description: 'Lægri tala birtist framar.',
          defaultValue: 100,
        }),
      },
    }),
  },
});
