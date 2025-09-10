import { NextResponse } from 'next/server';
import { getUserHistoryPoolClient } from '@/lib/user-history-db';

/**
 * Verify that the user history tables exist in the database
 * using the USER_HISTORY branch
 */
export async function GET() {
    try {
        // Get connection pool using the centralized utility function
        const pool = getUserHistoryPoolClient();
        // Query PostgreSQL catalog to get all tables
        const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('crosschain_swap_history', 'imported_tokens', 'favorite_tokens')
      ORDER BY table_name;
    `);

        const tables = result.rows.map(row => row.table_name);
        const allTablesExist =
            tables.includes('crosschain_swap_history') &&
            tables.includes('imported_tokens') &&
            tables.includes('favorite_tokens'); if (allTablesExist) {
                return NextResponse.json({
                    success: true,
                    message: 'All required tables exist in USER_HISTORY branch',
                    tables,
                    databaseBranch: 'USER_HISTORY'
                });
            } else {
            const missingTables = ['crosschain_swap_history', 'imported_tokens', 'favorite_tokens']
                .filter(t => !tables.includes(t));

            return NextResponse.json({
                success: false,
                message: 'Some tables are missing in USER_HISTORY branch',
                tables,
                missingTables,
            });
        }
    } catch (error) {
        console.error('Error verifying tables:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to verify tables',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
