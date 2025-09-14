import { useReadContract, useReadContracts } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS, MarketplaceListing, ListingStatus, getStatusText } from '../abi/marketplace-abi';
import { formatEther } from 'viem';

export function useMarketplaceListings() {
    // Get the current listing ID to know how many listings exist
    const { data: currentListingId, isLoading: isLoadingCurrentId, error: currentIdError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'getCurrentListingId',
    });

    // Debug logging
    console.log('🔍 Debug - currentListingId:', currentListingId);
    console.log('🔍 Debug - isLoadingCurrentId:', isLoadingCurrentId);
    console.log('🔍 Debug - currentIdError:', currentIdError);

    // Generate contract calls for all listings
    const contracts = useMemo(() => {
        if (!currentListingId || currentListingId === BigInt(0)) {
            console.log('🔍 Debug - No currentListingId or is 0:', currentListingId);
            return [];
        }
        
        const calls = [];
        const listingCount = Number(currentListingId);
        console.log('🔍 Debug - listingCount:', listingCount);
        
        for (let i = 1; i <= listingCount; i++) {
            calls.push({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'getListing',
                args: [BigInt(i)],
            });
        }
        
        console.log('🔍 Debug - contracts to call:', calls);
        return calls;
    }, [currentListingId]);

    // Fetch all listings using batch read
    const { data: rawListings, isLoading: isLoadingListings, error: listingsError } = useReadContracts({
        contracts: contracts as any[],
        query: {
            enabled: contracts.length > 0,
        }
    } as any);

    // Debug logging for raw listings
    console.log('🔍 Debug - rawListings:', rawListings);
    console.log('🔍 Debug - rawListings type:', typeof rawListings);
    console.log('🔍 Debug - rawListings length:', rawListings?.length);
    console.log('🔍 Debug - isLoadingListings:', isLoadingListings);
    console.log('🔍 Debug - listingsError:', listingsError);

    // Process and format listings
    const listings = useMemo(() => {
        if (!rawListings) {
            console.log('🔍 Debug - No rawListings data');
            return [];
        }
        
        console.log('🔍 Debug - Processing rawListings:', rawListings);
        
        return rawListings
            .map((result, index) => {
                console.log(`🔍 Debug - Processing listing ${index + 1}:`, result);
                
                if (result.status !== 'success' || !result.result) {
                    console.log(`🔍 Debug - Listing ${index + 1} failed or no result:`, result);
                    return null;
                }
                
                try {
                    // The contract returns a struct, not an array - access by property names
                    const raw = result.result as any;
                    
                    console.log(`🔍 Debug - Raw data for listing ${index + 1}:`, raw);
                    console.log(`🔍 Debug - Raw data type:`, typeof raw, Array.isArray(raw));
                    
                    // Check if we have valid data
                    if (!raw) {
                        console.warn(`Listing ${index + 1}: No raw data`);
                        return null;
                    }
                    
                    // Handle both array and object formats
                    let listing: MarketplaceListing;
                    
                    if (Array.isArray(raw)) {
                        // Array format - use indices
                        console.log(`🔍 Debug - Array format, length:`, raw.length);
                        listing = {
                            id: raw[0] || BigInt(index + 1),
                            seller: raw[1] || '0x0000000000000000000000000000000000000000',
                            buyer: raw[2] || '0x0000000000000000000000000000000000000000',
                            price: raw[3] || BigInt(0),
                            tokenAddress: raw[4] || '0x0000000000000000000000000000000000000000',
                            lpAddress: raw[5] || '0x0000000000000000000000000000000000000000',
                            lockUrl: raw[6] || '',
                            transferProofHash: raw[7] || '',
                            contactMethod: raw[8] || '',
                            status: raw[9] ?? 0,
                            purchaseTimestamp: raw[10] || BigInt(0),
                            createdAt: raw[11] || BigInt(0)
                        };
                    } else {
                        // Object format - use property names
                        console.log(`🔍 Debug - Object format, keys:`, Object.keys(raw));
                        listing = {
                            id: raw.id || BigInt(index + 1),
                            seller: raw.seller || '0x0000000000000000000000000000000000000000',
                            buyer: raw.buyer || '0x0000000000000000000000000000000000000000',
                            price: raw.price || BigInt(0),
                            tokenAddress: raw.tokenAddress || '0x0000000000000000000000000000000000000000',
                            lpAddress: raw.lpAddress || '0x0000000000000000000000000000000000000000',
                            lockUrl: raw.lockUrl || '',
                            transferProofHash: raw.transferProofHash || '',
                            contactMethod: raw.contactMethod || '',
                            status: raw.status ?? 0,
                            purchaseTimestamp: raw.purchaseTimestamp || BigInt(0),
                            createdAt: raw.createdAt || BigInt(0)
                        };
                    }
                    
                    console.log(`🔍 Debug - Processed listing ${Number(listing.id)}:`, listing);
                    return listing;
                } catch (error) {
                    console.error(`Error processing listing ${index + 1}:`, error);
                    return null;
                }
            })
            .filter((listing): listing is MarketplaceListing => listing !== null);
    }, [rawListings]);

    // Debug final listings
    console.log('🔍 Debug - Final processed listings:', listings);

    // Helper to format listing for display
    const formatListingForDisplay = (listing: MarketplaceListing) => {
        // Safe string formatting with null checks
        const formatAddress = (address: string | undefined | null) => {
            if (!address || address === '0x0000000000000000000000000000000000000000') {
                return 'Not set';
            }
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        };

        const tokenPair = listing.lpAddress && listing.lpAddress !== '0x0000000000000000000000000000000000000000'
            ? formatAddress(listing.lpAddress)
            : formatAddress(listing.tokenAddress);
            
        return {
            id: listing.id,
            name: tokenPair,
            value: `${formatEther(listing.price || BigInt(0))} BNB`,
            price: `${formatEther(listing.price || BigInt(0))} BNB`,
            status: getStatusText(listing.status),
            duration: listing.lockUrl ? 'Locked' : 'Unknown',
            action: 'View',
            seller: formatAddress(listing.seller),
            buyer: formatAddress(listing.buyer),
            tokenAddress: listing.tokenAddress || '',
            lpAddress: listing.lpAddress || '',
            lockUrl: listing.lockUrl || '',
            transferProofHash: listing.transferProofHash || '',
            contactMethod: listing.contactMethod || '',
            purchaseTimestamp: listing.purchaseTimestamp || BigInt(0),
            createdAt: listing.createdAt || BigInt(0),
            rawListing: listing
        };
    };

    // Filter listings by status
    const availableListings = useMemo(() => {
        return listings.filter(listing => listing.status === ListingStatus.Available);
    }, [listings]);

    const inEscrowListings = useMemo(() => {
        return listings.filter(listing => listing.status === ListingStatus.InEscrow);
    }, [listings]);

    const completedListings = useMemo(() => {
        return listings.filter(listing => listing.status === ListingStatus.Completed);
    }, [listings]);

    // Formatted listings for components
    const formattedListings = useMemo(() => {
        return listings.map(formatListingForDisplay);
    }, [listings]);

    const isLoading = isLoadingCurrentId || isLoadingListings;
    const error = currentIdError || listingsError;

    return {
        // Data
        listings,
        currentListingId,
        
        // State
        isLoading,
        error,
        
        // Filtered data
        availableListings,
        inEscrowListings,
        completedListings,
        
        // Helpers
        formatListingForDisplay,
        
        // Formatted listings for components
        formattedListings,
        
        // Stats
        totalListings: listings.length,
        availableCount: availableListings.length,
        inEscrowCount: inEscrowListings.length,
        completedCount: completedListings.length,
    };
}

