"use client"

import React from 'react';
import { getNetworkId } from './network-utils';
import TOKEN_ICON_MAP from './token-icon-map';

// Types for iconUtils
export interface IconMapEntry {
    path: string;
    aliases: string[];
}

// Icon Types
export type IconType = 'network' | 'token' | 'wallet' | 'exchange';

// Standard icon paths by type
const ICON_BASE_PATHS = {
    network: '/assets/networks/',
    token: '/assets/tokens/',
    wallet: '/assets/wallets/',
    exchange: '/assets/exchanges/'
};

// Map for network icons with aliases - comprehensive mapping of networks to icons
const NETWORK_ICON_MAP: Record<string, IconMapEntry> = {
    'eth': {
        path: 'ethereum.svg',
        aliases: ['ethereum', 'eth', 'ether', 'ethereum-network', 'ethereum-mainnet']
    },
    'bsc': {
        path: 'binance-smart-chain.svg',
        aliases: ['binance smart chain', 'binance-smart-chain', 'bnb chain', 'bnb-chain', 'binance', 'bnb smart chain', 'bnb', 'bep20', 'bep-20']
    },
    'polygon': {
        path: 'polygon.svg',
        aliases: ['polygon', 'polygon-pos', 'matic', 'polygon-network', 'polygon-matic']
    },
    'avax': {
        path: 'avalanche.svg',
        aliases: ['avalanche', 'avax', 'avalanche-network', 'avalanche-c-chain']
    },
    'arb': {
        path: 'arbitrum-one.svg',
        aliases: ['arbitrum', 'arbitrum-one', 'arbitrum-network', 'arbitrum one']
    },
    'op': {
        path: 'optimism.svg',
        aliases: ['optimism', 'optimistic-ethereum', 'optimism-network', 'op mainnet']
    },
    'ftm': {
        path: 'fantom.svg',
        aliases: ['fantom', 'ftm', 'fantom-opera', 'fantom-network', 'fantom opera']
    },
    'base': {
        path: 'base.svg',
        aliases: ['base', 'base-network', 'coinbase-chain', 'base chain']
    },
    'sol': {
        path: 'solana.svg',
        aliases: ['solana', 'sol', 'solana-network']
    },    
    'trx': {
        path: 'tron.svg',
        aliases: ['tron', 'trx', 'tron-network']
    },
    'sei': {
        path: 'sei-network.svg',
        aliases: ['sei', 'sei-network', 'sei-blockchain']
    },
    'zksync': {
        path: 'zksync.svg',
        aliases: ['zksync', 'zksync-era', 'zksync era', 'zksync-network']
    },    'arbitrum_nova': {
        path: 'arbitrum-nova.svg',
        aliases: ['arbitrum nova', 'arb-nova', 'arbitrum-nova']
    },
    'aurora': {
        path: 'aurora.svg',
        aliases: ['aurora', 'aurora-network', 'aurora-near']
    },
    'astr': {
        path: 'astr.svg',
        aliases: ['astar', 'astr', 'astar-network']
    },
    'boba': {
        path: 'boba.svg',
        aliases: ['boba', 'boba-network', 'boba-eth']
    },
    'bttc': {
        path: 'bttc.svg',
        aliases: ['bittorrent-chain', 'bittorrent', 'btt-chain', 'btt']
    },
    'callisto': {
        path: 'callisto.svg',
        aliases: ['callisto', 'callisto-network', 'clo']
    },
    'canto': {
        path: 'canto.svg',
        aliases: ['canto', 'canto-network']
    },
    'celo': {
        path: 'celo.svg',
        aliases: ['celo', 'celo-network', 'celo-platform']
    },
    'cfx': {
        path: 'cfx.svg',
        aliases: ['conflux', 'cfx', 'conflux-network']
    },
    'core': {
        path: 'core.svg',
        aliases: ['core', 'core-blockchain']
    },
    'cro': {
        path: 'cronos.svg',
        aliases: ['cronos', 'crypto-com-chain', 'cro', 'crypto-org', 'crypto-com']
    },
    'dfk': {
        path: 'dfk.svg',
        aliases: ['dfk', 'defi-kingdoms', 'dfk-chain']
    },
    'dogechain': {
        path: 'dogechain.svg',
        aliases: ['dogechain', 'doge-chain']
    },
    'ela': {
        path: 'ela.svg',
        aliases: ['elastos', 'ela', 'elastos-smart-contract']
    },    'etc': {
        path: 'ethereum-classic.svg',
        aliases: ['ethereum classic', 'ethereum-classic', 'etc', 'classic']
    },
    'ethw': {
        path: 'ethw.svg',
        aliases: ['ethereum-pow', 'ethw', 'ethereum-proof-of-work']
    },
    'evmos': {
        path: 'evmos.svg',
        aliases: ['evmos', 'evmos-network', 'cosmos-evm']
    },
    'exosama': {
        path: 'exosama.svg',
        aliases: ['exosama', 'exo-sama']
    },
    'fil': {
        path: 'filecoin.svg',
        aliases: ['filecoin', 'fil', 'filecoin-evm']
    },
    'findora': {
        path: 'findora.svg',
        aliases: ['findora', 'fra', 'findora-network']
    },
    'flare': {
        path: 'flare.svg',
        aliases: ['flare', 'flare-network', 'flr']
    },
    'fuse': {
        path: 'fuse.svg',
        aliases: ['fuse', 'fuse-network', 'fuse-io']
    },
    'moonbeam': {
        path: 'moonbeam.svg',
        aliases: ['moonbeam', 'glmr', 'moonbeam-network', 'polkadot-moonbeam']
    },
    'godwoken': {
        path: 'godwoken.svg',
        aliases: ['godwoken', 'nervos-godwoken']
    },
    'heco': {
        path: 'heco.svg',
        aliases: ['huobi-eco-chain', 'heco', 'huobi']
    },
    'iotex': {
        path: 'iotx.svg',
        aliases: ['iotex', 'iotx', 'iot-chain']
    },
    'kai': {
        path: 'kai.svg',
        aliases: ['kardiachain', 'kardia', 'kai']
    },
    'kava': {
        path: 'kava.svg',
        aliases: ['kava', 'kava-evm', 'kava-network']
    },
    'kcc': {
        path: 'kcc.svg',
        aliases: ['kucoin-chain', 'kcc', 'kucoin-community-chain']
    },
    'klaytn': {
        path: 'klaytn.svg',
        aliases: ['klaytn', 'klay', 'klaytn-network']
    },
    'linea': {
        path: 'linea.svg',
        aliases: ['linea', 'linea-network', 'consensys-linea']
    },
    'mantle': {
        path: 'mantle.svg',
        aliases: ['mantle', 'mantle-network', 'mnt']
    },
    'metis': {
        path: 'metis.svg',
        aliases: ['metis', 'metis-andromeda', 'andromeda']
    },
    'moonriver': {
        path: 'moonriver.svg',
        aliases: ['moonriver', 'movr', 'kusama-moonriver']
    },
    'mtr': {
        path: 'mtr.svg',
        aliases: ['meter', 'mtr', 'meter-network']
    },
    'oasys': {
        path: 'oasys.svg',
        aliases: ['oasys', 'oas', 'oasys-network']
    },
    'okx': {
        path: 'okexchain.svg',
        aliases: ['okx-chain', 'okex', 'okexchain', 'okb-chain']
    },
    'harmony': {
        path: 'one.svg',
        aliases: ['harmony', 'harmony-one', 'one']
    },
    'opbnb': {
        path: 'opbnb.svg',
        aliases: ['opbnb', 'optimism-bnb', 'op-bnb']
    },    
    'platon': {
        path: 'DEFAULT.svg',
        aliases: ['platon', 'platon-network', 'lat']
    },
    'polygonzk': {
        path: 'polygon-zkevm.svg',
        aliases: ['polygon-zkevm', 'polygon-zk', 'zkevm', 'polygon-zero-knowledge']
    },
    'pulsechain': {
        path: 'pulsechain.svg',
        aliases: ['pulsechain', 'pulse', 'pls']
    },
    'rollux': {
        path: 'rollux.svg',
        aliases: ['rollux', 'syscoin-rollux']
    },
    'ronin': {
        path: 'ronin.svg',
        aliases: ['ronin', 'ronin-network', 'sky-mavis', 'ron']
    },
    'scroll': {
        path: 'scroll.svg',
        aliases: ['scroll', 'scroll-network', 'scroll-l2']
    },
    'sdn': {
        path: 'sdn.svg',
        aliases: ['shiden', 'sdn', 'shiden-network', 'astar-shiden']
    },
    'shibarium': {
        path: 'shibarium.svg',
        aliases: ['shibarium', 'shib-chain', 'shiba-network', 'shib']
    },
    'syscoin': {
        path: 'sys.svg',
        aliases: ['syscoin', 'sys', 'syscoin-network', 'syscoin-nevm']
    },
    'tenet': {
        path: 'tenet.svg',
        aliases: ['tenet', 'tenet-network']
    },
    'thundercore': {
        path: 'thundercore.svg',
        aliases: ['thundercore', 'tt', 'thunder']
    },
    'telos': {
        path: 'tlos.svg',
        aliases: ['telos', 'telos-evm', 'tlos']
    },
    'tombchain': {
        path: 'tombchain.svg',
        aliases: ['tombchain', 'tomb-chain', 'tomb']
    },
    'tomo': {
        path: 'tomochain.svg',
        aliases: ['tomochain', 'tomo', 'tomo-chain']
    },
    'velas': {
        path: 'velas.svg',
        aliases: ['velas', 'velas-network', 'vlx']
    },
    'wan': {
        path: 'wan.svg',
        aliases: ['wanchain', 'wan', 'wanchain-network']
    },
    'wemix': {
        path: 'wemix.svg',
        aliases: ['wemix', 'wemix-network']
    },
    'xdai': {
        path: 'gnosis.svg',
        aliases: ['xdai', 'gnosis', 'gnosis-chain', 'gno']
    },
    'xdc': {
        path: 'xdc.svg',
        aliases: ['xdc', 'xinfin', 'xdc-network']
    },    'zetachain': {
        path: 'zeta-chain.svg',
        aliases: ['zetachain', 'zeta', 'zeta-chain']
    },'strk': {
        path: 'starknet.svg',
        aliases: ['starknet', 'strk', 'stark-network', 'starknet-network']
    },    'sui': {
        path: 'sui.svg',
        aliases: ['sui', 'sui-network', 'sui-blockchain']
    },
    'blast': {
        path: 'blast.svg',
        aliases: ['blast', 'blast-network', 'blast-l2']
    },
    'mode': {
        path: 'mode.svg',
        aliases: ['mode', 'mode-network', 'mode-chain']
    },
    'ton': {
        path: 'ton.svg',
        aliases: ['ton', 'the-open-network', 'telegram-open-network']
    },
    'manta': {
        path: 'manta-pacific.svg',
        aliases: ['manta', 'manta-network', 'manta-pacific']
    },    'goerli': {
        path: 'ethereum.svg', // Using main Ethereum icon for Goerli testnet
        aliases: ['goerli', 'goerli-testnet', 'ethereum-goerli', 'eth-goerli']
    },
    'sepolia': {
        path: 'ethereum.svg', // Using main Ethereum icon for Sepolia testnet
        aliases: ['sepolia', 'sepolia-testnet', 'ethereum-sepolia', 'eth-sepolia']
    },
    'blast-sepolia': {
        path: 'blast.svg', // Using main Blast icon for Blast Sepolia testnet
        aliases: ['blast-sepolia', 'blast-testnet', 'blast-sepolia-testnet']
    }
};

