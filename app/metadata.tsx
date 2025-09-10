import { Metadata } from "next"

// Define metadata for the homepage (root route)
export const metadata: Metadata = {
    title: 'Vizor | AI-Powered DeFi Intelligence Platform',
    description: 'Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
    keywords: ['DeFi Intelligence', 'Vizor', 'AI Analytics', 'Cross-Chain', 'DeFi Platform', 'Blockchain Analytics', 'DeFi Automation'],
    openGraph: {
        title: 'Vizor | AI-Powered DeFi Intelligence Platform',
        description: 'Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
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
        description: 'Harness the power of AI-driven analytics, cross-chain automation, and institutional-grade security to maximize your DeFi potential.',
        images: ['https://usevizor.com/assets/images/vizor-banner.png'],
    }
}