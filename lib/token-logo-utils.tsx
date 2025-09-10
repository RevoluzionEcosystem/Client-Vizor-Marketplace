/**
 * Token logo utilities for fetching and resolving token logos from various sources
 * Primary sources:
 * 1. GeckoTerminal API (best quality and most up-to-date)
 * 2. Block explorer APIs
 * 3. Community token repositories 
 */

import { NETWORK_MAP } from './network-utils';

// Create a networkUtils object that uses the NETWORK_MAP
const networkUtils = {
    getExplorerUrl: (network: string): string | null => {
        const normalizedNetwork = network.toLowerCase();
        // Check if the network exists directly in NETWORK_MAP
        if (NETWORK_MAP[normalizedNetwork]) {
            return NETWORK_MAP[normalizedNetwork].explorer;
        }

        // Otherwise, search through aliases
        for (const [key, value] of Object.entries(NETWORK_MAP)) {
            if (value.aliases.includes(normalizedNetwork)) {
                return value.explorer;
            }
        }

        return null;
    }
};

// Cache for GeckoTerminal API responses to avoid repeated API calls
const geckoTerminalCache = new Map<string, { logoUrl: string | null, timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours TTL for cache

// Network mapping from our internal network IDs to GeckoTerminal's network IDs
const GECKO_TERMINAL_NETWORKS: Record<string, string> = {
    'eth': 'eth',
    'ethereum': 'eth',
    'bsc': 'bsc',
    'binance-smart-chain': 'bsc',
    'polygon': 'polygon',
    'matic': 'polygon',
    'avalanche': 'avalanche',
    'avax': 'avalanche',
    'fantom': 'ftm',
    'ftm': 'ftm',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism',
    'base': 'base',
    'zksync': 'zksync_era',
    'zksync-era': 'zksync_era'
    // Add more networks as supported by GeckoTerminal
};

interface GeckoTerminalResponse {
    logoUrl: string | null;
    tokenName?: string;
    tokenSymbol?: string;
    decimals?: number;
    error?: string;
}

/**
 * Fetches token logo from GeckoTerminal API
 * @param network Network name (e.g., 'eth', 'bsc')
 * @param address Token contract address
 * @returns Logo URL if found, null otherwise
 */
export async function getGeckoTerminalTokenLogo(
    network: string,
    address: string
): Promise<GeckoTerminalResponse> {
    try {
        if (!address) return { logoUrl: null, error: 'No token address provided' };

        // Normalize the network name and convert to GeckoTerminal format
        const normalizedNetwork = network.toLowerCase();
        const geckoNetwork = GECKO_TERMINAL_NETWORKS[normalizedNetwork] || normalizedNetwork;

        // Check cache first
        const cacheKey = `${geckoNetwork}_${address.toLowerCase()}`;
        const cachedResult = geckoTerminalCache.get(cacheKey);

        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            return cachedResult;
        }

        // Make API request to GeckoTerminal
        const apiUrl = `https://api.geckoterminal.com/api/v2/networks/${geckoNetwork}/tokens/${address}`;

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) {
            throw new Error(`GeckoTerminal API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract token details from GeckoTerminal response
        const tokenData = data?.data?.attributes || {};
        const result: GeckoTerminalResponse = {
            logoUrl: tokenData.image_url || null,
            tokenName: tokenData.name || null,
            tokenSymbol: tokenData.symbol || null,
            decimals: tokenData.decimals || null
        };

        // Cache the result
        geckoTerminalCache.set(cacheKey, { ...result, timestamp: Date.now() });

        return result;
    } catch (error) {
        console.error('Error fetching token logo from GeckoTerminal:', error);
        return { logoUrl: null, error: String(error) };
    }
}

/**
 * Get token logo URL from block explorer APIs (Etherscan, BSCScan, etc)
 * @param network Network name
 * @param address Token contract address
 * @param symbol Token symbol (optional)
 * @returns Block explorer token logo URL
 */
export function getExplorerTokenLogoUrl(
    network: string,
    address: string,
    symbol?: string | null
): string | null {
    try {
        if (!address) return null;

        // Get block explorer base URL for the given network
        const explorer = networkUtils.getExplorerUrl(network);
        if (!explorer) return null;

        // Different block explorers have different logo URL patterns
        if (explorer.includes('etherscan')) {
            return `https://etherscan.io/token/images/${address}.png`;
        } else if (explorer.includes('bscscan')) {
            return `https://bscscan.com/token/images/${address}.png`;
        } else if (explorer.includes('polygonscan')) {
            return `https://polygonscan.com/token/images/${address}.png`;
        } else if (explorer.includes('arbiscan')) {
            return `https://arbiscan.io/token/images/${address}.png`;
        } else if (explorer.includes('ftmscan')) {
            return `https://ftmscan.com/token/images/${address}.png`;
        }

        // Generic pattern for other explorers
        const baseExplorerUrl = explorer.endsWith('/') ? explorer.slice(0, -1) : explorer;
        return `${baseExplorerUrl}/token/images/${address}.png`;
    } catch (error) {
        console.error('Error getting explorer token logo URL:', error);
        return null;
    }
}

/**
 * Get token logo from community repositories as a last resort
 * @param symbol Token symbol
 * @param address Token contract address
 * @returns URL to community repository token logo
 */
export function getFallbackTokenLogoUrl(
    symbol: string,
    address?: string
): string | null {
    try {
        // Try Trust Wallet community repository (most comprehensive)
        if (address) {
            return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
        }

        // Try other repositories based on symbol
        if (symbol) {
            const normalizedSymbol = symbol.toLowerCase();
            // Cryptocurrency Icons repository
            return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${normalizedSymbol}.svg`;
        }

        return null;
    } catch (error) {
        console.error('Error getting fallback token logo URL:', error);
        return null;
    }
}