// Map for wallet icons with aliases
const WALLET_ICON_MAP: Record<string, IconMapEntry> = {
    'metamask': {
        path: 'metamask.svg',
        aliases: ['metamask', 'meta mask', 'meta-mask', 'fox wallet']
    },
    'walletconnect': {
        path: 'walletconnect.svg',
        aliases: ['walletconnect', 'wallet connect', 'wallet-connect']
    },
    'coinbase': {
        path: 'coinbase.svg',
        aliases: ['coinbase', 'coinbase wallet', 'coinbase-wallet']
    },
    'trustwallet': {
        path: 'trust.svg',
        aliases: ['trustwallet', 'trust wallet', 'trust-wallet', 'trust']
    },
    'brave': {
        path: 'brave.svg',
        aliases: ['brave', 'brave wallet', 'brave-wallet']
    },
    'phantom': {
        path: 'phantom.svg',
        aliases: ['phantom', 'phantom wallet', 'phantom-wallet']
    },
    'rabby': {
        path: 'rabby.svg',
        aliases: ['rabby', 'rabby wallet', 'rabby-wallet']
    },
    'ledger': {
        path: 'ledger.svg',
        aliases: ['ledger', 'ledger wallet', 'ledger-wallet', 'ledger live']
    },
    'trezor': {
        path: 'trezor.svg',
        aliases: ['trezor', 'trezor wallet', 'trezor-wallet']
    },
    'tronlink': {
        path: 'tronlink.svg',
        aliases: ['tronlink', 'tron link', 'tron-link']
    },
    'okx': {
        path: 'okx.svg',
        aliases: ['okx', 'okx wallet', 'okx-wallet', 'okex']
    }
};

