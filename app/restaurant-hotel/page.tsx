import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata, getCommercialPage } from '@/lib/commercialPages'

const key = 'restaurant-hotel'
const p = getCommercialPage(key)
export const metadata: Metadata = commercialMetadata(key)

export default function RestaurantHotelPage() {
  return <CommercialSectionPage slug={p.slug} headline={p.headline} description={p.description} />
}
