'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart, FiSearch } from 'react-icons/fi'
import { categories } from '@/lib/data'
import { SITE_NAME } from '@/lib/site'
import { useCart } from '@/context/CartContext'
import CartModal from './CartModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { getTotalItems } = useCart()
  const router = useRouter()

  const categorySearchMap: Record<string, string> = {
    'Beds': 'bed',
    'Sofa Sets': 'sofa',
    'Dining Table Sets': 'dining table',
    'TV Units': 'tv unit',
    'Book Shelves': 'bookshelf',
    'Coffee Tables': 'coffee table',
    'Study Tables': 'study table',
    'Home Decor': 'decor',
  }

  const handleSearch = () => {
    const term = searchTerm.trim()
    if (!term) return

    const lower = term.toLowerCase()

    // Simple mapping for common categories
    if (lower.includes('bed')) {
      router.push('/category/beds')
      return
    }
    if (lower.includes('sofa')) {
      router.push('/category/sofa-sets')
      return
    }

    // Generic search results page
    router.push(`/search/results?q=${encodeURIComponent(term)}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>INR</span>
            <span>USD</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:text-yellow-400">Login</a>
            <a href="/register" className="hover:text-yellow-400">Register</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            <a href="/" className="flex items-center gap-3">
              <img 
                src="https://shreejeeblessingwood.in/sjbw-logo.png" 
                alt={`${SITE_NAME} logo`}
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold text-primary hidden sm:block">{SITE_NAME}</span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-lg hover:bg-secondary"
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:text-primary">
              <FiHeart className="text-xl" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-primary"
            >
              <FiShoppingCart className="text-xl" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button className="p-2 hover:text-primary">
              <FiUser className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 text-gray-400"
              aria-label="Search"
            >
              <FiSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="relative">
              <button
                className="px-6 py-3 bg-primary text-white font-semibold hover:bg-secondary flex items-center gap-2"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <FiMenu className="text-xl" />
                <span>All Categories</span>
              </button>
              
              {/* Category Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg w-64 max-h-[600px] overflow-y-auto"
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  {categories.map((category) => (
                    <div key={category.name} className="border-b">
                      <a
                        href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-3 hover:bg-gray-100 font-semibold"
                      >
                        {category.name}
                      </a>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="bg-gray-50">
                          {category.subcategories.map((sub) => {
                            const baseQuery = categorySearchMap[category.name] || category.name
                            return (
                              <a
                                key={sub}
                                href={`/search/results?q=${encodeURIComponent(baseQuery)}`}
                                className="block px-6 py-2 text-sm hover:bg-gray-200"
                              >
                                {sub}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-6 ml-6">
              <a href="/" className="py-3 hover:text-primary font-medium">Home</a>
              <a href="/office" className="py-3 hover:text-primary font-medium">Office</a>
              <a href="/outdoor" className="py-3 hover:text-primary font-medium">Outdoor</a>
              <a href="/restaurant-hotel" className="py-3 hover:text-primary font-medium">Restaurant/Hotel</a>
              <a href="/banquet" className="py-3 hover:text-primary font-medium">Banquet</a>
              <a href="/school" className="py-3 hover:text-primary font-medium">School</a>
              <a href="/hospital" className="py-3 hover:text-primary font-medium">Hospital</a>
              <a href="/customize" className="py-3 hover:text-primary font-medium">Customize</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <a href="/" className="block py-2 hover:text-primary">Home</a>
            <a href="/office" className="block py-2 hover:text-primary">Office</a>
            <a href="/outdoor" className="block py-2 hover:text-primary">Outdoor</a>
            <a href="/restaurant-hotel" className="block py-2 hover:text-primary">Restaurant/Hotel</a>
            <a href="/banquet" className="block py-2 hover:text-primary">Banquet</a>
            <a href="/school" className="block py-2 hover:text-primary">School</a>
            <a href="/hospital" className="block py-2 hover:text-primary">Hospital</a>
            <a href="/customize" className="block py-2 hover:text-primary">Customize</a>
          </div>
        </div>
      )}

      {/* Support Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
          <span className="font-semibold">Support 24/7</span>
          <span>|</span>
          <a href="tel:8467082350" className="hover:text-yellow-400">8467082350</a>
          <span>|</span>
          <a href="tel:9760232667" className="hover:text-yellow-400">9760232667</a>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

