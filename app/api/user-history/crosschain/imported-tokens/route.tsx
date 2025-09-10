import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserHistoryPoolClient } from '@/lib/user-history-db';
import { isValidWalletAddress } from '@/lib/history-utils';

// Define the imported token schema
const ImportedTokenSchema = z.object({
    walletAddress: z.string().refine(isValidWalletAddress, {
        message: 'Invalid wallet address format'
    }),
    network: z.string(),
    address: z.string(),
    symbol: z.string(),
    name: z.string(),
    decimals: z.number(),
    logoURI: z.string().optional(),
    timestamp: z.number().optional()
});

/**
 * GET handler for retrieving imported tokens
 */
export async function GET(request: Request) {
    try {
        // Parse URL and get search params
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('walletAddress');
        const network = searchParams.get('network');

        // Validate wallet address
        if (!walletAddress || !isValidWalletAddress(walletAddress)) {
            return NextResponse.json(
                { success: false, error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        // Build query based on params
        let query = `
      SELECT * FROM imported_tokens 
      WHERE wallet_address = $1
    `;

        const queryParams = [walletAddress];

        // Add network filter if provided
        if (network) {
            query += ` AND network = $2`;
            queryParams.push(network);
        }        
        // Add sorting by timestamp
        query += ` ORDER BY timestamp DESC`;        
        // Get the database pool
        const pool = getUserHistoryPoolClient();

        // Execute query
        const result = await pool.query(query, queryParams);

        // Transform database rows to token objects
        const tokens = result.rows.map(row => ({
            id: row.id,
            walletAddress: row.wallet_address,
            network: row.network,
            address: row.address,
            symbol: row.symbol,
            name: row.name,
            decimals: row.decimals,
            logoURI: row.logo_uri,
            timestamp: Number(row.timestamp)
        }));

        return NextResponse.json({
            success: true,
            data: tokens
        });
    } catch (error) {
        console.error('Error retrieving imported tokens:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST handler for adding imported token
 */
export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate token data
        const token = ImportedTokenSchema.parse(body);        // Set timestamp if not provided
        if (!token.timestamp) {
            token.timestamp = Date.now();
        }
        
        // Get the database pool
        const pool = getUserHistoryPoolClient();
        
        // Check if token already exists
        const existingToken = await pool.query(`
      SELECT id FROM imported_tokens
      WHERE wallet_address = $1
      AND network = $2
      AND address = $3
    `, [token.walletAddress, token.network, token.address]);

        if (existingToken.rowCount > 0) {            // Update existing token
            const result = await pool.query(`
        UPDATE imported_tokens
        SET
          symbol = $1,
          name = $2,
          decimals = $3,
          logo_uri = $4,
          timestamp = $5
        WHERE wallet_address = $6
        AND network = $7
        AND address = $8
        RETURNING id
      `, [token.symbol, token.name, token.decimals, token.logoURI || null, token.timestamp, token.walletAddress, token.network, token.address]);

            return NextResponse.json({
                success: true,
                id: result.rows[0].id,
                updated: true
            });
        } else {            // Insert new token
            const result = await pool.query(`
        INSERT INTO imported_tokens (
          wallet_address,
          network,
          address,
          symbol,
          name,
          decimals,
          logo_uri,
          timestamp
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING id
      `, [
          token.walletAddress,
          token.network,
          token.address,
          token.symbol,
          token.name,
          token.decimals,
          token.logoURI || null,
          token.timestamp
        ]);

            return NextResponse.json({
                success: true,
                id: result.rows[0].id,
                created: true
            });
        }
    } catch (error) {
        console.error('Error saving imported token:', error);

        // Check for validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE handler for removing imported token
 */
export async function DELETE(request: Request) {
    try {
        // Parse URL and get search params
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('walletAddress');
        const tokenAddress = searchParams.get('tokenAddress');
        const network = searchParams.get('network');

        // Validate parameters
        if (!walletAddress || !isValidWalletAddress(walletAddress)) {
            return NextResponse.json(
                { success: false, error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        if (!tokenAddress || !network) {
            return NextResponse.json(
                { success: false, error: 'Token address and network are required' },
                { status: 400 }
            );        }
        
        // Get the database pool
        const pool = getUserHistoryPoolClient();
        
        // Delete the token
        await pool.query(`
      DELETE FROM imported_tokens 
      WHERE wallet_address = $1
      AND address = $2
      AND network = $3
    `, [walletAddress, tokenAddress, network]);

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('Error deleting imported token:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
