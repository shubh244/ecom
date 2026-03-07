'use client'

import { useCart } from '@/context/CartContext'
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const router = useRouter()

  if (!isOpen) return null

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-2xl text-primary" />
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <span className="bg-primary text-white px-2 py-1 rounded-full text-sm">
              {getTotalItems()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
              <Link
                href="/"
                onClick={onClose}
                className="inline-block bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-3xl">🪑</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-primary">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

