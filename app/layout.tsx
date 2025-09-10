import { Metadata, Viewport } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import { ReactNode } from "react"
import { config } from "../components/modules/wallet/config"
import "./globals.css"

// Dynamic imports with next/dynamic to improve chunking
import dynamic from "next/dynamic"

// Dynamic import for root layout with loading state
const RootClientLayout = dynamic(() => import("../components/root-layout"), {
  ssr: true
})

// CommitHashInjector as a dynamic import since it's an async server component
const CommitHashInjector = dynamic(() =>
  import("../components/commit-hash-injector").then(mod => mod.CommitHashInjector)
)

// Define the JSON-LD structured data outside the metadata
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vizor',
  url: 'https://usevizor.com',
  logo: 'https://usevizor.com/assets/images/logo.png',
  sameAs: [
    'https://www.twitter.com/VizorDeFi',
    'https://t.me/vizordefi',
  ],
  description: 'Vizor: AI-Powered DeFi Intelligence Platform - Harness advanced analytics, cross-chain automation, and institutional-grade security',
  areaServed: 'Worldwide'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Vizor',
    default: 'Vizor | AI-Powered DeFi Intelligence Platform',
  },
  description: 'Vizor: Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
  keywords: [
    'Vizor', 'DeFi Intelligence', 'AI Analytics', 'Cross-Chain', 'DeFi Platform', 'Blockchain Analytics', 'DeFi Automation', 'Institutional Security'
  ],
  icons: {
    icon: [
      { url: '/assets/images/favicon.ico' },
      { url: '/assets/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/assets/images/favicon.ico',
    apple: '/assets/images/logo.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/assets/images/logo.png',
      },
    ],
  },
  authors: [
    { name: 'Vizor', url: 'https://usevizor.com' }
  ],
  creator: 'Vizor',
  publisher: 'Vizor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://usevizor.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Vizor | AI-Powered DeFi Intelligence Platform',
    description: 'Vizor: Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
    url: 'https://usevizor.com',
    siteName: 'Vizor',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://usevizor.com/assets/images/vizor-banner.png',
        width: 1200,
        height: 630,
        alt: 'Vizor AI-Powered DeFi Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vizor | AI-Powered DeFi Intelligence Platform',
    description: 'Vizor: Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
    creator: '@VizorDeFi',
    images: ['https://usevizor.com/assets/images/vizor-banner.png'],
  },
  other: {
    'msapplication-TileImage': 'https://usevizor.com/assets/images/vizor-banner.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:image:alt': 'Vizor AI-Powered DeFi Intelligence Platform',
    'theme-color': '#000000'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'google-site-verification-code',
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || 'yahoo-site-verification-code',
  },
  category: 'technology',
  classification: 'DeFi, AI, Blockchain, Analytics',
};

// Move JSON.stringify outside the render function to avoid recomputation
const jsonLdScript = JSON.stringify(organizationJsonLd);

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // Get initial state for wagmi
  const headersList = await headers()
  const initialState = cookieToInitialState(config, headersList.get("cookie"))

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* WhatsApp specific meta tags */}
        <meta property="og:image" content="https://usevizor.com/assets/images/vizor-banner.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Vizor AI-Powered DeFi Intelligence Platform" />
        <meta property="og:image:type" content="image/png" />
        <link rel="image_src" href="https://usevizor.com/assets/images/vizor-banner.png" />

        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript }}
        />

        {/* Inject commit hash for client-side components */}
        <CommitHashInjector />
      </head>
      <body className="min-h-screen antialiased">
        {/* Performance analytics loaded with dynamic imports */}
        <SpeedInsights />
        <Analytics />
        {/* Main layout with children */}
        <RootClientLayout initialState={initialState}>
          {children}
        </RootClientLayout>
      </body>
    </html>
  )
}