import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS, MarketplaceListing, ListingStatus } from '../abi/marketplace-abi';

export function useMarketplaceContract() {
    
    // Read functions
    const useListing = (listingId: number) => {
        return useReadContract({
            address: MARKETPLACE_CONTRACT_ADDRESS,
            abi: marketplaceAbi,
            functionName: 'getListing',
            args: [BigInt(listingId)],
        });
    };

    const useIsConfirmationExpired = (listingId: number) => {
        return useReadContract({
            address: MARKETPLACE_CONTRACT_ADDRESS,
            abi: marketplaceAbi,
            functionName: 'isConfirmationExpired',
            args: [BigInt(listingId)],
        });
    };

    // Note: These functions are not available in the current ABI
    // They would need to be added to the contract if needed
    const useListingFee = () => {
        // This would need to be implemented as a public state variable reader
        // For now, we can use a default value
        return { data: BigInt('10000000000000000') }; // 0.01 ETH in wei
    };

    const useNextListingId = () => {
        // This would need to be implemented in the contract
        // For now, we can derive it from events or use a placeholder
        return { data: BigInt(1) };
    };

    // Helper functions
    const formatListing = (rawListing: any): MarketplaceListing => {
        return {
            id: rawListing.id,
            seller: rawListing.seller,
            buyer: rawListing.buyer,
            price: rawListing.price,
            tokenAddress: rawListing.tokenAddress,
            lpAddress: rawListing.lpAddress,
            lockUrl: rawListing.lockUrl,
            transferProofHash: rawListing.transferProofHash,
            contactMethod: rawListing.contactMethod,
            status: rawListing.status,
            purchaseTimestamp: rawListing.purchaseTimestamp,
            createdAt: rawListing.createdAt
        };
    };

    const formatPrice = (price: bigint): string => {
        return formatEther(price);
    };

    return {
        // Read hooks
        useListing,
        useListingFee,
        useNextListingId,
        useIsConfirmationExpired,
        
        // Helper functions
        formatListing,
        formatPrice,
        
        // Contract address and ABI for external use
        contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi
    };
}