// Map for common DEX exchanges with aliases
const EXCHANGE_ICON_MAP: Record<string, IconMapEntry> = {
    'uniswap': {
        path: 'uniswap.svg',
        aliases: ['uniswap', 'uni', 'uniswap-v2', 'uniswap-v3', 'uniswap v3']
    },
    'pancakeswap': {
        path: 'pancakeswap.svg',
        aliases: ['pancakeswap', 'cake', 'pancake swap', 'pancake-swap']
    },
    'sushiswap': {
        path: 'sushiswap.svg',
        aliases: ['sushiswap', 'sushi', 'sushi swap', 'sushi-swap']
    },
    '1inch': {
        path: '1inch.svg',
        aliases: ['1inch', '1inch-exchange', '1inch exchange']
    },
    'curve': {
        path: 'curve.svg',
        aliases: ['curve', 'curve finance', 'curve-finance']
    },
    'balancer': {
        path: 'balancer.svg',
        aliases: ['balancer', 'balancer-labs', 'balancer labs']
    },
    'spookyswap': {
        path: 'spookyswap.svg',
        aliases: ['spookyswap', 'spooky', 'spooky swap', 'spooky-swap']
    },
    'quickswap': {
        path: 'quickswap.svg',
        aliases: ['quickswap', 'quick', 'quick swap', 'quick-swap']
    },
    'trader-joe': {
        path: 'traderjoe.svg',
        aliases: ['trader joe', 'traderjoe', 'trader-joe', 'joe']
    }
};