// Hook specifically for individual listing reads (for components that need specific listings)
export function useMarketplaceListing(listingId: number) {
    const { data: rawListing, isLoading, error, refetch } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'getListing',
        args: [BigInt(listingId)],
        query: {
            enabled: listingId > 0,
        }
    });

    const listing = useMemo(() => {
        if (!rawListing) return null;
        
        try {
            // Based on contract, getListing returns a tuple array
            const raw = rawListing as unknown as any[];
            
            // Validate we have the expected tuple structure
            if (!raw || !Array.isArray(raw) || raw.length < 11) {
                console.warn(`Individual listing: Invalid tuple structure`, raw);
                return null;
            }
            
            return {
                id: BigInt(listingId),
                seller: raw[0] || '0x0000000000000000000000000000000000000000',
                buyer: raw[1] || '0x0000000000000000000000000000000000000000',
                price: raw[2] || BigInt(0),
                tokenAddress: raw[3] || '0x0000000000000000000000000000000000000000',
                lpAddress: raw[4] || '0x0000000000000000000000000000000000000000',
                lockUrl: raw[5] || '',
                transferProofHash: raw[6] || '',
                contactMethod: raw[7] || '',
                status: raw[8] ?? 0,
                purchaseTimestamp: raw[9] || BigInt(0),
                createdAt: raw[10] || BigInt(0)
            } as MarketplaceListing;
        } catch (error) {
            console.error(`Error processing individual listing ${listingId}:`, error);
            return null;
        }
    }, [rawListing, listingId]);

    const formatListingForDisplay = useMemo(() => {
        if (!listing) return null;
        
        // Safe string formatting with null checks
        const formatAddress = (address: string | undefined | null) => {
            if (!address || address === '0x0000000000000000000000000000000000000000') {
                return 'Not set';
            }
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        };

        const tokenPair = listing.lpAddress && listing.lpAddress !== '0x0000000000000000000000000000000000000000'
            ? formatAddress(listing.lpAddress)
            : formatAddress(listing.tokenAddress);
            
        return {
            id: listing.id,
            name: tokenPair,
            value: `${formatEther(listing.price || BigInt(0))} BNB`,
            price: `${formatEther(listing.price || BigInt(0))} BNB`,
            status: getStatusText(listing.status),
            duration: listing.lockUrl ? 'Locked' : 'Unknown',
            action: 'View',
            seller: formatAddress(listing.seller),
            buyer: formatAddress(listing.buyer),
            tokenAddress: listing.tokenAddress || '',
            lpAddress: listing.lpAddress || '',
            lockUrl: listing.lockUrl || '',
            transferProofHash: listing.transferProofHash || '',
            contactMethod: listing.contactMethod || '',
            purchaseTimestamp: listing.purchaseTimestamp || BigInt(0),
            createdAt: listing.createdAt || BigInt(0),
            rawListing: listing
        };
    }, [listing]);

    return {
        listing,
        isLoading,
        error,
        refetch,
        formatListingForDisplay
    };
}
