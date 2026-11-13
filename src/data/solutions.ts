import type { Locale } from '../i18n';

/**
 * "Lausnir" copy. Icelandic is taken from the live site (November 2026).
 * ENGLISH IS A DRAFT TRANSLATION: replace with approved copy.
 */
interface LinkItem {
  label: string;
  href: string;
}

interface SolutionsContent {
  title: string;
  description: string;
  maturity: { heading: string; text: string };
  languageTech: {
    heading: string;
    intro: string[];
    items: { title: string; text: string; links: LinkItem[] }[];
  };
  pillars: { heading: string; text: string }[];
  resources: { title: string; text: string; href: string }[];
  support: { heading: string; paragraphs: string[] };
  /** Project slugs listed under "Stuðningur". */
  supportProjects: string[];
  /** Card text on this page where it differs from the project's own summary, by project slug. */
  supportText?: Record<string, string>;
}

const REPO = 'https://gitlab.com/icelandic-lt';
const CLARIN = 'https://repository.clarin.is/repository/xmlui/handle/20.500.12537';

export const solutions: Record<Locale, SolutionsContent> = {
  is: {
    title: 'Lausnir & þjónusta',
    description:
      'Yfirlit yfir máltæknilausnir, gögn, reikniafl, þekkingu og stuðning sem Almannarómur veitir aðgang að.',
    maturity: {
      heading: 'Þroskamat',
      text: 'Kveikja er samstarfsverkefni sem hjálpar fyrirtækjum og stofnunum að meta hvar þau standa í gervigreind með tilliti til innleiðingar og færniuppbyggingar. Þessi þjónusta er í þróun og er væntanleg á haustmánuðum 2026.',
    },
    languageTech: {
      heading: 'Máltæknilausnir',
      intro: [
        'Í máltækni er tölvutækni nýtt við beitingu tungumálsins og tungumálið nýtt við beitingu tölvutækni. Tilgangurinn er að auðvelda fólki notkun tungumálsins, á fjölda sviða.',
        'Hér má sjá yfirlit yfir kjarnalausnir og útskýringar á þeim auk afurða máltækniáætlunar hingað til.',
      ],
      items: [
        {
          title: 'Tal í texta',
          text: 'Markmiðið með þróun talgreinis er að til verði forrit sem geti túlkað eðlilegt tal á íslensku. Talgreiningu er hægt að nota á mörgum sviðum, s.s. í tölvukerfum bíla, í heilbrigðiskerfinu, í þjónustuverum fyrirtækja, í tölvustuddu tungumálanámi, til stuðnings fólki sem vegna fötlunar á erfitt með innslátt texta, en talgreinir gefur notendum kost á að eiga samskipti við tölvustýrð tæki með tali í stað lyklaborðs.',
          links: [{ label: 'Hugbúnaðarhirslur fyrir talgreiningu', href: `${REPO}/asr` }],
        },
        {
          title: 'Texti í tal',
          text: 'Þróun talgervils miðar að því að hann geti lesið upp íslenskan texta með skýrum og auðskiljanlegum framburði, og eðlilegu tónfalli. Talgervlar fyrir íslensku verða þróaðir þannig að hægt verður að framleiða margar mismunandi raddir. Þannig geta þeir sem vilja bæta sjálfvirkum upplestri eða talsvörun við sín kerfi samþætt talgervingu við sinn hugbúnað.',
          links: [{ label: 'Hugbúnaðarhirslur fyrir talgervingu', href: `${REPO}/tts` }],
        },
        {
          title: 'Vélþýðingar',
          text: 'Í vélþýðingum eru tölvur notaðar til að þýða texta úr einu tungumáli yfir á annað. Vélþýðingar geta þannig flýtt fyrir öllu starfi þýðenda og styrkt stöðu smærri tungumála verulega, með því t.d. að bjóða upp á rauntímaþýðingar á sjónvarpsefni, og draga verulega úr kostnaði.',
          links: [{ label: 'Hugbúnaðarhirslur fyrir vélþýðingar', href: `${REPO}/mt` }],
        },
        {
          title: 'Sjálfvirkar leiðréttingar',
          text: 'Hugbúnaður til málrýni getur hjálpað verulega við leiðréttingar á stafsetningu og málfari, og getur veitt margvíslegar leiðbeiningar við textaskrif. Auk þess að nýtast öllum almenningi við almenn skrif getur sérhæfð málrýni nýst fjölbreyttum hópi notenda: starfsfólki fyrirtækja og stofnana, börnum, fólki með íslensku sem annað mál, lesblindum, o.s.frv. Málrýni er líka mjög mikilvæg fyrir þróun annars konar máltæknihugbúnaðar, t.d. leitarvéla og vélþýðinga, og til að gera ljóslesna texta nothæfa í stafrænu umhverfi.',
          // Live site labels this link "…fyrir talgervingu" (copy-paste slip); corrected here.
          links: [{ label: 'Hugbúnaðarhirslur fyrir málrýni', href: `${REPO}/checker` }],
        },
        {
          title: 'Málföng',
          text: 'Undir málföng falla málleg gagnasöfn og stoðtól. Málleg gagnasöfn skiptast í texta- og orðasöfn ásamt talgögnum. Þau nýtast til að mynda við þjálfun á mál- og hljóðlíkönum fyrir mismunandi máltæknihugbúnað. Stoðtól eru nauðsynleg til þess að útbúa gögn til notkunar í máltækni, en þau framkvæma einnig grunngreiningu á texta, sem oft er fyrsta skref í flóknari máltæknihugbúnaði. Nægilegt magn viðeigandi gagna og áreiðanleg stoðtól eru grunnur og forsenda allrar þróunar í máltækni.',
          links: [
            { label: 'Hugbúnaðarhirslur fyrir stoðtól', href: `${REPO}/nlp` },
            // Live site points "Hugbúnaðarhirslur fyrir málföng" at /checker, which looks wrong. Kept until confirmed.
            { label: 'Hugbúnaðarhirslur fyrir málföng', href: `${REPO}/checker` },
            { label: 'Risamálheild 1', href: `${CLARIN}/41` },
            { label: 'Risamálheild 2', href: `${CLARIN}/33` },
            { label: 'Mörkuð íslensk málheild, Gullstaðall', href: `${CLARIN}/39` },
            { label: 'Mörkuð íslensk málheild, Gullstaðall, þjálfunar- og prófunarsett', href: `${CLARIN}/40` },
            { label: 'BÍN - Beygingarlýsing íslensks nútímamáls', href: 'https://bin.arnastofnun.is/' },
            { label: 'Íslenskt orðanet', href: 'https://ordanet.arnastofnun.is/' },
            { label: 'Samhliða málheild ParlIce', href: `${CLARIN}/16` },
            { label: 'Þjálfunar- og prófunargögn ParlIce', href: `${CLARIN}/24` },
            { label: 'Hljóðgögn frá RÚV sjónvarpi', href: `${CLARIN}/93` },
          ],
        },
      ],
    },
    pillars: [
      {
        heading: 'Reikniafl',
        text: 'Á grundvelli samstarfsverkefnisins Glóðar veitir Almannarómur aðgengi að reikniafli fyrir tilrauna- og þróunarverkefni hjá sprotum og litlum- og meðalstórum fyrirtækjum.',
      },
      {
        heading: 'Þekking',
        text: 'Almannarómur leggur áherslu á að fræða fólk og fyrirtæki jafnt innanlands sem utan um notkun íslensku í tækni og um stöðu gervigreindar á Íslandi og á heimsvísu.',
      },
      {
        heading: 'Gögn',
        text: 'Undir máltækniáætlun hefur átt sér stað mikil uppbygging innviða fyrir íslenska máltækni og gervigreind. Gríðarlegu magni íslenskra gagna hefur verið safnað og þróun átt sér stað á ýmsum hugbúnaði fyrir íslenskt mál, t.d. hugbúnaði fyrir þýðingarvélar, tal í texta, texta í tal og leiðréttingarforrit. Allir þessir innviðir hafa verið gefnir út undir opnum leyfum svo hver sem er geti nýtt sér þá við eigin hugbúnaðarþróun eða til að bæta íslenskugetu eigin lausna.',
      },
    ],
    resources: [
      {
        title: 'Íslenski málbankinn',
        text: 'Öll gagnasöfn fyrir íslensku má nálgast hjá Íslenska málbankanum og hægt að nýta þau til að þróa nýjar lausnir á íslensku.',
        href: 'https://malbankinn.is/is',
      },
      {
        title: 'GitHub',
        text: 'Á GitHub-síðu Almannaróms má nálgast ýmis málföng á borð við kóða, þjálfunargögn, skriftur o.fl.',
        href: 'https://github.com/icelandic-lt',
      },
      {
        title: 'Hugging Face',
        text: 'Á Hugging Face-síðu Almannaróms má nálgast opin grunnlíkön og hugbúnað sem hafa verið þróuð fyrir íslenska tungu.',
        href: 'https://huggingface.co/Icelandic-lt',
      },
    ],
    support: {
      heading: 'Stuðningur',
      paragraphs: [
        'Almannarómur styður við máltækni og gervigreind á Íslandi með aðgengi að sérfræðiþekkingu, hugbúnaði, tæknilegum innviðum og styrkjum.',
        'Styrkjunum er ætlað að styðja við þróun og innleiðingu hagnýtra endalausna sem byggja á máltækni. Styrkveiting er háð því að verkefni styðji við meginmarkmið máltækniáætlunar um að gera íslensku gjaldgenga í stafrænum heimi og stuðli að aukinni notkun á íslensku í tæknivörum og hugbúnaði.',
        'Snemma á árinu 2025 styrkti Almannarómur sérstaklega innleiðingu máltæknilausna hjá fyrirtækjum og stofnunum í samvinnu við menningar-, nýsköpunar- og háskólaráðuneytið. Styrkirnir voru veittir undir yfirskriftinni Skerfur en 12 verkefni voru styrkt fyrir samtals 60 m.kr. Öll verkefnin fela í sér innleiðingu og/eða hagnýtingu á íslenskri máltækni í samræmi við máltækniáætlun 2.',
      ],
    },
    supportProjects: ['skerfur', 'kveikja', 'glod'],
    supportText: {
      glod: 'Glóð býður upp á sérfræðiþekkingu í gervigreind og ofurtölvum, íslensk gagnasöfn og sameiginlega vinnuaðstöðu í Grósku. Teymið samanstendur af sex aðildarfélögum og hver stofnun tekur að sér þjónustu- og stuðningshlutverk.',
    },
  },

  // English: the professional translation (is-to-en, November 2026), word for word.
  // Not in that document: the page description (left in Icelandic) and the text on the
  // back of the "Language resources" card (placeholder text until it is translated).
  en: {
    title: 'Solutions & Services',
    description:
      'Yfirlit yfir máltæknilausnir, gögn, reikniafl, þekkingu og stuðning sem Almannarómur veitir aðgang að.',
    maturity: {
      heading: 'AI maturity assessment',
      text: 'Kveikja is a partnership that helps companies and organizations assess where they stand on AI adoption and skills development. This service is in development and is expected in fall 2026.',
    },
    languageTech: {
      heading: 'Language technology solutions',
      intro: [
        'Language technology uses computing to work with language, and uses language to work with computers. The aim is to make language easier for people to use in many areas of life.',
        'Below is an overview of the core solutions, with explanations, along with what the Language Technology Programme has produced so far.',
      ],
      items: [
        {
          title: 'Speech to text',
          text: 'The goal of developing a speech recognizer is software that can understand natural spoken Icelandic. Speech recognition can be used in many areas, such as in-car systems, healthcare, customer service centers, and computer-assisted language learning. It also supports people whose disabilities make typing difficult, since a speech recognizer lets users interact with devices by voice instead of a keyboard.',
          links: [{ label: 'Software repositories for speech recognition', href: `${REPO}/asr` }],
        },
        {
          title: 'Text to speech',
          text: 'The aim of developing a speech synthesizer is to read Icelandic text aloud with clear, easy-to-understand pronunciation and natural intonation. Icelandic speech synthesizers are being built to produce many different voices, so anyone who wants to add automatic read-aloud or spoken responses to their systems can integrate speech synthesis into their software.',
          links: [{ label: 'Software repositories for speech synthesis', href: `${REPO}/tts` }],
        },
        {
          title: 'Machine translation',
          text: "Machine translation uses computers to translate text from one language to another. It can speed up translators' work considerably and substantially strengthen the position of smaller languages, for example by offering real-time translation of TV content, while greatly reducing costs.",
          links: [{ label: 'Software repositories for machine translation', href: `${REPO}/mt` }],
        },
        {
          title: 'Automatic correction',
          text: 'Spelling and grammar checking software can make a real difference in correcting spelling and usage, and can offer a wide range of writing guidance. Besides helping the general public with everyday writing, specialized checking tools can serve many different users: employees of companies and institutions, children, people who speak Icelandic as a second language, people with dyslexia, and others. Spelling and grammar checking is also essential for developing other kinds of language technology, such as search engines and machine translation, and for making scanned (OCR) texts usable in a digital environment.',
          links: [{ label: 'Software repositories for spelling and grammar checking', href: `${REPO}/checker` }],
        },
        {
          title: 'Language resources',
          // PLACEHOLDER: this text is not in the translation document.
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          links: [
            { label: 'Software repositories for support tools', href: `${REPO}/nlp` },
            { label: 'Software repositories for language resources', href: `${REPO}/checker` },
            { label: 'Icelandic Gigaword Corpus 1', href: `${CLARIN}/41` },
            { label: 'Icelandic Gigaword Corpus 2', href: `${CLARIN}/33` },
            { label: 'Tagged Icelandic Corpus, Gold Standard (MIM-GOLD)', href: `${CLARIN}/39` },
            { label: 'Tagged Icelandic Corpus, Gold Standard (MIM-GOLD): training and test sets', href: `${CLARIN}/40` },
            { label: 'BÍN: Database of Modern Icelandic Inflection', href: 'https://bin.arnastofnun.is/' },
            { label: 'Icelandic Word Web (Íslenskt orðanet)', href: 'https://ordanet.arnastofnun.is/' },
            { label: 'ParIce parallel corpus', href: `${CLARIN}/16` },
            { label: 'ParIce training and test data', href: `${CLARIN}/24` },
            { label: 'Audio data from RÚV television', href: `${CLARIN}/93` },
          ],
        },
      ],
    },
    pillars: [
      {
        heading: 'Computing power',
        text: 'Through the Glóð partnership, Almannarómur provides access to computing power for experimental and development projects at startups and small and medium-sized enterprises.',
      },
      {
        heading: 'Knowledge',
        text: 'We work to educate people and companies, both in Iceland and abroad, about using Icelandic in technology and about the state of AI in Iceland and around the world.',
      },
      {
        heading: 'Data',
        text: 'The Language Technology Programme has built extensive infrastructure for Icelandic language technology and AI. A huge amount of Icelandic data has been collected, and a range of software for Icelandic has been developed, including machine translation, speech to text, text to speech, and spelling and grammar checkers. All of this infrastructure has been released under open licenses, so anyone can use it in their own software development or to improve how well their own solutions handle Icelandic.',
      },
    ],
    resources: [
      {
        title: 'Íslenski málbankinn (the Icelandic language data repository)',
        text: 'All Icelandic datasets are available through Íslenski málbankinn and can be used to develop new solutions in Icelandic.',
        href: 'https://malbankinn.is/is',
      },
      {
        title: 'GitHub',
        text: 'Our GitHub page offers a range of language resources, including code, training data, scripts, and more.',
        href: 'https://github.com/icelandic-lt',
      },
      {
        title: 'Hugging Face',
        text: 'Our Hugging Face page offers open foundation models and software developed for Icelandic.',
        href: 'https://huggingface.co/Icelandic-lt',
      },
    ],
    support: {
      heading: 'Support',
      paragraphs: [
        'We support language technology and AI in Iceland by providing access to expertise, software, technical infrastructure, and grants.',
        "The grants support the development and adoption of practical end-user solutions built on language technology. To receive funding, a project must support the Language Technology Programme's main goal of making Icelandic fully viable in the digital world and help increase the use of Icelandic in technology products and software.",
        'In early 2025, we worked with the Ministry of Culture, Innovation and Higher Education to provide dedicated funding for companies and institutions to adopt language technology solutions. The grants were awarded under the name Skerfur, with 12 projects receiving a total of ISK 60 million. All of the projects involve adopting or applying Icelandic language technology in line with Language Technology Programme 2.',
      ],
    },
    supportProjects: ['skerfur', 'kveikja', 'glod'],
    supportText: {
      glod: 'Glóð offers expertise in AI and supercomputing, Icelandic datasets, and a shared workspace at Gróska. The team is made up of six member organizations, each taking on a service and support role.',
    },
  },
};