// Alias lookup maps for fast matching
const networkAliasMap = new Map<string, string>();
const walletAliasMap = new Map<string, string>();
const exchangeAliasMap = new Map<string, string>();
const tokenAliasMap = new Map<string, string>(); // For token aliases

// Build the alias lookup maps
Object.entries(NETWORK_ICON_MAP).forEach(([id, entry]) => {
    entry.aliases.forEach(alias => {
        networkAliasMap.set(alias.toLowerCase(), id);
    });
});

Object.entries(WALLET_ICON_MAP).forEach(([id, entry]) => {
    entry.aliases.forEach(alias => {
        walletAliasMap.set(alias.toLowerCase(), id);
    });
});

Object.entries(EXCHANGE_ICON_MAP).forEach(([id, entry]) => {
    entry.aliases.forEach(alias => {
        exchangeAliasMap.set(alias.toLowerCase(), id);
    });
});

// Build token alias lookup map for all 1782 tokens using the generated TOKEN_ICON_MAP
Object.entries(TOKEN_ICON_MAP).forEach(([id, entry]) => {
    entry.aliases.forEach(alias => {
        tokenAliasMap.set(alias.toLowerCase(), id);
    });
});

/**
 * Get the icon path for a network
 * 
 * @param networkName Any network name, id, alias
 * @returns Path to network icon
 */
