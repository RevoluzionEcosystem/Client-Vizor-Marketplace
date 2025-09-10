import { createClient } from '@vercel/postgres';
import { z } from 'zod';
import { cache } from 'react';

// Function to validate wallet address format
const isValidWalletAddress = (address: string): boolean => {
    // Ethereum address format: 0x + 40 hex characters
    const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;

    // Solana address format: base58 encoded, typically around 44 characters
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    return ethereumRegex.test(address) || solanaRegex.test(address);
};

// Schema for user settings
export const userSettingsSchema = z.object({
    walletAddress: z.string().refine(
        (address) => isValidWalletAddress(address),
        {
            message: 'Invalid wallet address format. Must be a valid Ethereum or Solana address.'
        }
    ),
    settings: z.record(z.string(), z.any()), // Flexible settings structure
    lastUpdated: z.number().optional() // Timestamp of last update
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

// Initialize database schema for user settings
export const initializeUserSettingsDatabase = async () => {
    console.log('Setting up user settings database schema with POSTGRES_URL_NON_POOLING:', !!process.env.POSTGRES_URL_NON_POOLING);

    // Connect to Neon database with direct connection on demand
    const db = createClient({
        connectionString: process.env.POSTGRES_URL_NON_POOLING,
    });

    try {
        console.log('Connecting to database...');
        await db.connect();

        // Create table for user settings if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_settings (
                wallet_address VARCHAR(44) PRIMARY KEY, -- Primary key is the wallet address
                settings JSONB NOT NULL DEFAULT '{}',    -- Settings stored as JSON
                last_updated BIGINT NOT NULL             -- Timestamp of last update
            );
        `);
        console.log('Created user_settings table');

        // Create index for faster lookups
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_user_settings_wallet 
            ON user_settings(wallet_address);
        `);
        console.log('Created index on user_settings');

        return { success: true };
    } catch (error) {
        console.error('Error setting up user settings database:', error);
        return { success: false, error };
    } finally {
        try {
            console.log('Closing database connection');
            await db.end();
        } catch (e) {
            console.error('Error closing database connection:', e);
        }
    }
};

// Get user settings by wallet address
export const getUserSettings = cache(async (walletAddress: string): Promise<UserSettings | null> => {
    try {
        if (!isValidWalletAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
        }

        const db = createClient({
            connectionString: process.env.POSTGRES_URL_NON_POOLING,
        });

        await db.connect();

        const result = await db.query(`
            SELECT wallet_address, settings, last_updated
            FROM user_settings
            WHERE wallet_address = $1
        `, [walletAddress]);

        await db.end();

        if (result.rows.length === 0) {
            return null;
        }

        return {
            walletAddress: result.rows[0].wallet_address,
            settings: result.rows[0].settings,
            lastUpdated: Number(result.rows[0].last_updated)
        };
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return null;
    }
});

// Save or update user settings
export const saveUserSettings = async (walletAddress: string, settings: Record<string, unknown>): Promise<boolean> => {
    try {
        if (!isValidWalletAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
        }

        const db = createClient({
            connectionString: process.env.POSTGRES_URL_NON_POOLING,
        });

        await db.connect();

        // Use UPSERT (INSERT ... ON CONFLICT UPDATE) to handle both insert and update cases
        await db.query(`
            INSERT INTO user_settings (wallet_address, settings, last_updated)
            VALUES ($1, $2, $3)
            ON CONFLICT (wallet_address)
            DO UPDATE SET 
                settings = $2,
                last_updated = $3
        `, [walletAddress, settings, Date.now()]);

        await db.end();
        return true;
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
};

// Update specific settings fields for a user
export const updateUserSettings = async (walletAddress: string, settingsUpdate: Record<string, unknown>): Promise<boolean> => {
    try {
        if (!isValidWalletAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
        }

        const db = createClient({
            connectionString: process.env.POSTGRES_URL_NON_POOLING,
        });

        await db.connect();

        // First check if user already has settings
        const result = await db.query(`
            SELECT settings FROM user_settings WHERE wallet_address = $1
        `, [walletAddress]);

        let existingSettings = {};
        if (result.rows.length > 0) {
            existingSettings = result.rows[0].settings;
        }

        // Merge existing settings with updates
        const updatedSettings = {
            ...existingSettings,
            ...settingsUpdate
        };

        // Save the merged settings
        await db.query(`
            INSERT INTO user_settings (wallet_address, settings, last_updated)
            VALUES ($1, $2, $3)
            ON CONFLICT (wallet_address)
            DO UPDATE SET 
                settings = $2,
                last_updated = $3
        `, [walletAddress, updatedSettings, Date.now()]);

        await db.end();
        return true;
    } catch (error) {
        console.error('Error updating user settings:', error);
        return false;
    }
};

// Delete user settings
export const deleteUserSettings = async (walletAddress: string): Promise<boolean> => {
    try {
        if (!isValidWalletAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
        }

        const db = createClient({
            connectionString: process.env.POSTGRES_URL_NON_POOLING,
        });

        await db.connect();

        await db.query(`
            DELETE FROM user_settings
            WHERE wallet_address = $1
        `, [walletAddress]);

        await db.end();
        return true;
    } catch (error) {
        console.error('Error deleting user settings:', error);
        return false;
    }
};
