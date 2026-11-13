import type { Locale } from '../i18n';

/**
 * "Um okkur" copy. Icelandic is taken from the live site (November 2026).
 * ENGLISH IS A DRAFT TRANSLATION: replace with approved copy.
 * Staff are not here: they are edited in Keystatic (src/content/staff).
 */
interface AboutContent {
  title: string;
  description: string;
  role: { heading: string; paragraphs: string[] };
  focus: { heading: string; items: { title: string; text: string }[] };
  results: { heading: string; items: { text: string }[] };
  founders: { heading: string; text: string; imageAlt: string };
  staffHeading: string;
  board: {
    heading: string;
    intro: string;
    imageAlt: string;
    groups: { label: string; members: string[] }[];
  };
  council: { heading: string; paragraphs: string[]; members: { name: string; bio: string }[] };
}

const boardMembers = {
  chair: ['Halldór Benjamín Þorbergsson'],
  members: [
    'Björgvin Ingi Ólafsson',
    'Magga Dóra Ragnarsdóttir',
    'Páll Ásgeir Guðmundsson',
    'Ragnheiður H. Magnúsdóttir',
    'Snævar Ívarsson',
    'Sverrir Norland',
  ],
  alternates: ['Birna Ósk Einarsdóttir', 'Kristinn R. Þórisson', 'Pétur Þ. Óskarsson'],
};