export function getNetworkIconPath(networkName: string | null): string {
    if (!networkName) return `${ICON_BASE_PATHS.network}DEFAULT.svg`;

    try {
        // Standardize the network input
        let networkId;
        try {
            // Attempt to get standardized network ID - might throw in Edge runtime
            networkId = getNetworkId(networkName);
        } catch (e) {
            // If getNetworkId fails, implement a simplified version here
            // This fallback is similar to normalizeNetworkId in the API route
            const input = networkName.toLowerCase().trim();
            const mappings: Record<string, string> = {
                'ethereum': 'eth',
                'ether': 'eth',
                'binance': 'bsc',
                'binance-smart-chain': 'bsc',
                'bnb': 'bsc',
                'polygon-pos': 'polygon',
                'matic': 'polygon',
                'avalanche': 'avax',
                'arbitrum': 'arb',
                'arbitrum-one': 'arb',
                'optimism': 'op',
                'fantom': 'ftm',
                'zksync-era': 'zksync',
                'solana': 'sol',
                'tron': 'trx',
            };
            networkId = mappings[input] || input;
        }

        // Check direct match in our map first - most efficient path
        if (networkId && NETWORK_ICON_MAP[networkId]) {
            return `${ICON_BASE_PATHS.network}${NETWORK_ICON_MAP[networkId].path}`;
        }

        // Try looking up by alias
        const normalizedInput = networkName.toLowerCase().trim();
        const aliasMatch = networkAliasMap.get(normalizedInput);

        if (aliasMatch && NETWORK_ICON_MAP[aliasMatch]) {
            return `${ICON_BASE_PATHS.network}${NETWORK_ICON_MAP[aliasMatch].path}`;
        }

        // Handle fuzzy matching - removing spaces and hyphens
        const simplified = normalizedInput.replace(/[\s-]+/g, '');
        for (const [alias, id] of Array.from(networkAliasMap.entries())) {
            if (alias.replace(/[\s-]+/g, '').includes(simplified) || simplified.includes(alias.replace(/[\s-]+/g, ''))) {
                return `${ICON_BASE_PATHS.network}${NETWORK_ICON_MAP[id].path}`;
            }
        }

        // Fallback to a direct filename match
        const fallbackPath = `${ICON_BASE_PATHS.network}${networkId || normalizedInput}.svg`;
        
        // One last check - if we have the DEFAULT entry for this path already, use it
        if (NETWORK_ICON_MAP[networkId || normalizedInput]) {
            return `${ICON_BASE_PATHS.network}${NETWORK_ICON_MAP[networkId || normalizedInput].path}`;
        }

        return fallbackPath;
    } catch (error) {
        console.error('Error getting network icon path:', error);
        return `${ICON_BASE_PATHS.network}DEFAULT.svg`;
    }
}

/**
 * Get the icon path for a wallet
 * 
 * @param walletName Any wallet name or alias
 * @returns Path to wallet icon
 */
export function getWalletIconPath(walletName: string | null): string {
    if (!walletName) return `${ICON_BASE_PATHS.wallet}DEFAULT.svg`;

    try {
        const normalizedInput = walletName.toLowerCase().trim();

        // Direct match
        for (const [id, entry] of Object.entries(WALLET_ICON_MAP)) {
            if (id.toLowerCase() === normalizedInput) {
                return `${ICON_BASE_PATHS.wallet}${entry.path}`;
            }
        }

        // Alias lookup
        const aliasMatch = walletAliasMap.get(normalizedInput);
        if (aliasMatch) {
            return `${ICON_BASE_PATHS.wallet}${WALLET_ICON_MAP[aliasMatch].path}`;
        }

        // Fuzzy match
        const simplified = normalizedInput.replace(/[\s-]+/g, '');
        for (const [alias, id] of Array.from(walletAliasMap.entries())) {
            if (alias.replace(/[\s-]+/g, '').includes(simplified) || simplified.includes(alias.replace(/[\s-]+/g, ''))) {
                return `${ICON_BASE_PATHS.wallet}${WALLET_ICON_MAP[id].path}`;
            }
        }

        // Try direct filename
        return `${ICON_BASE_PATHS.wallet}${normalizedInput}.svg`;
    } catch (error) {
        console.error('Error getting wallet icon path:', error);
        return `${ICON_BASE_PATHS.wallet}DEFAULT.svg`;
    }
}

/**
 * Get the icon path for an exchange
 * 
 * @param exchangeName Any exchange name or alias
 * @returns Path to exchange icon
 */
