import { useState, useEffect } from 'react';
import { getTokenIconPath } from '@/lib/icon-utils';
import { getNetworkId } from '@/lib/network-utils';

interface UseTokenImageProps {
    address: string;
    symbol: string;
    network: string;
}

/**
 * A hook to fetch token logo URLs from the token logo API with Blob storage support
 */
export function useTokenImage({ address, symbol, network }: UseTokenImageProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Skip if we don't have an address, symbol, or network
        if (!address || !symbol || !network) {
            return;
        }

        async function fetchTokenLogo() {
            // Special case for native tokens which have address "0x0000000000000000000000000000000000000000"
            if (address === "0x0000000000000000000000000000000000000000") {
                const fallbackNativeIcon = getTokenIconPath(symbol);
                setLogoUrl(fallbackNativeIcon);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Use getNetworkId to normalize the network identifier
                const standardizedNetworkId = getNetworkId(network);
                
                // Fetch from our token logo API (with Blob storage support)
                const response = await fetch(
                    `/api/tokens-logo?network=${standardizedNetworkId}&address=${address}`,
                    { next: { revalidate: 3600 } } // Cache for 1 hour
                );

                if (!response.ok) {
                    // If the API returns an error, use the fallback icon
                    console.warn(`Error fetching token logo for ${symbol} (${address}) on ${standardizedNetworkId}`);
                    const fallbackIcon = getTokenIconPath(symbol, address);
                    if (isMounted) setLogoUrl(fallbackIcon);
                    return;
                }

                const data = await response.json();

                if (data.success && data.logo_url) {
                    if (isMounted) {
                        setLogoUrl(data.logo_url);
                    }
                } else {
                    // If the API doesn't return a logo URL, use our fallback method
                    const fallbackIcon = getTokenIconPath(symbol, address);
                    if (isMounted) {
                        setLogoUrl(fallbackIcon);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching token logo:", err);
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                    // Use fallback on error
                    const fallbackIcon = getTokenIconPath(symbol, address);
                    setLogoUrl(fallbackIcon);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchTokenLogo();

        return () => {
            isMounted = false;
        };
    }, [address, symbol, network]);

    return { logoUrl, isLoading, error };
}

/**
 * Utility function to directly get a token image URL without a React hook
 * Now uses the tokens-logo API with Blob storage support
 */
export async function getTokenImage(address: string, symbol: string, network: string): Promise<string> {
    try {
        // Fallback icon to use if anything fails
        const fallbackIcon = getTokenIconPath(symbol, address);

        // Special case for native tokens
        if (address === "0x0000000000000000000000000000000000000000") {
            return fallbackIcon;
        }

        // Use getNetworkId to normalize the network identifier
        const standardizedNetworkId = getNetworkId(network);
        
        // Fetch from our token logo API (with Blob storage support)
        const response = await fetch(
            `/api/tokens-logo?network=${standardizedNetworkId}&address=${address}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            return fallbackIcon;
        }

        const data = await response.json();

        // Return the API logo URL if available, otherwise use fallback
        return (data.success && data.logo_url)
            ? data.logo_url
            : fallbackIcon;
    } catch (error) {
        console.error("Error in getTokenImage:", error);
        return getTokenIconPath(symbol, address);
    }
}