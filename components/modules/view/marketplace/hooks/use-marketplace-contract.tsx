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

    // Read the actual listing fee from the contract
    const useListingFee = () => {
        return useReadContract({
            address: MARKETPLACE_CONTRACT_ADDRESS,
            abi: marketplaceAbi,
            functionName: 'listingFee',
        });
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
