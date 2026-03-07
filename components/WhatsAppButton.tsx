'use client'

import { useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Primary WhatsApp number (you can make this configurable)
  const whatsappNumber = '8467082350'
  const message = 'Hello! I would like to know more about your furniture products.'

  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="WhatsApp Chat"
      >
        <FiMessageCircle className="text-3xl" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </span>
      </button>

      {/* WhatsApp Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-slide-up">
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold">Shreejee Blessing Wood</h3>
                <p className="text-xs text-green-100">Typically replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600 rounded p-1"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-700 mb-4">
              Hi! 👋 How can we help you today?
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello! I would like to know more about your furniture products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-semibold transition"
              >
                Start Chat
              </a>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('I want to place an order')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg text-sm transition"
                >
                  Place Order
                </a>
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('I need product information')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg text-sm transition"
                >
                  Product Info
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online now</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