export function getExchangeIconPath(exchangeName: string | null): string {
    if (!exchangeName) return `${ICON_BASE_PATHS.exchange}DEFAULT.svg`;

    try {
        const normalizedInput = exchangeName.toLowerCase().trim();

        // Direct match
        for (const [id, entry] of Object.entries(EXCHANGE_ICON_MAP)) {
            if (id.toLowerCase() === normalizedInput) {
                return `${ICON_BASE_PATHS.exchange}${entry.path}`;
            }
        }

        // Alias lookup
        const aliasMatch = exchangeAliasMap.get(normalizedInput);
        if (aliasMatch) {
            return `${ICON_BASE_PATHS.exchange}${EXCHANGE_ICON_MAP[aliasMatch].path}`;
        }

        // Fuzzy match
        const simplified = normalizedInput.replace(/[\s-]+/g, '');
        for (const [alias, id] of Array.from(exchangeAliasMap.entries())) {
            if (alias.replace(/[\s-]+/g, '').includes(simplified) || simplified.includes(alias.replace(/[\s-]+/g, ''))) {
                return `${ICON_BASE_PATHS.exchange}${EXCHANGE_ICON_MAP[id].path}`;
            }
        }

        // Try direct filename
        return `${ICON_BASE_PATHS.exchange}${normalizedInput}.svg`;
    } catch (error) {
        console.error('Error getting exchange icon path:', error);
        return `${ICON_BASE_PATHS.exchange}DEFAULT.svg`;
    }
}

/**
 * Get the icon path for a token
 * 
 * @param tokenSymbol Token symbol (e.g., 'BTC', 'ETH')
 * @param tokenAddress Optional token contract address
 * @param network Optional network name (for explorer-specific images)
 * @returns Path to token icon
 */
export function getTokenIconPath(tokenSymbol: string | null, tokenAddress?: string, network?: string): string {
    if (!tokenSymbol) return `${ICON_BASE_PATHS.token}DEFAULT.svg`;

    try {
        const normalizedSymbol = tokenSymbol.toLowerCase().trim();
        
        // Try lookup by alias using our comprehensive token map
        const aliasMatch = tokenAliasMap.get(normalizedSymbol);
        if (aliasMatch && TOKEN_ICON_MAP[aliasMatch]) {
            return `${ICON_BASE_PATHS.token}${TOKEN_ICON_MAP[aliasMatch].path}`;
        }

        // Try direct match with the token map
        const tokenKey = normalizedSymbol.toLowerCase();
        if (TOKEN_ICON_MAP[tokenKey]) {
            return `${ICON_BASE_PATHS.token}${TOKEN_ICON_MAP[tokenKey].path}`;
        }

        // Final fallback: try using the uppercase symbol directly
        return `${ICON_BASE_PATHS.token}${normalizedSymbol.toUpperCase()}.svg`;
    } catch (error) {
        console.error('Error getting token icon path:', error);
        return `${ICON_BASE_PATHS.token}DEFAULT.svg`;
    }
}

/**
 * Get the best available token icon URL using all available sources
 * This is an async function that provides the most comprehensive token icon lookup:
 * 1. First tries local assets from TOKEN_ICON_MAP
 * 2. Then tries GeckoTerminal API
 * 3. Falls back to block explorer URLs
 * 4. Finally tries community repositories
 * 
 * @param tokenSymbol Token symbol (e.g., 'BTC', 'ETH')
 * @param tokenAddress Token contract address
 * @param network Network name (for explorer-specific images)
 * @returns Promise with the best available token icon URL
 */
export async function getTokenIconUrl(tokenSymbol: string | null, tokenAddress?: string, network?: string): Promise<string> {
    // First check if we have a local icon
    try {
        const normalizedSymbol = tokenSymbol?.toLowerCase().trim() || '';
        
        // Try alias mapping first for local icons
        const aliasMatch = tokenAliasMap.get(normalizedSymbol);
        if (aliasMatch && TOKEN_ICON_MAP[aliasMatch]) {
            return `${ICON_BASE_PATHS.token}${TOKEN_ICON_MAP[aliasMatch].path}`;
        }

        // Try direct match in our token map
        if (TOKEN_ICON_MAP[normalizedSymbol]) {
            return `${ICON_BASE_PATHS.token}${TOKEN_ICON_MAP[normalizedSymbol].path}`;
        }

        // Check for a local SVG file with the symbol name
        const fallbackLocalPath = `${ICON_BASE_PATHS.token}${normalizedSymbol.toUpperCase()}.svg`;
        // Placeholder for checking if file exists
        // For now, we'll just try the URL pattern and let the browser handle missing files

        // If network and address are provided, try GeckoTerminal API
        if (network && tokenAddress) {
            const { getGeckoTerminalTokenLogo } = await import('./token-logo-utils');
            const geckoResult = await getGeckoTerminalTokenLogo(network, tokenAddress);
            
            if (geckoResult.logoUrl) {
                return geckoResult.logoUrl;
            }
            
            // If GeckoTerminal didn't have the logo, try explorer URL
            const { getExplorerTokenLogoUrl } = await import('./token-logo-utils');
            const explorerUrl = getExplorerTokenLogoUrl(network, tokenAddress, tokenSymbol);
            if (explorerUrl) {
                return explorerUrl;
            }
            
            // Last resort: try community repositories
            const { getFallbackTokenLogoUrl } = await import('./token-logo-utils');
            const fallbackUrl = getFallbackTokenLogoUrl(normalizedSymbol, tokenAddress);
            if (fallbackUrl) {
                return fallbackUrl;
            }
        }

        // If we reach this point, use the local fallback
        return fallbackLocalPath;
    } catch (error) {
        console.error('Error getting token icon URL:', error);
        return `${ICON_BASE_PATHS.token}DEFAULT.svg`;
    }
}

