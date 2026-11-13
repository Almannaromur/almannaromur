export const locales = ['is', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'is';

/** Top-level pages. `null` means the page does not exist in that language. */
export const routes = {
  home: { is: '/', en: '/en' },
  projects: { is: '/verkefni', en: '/en/projects' },
  solutions: { is: '/lausnir', en: '/en/solutions' },
  news: { is: '/a-dofinni', en: null },
  about: { is: '/um-okkur', en: '/en/about' },
} as const satisfies Record<string, Record<Locale, string | null>>;

export type RouteKey = keyof typeof routes;

export function projectPath(locale: Locale, slug: string) {
  return `${routes.projects[locale]}/${slug}`;
}

export function newsPath(slug: string) {
  return `${routes.news.is}/${slug}`;
}

export const otherLocale = (locale: Locale): Locale => (locale === 'is' ? 'en' : 'is');

const ui = {
  is: {
    siteName: 'Almannarómur',
    siteTagline: 'Miðstöð gervigreindar og máltækni',
    siteDescription:
      'Almannarómur er miðstöð gervigreindar og máltækni. Við sækjum fram fyrir Ísland í stafrænum heimi svo að samfélagið okkar geti fullnýtt tækifæri tækninnar á eigin forsendum.',
    skipToContent: 'Fara beint í efni',
    menu: 'Valmynd',
    nav: {
      projects: 'Verkefni',
      solutions: 'Lausnir',
      news: 'Á döfinni',
      about: 'Um okkur',
      report: 'Staða gervigreindar á Íslandi',
    },
    switchLanguage: 'English',
    switchLanguageLabel: 'Switch to English',
    readMore: 'Skoða nánar',
    openSite: 'Opna vef',
    flipShow: 'Sýna lýsingu',
    flipHide: 'Fela lýsingu',
    staffShowBio: 'Sýna lýsingu',
    contactHeading: 'Viltu vinna með Almannarómi eða ert með hugmynd?',
    contactCta: 'Sendu okkur tölvupóst',
    newsletterHeading: 'Skráðu þig á póstlista',
    newsletterEmail: 'Sláðu inn netfangið þitt',
    newsletterSubmit: 'Skrá mig',
    newsAll: 'Allt',
    newsEmpty: 'Ekkert efni í þessum flokki enn sem komið er.',
    newsBack: 'Til baka í Á döfinni',
    moreNews: 'Fleira á döfinni',
    notFoundTitle: 'Síða fannst ekki',
    notFoundBody: 'Síðan sem þú leitar að er ekki til eða hefur verið færð.',
    notFoundCta: 'Fara á forsíðu',
    idNumber: 'Kt.',
  },
  // English: only wording from the professional translation (is-to-en, November 2026).
  // Strings marked "untranslated" are not in that document and stay in Icelandic until they are.
  en: {
    siteName: 'Almannarómur',
    // The organisation's description from the homepage text. Almannarómur asked for "Artificial
    // Intelligence" first; the translator had "Language Technology" first.
    siteTagline: 'Center for Artificial Intelligence and Language Technology',
    // The homepage introduction, with the same change of order.
    siteDescription:
      "Almannarómur is Iceland's Center for Artificial Intelligence and Language Technology. We make sure Icelandic works in the technology people use every day, and help Iceland put AI to work on its own terms. We are an independent non-profit foundation.",
    skipToContent: 'Fara beint í efni', // untranslated
    menu: 'Valmynd', // untranslated
    nav: {
      projects: 'Projects',
      solutions: 'Solutions',
      news: 'Upcoming',
      about: 'About us',
      report: 'The State of AI in Iceland',
    },
    switchLanguage: 'Íslenska',
    switchLanguageLabel: 'Skipta yfir í íslensku',
    readMore: 'Learn more',
    openSite: 'Visit website',
    flipShow: 'Sýna lýsingu', // untranslated
    flipHide: 'Fela lýsingu', // untranslated
    staffShowBio: 'Sýna lýsingu', // untranslated
    contactHeading: 'Want to work with us, or have an idea to share?',
    contactCta: 'Send us an email',
    newsletterHeading: 'Sign up for our newsletter',
    newsletterEmail: 'Enter your email address',
    newsletterSubmit: 'Subscribe',
    // The news pages exist in Icelandic only, so these four are never shown in English.
    newsAll: 'Allt',
    newsEmpty: 'Ekkert efni í þessum flokki enn sem komið er.',
    newsBack: 'Til baka í Á döfinni',
    moreNews: 'Fleira á döfinni',
    notFoundTitle: 'Síða fannst ekki', // untranslated
    notFoundBody: 'Síðan sem þú leitar að er ekki til eða hefur verið færð.', // untranslated
    notFoundCta: 'Fara á forsíðu', // untranslated
    idNumber: 'Kt.', // untranslated
  },
} as const;

export type UiStrings = (typeof ui)[Locale];

export function useTranslations(locale: Locale): UiStrings {
  return ui[locale];
}

export const NEWS_CATEGORY_LABELS = {
  frett: 'Frétt',
  verkefni: 'Verkefni',
  vidburdur: 'Viðburður',
  utgefid: 'Útgefið efni',
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORY_LABELS;

/** The label on a news item's own chip (shorter than the filter's for "Útgefið efni"), and the chip colour. */
export const NEWS_CATEGORY_CHIPS: Record<NewsCategory, { label: string; tone: 'blue' | 'yellow' | 'green' }> = {
  frett: { label: 'Frétt', tone: 'blue' },
  verkefni: { label: 'Verkefni', tone: 'yellow' },
  vidburdur: { label: 'Viðburður', tone: 'blue' },
  utgefid: { label: 'Útgefið', tone: 'green' },
};

const dateFormat = {
  is: new Intl.DateTimeFormat('is-IS', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
};

export function formatDate(date: Date, locale: Locale = 'is') {
  return dateFormat[locale].format(date);
}
