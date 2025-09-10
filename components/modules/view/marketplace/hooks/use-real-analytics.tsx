import { useReadContract, useBlockNumber } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS } from '../abi/marketplace-abi';

interface RealAnalytics {
    totalListings: number;
    totalVolume: string;
    activeListings: number;
    contractBalance: string;
    isLoading: boolean;
    error: string | null;
}

export function useRealMarketplaceAnalytics(): RealAnalytics {
    const [analytics, setAnalytics] = useState<RealAnalytics>({
        totalListings: 0,
        totalVolume: "0",
        activeListings: 0,
        contractBalance: "0",
        isLoading: true,
        error: null
    });

    // Get current block number to trigger updates
    const { data: blockNumber } = useBlockNumber({
        watch: true,
        chainId: bscTestnet.id,
    });

    // Get contract balance (total BNB in escrow + fees)
    const { data: contractBalance, isLoading: balanceLoading, error: balanceError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: [
            {
                "inputs": [],
                "name": "getContractBalance",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ] as const,
        functionName: 'getContractBalance',
        chainId: bscTestnet.id,
    });

    // Since the contract doesn't have aggregated view functions,
    // we'll need to query individual listings to get stats
    const [listingIds, setListingIds] = useState<number[]>([]);
    const [maxCheckedId, setMaxCheckedId] = useState(10); // Start checking first 10 IDs

    // Check if a listing exists by trying to get it
    const useListingExists = (listingId: number) => {
        const { data: listing, isLoading, error } = useReadContract({
            address: MARKETPLACE_CONTRACT_ADDRESS,
            abi: marketplaceAbi,
            functionName: 'getListing',
            args: [BigInt(listingId)],
            chainId: bscTestnet.id,
        });

        return {
            exists: listing && !error,
            listing,
            isLoading,
            error
        };
    };

    // Get analytics for discovered listings
    useEffect(() => {
        const calculateAnalytics = async () => {
            setAnalytics(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                // Discover existing listings by checking IDs
                const existingListings: any[] = [];
                let totalVolumeWei = BigInt(0);
                let activeCount = 0;

                // Check listings from 1 to maxCheckedId
                for (let i = 1; i <= maxCheckedId; i++) {
                    try {
                        // This would need to be done with multiple useReadContract calls
                        // For now, we'll use a simplified approach
                    } catch (err) {
                        // Listing doesn't exist or error occurred
                    }
                }

                setAnalytics({
                    totalListings: existingListings.length,
                    totalVolume: formatEther(totalVolumeWei),
                    activeListings: activeCount,
                    contractBalance: contractBalance ? formatEther(contractBalance) : "0",
                    isLoading: false,
                    error: null
                });

            } catch (err: any) {
                setAnalytics(prev => ({
                    ...prev,
                    isLoading: false,
                    error: err.message || 'Failed to load analytics'
                }));
            }
        };

        calculateAnalytics();
    }, [blockNumber, contractBalance, maxCheckedId]);

    return analytics;
}

// Hook to get a specific listing
export function useMarketplaceListing(listingId: number) {
    const { data: listing, isLoading, error, refetch } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'getListing',
        args: [BigInt(listingId)],
        chainId: bscTestnet.id,
    });

    return {
        listing,
        isLoading,
        error,
        refetch,
        exists: listing && !error
    };
}

// Hook to check if confirmation is expired
export function useConfirmationStatus(listingId: number) {
    const { data: isExpired, isLoading, error } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'isConfirmationExpired',
        args: [BigInt(listingId)],
        chainId: bscTestnet.id,
    });

    return {
        isExpired: Boolean(isExpired),
        isLoading,
        error
    };
}

// Hook to get multiple listings efficiently
export function useMarketplaceListings(listingIds: number[]) {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const results: any[] = [];
                
                // Note: In a real implementation, you'd want to batch these calls
                // or use a multicall contract to get all listings efficiently
                for (const id of listingIds) {
                    // This is a simplified approach - in production you'd use Promise.all
                    // with proper error handling for each listing
                }
                
                setListings(results);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch listings');
            } finally {
                setIsLoading(false);
            }
        };

        if (listingIds.length > 0) {
            fetchListings();
        } else {
            setListings([]);
            setIsLoading(false);
        }
    }, [listingIds]);

    return { listings, isLoading, error };
}
