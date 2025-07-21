import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from '@/lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'WhisperBox - Your Private Mental Health Companion',
  description: 'A secure, AI-enhanced space for emotional journaling and mental wellness. Write freely, reflect deeply, heal gently.',
  keywords: ['mental health', 'emotional wellbeing', 'AI therapy', 'private journaling', 'emotional support', 'mental wellness', 'self-care', 'emotional healing'],
  authors: [{ name: 'WhisperBox Team' }],
  creator: 'WhisperBox',
  publisher: 'WhisperBox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://whisperbox.app'),
  openGraph: {
    title: 'WhisperBox - Your Private Mental Health Companion',
    description: 'A secure, private space for emotional journaling with AI-powered insights and compassionate support for your mental wellness journey.',
    url: 'https://whisperbox.app',
    siteName: 'WhisperBox',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WhisperBox - Private Mental Health Companion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhisperBox - Your Private Mental Health Companion',
    description: 'A secure, private space for emotional journaling with AI-powered mental wellness support.',
    creator: '@whisperbox_app',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WhisperBox" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="WhisperBox" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
} 