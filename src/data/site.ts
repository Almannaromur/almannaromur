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
   * Newsletter signup. Set `action` to the provider's form endpoint to show the form.
   * While empty, the signup section is not rendered.
   */
  newsletter: {
    action: '',
    emailField: 'email',
  },
} as const;
