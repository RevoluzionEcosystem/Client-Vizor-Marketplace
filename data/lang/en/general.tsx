import { MenuItem, SocialLink, LegalLink } from '@/types/navigation';

// Types for the general content structure
export interface GeneralContent {
    project_title: string;
    project_acronym: string;
    project_description: string;
    project_copyright: string;
    developed_by: string;
    developer_link: string;
    developer_name: string;
    terms: {
        yes: string;
        no: string;
        menu: string;
        theme: string;
        light: string;
        dark: string;
        system: string;
        close: string;
        cancel: string;
        connect: string;
        social: string;
        powered_by: string;
        preset: string;
        preset_description: string;
        under_development: string;
        under_development_description: string;
        coming_soon: string;
        coming_soon_description: string;
        unauthorized: string;
        rate_limit: string;
        copied: string;
        copied_to_clipboard: string;
        language_settings: string;
        default_language: string;
        auto_detect_language: string;
        settings_preset: string;
    };
    marketplace: {
        title: string;
        description: string;
        subtitle: string;
        features: {
            security: {
                title: string;
                description: string;
            };
            trading: {
                title: string;
                description: string;
            };
            analytics: {
                title: string;
                description: string;
            };
        };
        tabs: {
            browse: string;
            my_listings: string;
            my_purchases: string;
            analytics: string;
        };
        stats: {
            active_listings: string;
            total_volume: string;
            avg_discount: string;
            active_traders: string;
        };
        actions: {
            create_listing: string;
            buy_now: string;
            view_details: string;
            browse_listings: string;
        };
        empty_states: {
            no_listings: string;
            no_purchases: string;
            analytics_coming_soon: string;
        };
    };
    error_404: {
        title: string;
        description: string;
        explore_title: string;
        report_issue: string;
        error_code: string;
        return_home: string;
    };
    footer: {
        company_section: {
            title: string;
            description: string;
        };
        product_section: {
            title: string;
            links: Array<{
                title: string;
                href: string;
            }>;
        };
        resources_section: {
            title: string;
            links: Array<{
                title: string;
                href: string;
            }>;
        };
        community_section: {
            title: string;
            description: string;
            button_text: string;
            telegram_link: string;
            benefits: string[];
        };
    };
    menu: MenuItem[];
    legal: LegalLink[];
    social: SocialLink[];
}

// Main content export as a constant
export const general: GeneralContent = {
    project_title: "Vizor",
    project_acronym: "W3W",
    project_description: "Vizor: Blockchain investment and staking rewards platform.",
    project_copyright: "© 2023—2025 - Vizor | All rights reserved",
    developed_by: "Developed by",
    developer_link: "https://revoluzion.app",
    developer_name: "Revoluzion Ecosystem",
    terms: {
        yes: "Yes",
        no: "No",
        menu: "Menu",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        close: "Close",
        cancel: "Cancel",
        connect: "Connect",
        social: "Social",
        powered_by: "Powered by",
        preset: "Settings",
        preset_description: "Choose your preferred preset",
        under_development: "Under Development",
        under_development_description: "This section is currently under development",
        coming_soon: "Coming soon",
        coming_soon_description: "We are constantly developing to serve you better",
        unauthorized: "Unauthorized Access",
        rate_limit: "Rate Limit Exceeded",
        copied: "Copied",
        copied_to_clipboard: "Copied to clipboard",
        language_settings: "Language Settings",
        default_language: "Default Language",
        auto_detect_language: "Auto-detect Language",
        settings_preset: "Settings",
    },
    error_404: {
        title: "Page Not Found",
        description: "The page you are looking for doesn't exist or has been moved. Check the URL or explore our ecosystem below.",
        explore_title: "Explore Our Ecosystem",
        report_issue: "Report Issue",
        error_code: "Error code: 404_PAGE_NOT_FOUND",
        return_home: "Return home or try searching for what you're looking for",
    },
    marketplace: {
        title: "LP Marketplace",
        description: "Trade locked liquidity pools with confidence",
        subtitle: "Specialized marketplace for trading locked liquidity pools (LP positions)",
        features: {
            security: {
                title: "On-Chain Security",
                description: "Every LP position is verified on-chain to prevent fraud and ensure authenticity"
            },
            trading: {
                title: "Instant Trading", 
                description: "Buy and sell locked LP positions instantly with our secure escrow system"
            },
            analytics: {
                title: "Advanced Analytics",
                description: "Get detailed insights on LP value, impermanent loss, and earning potential"
            }
        },
        tabs: {
            browse: "Browse",
            my_listings: "My Listings", 
            my_purchases: "Purchases",
            analytics: "Analytics"
        },
        stats: {
            active_listings: "Active Listings",
            total_volume: "Total Volume", 
            avg_discount: "Avg. Discount",
            active_traders: "Active Traders"
        },
        actions: {
            create_listing: "Create Listing",
            buy_now: "Buy Now",
            view_details: "View Details",
            browse_listings: "Browse Listings"
        },
        empty_states: {
            no_listings: "No Listings Yet",
            no_purchases: "No Purchases Yet",
            analytics_coming_soon: "Analytics Coming Soon"
        }
    },
    footer: {
        company_section: {
            title: "Vizor",
            description: "Pioneering the future of blockchain project investment and staking rewards. Join our community of forward-thinking Web3 enthusiasts."
        },
        product_section: {
            title: "Products",
            links: [
                { title: "Dashboard", href: "/dashboard" },
                { title: "Staking", href: "/staking" },
                { title: "Governance", href: "/governance" },
                { title: "Crosschain Swap", href: "/crosschain-swap" }
            ]
        },
        resources_section: {
            title: "Resources",
            links: [
                { title: "Documentation", href: "https://vizor.gitbook.io" },
                { title: "Support", href: "https://t.me/Vizor_portal" },
                { title: "Changelog", href: "/changelog" },
                { title: "Legal", href: "/legal" }
            ]
        },
        community_section: {
            title: "Join Our Telegram Community",
            description: "Connect with fellow stakers, get updates on investment projects, and stay informed about the latest ecosystem developments.",
            button_text: "Join Vizor Community",
            telegram_link: "https://t.me/Vizor_portal",
            benefits: [
                "Connect with 1,000+ stakers and Web3 enthusiasts",
                "Get early access to investment project opportunities"
            ]
        }
    },
    menu: [
        {
            id: "dashboard",
            title: "Dashboard",
            link: "/",
            type: "internal",
            open: false,
            child: [],
        },
        {
            id: "charts",
            title: "Charts",
            link: "#",
            type: "internal",
            open: false,
            child: [],
        },
        {
            id: "crosschain-swap",
            title: "Crosschain / Swap",
            link: "/crosschain-swap",
            type: "internal",
            open: false,
            child: [],
        },
    ],
    legal: [
        {
            id: "legal",
            title: "Legal",
            link: "/legal",
            type: "modal",
            open: false,
            child: [],
        },
        {
            id: "terms",
            title: "Terms",
            link: "/terms",
            type: "modal",
            open: false,
            child: [],
        },
        {
            id: "documentation",
            title: "Documentation",
            link: "",
            type: "modal",
            open: false,
            child: [],
        },
        {
            id: "support",
            title: "Support",
            link: "https://t.me/",
            type: "modal",
            open: false,
            child: [],
        },
    ],
    social: [
        {
            id: "x",
            link: "",
        },
        {
            id: "telegram",
            link: "",
        },
        {
            id: "youtube",
            link: "",
        }
    ],
};

// Frozen object export - prevents accidental modifications
export default Object.freeze(general);
