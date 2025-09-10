/**
 * Crosschain Swap History Utilities
 * Handles saving and retrieving transaction history from both local storage and cloud database
 */

import { z } from 'zod';
import { cache } from 'react';

// Define the transaction structure
export interface Transaction {
  id?: string; // Database ID
  hash: string;
  fromNetwork: string;
  toNetwork: string;
  fromToken: {
    symbol: string;
    address: string;
    image?: string;
  };
  toToken: {
    symbol: string;
    address: string;
    image?: string;
  };
  timestamp: number;
  type: "on-chain" | "cross-chain";
  provider?: string;
  status: "pending" | "success" | "failed";
  amount?: string;
  explorerUrl?: string;
  walletAddress?: string; // Added for cloud sync
}


// Local storage key - still keeping local storage for offline access
const STORAGE_KEY = "rubic-swap-transactions";

/**
 * Get transaction history for the specified address from local storage
 */
export function getLocalTransactionHistory(address: string): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // Get all transaction history
    const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    // Get and return address-specific history, or empty array if none
    const addressKey = address.toLowerCase();
    return allHistory[addressKey] || [];
  } catch (error) {
    console.error("Error retrieving local transaction history:", error);
    return [];
  }
}

/**
 * Save a transaction to local storage history
 */
export function saveLocalTransaction(
  address: string,
  transaction: Transaction
): void {
  if (typeof window === "undefined" || !address) {
    return;
  }

  try {
    // Get current history
    const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    // Get address-specific history
    const addressKey = address.toLowerCase();
    const addressHistory = allHistory[addressKey] || [];

    // Add transaction at the beginning (newest first)
    addressHistory.unshift({
      ...transaction,
      timestamp: transaction.timestamp || Date.now(),
    });

    // Limit history size to 50 items
    const limitedHistory = addressHistory.slice(0, 50);

    // Update and save
    allHistory[addressKey] = limitedHistory;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error("Error saving transaction to local storage:", error);
  }
}

/**
 * Get transaction history from the cloud database
 * This is cached to improve performance
 */
export const getCloudTransactionHistory = cache(async (
  address: string,
  limit: number = 50,
  network?: string
): Promise<Transaction[]> => {
  if (typeof window === "undefined" || !address) {
    return [];
  }

  try {
    // Build URL with query parameters
    let url = `/api/user-history/crosschain-swap?walletAddress=${address}&limit=${limit}`;
    if (network) {
      url += `&network=${network}`;
    }
    
    // Make API call to get transaction history
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error retrieving cloud transaction history:", error);
    // Fall back to local storage in case of API failure
    return getLocalTransactionHistory(address);
  }
});

/**
 * Save a transaction to cloud database
 */
export async function saveCloudTransaction(
  address: string,
  transaction: Transaction
): Promise<boolean> {
  if (typeof window === "undefined" || !address) {
    return false;
  }

  try {
    // Make API call to save transaction
    const response = await fetch('/api/user-history/crosschain-swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: address,
        ...transaction
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save transaction: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error saving transaction to cloud:", error);
    return false;
  }
}

/**
 * Main function to save a transaction to history
 * Saves to both local storage and cloud
 */
export async function saveTransaction(
  address: string,
  transaction: Transaction
): Promise<void> {
  if (!address || !transaction) {
    return;
  }

  // Save to local storage for immediate access and offline support
  saveLocalTransaction(address, transaction);

  // Save to cloud database for cross-device sync
  await saveCloudTransaction(address, transaction);
}

/**
 * Get combined transaction history (local + cloud)
 */
export async function getTransactionHistory(
  address: string,
  limit: number = 50,
  network?: string
): Promise<Transaction[]> {
  if (!address) {
    return [];
  }

  try {
    // Get cloud history first
    const cloudHistory = await getCloudTransactionHistory(address, limit, network);

    // Get local history as fallback
    const localHistory = getLocalTransactionHistory(address);
    
    // Filter local history by network if specified
    const filteredLocalHistory = network 
      ? localHistory.filter(tx => tx.fromNetwork === network || tx.toNetwork === network)
      : localHistory;

    // If we have cloud history, use it
    if (cloudHistory && cloudHistory.length > 0) {
      return cloudHistory;
    }

    // Otherwise use filtered local history
    return filteredLocalHistory;
  } catch (error) {
    console.error("Error retrieving combined transaction history:", error);
    // Fall back to local storage in case of any error
    return getLocalTransactionHistory(address);
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  address: string,
  hash: string,
  updates: Partial<Transaction>
): Promise<boolean> {
  if (!address || !hash) {
    return false;
  }

  // Update local storage for immediate feedback
  try {
    const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const addressKey = address.toLowerCase();
    const addressHistory = allHistory[addressKey] || [];

    const txIndex = addressHistory.findIndex((tx) => tx.hash === hash);
    if (txIndex !== -1) {
      // Update transaction
      addressHistory[txIndex] = {
        ...addressHistory[txIndex],
        ...updates,
      };

      // Save updated history
      allHistory[addressKey] = addressHistory;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    }
  } catch (error) {
    console.error("Error updating local transaction:", error);
  }

  // Update cloud record
  try {
    // Get cloud history to find the transaction ID
    const cloudHistory = await getCloudTransactionHistory(address, 100);
    const transaction = cloudHistory.find(tx => tx.hash === hash);

    if (transaction && 'id' in transaction) {
      // Make API call to update transaction
      const response = await fetch('/api/user-history/crosschain-swap', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: transaction.id,
          walletAddress: address,
          updates
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update transaction: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    }

    return false;
  } catch (error) {
    console.error("Error updating cloud transaction:", error);
    return false;
  }
}

/**
 * Clear transaction history
 */
export async function clearTransactionHistory(address?: string): Promise<boolean> {
  try {
    // Clear local storage
    if (typeof window !== "undefined") {
      if (address) {
        // Clear only specified address history
        const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        const addressKey = address.toLowerCase();
        delete allHistory[addressKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
      } else {
        // Clear all history
        localStorage.setItem(STORAGE_KEY, "{}");
      }
    }

    // Clear cloud storage
    if (address) {
      const response = await fetch(`/api/user-history/crosschain-swap?walletAddress=${address}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear cloud history: ${response.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error clearing transaction history:", error);
    return false;
  }
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerUrl(network: string, hash: string): string {
  const explorers: Record<string, string> = {
    eth: "https://etherscan.io/tx/",
    ethereum: "https://etherscan.io/tx/",
    matic: "https://polygonscan.com/tx/",
    polygon: "https://polygonscan.com/tx/",
    bsc: "https://bscscan.com/tx/",
    avalanche: "https://snowtrace.io/tx/",
    avax: "https://snowtrace.io/tx/",
    arbitrum: "https://arbiscan.io/tx/",
    arb: "https://arbiscan.io/tx/",
    optimism: "https://optimistic.etherscan.io/tx/",
    op: "https://optimistic.etherscan.io/tx/",
    base: "https://basescan.org/tx/",
    fantom: "https://ftmscan.com/tx/",
    ftm: "https://ftmscan.com/tx/",
    zksync: "https://explorer.zksync.io/tx/",
    linea: "https://lineascan.build/tx/",
    scroll: "https://scrollscan.com/tx/",
    polygon_zkevm: "https://zkevm.polygonscan.com/tx/",
    rootstock: "https://explorer.rootstock.io/tx/",
    fuse: "https://explorer.fuse.io/tx/",
  };

  const baseUrl = explorers[network.toLowerCase()] || "https://etherscan.io/tx/";
  return baseUrl + hash;
}
