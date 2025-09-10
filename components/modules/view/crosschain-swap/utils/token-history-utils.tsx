/**
 * Token history utilities
 * Handles importing and favoriting tokens with cloud sync
 */

import { z } from 'zod';
import { cache } from 'react';


// Define the imported token structure
export interface ImportedToken {
  id?: string;  // Database ID
  walletAddress: string;
  network: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  timestamp?: number;
}


// Define the favorite token structure with additional fields
export interface FavoriteToken extends ImportedToken {
  tags?: string[];
  notes?: string;
}

// Local storage keys
const IMPORTED_TOKENS_KEY = "vizor-imported-tokens";
const FAVORITE_TOKENS_KEY = "vizor-favorite-tokens";

/**
 * Get imported tokens from local storage
 */
export function getLocalImportedTokens(
  address: string,
  network?: string
): ImportedToken[] {
  if (typeof window === "undefined" || !address) {
    return [];
  }

  try {
    // Get all imported tokens
    const allTokens = JSON.parse(localStorage.getItem(IMPORTED_TOKENS_KEY) || "{}");

    // Get and return address-specific tokens
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Filter by network if specified
    if (network) {
      return userTokens.filter((token) => token.network === network);
    }

    return userTokens;
  } catch (error) {
    console.error("Error retrieving local imported tokens:", error);
    return [];
  }
}

/**
 * Save an imported token to local storage
 */
export function saveLocalImportedToken(
  address: string,
  token: Omit<ImportedToken, 'walletAddress'>
): void {
  if (typeof window === "undefined" || !address) {
    return;
  }

  try {
    // Get current imported tokens
    const allTokens = JSON.parse(localStorage.getItem(IMPORTED_TOKENS_KEY) || "{}");

    // Get address-specific tokens
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Check if token already exists
    const existingTokenIndex = userTokens.findIndex(
      (t) => t.address === token.address && t.network === token.network
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      userTokens[existingTokenIndex] = {
        ...userTokens[existingTokenIndex],
        ...token,
        timestamp: Date.now(),
      };
    } else {
      // Add new token
      userTokens.push({
        ...token,
        walletAddress: address,
        timestamp: Date.now(),
      });
    }

    // Update and save
    allTokens[addressKey] = userTokens;
    localStorage.setItem(IMPORTED_TOKENS_KEY, JSON.stringify(allTokens));
  } catch (error) {
    console.error("Error saving imported token to local storage:", error);
  }
}

/**
 * Get imported tokens from cloud database (cached)
 */
export const getCloudImportedTokens = cache(async (
  address: string,
  network?: string
): Promise<ImportedToken[]> => {
  if (typeof window === "undefined" || !address) {
    return [];
  }

  try {
    // Build URL with query parameters
    let url = `/api/user-history/imported-tokens?walletAddress=${address}`;
    if (network) {
      url += `&network=${network}`;
    }

    // Make API call to get imported tokens
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch imported tokens: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error retrieving cloud imported tokens:", error);
    // Fall back to local storage in case of API failure
    return getLocalImportedTokens(address, network);
  }
});

/**
 * Save an imported token to cloud database
 */
