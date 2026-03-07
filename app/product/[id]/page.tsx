'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(params.id)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.in_stock) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image || '/placeholder.jpg',
        category: product.category?.name || '',
        subcategory: product.subcategory,
        rating: product.rating,
        reviews: product.reviews,
        inStock: product.in_stock,
        description: product.description,
      })
    }
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
            <div
              className="w-full h-full bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(${product.image || '/placeholder.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!product.image && (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-8xl">
                  🪑
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-semibold">
                        -{discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              {product.original_price && (
                <p className="text-green-600 font-semibold">
                  You save ₹{(product.original_price - product.price).toLocaleString()}!
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  product.in_stock
                    ? 'bg-primary hover:bg-secondary text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart />
                Add to Cart
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
                <FiHeart />
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
                <FiShare2 />
              </button>
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Premium Quality Materials</li>
                <li>✓ Free Shipping on orders over ₹20,000</li>
                <li>✓ 1 & 1 Returns Policy</li>
                <li>✓ 24/7 Customer Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

