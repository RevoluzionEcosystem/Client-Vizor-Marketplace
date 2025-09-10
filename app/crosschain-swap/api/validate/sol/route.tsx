import { NextRequest, NextResponse } from "next/server";
import { NETWORK_MAP } from "@/lib/network-utils";
import { getExplorerTokenLogoUrl } from "@/lib/token-logo-utils";

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

// Helper function to validate Solana addresses
function isValidSolanaAddress(address: string): boolean {
    // Solana addresses are base58-encoded strings, typically 32-44 characters long
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// Fallback RPC URLs in case the network map import fails
const FALLBACK_RPC_URLS = {
    solana: "https://api.mainnet-beta.solana.com"
};

export async function GET(req: NextRequest) {
    try {
        // Get token address from URL query parameter
        const url = new URL(req.url);
        const address = url.searchParams.get("address");

        // Return error if no address provided
        if (!address) {
            return NextResponse.json({
                success: false,
                error: "Token address is required"
            }, { status: 400 });
        }

        // Validate address format
        if (!isValidSolanaAddress(address)) {
            return NextResponse.json({
                success: false,
                error: "Invalid Solana token address format"
            }, { status: 400 });
        }

        // Special case for native SOL
        if (address.toLowerCase() === "11111111111111111111111111111111") {
            return NextResponse.json({
                success: true,
                token: {
                    address: "11111111111111111111111111111111",
                    name: "Solana",
                    symbol: "SOL",
                    decimals: 9,
                    chainId: "solana",
                    isNative: true,
                    logoUrl: getExplorerTokenLogoUrl('sol', address)
                }
            });
        }

        // Get Solana RPC URL - use fallback if NETWORK_MAP is unavailable
        let rpcUrl;
        try {
            rpcUrl = NETWORK_MAP?.sol?.rpcUrls?.http?.[0] || FALLBACK_RPC_URLS.solana;
        } catch (error) {
            console.log("Error accessing NETWORK_MAP, using fallback:", error);
            rpcUrl = FALLBACK_RPC_URLS.solana;
        }

        console.log("Using Solana RPC URL:", rpcUrl);

        // First, verify if the address is a valid SPL token
        const getAccountInfoRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [
                address,
                { encoding: "jsonParsed" }
            ]
        };

        const accountInfoResponse = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getAccountInfoRequest)
        });

        if (!accountInfoResponse.ok) {
            return NextResponse.json({
                success: false,
                error: "Error communicating with Solana node"
            }, { status: 500 });
        }

        const accountInfoData = await accountInfoResponse.json();

        // Check if the account exists and is a token 
        if (!accountInfoData.result || !accountInfoData.result.value || accountInfoData.result.value.data?.program !== "spl-token") {
            // This account doesn't exist or is not an SPL token
            return NextResponse.json({
                success: false,
                error: "No valid token found at this address on Solana network"
            }, { status: 404 });
        }

        // For SPL tokens, we need to make additional calls to get the token metadata
        // This would typically use the Metaplex token metadata program
        // For simplicity, we'll call the Solana SPL token endpoint for token details

        // Use solscan.io API to get token details
        const solscanApiUrl = `https://api.solscan.io/token/meta?token=${address}`;

        const tokenResponse = await fetch(solscanApiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!tokenResponse.ok) {
            // If we can't get metadata, still return basic token info
            const parsedData = accountInfoData.result.value.data.parsed;
            return NextResponse.json({
                success: true,
                token: {
                    address: address,
                    name: "Unknown Token", // We don't have metadata
                    symbol: "???",
                    decimals: parsedData.info.decimals || 0,
                    chainId: "solana",
                    logoUrl: `https://solscan.io/token/${address}`
                }
            });
        }

        const tokenData = await tokenResponse.json();

        // Construct the token response with logo URL
        return NextResponse.json({
            success: true,
            token: {
                address: address,
                name: tokenData.symbol || "Unknown Token",
                symbol: tokenData.symbol || "???",
                decimals: tokenData.decimals || 9,
                chainId: "solana",
                logoUrl: tokenData.icon || `https://solscan.io/token/${address}`
            }
        });

    } catch (error) {
        console.error("Error validating Solana token:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to validate Solana token"
        }, { status: 500 });
    }
}