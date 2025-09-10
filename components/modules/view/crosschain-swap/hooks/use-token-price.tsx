// hooks/useTokenPrice.ts
import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { BlockchainName } from './blockchain-names';
import { TO_BACKEND_BLOCKCHAINS } from './backend-blockchains';
import { getNetworkId } from '@/lib/network-utils';

interface UseTokenPriceProps {
    address: string;
    blockchain: BlockchainName;
    enabled?: boolean;
}

// Direct mapping for network codes to backend blockchain names
const NETWORK_TO_BACKEND_MAP = {
    'eth': 'ethereum',
    'bsc': 'binance-smart-chain',
    'polygon': 'polygon',
    'matic': 'polygon', // ALWAYS map MATIC to polygon
    'ftm': 'fantom',
    'fantom': 'fantom',
    'avax': 'avalanche',
    'avalanche': 'avalanche',
    'arb': 'arbitrum',
    'arbitrum': 'arbitrum',
    'op': 'optimistic-ethereum',
    'optimism': 'optimistic-ethereum',
    'base': 'base',
    'zksync': 'zksync',
    'linea': 'linea',
    'scroll': 'scroll'
};

export function useTokenPrice({ address, blockchain, enabled = true }: UseTokenPriceProps) {
    // Initialize price with BigNumber(0) instead of null
    const [price, setPrice] = useState<BigNumber>(new BigNumber(0));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchPrice() {
            if (!address || !blockchain || !enabled) return;

            setIsLoading(true);
            setError(null);

            try {
                // Use the standardized getNetworkId function for consistency
                const standardizedNetwork = getNetworkId(blockchain);
                
                // Convert to backend blockchain format
                let backendBlockchain = standardizedNetwork;
                
                // Direct mapping lookup for network codes like 'polygon', 'eth', etc.
                if (NETWORK_TO_BACKEND_MAP[backendBlockchain]) {
                    backendBlockchain = NETWORK_TO_BACKEND_MAP[backendBlockchain];
                }
                // Then try to use uppercase for Rubic constants like 'POLYGON', 'ETHEREUM', etc.
                else if (TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName]) {
                    backendBlockchain = TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName];
                }
                
                console.log(`Fetching price for token ${address} on blockchain ${blockchain} -> ${backendBlockchain}`);
                
                // Use the determined blockchain identifier for the API call
                const response = await fetch(
                    `/crosschain-swap/api/token-prices?address=${address}&blockchain=${backendBlockchain}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(`Price API response for ${address}:`, data);

                if (isMounted && data) {
                    if (data.price && data.price !== "NaN" && data.price !== "0") {
                        setPrice(new BigNumber(data.price));
                    } else {
                        // Set price to 0 if price is null, NaN, or 0
                        setPrice(new BigNumber(0));
                        
                        if (data.error) {
                            console.warn(`Error in price API response: ${data.error}`);
                            setError(new Error(data.error));
                        }
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error(`Error fetching token price for ${address} on ${blockchain}:`, err);
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                    // Set price to 0 on error
                    setPrice(new BigNumber(0));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchPrice();

        return () => {
            isMounted = false;
        };
    }, [address, blockchain, enabled]);

    // Function to manually refetch the price
    const refetch = async () => {
        if (!address || !blockchain || !enabled) return;
        
        setIsLoading(true);
        setError(null);

        try {
            // Use the standardized getNetworkId function for consistency
            const standardizedNetwork = getNetworkId(blockchain);
            
            // Convert to backend blockchain format
            let backendBlockchain = standardizedNetwork;
            
            // Direct mapping lookup for network codes
            if (NETWORK_TO_BACKEND_MAP[backendBlockchain]) {
                backendBlockchain = NETWORK_TO_BACKEND_MAP[backendBlockchain];
            }
            // Then try the TO_BACKEND_BLOCKCHAINS mapping if it's an uppercase blockchain name
            else if (TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName]) {
                backendBlockchain = TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName];
            }
            
            const response = await fetch(
                `/crosschain-swap/api/token-prices?address=${address}&blockchain=${backendBlockchain}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.price && data.price !== "NaN" && data.price !== "0") {
                setPrice(new BigNumber(data.price));
            } else {
                // Set price to 0 if no valid price is returned
                setPrice(new BigNumber(0));
                
                if (data.error) {
                    throw new Error(data.error);
                }
            }
        } catch (err) {
            console.error(`Error refetching token price for ${address} on ${blockchain}:`, err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            // Set price to 0 on error
            setPrice(new BigNumber(0));
        } finally {
            setIsLoading(false);
        }
    };

    // Function for direct HTTP fetch (for use outside of React components)
    const fetchTokenPrice = async (params: { address: string; blockchain: BlockchainName }): Promise<BigNumber> => {
        // Use the standardized getNetworkId function for consistency
        const standardizedNetwork = getNetworkId(params.blockchain);
        
        // Convert to backend blockchain format
        let backendBlockchain = standardizedNetwork;
        
        // Direct mapping lookup for network codes
        if (NETWORK_TO_BACKEND_MAP[backendBlockchain]) {
            backendBlockchain = NETWORK_TO_BACKEND_MAP[backendBlockchain];
        }
        // Then try the TO_BACKEND_BLOCKCHAINS mapping if it's an uppercase blockchain name
        else if (TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName]) {
            backendBlockchain = TO_BACKEND_BLOCKCHAINS[standardizedNetwork.toUpperCase() as BlockchainName];
        }
        
        console.log(`Direct fetch for token price: ${params.address} on ${params.blockchain} -> ${backendBlockchain}`);
        
        try {
            const response = await fetch(
                `/crosschain-swap/api/token-prices?address=${params.address}&blockchain=${backendBlockchain}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.price && data.price !== "NaN" && data.price !== "0") {
                return new BigNumber(data.price);
            }
            
            // Always return BigNumber(0) for any invalid or missing price
            return new BigNumber(0);
        } catch (err) {
            console.error(`Error in direct token price fetch:`, err);
            return new BigNumber(0);
        }
    };

    return { 
        // Make sure we never return null, convert null to BigNumber(0)
        price: price || new BigNumber(0), 
        isLoading, 
        error, 
        refetch, 
        fetchTokenPrice 
    };
}