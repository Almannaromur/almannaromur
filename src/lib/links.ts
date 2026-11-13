/**
 * Links that leave the website open in a new tab; links within it stay in the same tab.
 * Use on every <a> whose address is not fixed in the code:
 *   <a href={href} {...externalLinkAttrs(href)}>
 * Text written in Markdoc gets the same treatment in markdoc.config.mjs.
 */
const OWN_HOSTS = new Set(['almannaromur.is', 'www.almannaromur.is']);

/** True for an http(s) address on another website. Paths, anchors, mailto: and tel: are not external. */
export function isExternalLink(href: string | undefined | null): boolean {
  if (!href || !/^(https?:)?\/\//i.test(href)) return false;
  try {
    return !OWN_HOSTS.has(new URL(href, 'https://almannaromur.is').hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function externalLinkAttrs(href: string | undefined | null): { target?: '_blank'; rel?: 'noopener' } {
  return isExternalLink(href) ? { target: '_blank', rel: 'noopener' } : {};
}
