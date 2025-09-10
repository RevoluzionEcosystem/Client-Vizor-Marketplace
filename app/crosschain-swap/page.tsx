import { Metadata } from "next"
import Script from "next/script"
import CrosschainSwapView from "@/components/modules/view/crosschain-swap"

// Define the JSON-LD structured data outside the metadata
const crosschainSwapJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vizor Cross-Chain Swap',
  description: 'Swap your Vizor tokens across different blockchains with the best rates and lowest fees. Secure and efficient token transfers.',
  applicationCategory: 'DeFi Tools',
  offers: {
    '@type': 'Offer',
    description: 'Cross-chain W3W token swaps with optimal rates and security'
  },
  provider: {
    '@type': 'Organization',
    name: 'Vizor',
    url: 'https://vizor.com'
  }
};

export const metadata: Metadata = {
  title: 'Cross-Chain Swap | Vizor',
  description: 'Swap tokens across different blockchains with the best rates and lowest fees. Powered by Rubic and protected by GoPlusLabs security.',
  keywords: ['Cross-Chain Swap', 'Token Swap', 'DeFi', 'Multi-Chain', 'Vizor', 'W3W', 'Blockchain', 'Crypto'],
  openGraph: {
    title: 'Cross-Chain Swap | Vizor',
    description: 'Swap tokens across different blockchains with the best rates and lowest fees. Powered by Rubic and protected by GoPlusLabs security.',
    url: 'https://vizor.com/crosschain-swap',
    siteName: 'Vizor',
    locale: 'en_US',
    type: 'website',    
    images: [
      {
        url: 'https://usevizor.com/assets/images/vizor-banner.png',
        width: 1200,
        height: 630,
        alt: 'Vizor Cross-Chain Swap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cross-Chain Swap | Vizor',
    description: 'Swap tokens across different blockchains with the best rates and lowest fees.',
    images: ['https://usevizor.com/assets/images/vizor-banner.png'],
  }
}

export default function CrosschainSwap() {
  return (
    <>
      {/* Add JSON-LD using next/script */}
      <Script
        id="crosschain-swap-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crosschainSwapJsonLd) }}
      />
      <CrosschainSwapView />
    </>
  )
}