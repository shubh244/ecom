/** Public site name (matches product branding). */
export const SITE_NAME = 'Shreejee Blessings Wood'

/** Canonical site URL for metadata, sitemap, and JSON-LD. Set in production. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (explicit) return explicit
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  return 'https://www.shreejeeblessingwood.in'
}

export const siteSeo = {
  homeTitle: `${SITE_NAME} | Wooden Furniture in Delhi & Pan India Delivery`,
  homeDescription:
    'Buy premium wooden furniture online from Shreejee Blessings Wood — beds, sofas, dining sets, TV units & more. Delhi NCR showrooms (Rajouri Garden, Gurgaon, Noida) with trusted Pan India delivery and secure checkout.',
  defaultDescription:
    'Shreejee Blessings Wood: premium wooden furniture with Delhi NCR stores and Pan India delivery. Shop beds, sofas, dining & home furniture online.',
  keywords: [
    SITE_NAME,
    'wooden furniture Delhi',
    'furniture shop Delhi NCR',
    'buy furniture online India',
    'Pan India furniture delivery',
    'furniture delivery across India',
    'Rajouri Garden furniture',
    'solid wood furniture India',
    'beds sofas dining online',
    'home furniture Delhi',
  ],
  ogImage: 'https://shreejeeblessingwood.in/sjbw-logo.png',
} as const

export function buildProductMetaDescription(productName: string, excerpt?: string | null): string {
  const base = `${productName} — Buy from ${SITE_NAME}. Premium wooden furniture with delivery in Delhi NCR and Pan India.`
  if (excerpt && excerpt.length < 120) return `${base} ${excerpt}`
  return base
}

export function organizationJsonLd() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: SITE_NAME,
        url,
        logo: siteSeo.ogImage,
        sameAs: ['https://shreejeeblessingwood.in'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8467082350',
          contactType: 'customer service',
          areaServed: ['IN', 'Delhi', 'NCR'],
          availableLanguage: ['English', 'Hindi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME,
        publisher: { '@id': `${url}/#organization` },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${url}/search/results?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FurnitureStore',
        '@id': `${url}/#store`,
        name: SITE_NAME,
        image: siteSeo.ogImage,
        url,
        telephone: ['+91-8467082350', '+91-9760232667'],
        email: 'info@shreejeeblessingwood.in',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '131, Gupta Palace, Block A, Rajouri Garden',
          addressLocality: 'New Delhi',
          postalCode: '110027',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
        areaServed: [
          { '@type': 'City', name: 'Delhi' },
          { '@type': 'AdministrativeArea', name: 'National Capital Region' },
          { '@type': 'Country', name: 'India' },
        ],
        priceRange: '₹₹',
      },
    ],
  }
}
