import { Pool, createPool } from '@vercel/postgres';

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

/**
 * Dedicated function to check if the USER_HISTORY database is connected and tables exist
 * Returns information about the connection status and available tables
 */
export const checkUserHistoryDbStatus = async () => {
    try {
        const pool = getUserHistoryPoolClient();

        // Test connection
        const connectionResult = await pool.query('SELECT NOW() as time');

        // Check for tables
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
        `);

        const tables = tablesResult.rows.map(row => row.table_name);
        const requiredTables = [
            'crosschain_swap_history',
            'imported_tokens',
            'favorite_tokens'
        ];

        const missingTables = requiredTables.filter(table => !tables.includes(table));

        return {
            connected: true,
            time: connectionResult.rows[0]?.time,
            tables,
            requiredTables,
            missingTables,
            tablesReady: missingTables.length === 0
        };
    } catch (error) {
        console.error('Error checking USER_HISTORY database status:', error);
        return {
            connected: false,
            error: error instanceof Error ? error.message : String(error),
            tables: [],
            requiredTables: ['crosschain_swap_history', 'imported_tokens', 'favorite_tokens'],
            missingTables: ['crosschain_swap_history', 'imported_tokens', 'favorite_tokens'],
            tablesReady: false
        };
    }
};

/**
 * UserHistoryDb Class
 * Responsible for managing operations related to user history database
 */
export class UserHistoryDb {
    private pool: Pool;

    constructor() {
        this.pool = getUserHistoryPoolClient();
    }

    /**
     * Initialize the user history database by creating necessary tables if they don't exist
     */
    async initializeDatabase() {
        try {
            // Create crosschain_swap_history table if it doesn't exist
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS crosschain_swap_history (
                    id SERIAL PRIMARY KEY,
                    wallet_address VARCHAR(255) NOT NULL,
                    from_chain VARCHAR(50) NOT NULL,
                    to_chain VARCHAR(50) NOT NULL,
                    from_token VARCHAR(255) NOT NULL,
                    to_token VARCHAR(255) NOT NULL,
                    amount NUMERIC NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    tx_hash VARCHAR(255) NOT NULL,
                    status VARCHAR(50) NOT NULL
                );
            `);

            // Create imported_tokens table if it doesn't exist
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS imported_tokens (
                    id SERIAL PRIMARY KEY,
                    wallet_address VARCHAR(255) NOT NULL,
                    chain_id VARCHAR(50) NOT NULL,
                    token_address VARCHAR(255) NOT NULL,
                    token_name VARCHAR(255) NOT NULL,
                    token_symbol VARCHAR(50) NOT NULL,
                    token_decimals INTEGER NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(wallet_address, chain_id, token_address)
                );
            `);

            // Create favorite_tokens table if it doesn't exist
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS favorite_tokens (
                    id SERIAL PRIMARY KEY,
                    wallet_address VARCHAR(255) NOT NULL,
                    chain_id VARCHAR(50) NOT NULL,
                    token_address VARCHAR(255) NOT NULL,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(wallet_address, chain_id, token_address)
                );
            `);

            // Get current tables status
            const status = await checkUserHistoryDbStatus();

            return {
                success: true,
                message: "User history database initialized successfully",
                tablesCreated: ['crosschain_swap_history', 'imported_tokens', 'favorite_tokens'],
                status
            };
        } catch (error) {
            console.error("Error initializing user history database:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                status: await checkUserHistoryDbStatus()
            };
        }
    }

    /**
     * Get user history records based on filter criteria
     */
    async getUserHistoryRecords({
        walletAddress,
        fromChain,
        toChain,
        limit = 100,
        offset = 0
    }: {
        walletAddress?: string;
        fromChain?: string;
        toChain?: string;
        limit?: number;
        offset?: number;
    }) {
        try {
            let queryParts = [`SELECT * FROM crosschain_swap_history WHERE 1=1`];
            const params: any[] = [];
            let paramIndex = 1;

            if (walletAddress) {
                queryParts.push(`AND wallet_address = $${paramIndex++}`);
                params.push(walletAddress);
            }

            if (fromChain) {
                queryParts.push(`AND from_chain = $${paramIndex++}`);
                params.push(fromChain);
            }

            if (toChain) {
                queryParts.push(`AND to_chain = $${paramIndex++}`);
                params.push(toChain);
            }

            queryParts.push(`ORDER BY timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`);
            params.push(limit, offset);

            const query = queryParts.join(' ');
            const result = await this.pool.query(query, params);

            return {
                success: true,
                records: result.rows,
                count: result.rowCount
            };
        } catch (error) {
            console.error("Error fetching user history records:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                records: [],
                count: 0
            };
        }
    }

    /**
     * Check if the database tables exist
     */
    async checkTables() {
        return checkUserHistoryDbStatus();
    }
}