export async function saveCloudImportedToken(
  address: string,
  token: Omit<ImportedToken, 'walletAddress'>
): Promise<boolean> {
  if (typeof window === "undefined" || !address) {
    return false;
  }

  try {
    // Make API call to save imported token
    const response = await fetch('/api/user-history/imported-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: address,
        ...token
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save imported token: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error saving imported token to cloud:", error);
    return false;
  }
}

/**
 * Main function to import a token
 * Saves to both local storage and cloud
 */
export async function importToken(
  address: string,
  token: Omit<ImportedToken, 'walletAddress'>
): Promise<boolean> {
  if (!address || !token) {
    return false;
  }

  // Save to local storage
  saveLocalImportedToken(address, token);

  // Save to cloud database
  return await saveCloudImportedToken(address, token);
}

/**
 * Remove an imported token
 */
export async function removeImportedToken(
  address: string,
  tokenAddress: string,
  network: string
): Promise<boolean> {
  if (!address || !tokenAddress || !network) {
    return false;
  }

  // Remove from local storage
  try {
    const allTokens = JSON.parse(localStorage.getItem(IMPORTED_TOKENS_KEY) || "{}");
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Filter out the token to remove
    const updatedTokens = userTokens.filter(
      (t) => !(t.address === tokenAddress && t.network === network)
    );

    // Save updated tokens
    allTokens[addressKey] = updatedTokens;
    localStorage.setItem(IMPORTED_TOKENS_KEY, JSON.stringify(allTokens));
  } catch (error) {
    console.error("Error removing imported token from local storage:", error);
  }

  // Remove from cloud database
  try {
    const response = await fetch(
      `/api/user-history/imported-tokens?walletAddress=${address}&tokenAddress=${tokenAddress}&network=${network}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove imported token: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error removing imported token from cloud:", error);
    return false;
  }
}

/**
 * Get favorite tokens from local storage
 */
export function getLocalFavoriteTokens(
  address: string,
  network?: string
): FavoriteToken[] {
  if (typeof window === "undefined" || !address) {
    return [];
  }

  try {
    // Get all favorite tokens
    const allTokens = JSON.parse(localStorage.getItem(FAVORITE_TOKENS_KEY) || "{}");

    // Get and return address-specific tokens
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Filter by network if specified
    if (network) {
      return userTokens.filter((token) => token.network === network);
    }

    return userTokens;
  } catch (error) {
    console.error("Error retrieving local favorite tokens:", error);
    return [];
  }
}

/**
 * Save a favorite token to local storage
 */
export function saveLocalFavoriteToken(
  address: string,
  token: Omit<FavoriteToken, 'walletAddress'>
): void {
  if (typeof window === "undefined" || !address) {
    return;
  }

  try {
    // Get current favorite tokens
    const allTokens = JSON.parse(localStorage.getItem(FAVORITE_TOKENS_KEY) || "{}");

    // Get address-specific tokens
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Check if token already exists
    const existingTokenIndex = userTokens.findIndex(
      (t) => t.address === token.address && t.network === token.network
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      userTokens[existingTokenIndex] = {
        ...userTokens[existingTokenIndex],
        ...token,
        timestamp: Date.now(),
      };
    } else {
      // Add new token
      userTokens.push({
        ...token,
        walletAddress: address,
        timestamp: Date.now(),
      });
    }

    // Update and save
    allTokens[addressKey] = userTokens;
    localStorage.setItem(FAVORITE_TOKENS_KEY, JSON.stringify(allTokens));
  } catch (error) {
    console.error("Error saving favorite token to local storage:", error);
  }
}

/**
 * Get favorite tokens from cloud database (cached)
 */
export const getCloudFavoriteTokens = cache(async (
  address: string,
  network?: string
): Promise<FavoriteToken[]> => {
  if (typeof window === "undefined" || !address) {
    return [];
  }

  try {
    // Build URL with query parameters
    let url = `/api/user-history/favorite-tokens?walletAddress=${address}`;
    if (network) {
      url += `&network=${network}`;
    }

    // Make API call to get favorite tokens
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch favorite tokens: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error retrieving cloud favorite tokens:", error);
    // Fall back to local storage in case of API failure
    return getLocalFavoriteTokens(address, network);
  }
});

/**
 * Save a favorite token to cloud database
 */
export async function saveCloudFavoriteToken(
  address: string,
  token: Omit<FavoriteToken, 'walletAddress'>
): Promise<boolean> {
  if (typeof window === "undefined" || !address) {
    return false;
  }

  try {
    // Make API call to save favorite token
    const response = await fetch('/api/user-history/favorite-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: address,
        ...token
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save favorite token: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error saving favorite token to cloud:", error);
    return false;
  }
}

/**
 * Main function to add a token to favorites
 * Saves to both local storage and cloud
 */
export async function addFavoriteToken(
  address: string,
  token: Omit<FavoriteToken, 'walletAddress'>
): Promise<boolean> {
  if (!address || !token) {
    return false;
  }

  // Save to local storage
  saveLocalFavoriteToken(address, token);

  // Save to cloud database
  return await saveCloudFavoriteToken(address, token);
}

/**
 * Remove a favorite token
 */
export async function removeFavoriteToken(
  address: string,
  tokenAddress: string,
  network: string
): Promise<boolean> {
  if (!address || !tokenAddress || !network) {
    return false;
  }

  // Remove from local storage
  try {
    const allTokens = JSON.parse(localStorage.getItem(FAVORITE_TOKENS_KEY) || "{}");
    const addressKey = address.toLowerCase();
    const userTokens = allTokens[addressKey] || [];

    // Filter out the token to remove
    const updatedTokens = userTokens.filter(
      (t) => !(t.address === tokenAddress && t.network === network)
    );

    // Save updated tokens
    allTokens[addressKey] = updatedTokens;
    localStorage.setItem(FAVORITE_TOKENS_KEY, JSON.stringify(allTokens));
  } catch (error) {
    console.error("Error removing favorite token from local storage:", error);
  }

  // Remove from cloud database
  try {
    const response = await fetch(
      `/api/user-history/favorite-tokens?walletAddress=${address}&tokenAddress=${tokenAddress}&network=${network}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove favorite token: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error removing favorite token from cloud:", error);
    return false;
  }
}

/**
 * Get combined token lists (local + cloud)
 */
export async function getImportedTokens(
  address: string,
  network?: string
): Promise<ImportedToken[]> {
  if (!address) {
    return [];
  }

  try {
    // Get cloud tokens first
    const cloudTokens = await getCloudImportedTokens(address, network);

    // Get local tokens as fallback
    const localTokens = getLocalImportedTokens(address, network);

    // If we have cloud tokens, use them
    if (cloudTokens && cloudTokens.length > 0) {
      return cloudTokens;
    }

    // Otherwise use local tokens
    return localTokens;
  } catch (error) {
    console.error("Error retrieving imported tokens:", error);
    // Fall back to local storage in case of any error
    return getLocalImportedTokens(address, network);
  }
}

/**
 * Get combined favorite tokens (local + cloud)
 */
export async function getFavoriteTokens(
  address: string,
  network?: string
): Promise<FavoriteToken[]> {
  if (!address) {
    return [];
  }

  try {
    // Get cloud tokens first
    const cloudTokens = await getCloudFavoriteTokens(address, network);

    // Get local tokens as fallback
    const localTokens = getLocalFavoriteTokens(address, network);

    // If we have cloud tokens, use them
    if (cloudTokens && cloudTokens.length > 0) {
      return cloudTokens;
    }

    // Otherwise use local tokens
    return localTokens;
  } catch (error) {
    console.error("Error retrieving favorite tokens:", error);
    // Fall back to local storage in case of any error
    return getLocalFavoriteTokens(address, network);
  }
}
