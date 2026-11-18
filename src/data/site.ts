/** Organisation-wide facts used by the header, footer and contact blocks. */
export const site = {
  name: 'Almannarómur',
  email: 'almannaromur@almannaromur.is',
  address: ['Gróska, Bjargargata 1', '102 Reykjavík'],
  idNumber: '621214-2680',
  reportUrl: 'https://stadagervigreindar.is/',
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/almannaromur/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/almannaromur/' },
  ],
  /**
   * Newsletter signup (Mailchimp). The address is sent to the list from the page itself, so
   * the visitor stays on the site (see Newsletter.astro). While `action` is empty the button
   * is disabled.
   *   action     the list's "subscribe/post" address: the u and id values are in the link to
   *              the list's signup page in Mailchimp
   *   emailField the name Mailchimp gives the email field
   *   trap       a hidden field that people leave empty and spam robots fill in:
   *              "b_" + u + "_" + id
   */
  newsletter: {
    action: 'https://almannaromur.us3.list-manage.com/subscribe/post?u=e1dcf5455a885cfc6811b32ad&id=d628b76fe6',
    emailField: 'EMAIL',
    trap: 'b_e1dcf5455a885cfc6811b32ad_d628b76fe6',
  },
} as const;
