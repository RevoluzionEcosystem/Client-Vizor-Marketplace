import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { cache } from 'react';
import { createPool, Pool } from '@vercel/postgres';

// Cached instance of the USER_HISTORY database pool
let userHistoryPool: Pool | null = null;

/**
 * Get a connection pool to the USER_HISTORY database branch
 * This is a singleton pattern to avoid creating multiple pools
 */
export const getUserHistoryPoolClient = () => {
    if (userHistoryPool) return userHistoryPool;
    
    const dbUrl = process.env.USER_HISTORY_POSTGRES_URL;
    if (!dbUrl) {
        throw new Error("Missing USER_HISTORY database connection string");
    }
    
    userHistoryPool = createPool({
        connectionString: dbUrl,
    });
    
    return userHistoryPool;
};

// Function to validate wallet address format
export const isValidWalletAddress = (address: string): boolean => {
    if (!address || typeof address !== 'string') return false;

    // Ethereum/EVM address format: 0x + 40 hex characters
    const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;

    // Solana address format: base58 encoded, typically around 44 characters
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    // TON/The Open Network address format (user-friendly format)
    const tonRegex = /^[UEQ][A-Za-z0-9_-]{46,48}$/;

    // Polkadot/Kusama address format
    const polkadotRegex = /^[1-9A-HJ-NP-Za-km-z]{46,48}$/;

    // Cardano address format
    const cardanoRegex = /^(addr1|stake1)[0-9a-z]{53,98}$/;

    // Tezos address format
    const tezosRegex = /^(tz1|tz2|tz3|KT1)[0-9a-zA-Z]{33}$/;

    // Cosmos-based chains (including Osmosis, etc.)
    const cosmosRegex = /^[a-z0-9]{1,20}1[0-9a-z]{38,58}$/;

    // Algorand address format
    const algorandRegex = /^[A-Z2-7]{58}$/;

    // General fallback for any blockchain address
    // This is more lenient and will accept most valid addresses
    // at least 20 characters, less than 100, and contains alphanumeric characters
    const generalAddressRegex = /^[A-Za-z0-9_-]{20,100}$/;

    return (
        ethereumRegex.test(address) ||
        solanaRegex.test(address) ||
        tonRegex.test(address) ||
        polkadotRegex.test(address) ||
        cardanoRegex.test(address) ||
        tezosRegex.test(address) ||
        cosmosRegex.test(address) ||
        algorandRegex.test(address) ||
        generalAddressRegex.test(address) // As a fallback for other chains
    );
};

// Custom validator for wallet addresses
const walletAddressValidator = z.string().refine(
    (address) => isValidWalletAddress(address),
    {
        message: 'Invalid wallet address format. Must be a valid Ethereum or Solana address.'
    }
);

// Define the history item schema
export const HistoryItemSchema = z.object({
    id: z.string().optional(), // Auto-generated if not provided
    walletAddress: walletAddressValidator,
    componentType: z.string(), // e.g. 'flattener', 'scanner', etc.
    data: z.record(z.string(), z.any()), // Flexible data structure
    timestamp: z.number().optional(), // Auto-generated if not provided
});

export type HistoryItem = z.infer<typeof HistoryItemSchema>;