export const about: Record<Locale, AboutContent> = {
  is: {
    // \u00AD is a soft hyphen: the name may break there on narrow screens.
    title: 'Hvað er Almanna\u00ADrómur?',
    description:
      'Almannarómur er sjálfseignastofnun sem sækir fram fyrir Ísland í stafrænum heimi svo að samfélagið okkar geti fullnýtt tækifæri tækninnar á eigin forsendum.',
    role: {
      heading: 'Hlutverk',
      paragraphs: [
        'Almannarómur er sjálfseignastofnun sem sækir fram fyrir Ísland í stafrænum heimi svo að samfélagið okkar geti fullnýtt tækifæri tækninnar á eigin forsendum. Við leiðum saman stjórnvöld, fræðasamfélag, atvinnulíf og alþjóðlega samstarfsaðila, ryðjum úr vegi hindrunum í þróun og hagnýtingu gervigreindar og máltækni og stuðlum þannig að ábyrgri, gagnlegri og víðtækri notkun þeirra í samfélaginu.',
        'Þannig sýnir Ísland að smátt málsamfélag getur leitt gervigreindarbyltinguna á eigin forsendum, með lausnum sem styðja nýsköpun, verðmætasköpun og aukin lífsgæði.',
      ],
    },
    focus: {
      heading: 'Áherslur',
      items: [
        {
          title: 'Þróun og aðgengi að sameiginlegum innviðum á borð við gögn og reikniafl',
          text: 'Styðjum uppbyggingu opinna innviða fyrir íslensku í tækni með verkstjórn máltækniáætlana, veitum aðgang að gagnasöfnum og reikniafli, greinum sameiginlegar hindranir í þróun og innleiðingu og leitum lausna.',
        },
        {
          title: 'Fræðsla, upplýst umræða og uppbygging þekkingar fyrir samfélagið allt',
          text: 'Eflum upplýsta umræðu um málefni gervigreindar og máltækni með öflugri útgáfu, völdum fyrirlestrum og virkri þátttöku í samfélagsumræðunni.',
        },
        {
          title: 'Sterkt vistkerfi gervigreindar og máltækni með samstarfi og samhæfingu',
          text: 'Tengjum og leiðum saman ólíka aðila í vistkerfi gervigreindar og máltækni til að deila þekkingu, sameinast í verkefnum og læra af reynslu annarra.',
        },
      ],
    },
    results: {
      heading: 'Árangur',
      items: [
        {
          text: 'Almannarómur hefur verkstýrt tveimur máltækniáætlunum stjórnvalda sem lyft hafa stöðu íslensku í tækni úr því að teljast vera tungumál í „stafrænni útrýmingarhættu“ í að vera tungumál sem telst meðalvel stutt.',
        },
        {
          text: 'Almannarómur hefur með miklum árangri sótt fjármuni, tengsl og þekkingu inn í vistkerfi gervigreindar og máltækni á Íslandi, meðal annars í gegnum alþjóðlega styrki og með samstarfi við alþjóðleg tæknifyrirtæki.',
        },
        {
          text: 'Almannarómur hefur tekið þátt í að stórbæta stöðu íslensku í erlendum tæknilausnum með virkri hagsmunagæslu á alþjóðavettvangi.',
        },
      ],
    },
    founders: {
      heading: 'Stofnaðilar',
      text: 'Almannarómur var stofnaður árið 2014 í því augnamiði að tryggja að íslenska standi jafnfætis öðrum tungumálum í tækniheiminum.',
      imageAlt: 'Merki stofnaðila Almannaróms',
    },
    staffHeading: 'Starfsfólk Almannaróms',
    board: {
      heading: 'Stjórn',
      intro: 'Stjórn Almannaróms skipar fagfólk þvert á atvinnulífið sem öll leggja sína sérþekkingu að mörkum.',
      imageAlt: 'Stjórn Almannaróms',
      groups: [
        { label: 'Formaður stjórnar', members: boardMembers.chair },
        { label: 'Meðstjórnendur', members: boardMembers.members },
        { label: 'Varamenn', members: boardMembers.alternates },
      ],
    },
    council: {
      heading: 'Fagráð',
      paragraphs: [
        'Almannarómur ber ábyrgð á að afurðir máltækniáætlana stjórnvalda verði að öllu leyti fullnægjandi til að frumkvöðlar, fyrirtæki, stofnanir og einstaklingar geti nýtt þær við smíði tækni sem virkar á íslensku.',
        'Í því skyni hefur Almannarómur sett saman fagráð sem samanstendur af virtum alþjóðlegum sérfræðingum á sviði máltækni. Fagráðið skipa þau Bente Maegaard, Kadri Vider og Steven Krauwer.',
        'Hlutverk fagráðs er að vera verkefnastjórn máltækniáætlunar til ráðgjafar hvað varðar tæknilega útfærslu kjarnaverkefna. Þannig rýnir fagráð ítarlega tæknilýsingar og áfangaskýrslur allra verkefna áætlananna.',
        'Meira um sérfræðinga fagráðsins má lesa hér:',
      ],
      members: [
        {
          name: "Bente Maegaard",
          bio: "Bente Maegaard er fyrrverandi forstöðumaður Center for Sprogteknologi (Máltæknimiðstöðvar) innan stofnunar norrænna fræða og málvísinda við Kaupmannahafnarháskóla. Hún var varaframkvæmdastjóri CLARIN ERIC máltæknisamstarfsins árin 2012-2018. Sérsvið hennar eru einkum rannsóknarinnviðir, málföng og stoðtól, vélrænar þýðingar, mat og stjórnun. Bente hefur stýrt fjölda danskra og evrópskra rannsóknarverkefna. Hún er formaður ESFRI Strategy Working Group for Social and Cultural Innovation 2019-2021. Hún var varaformaður samtakanna Digital Humanities in the Nordic countries frá stofnun þeirra árið 2015 til 2020.",
        },
        {
          name: "Kadri Vider",
          bio: "Kadri Vider er sérfræðingur í máltækni við tölvunarfræðideild háskólans í Tartu í Eistlandi. Hún er einnig landsfulltrúi Eistlands fyrir CLARIN ERIC og framkvæmdastjóri eistnesku málfangamiðstöðvarinnar. Kadri hefur mikla reynslu af mótun og vinnu við máltækniáætlanir fyrir tungumál sem eiga undir högg að sækja líkt og eistneska, og var stjórnandi eistnesku máltækniáætlunarinnar sem er ein af fyrirmyndum máltækniáætlunar fyrir íslensku.",
        },
        {
          name: "Steven Krauwer",
          bio: "Steven Krauwer er emeritus við Utrecht-háskóla í Hollandi. Hann nam stærðfræði og almenn málvísindi í Utrecht og Kaupmannahöfn og var kennari og sérfræðingur í stærðfræðilegum og tölvunarfræðilegum málvísindum við málvísindastofnun Utrecht-háskóla uns hann fór á eftirlaun 2011. Steven stýrði og tók þátt í fjölda verkefna á vegum Evrópusambandsins, einkum innan vélrænna þýðinga og annarra sviða innan mál- og taltækni. Steven hefur verið í stýrihópi Foundation for Endangered Languages (Miðstöð tungumála í útrýmingarhættu) frá árinu 2005. Eftir að hann hætti störfum við Utrecht-háskóla varð hann fyrsti framkvæmdastjóri CLARIN ERIC, miðstjórnar CLARIN (Common Language Resources and Technology Infrastructure). Þegar því starfi lauk árið 2015 gerðist Steven ráðgjafi aðalstjórnar CLARIN.",
        },
      ],
    },
  },

  // English: the professional translation (is-to-en, November 2026), word for word.
  // Not in that document, so left in Icelandic: the two image descriptions (imageAlt).
  en: {
    title: 'What is Almanna\u00ADrómur?',
    description:
      'Almannarómur is an independent non-profit foundation that helps Icelandic society make full use of AI and language technology on its own terms, starting with making sure Icelandic works in the tools people rely on.',
    role: {
      heading: 'Our mission',
      paragraphs: [
        'Almannarómur is an independent non-profit foundation that helps Icelandic society make full use of AI and language technology on its own terms, starting with making sure Icelandic works in the tools people rely on. We bring together government, academia, business, and international partners, remove barriers to developing and using AI and language technology, and, in doing so, promote their responsible, beneficial, and widespread use across society.',
        'In this way, Iceland shows that a small language community can lead the AI revolution on its own terms, with solutions that support innovation, value creation, and a better quality of life.',
      ],
    },
    focus: {
      heading: 'Focus areas',
      items: [
        {
          title: 'Developing and providing access to shared infrastructure such as data and computing power',
          text: 'We manage the Language Technology Programmes, which build open infrastructure for Icelandic in technology. We also provide access to datasets and computing power, identify common barriers to development and adoption, and look for solutions.',
        },
        {
          title: 'Education, informed debate, and knowledge building for all of society',
          text: 'We encourage informed debate on AI and language technology through a strong publishing program, selected talks, and active participation in public discussion.',
        },
        {
          title: 'A strong AI and language technology ecosystem through collaboration and coordination',
          text: "We connect and bring together different players in the AI and language technology ecosystem to share knowledge, join forces on projects, and learn from each other's experience.",
        },
      ],
    },
    results: {
      heading: 'Results',
      items: [
        {
          text: 'We have managed two government Language Technology Programmes, which have lifted Icelandic from a language considered “at risk of digital extinction” to one now considered moderately well supported.',
        },
        {
          text: "We have brought funding, connections, and knowledge into Iceland's AI and language technology ecosystem, including through international grants and partnerships with global technology companies.",
        },
        {
          text: 'We have helped significantly improve Icelandic support for foreign technology through active international advocacy.',
        },
      ],
    },
    founders: {
      heading: 'Founders',
      text: 'Almannarómur was founded in 2014 to ensure that Icelandic stands on an equal footing with other languages in the world of technology.',
      imageAlt: 'Merki stofnaðila Almannaróms',
    },
    staffHeading: 'Our team',
    board: {
      heading: 'Board of Directors',
      intro: 'Our board is made up of professionals from across the business community, each contributing their own expertise.',
      imageAlt: 'Stjórn Almannaróms',
      groups: [
        { label: 'Chair', members: boardMembers.chair },
        { label: 'Board members', members: boardMembers.members },
        { label: 'Alternates', members: boardMembers.alternates },
      ],
    },
    council: {
      heading: 'Advisory board',
      paragraphs: [
        "We are responsible for making sure the outputs of the government's Language Technology Programmes fully meet the needs of entrepreneurs, companies, institutions, and individuals building technology that works in Icelandic.",
        'To that end, we have assembled an advisory board of respected international language technology experts: Bente Maegaard, Kadri Vider, and Steven Krauwer.',
        "The advisory board advises the Language Technology Programme's steering committee on the technical design of core projects, reviewing the technical specifications and progress reports of every project of the programs in detail.",
        'Read more about the advisory board members:',
      ],
      members: [
        {
          name: 'Bente Maegaard',
          bio: 'Bente Maegaard is the former director of the Centre for Language Technology (Center for Sprogteknologi) at the Department of Nordic Studies and Linguistics, University of Copenhagen. She was Vice Executive Director of CLARIN ERIC from 2012 to 2018. Her main areas of expertise are research infrastructure, language resources and tools, machine translation, evaluation, and management. Bente has led many Danish and European research projects. She chaired the ESFRI Strategy Working Group for Social and Cultural Innovation (2019–2021) and was vice chair of Digital Humanities in the Nordic Countries from its founding in 2015 until 2020.',
        },
        {
          name: 'Kadri Vider',
          bio: "Kadri Vider is a language technology specialist at the Institute of Computer Science, University of Tartu, Estonia. She is also Estonia's national coordinator for CLARIN ERIC and director of the Center of Estonian Language Resources. Kadri has extensive experience designing and running language technology programs for languages under pressure, such as Estonian, and has managed the Estonian Language Technology Programme, one of the models for Iceland's own program.",
        },
        {
          name: 'Steven Krauwer',
          bio: "Steven Krauwer is an emeritus at Utrecht University in the Netherlands. He studied mathematics and general linguistics in Utrecht and Copenhagen. He taught and worked as a specialist in mathematical and computational linguistics at Utrecht University's Institute of Linguistics until he retired in 2011. Steven led and took part in many EU projects, mainly in machine translation and other areas of language and speech technology. He has served on the committee of the Foundation for Endangered Languages since 2005. After leaving Utrecht University, he became the first Executive Director of CLARIN ERIC, the central body of CLARIN (Common Language Resources and Technology Infrastructure). When that role ended in 2015, Steven became an adviser to CLARIN's Board of Directors.",
        },
      ],
    },
  },
};
