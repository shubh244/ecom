import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: 'Shreejee Blessing Wood - Buy Wooden Furniture',
  description: 'Premium quality and tailor-made furniture and furnishing solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

