import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

// Cache settings to improve performance and reduce API calls
export const revalidate = 3600; // Revalidate every hour

/**
 * Simple network ID normalization function for Edge runtime
 * This is a simplified version of getNetworkId from network-utils.tsx
 */
function normalizeNetworkId(network: string | null): string {
    if (!network) return '';
    
    const input = network.toLowerCase().trim();
    
    // Common network mappings
    const mappings: Record<string, string> = {
        'ethereum': 'eth',
        'ether': 'eth',
        'binance': 'bsc',
        'binance-smart-chain': 'bsc',
        'binance smart chain': 'bsc',
        'bnb': 'bsc',
        'bnb-chain': 'bsc',
        'bnb chain': 'bsc',
        'polygon-pos': 'polygon',
        'polygon-matic': 'polygon',
        'matic': 'polygon',
        'avalanche': 'avax',
        'avalanche-network': 'avax',
        'arbitrum': 'arb',
        'arbitrum-one': 'arb',
        'optimism': 'op',
        'fantom': 'ftm',
        'fantom-opera': 'ftm',
        'zksync-era': 'zksync',
        'solana': 'sol',
        'tron': 'trx',
    };
    
    return mappings[input] || input;
}

/**
 * API handler for fetching token logos
 * Supports multiple sources: Vercel Blob storage, local assets, GeckoTerminal API
 */
export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
        const url = new URL(req.url);
        const networkParam = url.searchParams.get('network');
        const address = url.searchParams.get('address');

        // Validate required parameters        
        if (!networkParam || !address) {
            return NextResponse.json(
                { error: 'Missing required parameters: network and address' },
                { status: 400 }
            );
        }
        
        // Normalize network ID manually for edge runtime compatibility
        const network = normalizeNetworkId(networkParam);

        // Normalize address to lowercase for consistency
        const normalizedAddress = address.toLowerCase();
        
        // Check if the logo exists in Blob storage first
        const blobLogoUrl = await getTokenLogoFromBlob(network, normalizedAddress);
        if (blobLogoUrl) {
            return NextResponse.json({
                success: true,
                source: 'blob',
                logo_url: blobLogoUrl,
            });
        }

        // Try to fetch token information from GeckoTerminal
        const geckoData = await fetchGeckoTerminalToken(network, normalizedAddress);
        
        // If we found a logo from GeckoTerminal, store it in Blob and return it
        if (geckoData?.data?.attributes?.image_url) {
            // Try to store the image in Vercel Blob
            const imageUrl = geckoData.data.attributes.image_url;
            try {
                // Store the image in Vercel Blob
                const storedBlobUrl = await storeTokenLogoInBlob(network, normalizedAddress, imageUrl);
                
                if (storedBlobUrl) {
                    // Return the Blob URL if successful
                    return NextResponse.json({
                        success: true,
                        source: 'geckoterminal-blob',
                        logo_url: storedBlobUrl,
                        symbol: geckoData.data.attributes.symbol || null,
                        name: geckoData.data.attributes.name || null
                    });
                }
            } catch (blobError) {
                console.error('Error storing logo in Blob:', blobError);
                // Continue with the original URL if Blob storage fails
            }
            
            // Return the original GeckoTerminal URL if Blob storage wasn't successful
            return NextResponse.json({
                success: true,
                source: 'geckoterminal',
                logo_url: imageUrl,
                symbol: geckoData.data.attributes.symbol || null,
                name: geckoData.data.attributes.name || null
            });
        }

        // If all else fails, return a default logo
        return NextResponse.json({
            success: false,
            source: 'default',
            logo_url: '/assets/tokens/default.svg',
            message: 'No token logo found'
        });

    } catch (error) {
        console.error('Error fetching token logo:', error);
        return NextResponse.json(
            { error: 'Failed to fetch token logo' },
            { status: 500 }
        );
    }
}

/**
 * Fetch token information from GeckoTerminal API
 */
async function fetchGeckoTerminalToken(network: string, address: string) {
    // Map network identifiers to GeckoTerminal network slugs
    // Note: Since we're already using standardized network IDs from getNetworkId(),
    // we just need to map our internal IDs to GeckoTerminal's expected format
    const networkMap: Record<string, string> = {
        'eth': 'eth',
        'bsc': 'bsc',
        'polygon': 'polygon_pos',
        'avax': 'avalanche',
        'arb': 'arbitrum',
        'op': 'optimism',
        'ftm': 'fantom',
        'base': 'base',
        'sol': 'solana',
        'zksync': 'zksync',
        'linea': 'linea',
        'scroll': 'scroll',
        'mantle': 'mantle',
        'blast': 'blast',
        'polygonzk': 'polygon_zkevm'
    };

    // Get the correct network slug for GeckoTerminal
    const geckoNetwork = networkMap[network.toLowerCase()] || network.toLowerCase();

    try {
        // Fetch token data from GeckoTerminal API
        const response = await fetch(
            `https://api.geckoterminal.com/api/v2/networks/${geckoNetwork}/tokens/${address}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Revoluzion-Ecosystem/1.0'
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from GeckoTerminal for ${network}/${address}:`, error);
        return null;
    }
}

/**
 * Check if a token logo exists in Vercel Blob storage
 * @param network - The blockchain network
 * @param address - The token address
 * @returns The URL of the logo in Blob storage, or null if not found
 */
async function getTokenLogoFromBlob(network: string, address: string): Promise<string | null> {
    try {
        // Normalize the network name (should already be standardized at this point)
        const normalizedNetwork = network.toLowerCase();
        
        // Path pattern for the token logo in Blob storage
        const blobPrefix = `token-logos/${normalizedNetwork}/${address}`;
        
        // List blobs with the specified prefix
        const { blobs } = await list({ prefix: blobPrefix });
        
        // Return the URL of the first matching blob, if any
        if (blobs.length > 0) {
            return blobs[0].url;
        }
        
        return null;
    } catch (error) {
        console.error(`Error checking Blob storage for ${network}/${address}:`, error);
        return null;
    }
}

/**
 * Store a token logo in Vercel Blob storage
 * @param network - The blockchain network
 * @param address - The token address
 * @param imageUrl - The URL of the image to store
 * @returns The URL of the stored image in Blob storage, or null if failed
 */
async function storeTokenLogoInBlob(network: string, address: string, imageUrl: string): Promise<string | null> {
    try {
        // Normalize the network name (should already be standardized at this point)
        const normalizedNetwork = network.toLowerCase();
        
        // Fetch the image from the URL
        const imageResponse = await fetch(imageUrl);
        
        if (!imageResponse.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${imageResponse.status}`);
            return null;
        }
        
        // Get the image as a blob
        const imageBlob = await imageResponse.blob();
        
        // Use .png extension for all images for consistency
        const fileExtension = '.png';
        
        // Path for the token logo in Blob storage
        const blobPath = `token-logos/${normalizedNetwork}/${address}${fileExtension}`;
        
        console.log(`Storing image in Blob: ${blobPath}, Original Content-Type: ${imageResponse.headers.get('content-type') || 'unknown'}`);
        
        // Store the image in Vercel Blob with PNG content type
        const { url } = await put(blobPath, imageBlob, {
            access: 'public',
            contentType: 'image/png',
            cacheControlMaxAge: 31536000, // Cache for 1 year (in seconds)
        });
        
        console.log(`Successfully stored image in Blob: ${url}`);
        return url;
    } catch (error) {
        console.error(`Error storing image in Blob for ${network}/${address}:`, error);
        return null;
    }
}