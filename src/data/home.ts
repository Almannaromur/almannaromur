import type { Locale } from '../i18n';

/**
 * Homepage copy. Icelandic is taken from the live site (November 2026).
 * ENGLISH IS A DRAFT TRANSLATION: replace with approved copy.
 */
interface HomeContent {
  hero: { lines: string[]; lede: string; cta: string };
  report: { eyebrow: string; title: string; text: string; cta: string };
  featuredHeading: string;
  /** Project slugs shown on the homepage, with homepage-specific text. */
  featured: { slug: string; title: string; text: string }[];
  prioritiesHeading: string;
  priorities: { title: string }[];
  timelineHeading: string;
  /** One entry per milestone. `image` is a file name in src/assets/images/timeline/. */
  timeline: { year: string; text: string; image?: string }[];
  newsHeading: string;
  newsletterHeading: string;
  faqHeading: string;
  faq: { question: string; answer: string[]; list?: string[]; after?: string[] }[];
}

export const home: Record<Locale, HomeContent> = {
  is: {
    hero: {
      lines: ['Tölum um', 'framtíðina'],
      lede: 'Almannarómur, miðstöð gervigreindar og máltækni, sækir fram fyrir Ísland í stafrænum heimi. Almannarómur er óháð sjálfseignarstofnun.',
      cta: 'Lesa meira um okkur',
    },
    report: {
      eyebrow: 'Staða gervigreindar',
      title: 'Staða gervigreindar - ný útgáfa',
      text: 'Gögn, þróun og sjónarmið um tækni sem er þegar farin að móta íslenskt samfélag. Nýjasta efni fer yfir umhverfisáhrif gervigreindar, yfirvofandi reglugerðir (AI act) og margt fleira.',
      cta: 'Skoða nánar',
    },
    featuredHeading: 'Verkefni',
    featured: [
      {
        slug: 'maltaekni',
        title: 'Íslenska í tækni',
        text: 'Allar helstu tæknilausnir eiga að vera aðgengilegar á góðri íslensku. Almannarómur vinnur að því að fjölga tæknilausnum sem virka vel á íslensku ásamt góðum þjálfunargögnum og hugbúnaði fyrir íslensku í tækni.',
      },
      {
        slug: 'new-nordics',
        title: 'New Nordics AI',
        text: 'New Nordics AI er miðstöð Norðurlanda og Eystrasaltsríkjanna fyrir hagnýta gervigreind. Almannarómur er stofnaðili og leiðandi í starfsemi miðstöðvarinnar.',
      },
    ],
    prioritiesHeading: 'Áherslur okkar',
    priorities: [
      { title: 'Tryggja að allar helstu tæknilausnir séu vel nothæfar á íslensku' },
      { title: 'Auka ábyrga hagnýtingu og þróun á máltækni og gervigreind á Íslandi' },
      { title: 'Valdefla og auka vitund hjá breiðum hópi notenda í gervigreind og máltækni' },
    ],
    timelineHeading: 'Tímalína',
    timeline: [
      { year: '2014', text: 'Almannarómur stofnaður með það markmið að tryggja íslensku í tækni.', image: 't1.png' },
      { year: '2019', text: 'Máltækniáætlun 1 fer í framkvæmd og skilar að því loknu opnum innviðum fyrir talgreiningu, talgervingu, vélþýðingar, málrýni og málföng.' },
      { year: '2022', text: 'Samtal virkjað við Open AI og fleiri tæknifyrirtæki um mikilvægi íslensku í tæknilausnum.', image: 't2.png' },
      { year: '2024', text: 'Máltækniáætlun 2 hefst þar sem byggt er áfram á tækniinnviðum og áframhaldandi gagnaöflun, og prófunum á íslenskugetu mállíkana.', image: 't3.png' },
      { year: '2024', text: 'ChatGPT 4 kom út á íslensku - svar við ákalli Almannaróms og fleiri.' },
      { year: '2025', text: 'Microsoft Co-pilot kemur út á íslensku - svar við ákalli Almannaróms og fleiri.' },
      { year: '2025', text: 'UNESCO samstarf leitt af Almannarómi.', image: 't4.png' },
      { year: '2025', text: 'Almannarómur tryggir yfir milljarð króna samtals í Evrópustyrkjum sem efla stafræna nýsköpun á Íslandi.', image: 't5.png' },
      { year: '2025', text: 'Almannarómur meðstofnandi og leiðandi afl í samnorrænni gervigreindarmiðstöð New Nordics AI.' },
      { year: '2026', text: 'Almannarómur stækkar; 6 nýir starfsmenn.', image: 't6.png' },
      { year: '2026', text: 'Almannarómur gefur út fyrstu útgáfu af skýrslunni „Staða gervigreindar á Íslandi“.' },
    ],
    newsHeading: 'Á döfinni',
    newsletterHeading: 'Viltu vita meira um okkur?',
    faqHeading: 'Algengar spurningar',
    faq: [
      {
        question: 'Hvað er Almannarómur?',
        answer: [
          'Almannarómur er miðstöð gervigreindar og máltækni, stofnuð 2014. Almannarómur, sem er óháð sjálfseignastofnun, er fjármögnuð af rekstrarsamningi við menningar-, nýsköpunar og háskólaráðuneytið og með styrkjum tengdum Evrópuverkefnum. Miðstöðin heldur um framkvæmd máltækniáætlunar en sinnir einnig fjölbreyttum verkefnum sem snúa að stuðningi við ábyrga þróun og hagnýtingu gervigreindar og máltækni á Íslandi.',
        ],
      },
      {
        question: 'Af hverju gervigreind?',
        answer: [
          'Almannarómur var stofnaður árið 2014 í því augnamiði að tryggja að máltæknilausnir verði smíðaðar fyrir íslensku. Með tilkomu stórra mállíkana, sem byggja á máltækni, t.d. í formi Chat GTP, Claude eða Gemini þá hafa gervigreindarverkefni Almannaróms aukist til muna. Til að mæta stóraukinni þörf samfélagsins fyrir gervigreindarstuðning og uppbyggingu innviða hefur Almannarómur útvíkkað hlutverk sitt og sinnir nú báðum málaflokkum.',
        ],
      },
      {
        question: 'Fyrir hvern er Almannarómur?',
        answer: [
          'Almannarómur er fyrir samfélagið í heild sinni, en miðstöðin leggur megináherslu á stuðning við innviðauppbyggingu og framþróun í nýsköpun á sviði máltækni og gervigreindar. Sérstakur hagaðili Almannaróms er samfélag fatlaðra en þar eru margir ofurnotendur máltæknilausna. Einnig vinnur Almannarómur þétt með háskólunum, nýsköpunarsamfélaginu og atvinnulífinu.',
        ],
      },
      {
        question: 'Hvað eru máltæknilausnir?',
        answer: [
          'Máltæknilausnir eru stafrænar lausnir sem vinna með mannlegt mál. Þær byggja á máltækni (language technology / natural language processing, NLP) og eru notaðar til að skilja, greina, þýða, mynda eða vinna úr texta og máli.',
          'Dæmi um máltæknilausnir:',
        ],
        list: [
          'Þýðingarvélar – sjálfvirk þýðing á milli tungumála (t.d. Google Translate, DeepL)',
          'Talgervlar (speech synthesis / TTS) – breyta texta í tal',
          'Talgreinar (speech recognition / ASR) – breyta tali í texta',
          'Spjallbottar og stór tungumálalíkön – t.d. ChatGPT, Claude',
          'Leitarvélar – skilja fyrirspurnir á náttúrulegu máli',
          'Málrýnar – stafsetningar- og málfræðiprófar',
          'Textagreining – t.d. tilfinningagreining, flokkun texta, upplýsingavinnsla',
          'Samantektarkerfi – draga saman langan texta',
        ],
        after: [
          'Í íslenska samhenginu er þetta sérstaklega viðeigandi vegna þess að íslenska er tungumál sem fáir tala á heimsvísu og því þarf að tryggja stafræna innviði og lausnir svo íslenska eigi sér öruggan stað í allri tækni.',
        ],
      },
    ],
  },

  // English: the professional translation (is-to-en, November 2026), word for word, except that
  // "Artificial Intelligence" now comes before "Language Technology" in the description (Almannarómur's wish).
  en: {
    hero: {
      lines: ['The Future Is', 'Worth Talking About'],
      lede: "Almannarómur is Iceland's Center for Artificial Intelligence and Language Technology. We make sure Icelandic works in the technology people use every day, and help Iceland put AI to work on its own terms. We are an independent non-profit foundation.",
      cta: 'Read more about our work',
    },
    report: {
      eyebrow: 'The State of AI',
      title: 'The State of AI: Latest Edition',
      text: 'Data, trends, and perspectives on a technology that is already shaping Icelandic society. The latest edition covers the environmental impact of AI, upcoming regulation (the EU AI Act), and a new Gallup survey on which AI tools people in Iceland use.',
      cta: 'Learn more',
    },
    featuredHeading: 'Projects',
    featured: [
      {
        slug: 'maltaekni',
        title: 'Icelandic in Technology',
        text: 'Every major technology solution should be available in good Icelandic. We work to increase the number of solutions that perform well in Icelandic, and develop high-quality training data and software that support Icelandic in technology.',
      },
      {
        slug: 'new-nordics',
        title: 'New Nordics AI',
        text: 'New Nordics AI is the Nordic and Baltic center for applied AI. We are a founding partner and play a leading role in its work.',
      },
    ],
    prioritiesHeading: 'Our focus',
    priorities: [
      { title: 'Ensure that all major technology solutions work well in Icelandic' },
      { title: 'Expand the responsible use and development of language technology and AI in Iceland' },
      { title: 'Empower a broad range of users and build awareness of AI and language technology' },
    ],
    timelineHeading: 'Timeline',
    timeline: [
      { year: '2014', text: 'Almannarómur is founded to secure a place for Icelandic in technology.', image: 't1.png' },
      { year: '2019', text: 'The first Language Technology Programme begins, building open infrastructure for speech recognition, speech synthesis, machine translation, spelling and grammar checking, and language resources.' },
      { year: '2022', text: 'Almannarómur opens talks with OpenAI and other technology companies about the importance of Icelandic in their products.', image: 't2.png' },
      { year: '2024', text: 'The second Language Technology Programme begins, building on existing infrastructure through continued data collection and testing how well language models handle Icelandic.', image: 't3.png' },
      { year: '2024', text: 'ChatGPT launches with Icelandic support, in response to calls from Almannarómur and others.' },
      { year: '2025', text: 'Microsoft Copilot launches in Icelandic, in response to calls from Almannarómur and others.' },
      { year: '2025', text: 'Almannarómur leads a collaboration with UNESCO.', image: 't4.png' },
      { year: '2025', text: 'Almannarómur secures more than ISK 1 billion in European grants to support digital innovation in Iceland.', image: 't5.png' },
      { year: '2025', text: 'Almannarómur co-founds New Nordics AI, a joint Nordic AI center, and takes a leading role in its work.' },
      { year: '2026', text: 'Almannarómur grows its team with six new employees.', image: 't6.png' },
      { year: '2026', text: 'Almannarómur publishes the first edition of its report, The State of AI in Iceland.' },
    ],
    newsHeading: 'Upcoming',
    newsletterHeading: 'Want to hear more from us?',
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        question: 'What is Almannarómur?',
        answer: [
          "Almannarómur is Iceland's Center for Artificial Intelligence and Language Technology, founded in 2014. It is an independent non-profit foundation, funded through the national budget and by grants linked to European projects. Among other responsibilities, the center runs the national Language Technology Programme. It also helps build AI infrastructure, supports innovation, and helps businesses adopt AI and put it to practical use.",
        ],
      },
      {
        question: 'Why AI?',
        answer: [
          'We were founded in 2014 to make sure language technology solutions would be built for Icelandic. Large language models such as ChatGPT, Claude, and Gemini are built on language technology, and since they arrived, our AI work has grown considerably. Society now needs far more AI support and infrastructure, so we have broadened our role and now work across both fields.',
        ],
      },
      {
        question: 'Who is Almannarómur for?',
        answer: [
          'We serve Icelandic society as a whole. Our main focus is supporting infrastructure development and innovation in language technology and AI. People with disabilities are a key stakeholder group, as they are among the most important users of language technology. We also work closely with universities, the innovation community, and the business sector.',
        ],
      },
      {
        question: 'What are language technology solutions?',
        answer: [
          'Language technology solutions are digital tools that work with human language. They are built on language technology, also known as natural language processing (NLP), and are used to understand, analyze, translate, generate, or process text and speech.',
          'Types of language technology solutions:',
        ],
        list: [
          'Machine translation: automatic translation between languages (for example, Google Translate and DeepL)',
          'Speech synthesis (text-to-speech, TTS): converts text into speech',
          'Speech recognition (automatic speech recognition, ASR): converts speech into text',
          'Chatbots and large language models: for example, ChatGPT and Claude',
          'Search engines: understand queries written in everyday language',
          'Spelling and grammar checkers: tools that help people write accurately',
          'Text analysis: for example, sentiment analysis, text classification, and information extraction',
          'Summarization tools: condense long texts',
          'Digital assistants and support apps: especially those developed for smaller languages such as Icelandic',
        ],
        after: [
          'This matters especially in Iceland. Icelandic is a small language, and it needs dedicated language technology so that it is not left behind as AI and digital technology develop.',
        ],
      },
    ],
  },
};
