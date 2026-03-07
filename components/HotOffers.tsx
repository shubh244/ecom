'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function HotOffers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotOffers = async () => {
      try {
        const data = await apiClient.getHotOffers()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching hot offers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotOffers()
  }, [])

  if (loading) {
    return null
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl">🔥</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Hot Offers</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Limited time deals you can't miss!</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg transform hover:scale-105 transition-transform">
            Up to 70% OFF
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative transform hover:scale-105 transition-transform duration-300">
              {product.hot_offer && (
                <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                  {product.offer_percentage}% OFF
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

