import { Metadata } from "next"
import Script from "next/script"
import MarketplaceView from "@/components/modules/view/marketplace"
import CardStats from "@/components/modules/card/stats";
import { Link } from "lucide-react";

// Define the JSON-LD structured data outside the metadata
const marketplaceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizor LP Marketplace',
    description: 'Trade locked liquidity pools (LP positions) with confidence. Buy, sell, and participate in auctions for premium locked liquidity opportunities on the decentralized marketplace.',
    applicationCategory: 'DeFi Marketplace',
    offers: {
        '@type': 'Offer',
        description: 'Peer-to-peer trading of locked LP positions'
    },
    provider: {
        '@type': 'Organization',
        name: 'Vizor',
        url: 'https://vizor.com'
    }
};

export const metadata: Metadata = {
    title: 'LP Marketplace | Vizor',
    description: 'Trade locked liquidity pools (LP positions) with confidence. Buy, sell, and participate in auctions for premium locked liquidity opportunities on the decentralized marketplace.',
    keywords: ['LP Marketplace', 'Locked Liquidity', 'DeFi Trading', 'LP Tokens', 'Liquidity Trading', 'P2P Marketplace'],
    openGraph: {
        title: 'LP Marketplace | Vizor',
        description: 'Trade locked liquidity pools (LP positions) with confidence. Buy, sell, and participate in auctions for premium locked liquidity opportunities on the decentralized marketplace.',
        url: 'https://vizor.com/marketplace',
        siteName: 'Vizor',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://usevizor.com/assets/images/vizor-banner.png',
                width: 1200,
                height: 630,
                alt: 'Vizor LP Marketplace',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LP Marketplace | Vizor',
        description: 'Trade locked liquidity pools (LP positions) with confidence. Buy, sell, and participate in auctions for premium locked liquidity opportunities on the decentralized marketplace.',
        images: ['https://usevizor.com/assets/images/vizor-banner.png'],
    }
}

export default function Marketplace() {
    return (
        <>
            {/* Add JSON-LD using next/script */}
            <Script
                id="marketplace-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceJsonLd) }}
            />
            <MarketplaceView />
        </>
    )
}
