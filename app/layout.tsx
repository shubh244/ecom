import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { SITE_NAME, getSiteUrl, siteSeo, organizationJsonLd } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteSeo.homeTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteSeo.defaultDescription,
  keywords: [...siteSeo.keywords],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: SITE_NAME,
    title: siteSeo.homeTitle,
    description: siteSeo.defaultDescription,
    images: [{ url: siteSeo.ogImage, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSeo.homeTitle,
    description: siteSeo.defaultDescription,
    images: [siteSeo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'shopping',
}

const jsonLd = JSON.stringify(organizationJsonLd())

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