/**
 * General purpose function to get an icon based on name and type
 * 
 * @param name The name, symbol, or identifier to look up
 * @param type The type of icon to fetch (network, token, wallet, exchange)
 * @param address Optional address for tokens
 * @returns Path to the icon
 */
export function getIconPath(name: string | null, type: IconType, address?: string): string {
    if (!name) return `${ICON_BASE_PATHS[type]}DEFAULT.svg`;

    switch (type) {
        case 'network':
            return getNetworkIconPath(name);
        case 'wallet':
            return getWalletIconPath(name);
        case 'exchange':
            return getExchangeIconPath(name);
        case 'token':
            return getTokenIconPath(name, address);
        default:
            return `${ICON_BASE_PATHS.token}DEFAULT.svg`;
    }
}

/**
 * Utility function to create an image element with error fallback
 * 
 * @param src Icon source path
 * @param alt Alt text for the image
 * @param className Optional CSS classes
 * @param fallbackSrc Optional fallback image source
 * @returns JSX image element with error handling
 */
import Image from "next/image";

export function IconImage({
    src,
    alt,
    className = "w-5 h-5",
    fallbackSrc
}: {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}) {
    // Get the appropriate default fallback based on the path
    const getDefaultFallback = () => {
        if (src?.includes('/networks/')) return `${ICON_BASE_PATHS.network}DEFAULT.svg`;
        if (src?.includes('/tokens/')) return `${ICON_BASE_PATHS.token}DEFAULT.svg`;
        if (src?.includes('/wallets/')) return `${ICON_BASE_PATHS.wallet}DEFAULT.svg`;
        if (src?.includes('/exchanges/')) return `${ICON_BASE_PATHS.exchange}DEFAULT.svg`;
        return '/assets/tokens/DEFAULT.svg';
    };

    // Generate a reference key from the src to maintain stability between renders
    const srcKey = React.useMemo(() => 
        src.replace(/\W+/g, '_').substring(0, 20), 
        [src]
    );
    
    const [imgSrc, setImgSrc] = React.useState(src);
    const [errorCount, setErrorCount] = React.useState(0);
    const [hasFallback, setHasFallback] = React.useState(false);

    // Reset state when source changes
    React.useEffect(() => {
        setImgSrc(src);
        setErrorCount(0);
        setHasFallback(false);
    }, [src]);

    // Handle image load error
    const handleError = React.useCallback(() => {
        // If we already tried the fallback or hit max retry count, use the default
        if (hasFallback || errorCount > 1) {
            const defaultImage = fallbackSrc || getDefaultFallback();
            setImgSrc(defaultImage);
            setHasFallback(true);
            return;
        }
        
        // Try fallback if we have one
        if (fallbackSrc && !hasFallback) {
            setImgSrc(fallbackSrc);
            setHasFallback(true);
            return;
        }
        
        // Otherwise try default fallback
        const defaultImage = getDefaultFallback();
        setImgSrc(defaultImage);
        setHasFallback(true);
        setErrorCount(prev => prev + 1);
    }, [fallbackSrc, hasFallback, errorCount, getDefaultFallback]);

    return (
        <Image
            key={`img-${srcKey}`} // Use a stable key based on the src
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            width={20}
            height={20}
            unoptimized={true} // Don't optimize images to avoid caching issues
            loading="eager" // Prioritize loading these small icons
        />
    );
}