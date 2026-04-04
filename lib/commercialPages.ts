import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo } from '@/lib/site'

export const COMMERCIAL_ROUTES = [
  'office',
  'outdoor',
  'restaurant-hotel',
  'banquet',
  'school',
  'hospital',
  'customize',
] as const

export type CommercialRoute = (typeof COMMERCIAL_ROUTES)[number]

type PageDef = {
  slug: CommercialRoute
  title: string
  headline: string
  description: string
}

const PAGES: Record<CommercialRoute, PageDef> = {
  office: {
    slug: 'office',
    title: 'Office Furniture',
    headline: 'Office furniture for productive workspaces',
    description:
      'Executive desks, ergonomic chairs, conference tables and storage — ideal for offices in Delhi NCR and Pan India projects.',
  },
  outdoor: {
    slug: 'outdoor',
    title: 'Outdoor Furniture',
    headline: 'Outdoor & patio furniture',
    description:
      'Weather-resistant sofas, dining sets and loungers for balconies, terraces and gardens.',
  },
  'restaurant-hotel': {
    slug: 'restaurant-hotel',
    title: 'Restaurant & Hotel Furniture',
    headline: 'Commercial dining & lobby furniture',
    description:
      'Durable chairs, tables and seating for restaurants, cafés and hotel lobbies.',
  },
  banquet: {
    slug: 'banquet',
    title: 'Banquet Furniture',
    headline: 'Banquet & event furniture',
    description:
      'Folding tables, stackable chairs and round banquet setups for halls and celebrations.',
  },
  school: {
    slug: 'school',
    title: 'School Furniture',
    headline: 'School & classroom furniture',
    description:
      'Student desks, library tables and lab seating for schools and institutions.',
  },
  hospital: {
    slug: 'hospital',
    title: 'Hospital Furniture',
    headline: 'Healthcare & waiting area furniture',
    description:
      'Patient beds, waiting benches and storage suited for clinics and hospitals.',
  },
  customize: {
    slug: 'customize',
    title: 'Custom & Bespoke Furniture',
    headline: 'Made-to-order furniture',
    description:
      'Custom wardrobes, dining tables and TV units — designed to your space and finish at our workshop.',
  },
}

export function getCommercialPage(route: CommercialRoute): PageDef {
  return PAGES[route]
}

export function commercialMetadata(route: CommercialRoute): Metadata {
  const p = PAGES[route]
  const siteUrl = getSiteUrl()
  const path = `/${route}`
  const desc = `${p.description} Shop ${p.title} from ${SITE_NAME} with delivery across India.`
  return {
    title: `${p.title} | ${SITE_NAME}`,
    description: desc,
    keywords: [...siteSeo.keywords, p.title, `${p.title} Delhi`, 'commercial furniture India'],
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${p.title} | ${SITE_NAME}`,
      description: desc,
      url: `${siteUrl}${path}`,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: siteSeo.ogImage, alt: SITE_NAME }],
    },
  }
}
