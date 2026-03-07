'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import PromoBanner from '@/components/PromoBanner'
import CategoryBanner from '@/components/CategoryBanner'
import StatsBanner from '@/components/StatsBanner'
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import TopPicks from '@/components/TopPicks'
import BedsSection from '@/components/BedsSection'
import SofaSection from '@/components/SofaSection'
import HotOffers from '@/components/HotOffers'
import { apiClient } from '@/lib/api'
import { Category, Product } from '@/lib/types'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, featuredData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getFeaturedProducts(),
        ])
        setCategories(categoriesData)
        setFeaturedProducts(featuredData)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to static data if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <PromoBanner />
      <HotOffers />
      <CategoryBanner />
      <TopPicks categories={categories} />
      <StatsBanner />
      <BedsSection />
      <SofaSection />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
    </div>
  )
}
