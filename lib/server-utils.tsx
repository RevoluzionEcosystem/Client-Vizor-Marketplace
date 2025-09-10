// Server-side version of networkUtils functions for use in server components
// This file avoids the "use client" directive, making it safe to use in server components

// Copy of the NETWORK_MAP from networkUtils.tsx without the "use client" directive
const NETWORK_MAP = {
    // Ethereum
    eth: {
        id: 'eth',
        slug: 'ethereum',
        name: 'Ethereum',
        aliases: ['ethereum', 'eth', 'ethereum-network'],
        apiKey: 'ethereum',
        chainId: 1,
        explorer: 'https://etherscan.io',
        blockExplorerUrls: ['https://etherscan.io']
    },

    // Binance Smart Chain
    bsc: {
        id: 'bsc',
        slug: 'bsc',
        name: 'Binance Smart Chain',
        aliases: ['binance-smart-chain', 'bsc', 'bnb-chain', 'binance'],
        apiKey: 'binance-smart-chain',
        chainId: 56,
        explorer: 'https://bscscan.com',
        blockExplorerUrls: ['https://bscscan.com']
    },

    // Polygon
    polygon: {
        id: 'polygon',
        slug: 'polygon',
        name: 'Polygon',
        aliases: ['polygon', 'matic', 'polygon-pos', 'polygon-network'],
        apiKey: 'polygon-pos',
        chainId: 137,
        explorer: 'https://polygonscan.com',
        blockExplorerUrls: ['https://polygonscan.com']
    },

    // Avalanche
    avax: {
        id: 'avax',
        slug: 'avalanche',
        name: 'Avalanche',
        aliases: ['avalanche', 'avax', 'avalanche-network'],
        apiKey: 'avalanche',
        chainId: 43114,
        explorer: 'https://snowtrace.io',
        blockExplorerUrls: ['https://snowtrace.io']
    },

    // Arbitrum
    arb: {
        id: 'arb',
        slug: 'arbitrum',
        name: 'Arbitrum',
        aliases: ['arbitrum', 'arb', 'arbitrum-one'],
        apiKey: 'arbitrum-one',
        chainId: 42161,
        explorer: 'https://arbiscan.io',
        blockExplorerUrls: ['https://arbiscan.io']
    },

    // Optimism
    op: {
        id: 'op',
        slug: 'optimism',
        name: 'Optimism',
        aliases: ['optimism', 'op', 'optimistic-ethereum'],
        apiKey: 'optimistic-ethereum',
        chainId: 10,
        explorer: 'https://optimistic.etherscan.io',
        blockExplorerUrls: ['https://optimistic.etherscan.io']
    },

    // Fantom
    ftm: {
        id: 'ftm',
        slug: 'fantom',
        name: 'Fantom',
        aliases: ['fantom', 'ftm', 'fantom-opera'],
        apiKey: 'fantom',
        chainId: 250,
        explorer: 'https://ftmscan.com',
        blockExplorerUrls: ['https://ftmscan.com']
    },

    // Base
    base: {
        id: 'base',
        slug: 'base',
        name: 'Base',
        aliases: ['base', 'base-network', 'base-chain'],
        apiKey: 'base',
        chainId: 8453,
        explorer: 'https://basescan.org',
        blockExplorerUrls: ['https://basescan.org']
    },

    // Additional networks (abbreviated for brevity)
    sol: {
        id: 'sol',
        slug: 'solana',
        name: 'Solana',
        aliases: ['solana', 'sol'],
        apiKey: 'solana',
        explorer: 'https://explorer.solana.com'
    },
    
    linea: {
        id: 'linea',
        slug: 'linea',
        name: 'Linea',
        aliases: ['linea'],
        explorer: 'https://lineascan.build'
    },

    zksync: {
        id: 'zksync',
        slug: 'zksync-era',
        name: 'zkSync Era',
        aliases: ['zksync', 'zksync-era'],
        explorer: 'https://explorer.zksync.io'
    }
};

// Lookup maps for fast conversions
const ID_MAP = new Map();
const SLUG_MAP = new Map();
const NAME_MAP = new Map();
const ALIAS_MAP = new Map();

// Initialize the lookup maps
Object.values(NETWORK_MAP).forEach(network => {
    ID_MAP.set(network.id, network);
    SLUG_MAP.set(network.slug, network);
    NAME_MAP.set(network.name.toLowerCase(), network);

    // Map all aliases to the network
    network.aliases.forEach(alias => {
        ALIAS_MAP.set(alias.toLowerCase(), network);
    });
});

/**
 * Converts any network identifier to the standard short network ID
 * This is the primary function for normalizing network names
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The standard network ID (short code) or the original if not found
 */
export function getNetworkId(network: string | null): string {
    if (!network) return '';

    const normalizedInput = network.toLowerCase().trim();

    // Direct match from ID map
    if (ID_MAP.has(normalizedInput)) {
        return normalizedInput; // Already an ID
    }

    // Check slug map
    if (SLUG_MAP.has(normalizedInput)) {
        return SLUG_MAP.get(normalizedInput).id;
    }

    // Check name map
    if (NAME_MAP.has(normalizedInput)) {
        return NAME_MAP.get(normalizedInput).id;
    }

    // Check alias map
    if (ALIAS_MAP.has(normalizedInput)) {
        return ALIAS_MAP.get(normalizedInput).id;
    }

    // Special case for spaces and hyphens
    const withoutSpacesAndHyphens = normalizedInput
        .replace(/[\s-]+/g, '') // Remove spaces and hyphens
        .toLowerCase();

    // Do a fuzzy search in aliases
    for (const [alias, network] of Array.from(ALIAS_MAP.entries())) {
        if (alias.replace(/[\s-]+/g, '').toLowerCase() === withoutSpacesAndHyphens) {
            return network.id;
        }
    }

    // Return original if no match found
    console.warn(`Network not found in mapping: ${network}`);
    return normalizedInput;
}

/**
 * Converts any network identifier to the human-readable name
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The full name of the network or the original if not found
 */
export function getNetworkName(network: string | null): string {
    if (!network) return '';

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.name || networkId;
}

/**
 * Gets the explorer URL for a given network
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The blockchain explorer URL or a default value if not found
 */
export function getExplorerUrl(network: string | null): string {
    if (!network) return 'https://etherscan.io'; // Default to Ethereum
    
    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.explorer || 'https://etherscan.io';
}

/**
 * Builds a complete explorer URL for a specific address (contract/wallet)
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @param address - The address to view on the explorer
 * @returns The complete URL to view the address on the explorer
 */
export function getAddressExplorerUrl(network: string | null, address: string): string {
    if (!address) return getExplorerUrl(network);
    return `${getExplorerUrl(network)}/address/${address}`;
}