"use client";

import { useState, useCallback } from 'react';
import { useAccount, useConfig, useSwitchChain } from 'wagmi';
import { usePublicClient, useWalletClient } from 'wagmi';
import { CHAIN_TYPE, BLOCKCHAIN_NAME } from 'rubic-sdk';
import { toast } from 'sonner';

/**
 * Custom hook to connect a wallet provider to the Rubic SDK
 */
const useWalletConnector = () => {
    const { address, isConnected, chainId } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const wagmiConfig = useConfig();
    const { switchChain } = useSwitchChain();

    const [sdkInitialized, setSdkInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Map blockchain names to chain IDs
    const blockchainToChainId = useCallback((blockchain) => {
        const mapping = {
            [BLOCKCHAIN_NAME.ETHEREUM]: 1,
            [BLOCKCHAIN_NAME.POLYGON]: 137,
            [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 56,
            [BLOCKCHAIN_NAME.ARBITRUM]: 42161,
            [BLOCKCHAIN_NAME.OPTIMISM]: 10,
            [BLOCKCHAIN_NAME.AVALANCHE]: 43114,
            [BLOCKCHAIN_NAME.BASE]: 8453,
            [BLOCKCHAIN_NAME.FANTOM]: 250,
        };
        return mapping[blockchain] || 1;
    }, []);

    // Create a Rubic-compatible provider from the wagmi wallet client
    const createRubicProvider = useCallback(async () => {
        try {
            if (!walletClient || !isConnected) {
                return null;
            }

            // Create a provider object compatible with Rubic SDK
            const provider: { address?: string; provider: typeof walletClient; core: typeof walletClient; request: (args: any) => Promise<any>; on: (event: string, listener: any) => any; removeListener: (event: string, listener: any) => any; } = {
                // For Rubic SDK v3 compatibility
                provider: walletClient,
                core: walletClient,
                // This is what Rubic SDK expects for EVM
                request: async (args) => {
                    try {
                        // Try to use the walletClient's request method directly
                        if (typeof walletClient.request === 'function') {
                            return await walletClient.request(args);
                        }

                        // If not available, map common methods to appropriate walletClient methods
                        const { method, params = [] } = args;

                        // Handle chain switching
                        if (method === 'wallet_switchEthereumChain') {
                            const chainId = params[0]?.chainId;
                            if (chainId) {
                                try {
                                    // Use switchChain function from wagmi
                                    await switchChain({ chainId: parseInt(chainId, 16) });
                                    // Allow time for the chain to switch
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    return null;
                                } catch (switchError) {
                                    console.error("Error switching chain:", switchError);
                                    throw switchError;
                                }
                            }
                        }

                        // Handle transaction sending
                        if (method === 'eth_sendTransaction') {
                            const [txParams] = params;
                            try {
                                const hash = await walletClient.sendTransaction({
                                    account: address, // Include the account property
                                    to: txParams.to,
                                    value: txParams.value ? BigInt(txParams.value) : undefined,
                                    data: txParams.data,
                                    gas: txParams.gas ? BigInt(txParams.gas) : undefined,
                                    gasPrice: txParams.gasPrice ? BigInt(txParams.gasPrice) : undefined,
                                    maxFeePerGas: txParams.maxFeePerGas ? BigInt(txParams.maxFeePerGas) : undefined,
                                    maxPriorityFeePerGas: txParams.maxPriorityFeePerGas ? BigInt(txParams.maxPriorityFeePerGas) : undefined,
                                    chain: walletClient.chain, // Add the required 'chain' property
                                    kzg: undefined, // Add the required 'kzg' property
                                });
                                return hash;
                            } catch (txError) {
                                console.error("Transaction error:", txError);
                                throw txError;
                            }
                        }

                        // Handle chain ID retrieval
                        if (method === 'eth_chainId') {
                            return `0x${walletClient.chain.id.toString(16)}`;
                        }

                        // Handle account retrieval
                        if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
                            return [address];
                        }

                        // For any other methods, attempt to call them on the public client
                        if (publicClient && typeof publicClient[method] === 'function') {
                            return await publicClient[method](...params);
                        }

                        // If we can't handle it, throw an error
                        throw new Error(`Method ${method} not supported`);
                    } catch (err) {
                        console.error('Provider request error:', err);
                        throw err;
                    }
                },
                on: (event, listener) => {
                    // Basic event emitter implementation
                    if (event === 'chainChanged' && walletClient) {
                        // We don't need to actually add listeners for our implementation
                        console.log("Registering chain change listener");
                    }
                    return { provider: walletClient };
                },
                removeListener: (event, listener) => {
                    // No need to implement for our use case
                    return { provider: walletClient };
                },
            };

            // Add the wallet address to the provider object
            provider.address = address || '';

            return provider;
        } catch (err) {
            console.error('Error creating Rubic provider:', err);
            setError(`Failed to create wallet provider: ${err.message}`);
            return null;
        }
    }, [walletClient, publicClient, isConnected, address, switchChain]);

    // Connect the provider to Rubic SDK
    const connectToRubicSDK = useCallback(async (sdk, provider) => {
        try {
            if (!sdk || !provider) {
                return false;
            }

            // Update the wallet provider in the Rubic SDK
            await sdk.updateWalletProviderCore(CHAIN_TYPE.EVM, provider);

            // Set the wallet address in the Rubic SDK
            await sdk.updateWalletAddress(CHAIN_TYPE.EVM, address);

            console.log('Wallet connected to Rubic SDK successfully');
            setSdkInitialized(true);
            return true;
        } catch (err) {
            console.error('Error connecting wallet to Rubic SDK:', err);
            setError(`Failed to connect wallet to Rubic SDK: ${err.message}`);
            toast.error(`Wallet connection error: ${err.message}`);
            return false;
        }
    }, [address]);

    return {
        address,
        isConnected,
        chainId,
        sdkInitialized,
        error,
        createRubicProvider,
        connectToRubicSDK,
        blockchainToChainId
    };
};

export default useWalletConnector;