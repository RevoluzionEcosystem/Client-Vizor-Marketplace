// app/api/token-price/route.ts
import { NextRequest, NextResponse } from 'next/server';
import BigNumber from 'bignumber.js';
// Import the shared blockchain name mappings
import { TO_BACKEND_BLOCKCHAINS } from '@/components/modules/view/crosschain-swap/hooks/backend-blockchains';

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

interface TokenPriceFromBackend {
    network: string;
    address: string;
    usd_price: number | null;
    error?: string;
    detail?: string;
}

class TokenPriceApi {
    // Use our shared blockchain mapping instead of maintaining a separate one
    private normalizeBlockchainName(blockchain: string): string {
        try {
            // First check if this is already using the correct format (all lowercase with hyphens)
            // This would be the case if it's coming directly from our TO_BACKEND_BLOCKCHAINS mapping
            if (/^[a-z0-9-]+$/.test(blockchain)) {
                return blockchain;
            }
            
            // CRITICAL: Check for specific network naming conflicts and fix them
            const conflictMap: Record<string, string> = {
                'matic': 'polygon', // Map 'matic' network to 'polygon'
                'eth': 'ethereum',
                'bsc': 'binance-smart-chain',
                'ftm': 'fantom',
                'avax': 'avalanche',
                'arb': 'arbitrum',
                'op': 'optimistic-ethereum'
            };
            
            // Check if it's a short network code that might be used in the UI
            const shortNetworkMap: Record<string, string> = {
                'eth': 'ethereum',
                'bsc': 'binance-smart-chain',
                'polygon': 'polygon',
                'ftm': 'fantom',
                'avax': 'avalanche',
                'arb': 'arbitrum',
                'op': 'optimistic-ethereum',
                'base': 'base',
                'zksync': 'zksync',
                'linea': 'linea',
                'scroll': 'scroll',
            };
            
            const lowerBlockchain = blockchain.toLowerCase();
            
            // First check conflict map
            if (conflictMap[lowerBlockchain]) {
                console.log(`Converting blockchain name from ${blockchain} to ${conflictMap[lowerBlockchain]}`);
                return conflictMap[lowerBlockchain];
            }
            
            // Then check short network map
            if (shortNetworkMap[lowerBlockchain]) {
                return shortNetworkMap[lowerBlockchain];
            }
            
            // Try to use the shared TO_BACKEND_BLOCKCHAINS mapping if it's an uppercase constant name
            const upperBlockchain = blockchain.toUpperCase();
            if (TO_BACKEND_BLOCKCHAINS[upperBlockchain]) {
                return TO_BACKEND_BLOCKCHAINS[upperBlockchain];
            }
            
            // Otherwise, normalize by converting to lowercase and replacing underscores with hyphens
            const normalized = blockchain.toLowerCase().replace(/_/g, '-');
            return normalized;
        } catch (error) {
            console.error(`Error normalizing blockchain name ${blockchain}:`, error);
            // Default to ethereum if we can't normalize
            return 'ethereum';
        }
    }

    // Map for native tokens on different blockchains
    private nativeTokenAddresses: Record<string, string> = {
        'ethereum': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
        'binance-smart-chain': '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // WBNB
        'polygon': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC
        'matic': '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC (duplicate for 'matic' network code)
        'fantom': '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
        'avalanche': '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // WAVAX
        'arbitrum': '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', // WETH on Arbitrum
        'optimistic-ethereum': '0x4200000000000000000000000000000000000006', // WETH on Optimism
        'base': '0x4200000000000000000000000000000000000006', // WETH on Base
        'zksync': '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91', // WETH on zkSync
        'linea': '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f', // WETH on Linea
        'scroll': '0x5300000000000000000000000000000000000004', // WETH on Scroll
    };

