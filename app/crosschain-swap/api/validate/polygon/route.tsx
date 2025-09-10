import { NextRequest, NextResponse } from "next/server";
import { NETWORK_MAP } from "@/lib/network-utils";
import { getNetworkId } from "@/lib/network-utils";

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

// Helper function to validate Ethereum-style addresses
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Get token logo from our centralized API (with Blob storage support)
async function getTokenLogo(network: string, address: string): Promise<string> {
  try {
    // Get standardized network ID
    const standardizedNetwork = getNetworkId(network);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/tokens-logo?network=${standardizedNetwork}&address=${address}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.logo_url) {
        return data.logo_url;
      }
    }
    
    return `/assets/tokens/default.svg`;
  } catch (error) {
    console.error(`Error fetching token logo for ${network}/${address}:`, error);
    return `/assets/tokens/default.svg`;
  }
}

// Fallback RPC URLs in case the network map import fails
const FALLBACK_RPC_URLS = {
  polygon: "https://polygon-rpc.com"
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
    if (!isValidAddress(address)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token address format" 
      }, { status: 400 });
    }

    // Special case for native token (MATIC)
    if (address.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      // Get logo from our token logo API
      const logoUrl = await getTokenLogo('polygon', address);
      
      return NextResponse.json({
        success: true,
        token: {
          address: "0x0000000000000000000000000000000000000000",
          name: "Matic",
          symbol: "MATIC",
          decimals: 18,
          chainId: 137,
          isNative: true,
          logoUrl: logoUrl
        }
      });
    }

    // Get Polygon RPC URL - use fallback if NETWORK_MAP is unavailable
    let rpcUrl;
    try {
      rpcUrl = NETWORK_MAP?.polygon?.rpcUrls?.http?.[0] || FALLBACK_RPC_URLS.polygon;
    } catch (error) {
      console.log("Error accessing NETWORK_MAP, using fallback:", error);
      rpcUrl = FALLBACK_RPC_URLS.polygon;
    }

    console.log("Using RPC URL:", rpcUrl);

    // Prepare the requests for name, symbol, and decimals
    const nameRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [
        {
          to: address,
          data: "0x06fdde03" // keccak256 hash of "name()"
        },
        "latest"
      ]
    };

    const symbolRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "eth_call",
      params: [
        {
          to: address,
          data: "0x95d89b41" // keccak256 hash of "symbol()"
        },
        "latest"
      ]
    };

    const decimalsRequest = {
      jsonrpc: "2.0",
      id: 3,
      method: "eth_call",
      params: [
        {
          to: address,
          data: "0x313ce567" // keccak256 hash of "decimals()"
        },
        "latest"
      ]
    };

    // Make parallel requests to the Polygon node
    const [nameResponse, symbolResponse, decimalsResponse] = await Promise.all([
      fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameRequest)
      }),
      fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(symbolRequest)
      }),
      fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decimalsRequest)
      })
    ]);

    if (!nameResponse.ok || !symbolResponse.ok || !decimalsResponse.ok) {
      console.error("RPC response not OK:", {
        name: nameResponse.status,
        symbol: symbolResponse.status,
        decimals: decimalsResponse.status
      });
      return NextResponse.json({
        success: false,
        error: "Error communicating with blockchain node"
      }, { status: 500 });
    }

    const nameData = await nameResponse.json();
    const symbolData = await symbolResponse.json();
    const decimalsData = await decimalsResponse.json();

    // Check for RPC errors that indicate the contract is not a valid token
    if (nameData.error || symbolData.error || decimalsData.error) {
      // Check if the error is because the contract doesn't exist or is not a token
      const isContractError = 
        nameData.error?.message?.includes("execution reverted") ||
        symbolData.error?.message?.includes("execution reverted") ||
        decimalsData.error?.message?.includes("execution reverted");
      
      const isNotFoundError = 
        nameData.error?.message?.includes("not found") ||
        symbolData.error?.message?.includes("not found") ||
        decimalsData.error?.message?.includes("not found");

      if (isContractError || isNotFoundError) {
        // This is a case where the address is valid but not a token contract
        return NextResponse.json({ 
          success: false, 
          error: "No valid token found at this address on Polygon network" 
        }, { status: 404 });
      } else {
        // This is an actual RPC error
        console.error("RPC error:", {
          nameError: nameData.error,
          symbolError: symbolData.error,
          decimalsError: decimalsData.error
        });
        return NextResponse.json({ 
          success: false, 
          error: "Error communicating with blockchain node" 
        }, { status: 500 });
      }
    }

    // Helper function to decode Ethereum ABI-encoded strings
    const decodeString = (hexString: string): string => {
      if (!hexString || hexString === "0x") return "";

      try {
          // Remove 0x prefix
          const hex = hexString.substring(2);

          // First 32 bytes (64 chars) is the offset
          const offset = parseInt(hex.substring(0, 64), 16);

          // Next 32 bytes after the offset is the length
          const length = parseInt(hex.substring(64, 128), 16);

          // The string data starts after the length
          const stringHex = hex.substring(128, 128 + length * 2);

          // Convert hex to string
          let result = "";
          for (let i = 0; i < stringHex.length; i += 2) {
              result += String.fromCharCode(parseInt(stringHex.substring(i, i + 2), 16));
          }

          return result;
      } catch (error) {
          console.error("Error decoding string:", error);
          return "";
      }
  };

  // Decode the results
  const name = decodeString(nameData.result);
  const symbol = decodeString(symbolData.result);
  const decimals = parseInt(decimalsData.result, 16);
  
  // Get logo from our token logo API
  const logoUrl = await getTokenLogo('polygon', address);

  // Return the token data
  return NextResponse.json({
      success: true,
      token: {
          address: address,
          name: name,
          symbol: symbol,
          decimals: decimals,
          chainId: 137,  // Corrected chain ID for Polygon
          logoUrl: logoUrl
      }
  });

  } catch (error) {
    console.error("Error validating Polygon token:", error);
    return NextResponse.json({
        success: false,
        error: "Failed to validate token"
    }, { status: 500 });
  }
}