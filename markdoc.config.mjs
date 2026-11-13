import { component, defineMarkdocConfig, Markdoc, nodes } from '@astrojs/markdoc/config';
import { externalLinkAttrs } from './src/lib/links.ts';

/**
 * Extra building blocks for project pages (src/content/projects/*.mdoc) and
 * news articles (src/content/news/*.mdoc).
 *
 * News articles (these are also set up in keystatic.config.ts, so editors can insert them):
 *   {% quote name="…" role="…" %}text{% /quote %}    pull quote with the speaker underneath
 *   {% arrows %} - item … {% /arrows %}              list with arrows instead of dots
 *   {% caption %}text{% /caption %}                  caption under an image
 *   {% button href="…" label="…" /%}                 centred yellow button
 *   {% narrow width=480 %}![…](…){% /narrow %}       image narrower than the text column
 *   {% accordion title="…" %}text{% /accordion %}    expandable row
 *   {% br /%}                                        line break inside a heading
 *   {% panel heading="…" %}{% table %}…{% /panel %}  pale blue box, e.g. a list of grants
 *
 * Project pages:
 *   {% action href="…" label="…" /%}                 right-aligned text link
 *   {% cards columns=3 %} … {% /cards %}             full-width card grid
 *     {% card title="…" image="file.png" %}text{% /card %}        photo card
 *     {% card title="…" logo="file.png" href="…" %}text{% /card %} partner card
 *     {% card title="…" icon="file.svg" %}text{% /card %}          icon on a gradient
 *     {% flipcard title="…" note="…" %}text{% /flipcard %}         turn-over card
 *   {% accordion title="…" %}text{% /accordion %}    expandable row
 *   {% band heading="…" %}text{% /band %}            full-width tinted panel
 *   {% video src="…" title="…" /%}                   embedded video
 *   {% ratings /%}                                   company rating table
 */
const text = { type: String };

export default defineMarkdocConfig({
  nodes: {
    // Links in the text: one to another website opens in a new tab (see src/lib/links.ts).
    link: {
      ...nodes.link,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return new Markdoc.Tag('a', { ...attributes, ...externalLinkAttrs(attributes.href) }, node.transformChildren(config));
      },
    },
  },
  tags: {
    action: {
      render: component('./src/components/markdoc/ProseAction.astro'),
      selfClosing: true,
      attributes: { href: { ...text, required: true }, label: { ...text, required: true } },
    },
    cards: {
      render: component('./src/components/markdoc/Cards.astro'),
      attributes: { columns: { type: Number, default: 3 } },
    },
    card: {
      render: component('./src/components/markdoc/Card.astro'),
      attributes: { title: text, image: text, logo: text, icon: text, href: text },
    },
    flipcard: {
      render: component('./src/components/markdoc/FlipCardBlock.astro'),
      attributes: { title: { ...text, required: true }, note: text, icon: text },
    },
    accordion: {
      render: component('./src/components/markdoc/AccordionBlock.astro'),
      attributes: { title: { ...text, required: true } },
    },
    band: {
      render: component('./src/components/markdoc/Band.astro'),
      attributes: { heading: { ...text, required: true } },
    },
    video: {
      render: component('./src/components/markdoc/Video.astro'),
      selfClosing: true,
      attributes: { src: { ...text, required: true }, title: { ...text, required: true } },
    },
    ratings: {
      render: component('./src/components/markdoc/Ratings.astro'),
      selfClosing: true,
    },
    quote: {
      render: component('./src/components/markdoc/Quote.astro'),
      attributes: { name: text, role: text },
    },
    arrows: {
      render: component('./src/components/markdoc/Arrows.astro'),
    },
    caption: {
      render: component('./src/components/markdoc/Caption.astro'),
    },
    button: {
      render: component('./src/components/markdoc/ProseButton.astro'),
      selfClosing: true,
      attributes: { href: { ...text, required: true }, label: { ...text, required: true } },
    },
    narrow: {
      render: component('./src/components/markdoc/Narrow.astro'),
      attributes: { width: { type: Number, required: true } },
    },
    br: {
      render: 'br',
      selfClosing: true,
    },
    panel: {
      render: component('./src/components/markdoc/Panel.astro'),
      attributes: { heading: text },
    },
  },
});