    // Rest of the TokenPriceApi implementation
    private async getTokenPriceFromBackend(
        blockchain: string,
        tokenAddress: string
    ): Promise<TokenPriceFromBackend> {
        try {        
            // Normalize the blockchain name to the format expected by Rubic API
            const normalizedBlockchain = this.normalizeBlockchainName(blockchain);
            
            console.log(`Fetching price from backend for token ${tokenAddress} on ${normalizedBlockchain} (original: ${blockchain})`);
            
            const response = await fetch(
                `https://api.rubic.exchange/api/v2/tokens/price/${normalizedBlockchain}/${tokenAddress}`,
                { next: { revalidate: 15 } } // Cache for 15 secs
            );

            if (!response.ok) {
                const errorText = await response.text();
                
                // For 404 errors, provide a more specific message
                if (response.status === 404) {
                    return {
                        network: normalizedBlockchain,
                        address: tokenAddress,
                        usd_price: null,
                        error: `Token not found at address ${tokenAddress} on ${normalizedBlockchain}`
                    };
                }
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle error response from Rubic API
            if (data.detail === 'Token not found' || data.error) {
                return {
                    network: normalizedBlockchain,
                    address: tokenAddress,
                    usd_price: null,
                    error: data.detail || data.error || 'Token not found'
                };
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching token price from backend:', error);

            return {
                network: blockchain,
                address: tokenAddress,
                usd_price: null,
                error: error.message
            };
        }
    }

    public async getTokenPrice(tokenAddress: string, blockchain: string): Promise<BigNumber> {
        // Normalize blockchain name first
        const normalizedBlockchain = this.normalizeBlockchainName(blockchain);
        
        // Special handling for native tokens (with 0x0 address)
        if (tokenAddress === "0x0000000000000000000000000000000000000000") {
            // Get the wrapped token address for this blockchain
            const wrappedTokenAddress = this.nativeTokenAddresses[normalizedBlockchain];
            
            if (wrappedTokenAddress) {
                // Use the wrapped token address (like WBNB for BNB) to get the price
                const response = await this.getTokenPriceFromBackend(normalizedBlockchain, wrappedTokenAddress);
                
                if (response?.usd_price !== null && response?.usd_price !== undefined) {
                    const price = parseFloat(String(response.usd_price));
                    if (!isNaN(price)) {
                        // Add debug log for native token price
                        console.log(`Native token price for ${normalizedBlockchain}: $${price}`);
                        return new BigNumber(price);
                    }
                }
            }
        }
        
        const response = await this.getTokenPriceFromBackend(normalizedBlockchain, tokenAddress);
        
        // Check if the price is explicitly null, undefined, or NaN and handle appropriately
        if (response?.usd_price !== null && response?.usd_price !== undefined) {
            // Ensure it's treated as a number by using parseFloat, which helps with inconsistent API responses
            const price = parseFloat(String(response.usd_price));
            if (!isNaN(price)) {
                // Add debug log for token price
                console.log(`Token price for ${tokenAddress} on ${normalizedBlockchain}: $${price}`);
                return new BigNumber(price);
            }
        }
        
        // Return zero instead of NaN for better UI display
        return new BigNumber(0);
    }
}

const tokenPriceApi = new TokenPriceApi();

export async function GET(request: NextRequest) {
    // Get URL search parameters
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    let blockchain = searchParams.get('blockchain');

    if (!address || !blockchain) {
        return NextResponse.json(
            { error: 'Missing required parameters: address and blockchain' },
            { status: 400 }
        );
    }
    
    // Handle "matic" vs "polygon" inconsistency specifically
    if (blockchain.toLowerCase() === 'matic') {
        console.log('Converting "matic" blockchain to "polygon" for price lookup');
        blockchain = 'polygon';
    }

    try {
        const price = await tokenPriceApi.getTokenPrice(address, blockchain);
        console.log(`Final price for ${address} on ${blockchain}: ${price.toString()}`);
        return NextResponse.json({ price: price.toString() });
    } catch (error) {
        console.error('Error in token price API route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch token price', price: "0" },
            { status: 500 }
        );
    }
}

// This enables CORS for this route
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}