// Cache the fetch history function to improve performance
export const getUserHistory = cache(async (walletAddress: string, componentType: string, limit: number = 20) => {
    try {
        // Validate inputs
        if (!walletAddress || !isValidWalletAddress(walletAddress) || !componentType) {
            throw new Error('Invalid parameters for fetching history');
        }

        // Query the database for user history based on wallet address and component type
        const { rows } = await sql`
      SELECT * FROM user_history 
      WHERE wallet_address = ${walletAddress} 
      AND component_type = ${componentType}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;

        // Transform database rows to HistoryItem format
        return rows.map(row => ({
            id: row.id,
            walletAddress: row.wallet_address,
            componentType: row.component_type,
            data: row.data,
            timestamp: new Date(row.timestamp).getTime(),
        }));
    } catch (error) {
        console.error('Error fetching user history:', error);
        return [];
    }
});

// Add a new history item
export const addHistoryItem = async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    try {
        // Validate the history item
        HistoryItemSchema.parse({
            ...item,
            id: undefined,
            timestamp: Date.now()
        });

        // Insert the history item into the database
        const timestamp = new Date().toISOString();
        const { rows } = await sql`
      INSERT INTO user_history (wallet_address, component_type, data, timestamp)
      VALUES (${item.walletAddress}, ${item.componentType}, ${JSON.stringify(item.data)}, ${timestamp})
      RETURNING id
    `;

        return { success: true, id: rows[0]?.id };
    } catch (error) {
        console.error('Error adding history item:', error);
        return { success: false, error };
    }
};

// Delete a specific history item
export const deleteHistoryItem = async (id: string, walletAddress: string) => {
    try {
        // Validate inputs
        if (!id || !walletAddress || !isValidWalletAddress(walletAddress)) {
            throw new Error('Invalid parameters for deleting history item');
        }

        // Delete the history item from the database (ensure user owns the item)
        await sql`
      DELETE FROM user_history 
      WHERE id = ${id} 
      AND wallet_address = ${walletAddress}
    `;

        return { success: true };
    } catch (error) {
        console.error('Error deleting history item:', error);
        return { success: false, error };
    }
};

// Clear all history for a specific user and component type
export const clearUserHistory = async (walletAddress: string, componentType: string) => {
    try {
        // Validate inputs
        if (!walletAddress || !isValidWalletAddress(walletAddress) || !componentType) {
            throw new Error('Invalid parameters for clearing history');
        }

        // Delete all history items for this user and component
        await sql`
      DELETE FROM user_history 
      WHERE wallet_address = ${walletAddress} 
      AND component_type = ${componentType}
    `;

        return { success: true };
    } catch (error) {
        console.error('Error clearing user history:', error);
        return { success: false, error };
    }
};

// Create the database schema if it doesn't exist
export const initializeHistoryDatabase = async () => {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS user_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(44) NOT NULL, -- Increased to 44 to accommodate Solana addresses
        component_type VARCHAR(50) NOT NULL,
        data JSONB NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

        // Create indices for better query performance
        await sql`
      CREATE INDEX IF NOT EXISTS idx_history_wallet_component 
      ON user_history(wallet_address, component_type)
    `;

        return { success: true };
    } catch (error) {
        console.error('Error initializing history database:', error);
        return { success: false, error };
    }
};

// Schema for scan history entries
export const scanHistoryEntrySchema = z.object({
    address: walletAddressValidator, // The address that was scanned
    network: z.string(), // The network on which the scan was performed
    type: z.string(), // Type of scan (token, nft, allowance, address)
    accountAddress: walletAddressValidator, // The wallet address of the user who performed the scan
    timestamp: z.number().optional(), // When the scan was performed
    result: z.any().optional() // Optional scan result
});

export type DbScanHistoryEntry = z.infer<typeof scanHistoryEntrySchema>;

/**
 * Save a scan history entry to the database for a user
 * @param entry The scan history entry to save
 * @returns True if the entry was saved successfully
 */
export async function saveScanHistoryToDb(entry: DbScanHistoryEntry): Promise<boolean> {
    try {
        const { address, network, type, accountAddress, timestamp = Date.now() } = entry;
        // Simplified result storage - convert to JSON string
        const resultJson = entry.result ? JSON.stringify(entry.result) : null;

        await sql`
            INSERT INTO scan_history (address, network, type, account_address, timestamp, result_json)
            VALUES (${address}, ${network}, ${type}, ${accountAddress}, ${timestamp}, ${resultJson})
        `;

        return true;
    } catch (error) {
        console.error('Error saving scan history to database:', error);
        return false;
    }
}

/**
 * Get scan history for a specific wallet address from the database
 * @param accountAddress The wallet address to get history for
 * @param limit Maximum number of entries to fetch (default: 50)
 * @returns Array of scan history entries
 */
export const getScanHistoryFromDb = cache(async (
    accountAddress: string,
    limit: number = 50
): Promise<DbScanHistoryEntry[]> => {
    try {
        if (!isValidWalletAddress(accountAddress)) {
            throw new Error('Invalid wallet address');
        }

        const result = await sql`
            SELECT address, network, type, account_address, timestamp, result_json
            FROM scan_history
            WHERE account_address = ${accountAddress}
            ORDER BY timestamp DESC
            LIMIT ${limit}
        `;

        return result.rows.map(row => ({
            address: row.address,
            network: row.network,
            type: row.type,
            accountAddress: row.account_address,
            timestamp: Number(row.timestamp),
            result: row.result_json ? JSON.parse(row.result_json) : null
        }));
    } catch (error) {
        console.error('Error fetching scan history from database:', error);
        return [];
    }
});

/**
 * Delete scan history for a specific wallet address from the database
 * @param accountAddress The wallet address to delete history for
 * @returns True if the history was deleted successfully
 */
export async function deleteScanHistoryFromDb(accountAddress: string): Promise<boolean> {
    try {
        if (!isValidWalletAddress(accountAddress)) {
            throw new Error('Invalid wallet address');
        }

        await sql`
            DELETE FROM scan_history
            WHERE account_address = ${accountAddress}
        `;

        return true;
    } catch (error) {
        console.error('Error deleting scan history from database:', error);
        return false;
    }
}