"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SDK, BLOCKCHAIN_NAME, CHAIN_TYPE } from "rubic-sdk";
import SwapInterface from "./components/swap-interface";
import rubicConfiguration from "./config/config";
import { RubicSDKProvider } from "./components/rubic-sdk-context";
import useWalletConnector from "./hooks/use-wallet-connector";
import { RefreshCcw } from "lucide-react";
import { installProxyFetch } from "./utils/proxy-fetch";
import { debug, logError, monitorFetch } from "./utils/debug";
import { HeaderContent } from "../../header";
import { terms } from "./data/swap-data";

// Main cross-chain swap component
export default function CrossChainSwap() {
    const [sdkInstance, setSdkInstance] = useState(null);
    const [isSDKInitialized, setIsSDKInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Use the wallet connector hook
    const {
        sdkInitialized: walletInitialized,
        error: walletError,
        createRubicProvider,
        connectToRubicSDK,
        address,
        isConnected,
        blockchainToChainId
    } = useWalletConnector();

    // Install proxy fetch to handle CORS issues and enable monitoring
    useEffect(() => {
        // Install our proxy fetch implementation to intercept Rubic API calls
        installProxyFetch();

        // Enable fetch monitoring for debugging
        monitorFetch();

        debug("Proxy fetch and monitoring installed for Rubic SDK");
    }, []);

    // Initialize the Rubic SDK when the component mounts
    useEffect(() => {
        const initRubicSDK = async () => {
            try {
                debug("Initializing Rubic SDK...");

                // Create SDK instance with the configuration
                const sdk = await SDK.createSDK(rubicConfiguration);
                debug("Rubic SDK initialized successfully");

                setSdkInstance(sdk);
                setIsSDKInitialized(true);

                // If wallet is already connected, connect it to the SDK
                if (isConnected && address) {
                    const provider = await createRubicProvider();
                    if (provider) {
                        await connectToRubicSDK(sdk, provider);
                    }
                }
            } catch (err) {
                logError("Error initializing Rubic SDK", err);
                setError(err.message || "Failed to initialize Rubic SDK");
            }
        };

        initRubicSDK();

        // Cleanup function when component unmounts
        return () => {
            // Currently no cleanup needed for SDK instance
            debug("Cleaning up Rubic SDK resources");
        };
    }, [isConnected, address, createRubicProvider, connectToRubicSDK]);

    // Update SDK wallet provider when wallet connection changes
    useEffect(() => {
        const connectWallet = async () => {
            if (sdkInstance && isConnected && address) {
                try {
                    const provider = await createRubicProvider();
                    if (provider) {
                        await connectToRubicSDK(sdkInstance, provider);
                    }
                } catch (err) {
                    logError("Error connecting wallet to SDK", err);
                }
            }
        };

        connectWallet();
    }, [sdkInstance, isConnected, address, createRubicProvider, connectToRubicSDK]);

    // Update SDK wallet provider when wallet connection changes
    const updateWalletProvider = useCallback(async (walletProvider) => {
        if (sdkInstance) {
            try {
                await sdkInstance.updateWalletProviderCore(CHAIN_TYPE.EVM, walletProvider);
                debug("Wallet provider updated in Rubic SDK");
            } catch (err) {
                logError("Error updating wallet provider", err);
            }
        }
    }, [sdkInstance]);

    // Connect wallet address to SDK
    const connectWalletToSDK = useCallback((chainType, address) => {
        if (sdkInstance) {
            try {
                sdkInstance.updateWalletAddress(chainType, address);
                debug(`Wallet address ${address} connected for chain type ${chainType}`);
            } catch (err) {
                logError("Error connecting wallet address to SDK", err);
            }
        }
    }, [sdkInstance]);

    // Helper function to convert blockchain name to chainId
    const getChainId = (blockchainName) => {
        const chainMapping = {
            [BLOCKCHAIN_NAME.ETHEREUM]: 1,
            [BLOCKCHAIN_NAME.POLYGON]: 137,
            [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 56,
            [BLOCKCHAIN_NAME.ARBITRUM]: 42161,
            [BLOCKCHAIN_NAME.OPTIMISM]: 10,
            [BLOCKCHAIN_NAME.AVALANCHE]: 43114,
            [BLOCKCHAIN_NAME.BASE]: 8453,
            [BLOCKCHAIN_NAME.FANTOM]: 250,
            [BLOCKCHAIN_NAME.LINEA]: 59144,
            [BLOCKCHAIN_NAME.SCROLL]: 534352,
            [BLOCKCHAIN_NAME.POLYGON_ZKEVM]: 1101,
            [BLOCKCHAIN_NAME.BLAST]: 81457,
            [BLOCKCHAIN_NAME.ROOTSTOCK]: 30,
            [BLOCKCHAIN_NAME.KROMA]: 255,
            [BLOCKCHAIN_NAME.HORIZEN_EON]: 7332,
            [BLOCKCHAIN_NAME.MODE]: 34443,
            [BLOCKCHAIN_NAME.ZK_FAIR]: 42766,
            [BLOCKCHAIN_NAME.TAIKO]: 167004,
            [BLOCKCHAIN_NAME.METIS]: 1088,
            [BLOCKCHAIN_NAME.KLAYTN]: 8217,
            [BLOCKCHAIN_NAME.VELAS]: 106,
            [BLOCKCHAIN_NAME.SYSCOIN]: 57,
            [BLOCKCHAIN_NAME.AURORA]: 1313161554,
            [BLOCKCHAIN_NAME.CELO]: 42220,
            [BLOCKCHAIN_NAME.BOBA]: 288,
            [BLOCKCHAIN_NAME.KAVA]: 2222,
            [BLOCKCHAIN_NAME.OASIS]: 42262,
            [BLOCKCHAIN_NAME.GNOSIS]: 100,
            [BLOCKCHAIN_NAME.FUSE]: 122,
            [BLOCKCHAIN_NAME.MOONBEAM]: 1284,
            [BLOCKCHAIN_NAME.MOONRIVER]: 1285,
            [BLOCKCHAIN_NAME.HARMONY]: 1666600000,
            [BLOCKCHAIN_NAME.TELOS]: 40,
            [BLOCKCHAIN_NAME.CRONOS]: 25,
            [BLOCKCHAIN_NAME.ASTAR_EVM]: 592,
            [BLOCKCHAIN_NAME.ZETACHAIN]: 7000,
            [BLOCKCHAIN_NAME.TRON]: 728126428,
            [BLOCKCHAIN_NAME.MANTA_PACIFIC]: 169,
        };

        return chainMapping[blockchainName] || 1; // Default to Ethereum if not found
    };

    // Calculate trade for on-chain swap
    const calculateOnChainTrade = async (fromBlockchain, fromTokenAddress, toTokenAddress, amount) => {
        if (!sdkInstance || !isSDKInitialized) {
            throw new Error("SDK not initialized");
        }

        try {
            debug(`Calculating on-chain trade: ${fromBlockchain} from ${fromTokenAddress} to ${toTokenAddress}`);
            // Calculate on-chain trade
            const trades = await sdkInstance.onChainManager.calculateTrade(
                {
                    blockchain: fromBlockchain,
                    address: fromTokenAddress
                },
                amount,
                toTokenAddress
            );

            return trades;
        } catch (err) {
            logError("Error calculating on-chain trade", err);
            throw err;
        }
    };

    // Calculate trade for cross-chain swap
    const calculateCrossChainTrade = async (fromBlockchain, toBlockchain, fromTokenAddress, toTokenAddress, amount) => {
        if (!sdkInstance || !isSDKInitialized) {
            throw new Error("SDK not initialized");
        }

        try {
            debug(`Calculating cross-chain trade from ${fromBlockchain} to ${toBlockchain}`);
            // Calculate cross-chain trade
            const trades = await sdkInstance.crossChainManager.calculateTrade(
                {
                    blockchain: fromBlockchain,
                    address: fromTokenAddress
                },
                amount,
                {
                    blockchain: toBlockchain,
                    address: toTokenAddress
                }
            );

            return trades;
        } catch (err) {
            logError("Error calculating cross-chain trade", err);
            throw err;
        }
    };

    // Execute swap function
    const executeSwap = async (trade, options = {}) => {
        if (!sdkInstance) {
            throw new Error("SDK not initialized");
        }

        try {
            // Default options for swap
            const swapOptions = {
                onConfirm: hash => debug("Transaction confirmed:", hash),
                onApprove: hash => debug("Approval transaction:", hash),
                ...options
            };

            debug("Executing swap with options:", swapOptions);
            // Execute the swap
            return await trade.swap(swapOptions);
        } catch (err) {
            logError("Error executing swap", err);
            throw err;
        }
    };

    // Combine wallet and SDK errors
    const combinedError = error || walletError;

    // Create a context object with SDK functions
    const rubicSDKContext = {
        sdkInstance,
        isInitialized: isSDKInitialized && walletInitialized,
        error: combinedError,
        calculateOnChainTrade,
        calculateCrossChainTrade,
        executeSwap,
        updateWalletProvider,
        connectWalletToSDK,
        BLOCKCHAIN_NAME,
        CHAIN_TYPE,
        getChainId,
        blockchainToChainId
    };

    return (
        <div className="space-y-6">
            {/* Header with title */}
            <HeaderContent
                headline={terms.headline}
                subheadline={terms.subheadline}
                Icon={RefreshCcw}
            />

            {combinedError && (
                <Card className="mb-6 border-red-400 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                        <p className="text-red-600 dark:text-red-400">
                            Error: {combinedError}
                        </p>
                    </CardContent>
                </Card>
            )}

            <RubicSDKProvider sdkContext={rubicSDKContext}>
                <SwapInterface />
            </RubicSDKProvider>
        </div>
    );
}