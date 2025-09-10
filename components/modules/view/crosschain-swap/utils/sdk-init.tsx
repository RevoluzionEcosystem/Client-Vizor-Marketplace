import { SDK, BLOCKCHAIN_NAME, BlockchainName, Web3Pure } from 'rubic-sdk';
import rubicConfiguration from '../config/config';
import BigNumber from 'bignumber.js';
import { formatTokenAmount } from './format-utils';

let sdkInstance: SDK | null = null;
let initPromise: Promise<SDK> | null = null;

/**
 * Initialize the Rubic SDK with configuration
 * @returns Promise resolving to the SDK instance
 */
export const initializeSDK = async (): Promise<SDK> => {
    try {
        // Return existing instance if already initialized
        if (sdkInstance) {
            return sdkInstance;
        }

        // Return the existing promise if initialization is in progress
        if (initPromise) {
            return initPromise;
        }

        // Create a new initialization promise
        initPromise = (async () => {
            // Initialize SDK with our configuration
            const sdk = await SDK.createSDK(rubicConfiguration);

            // Store instance for future use
            sdkInstance = sdk;

            console.log('Rubic SDK initialized successfully');
            return sdk;
        })();

        return initPromise;
    } catch (error) {
        console.error('Failed to initialize Rubic SDK:', error);
        throw new Error('SDK initialization failed');
    }
};

/**
 * Get the SDK instance (initializing if needed)
 */
export const getSDK = async (): Promise<SDK> => {
    return sdkInstance || initializeSDK();
};

/**
 * Force reinitialize the SDK (for example after network change)
 */
export const reinitializeSDK = async (): Promise<SDK> => {
    sdkInstance = null;
    initPromise = null;
    return initializeSDK();
};

/**
 * Check if the SDK is already initialized
 */
export const isSDKInitialized = (): boolean => {
    return sdkInstance !== null;
};

/**
 * Get native currency symbol for a blockchain
 */
export const getNativeCurrencySymbol = (blockchain: BlockchainName): string => {
    try {
        // Using Web3Pure's native token info method instead of nativeTokenSymbol
        return Web3Pure[blockchain].nativeTokenSymbol;
    } catch {
        // Fallback to common mapping
        const symbolMap: Record<string, string> = {
            [BLOCKCHAIN_NAME.ETHEREUM]: 'ETH',
            [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 'BNB',
            [BLOCKCHAIN_NAME.POLYGON]: 'MATIC',
            [BLOCKCHAIN_NAME.ARBITRUM]: 'ETH',
            [BLOCKCHAIN_NAME.OPTIMISM]: 'ETH',
            [BLOCKCHAIN_NAME.AVALANCHE]: 'AVAX',
            [BLOCKCHAIN_NAME.FANTOM]: 'FTM',
            [BLOCKCHAIN_NAME.LINEA]: 'ETH',
            [BLOCKCHAIN_NAME.BASE]: 'ETH',
            [BLOCKCHAIN_NAME.SCROLL]: 'ETH',
        };
        return symbolMap[blockchain] || 'ETH';
    }
};

/**
 * Get native currency address (zero address for most chains)
 */
export const getNativeTokenAddress = (blockchain: BlockchainName): string => {
    return '0x0000000000000000000000000000000000000000';
};

/**
 * Get chain ID from blockchain name
 */
export const getChainId = (blockchainName: BlockchainName): number => {
    const chainIdMap: Record<string, number> = {
        [BLOCKCHAIN_NAME.ETHEREUM]: 1,
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 56,
        [BLOCKCHAIN_NAME.POLYGON]: 137,
        [BLOCKCHAIN_NAME.ARBITRUM]: 42161,
        [BLOCKCHAIN_NAME.OPTIMISM]: 10,
        [BLOCKCHAIN_NAME.AVALANCHE]: 43114,
        [BLOCKCHAIN_NAME.FANTOM]: 250,
        [BLOCKCHAIN_NAME.LINEA]: 59144,
        [BLOCKCHAIN_NAME.BASE]: 8453,
        [BLOCKCHAIN_NAME.SCROLL]: 534352,
        [BLOCKCHAIN_NAME.TELOS]: 40,
        [BLOCKCHAIN_NAME.CELO]: 42220,
        [BLOCKCHAIN_NAME.MANTLE]: 5000,
        [BLOCKCHAIN_NAME.BLAST]: 81457,
        [BLOCKCHAIN_NAME.ZK_SYNC]: 324,
        [BLOCKCHAIN_NAME.POLYGON_ZKEVM]: 1101,
    };

    return chainIdMap[blockchainName] || 1;
};

/**
 * Get blockchain name from chain ID
 */
export const getBlockchainNameByChainId = (chainId: number): BlockchainName => {
    const chainIdToBlockchainMap: Record<number, BlockchainName> = {
        1: BLOCKCHAIN_NAME.ETHEREUM,
        56: BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
        137: BLOCKCHAIN_NAME.POLYGON,
        42161: BLOCKCHAIN_NAME.ARBITRUM,
        10: BLOCKCHAIN_NAME.OPTIMISM,
        43114: BLOCKCHAIN_NAME.AVALANCHE,
        250: BLOCKCHAIN_NAME.FANTOM,
        59144: BLOCKCHAIN_NAME.LINEA,
        8453: BLOCKCHAIN_NAME.BASE,
        534352: BLOCKCHAIN_NAME.SCROLL,
        40: BLOCKCHAIN_NAME.TELOS,
        42220: BLOCKCHAIN_NAME.CELO,
        5000: BLOCKCHAIN_NAME.MANTLE,
        81457: BLOCKCHAIN_NAME.BLAST,
        324: BLOCKCHAIN_NAME.ZK_SYNC,
        1101: BLOCKCHAIN_NAME.POLYGON_ZKEVM,
    };

    return chainIdToBlockchainMap[chainId] || BLOCKCHAIN_NAME.ETHEREUM;
};

export default {
    initializeSDK,
    getSDK,
    reinitializeSDK,
    isSDKInitialized,
    getNativeCurrencySymbol,
    getNativeTokenAddress,
    getChainId,
    getBlockchainNameByChainId,
    formatTokenAmount
};