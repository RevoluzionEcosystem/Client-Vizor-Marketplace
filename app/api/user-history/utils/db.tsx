import { NextResponse } from 'next/server';
import { getUserHistoryPoolClient } from '@/lib/user-history-db';

/**
 * Create an initialized pool for the USER_HISTORY database
 * This function can be imported and used by all user-history API routes
 * It delegates to the centralized implementation in lib/user-history-db.tsx
 */
export const getUserHistoryPool = getUserHistoryPoolClient;

export async function GET() {
    try {
        const pool = getUserHistoryPool();
        const result = await pool.query(`SELECT NOW() as time`);

        return NextResponse.json({
            success: true,
            message: 'USER_HISTORY database is connected',
            time: result.rows[0]?.time,
            details: "This helper endpoint provides connection pooling for the USER_HISTORY database"
        });
    } catch (error) {
        console.error("Error connecting to USER_HISTORY database:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to connect to USER_HISTORY database",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
