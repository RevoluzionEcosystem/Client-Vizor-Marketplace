import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserHistoryPool } from '../utils/db';
import { isValidWalletAddress } from '@/lib/history-utils';

// Define the transaction schema
const TransactionSchema = z.object({
    walletAddress: z.string().refine(isValidWalletAddress, {
        message: 'Invalid wallet address format'
    }),
    hash: z.string(),
    fromNetwork: z.string(),
    toNetwork: z.string(),
    fromToken: z.object({
        symbol: z.string(),
        address: z.string(),
        image: z.string().optional()
    }),
    toToken: z.object({
        symbol: z.string(),
        address: z.string(),
        image: z.string().optional()
    }),
    timestamp: z.number().optional(),
    type: z.enum(['on-chain', 'cross-chain']),
    provider: z.string().optional(),
    status: z.enum(['pending', 'success', 'failed']),
    amount: z.string().optional(),
    explorerUrl: z.string().optional()
});

/**
 * GET handler for retrieving swap history
 */
export async function GET(request: Request) {
    try {
        // Parse URL and get search params
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('walletAddress');
        const limit = searchParams.get('limit') ?? '50';
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
      SELECT * FROM crosschain_swap_history 
      WHERE wallet_address = $1
    `;

        const queryParams = [walletAddress];

        // Add network filter if provided
        if (network) {
            query += ` AND (from_network = $2 OR to_network = $2)`;
            queryParams.push(network);
        }

        // Add sorting and limit
        query += ` ORDER BY timestamp DESC LIMIT $${queryParams.length + 1}`;
        queryParams.push(parseInt(limit, 10).toString());        
        // Get the database pool
        const pool = getUserHistoryPool();

        // Execute query
        const result = await pool.query(query, queryParams);

        // Transform database rows to transaction objects
        const transactions = result.rows.map(row => ({
            id: row.id,
            walletAddress: row.wallet_address,
            hash: row.hash,
            fromNetwork: row.from_network,
            toNetwork: row.to_network,
            fromToken: row.from_token,
            toToken: row.to_token,
            timestamp: Number(row.timestamp),
            type: row.type,
            provider: row.provider,
            status: row.status,
            amount: row.amount,
            explorerUrl: row.explorer_url
        }));

        return NextResponse.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Error retrieving swap history:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST handler for adding swap history
 */
export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate transaction data
        const transaction = TransactionSchema.parse(body);        
        // Set timestamp if not provided
        if (!transaction.timestamp) {
            transaction.timestamp = Date.now();
        }

        const pool = getUserHistoryPool();

        // Insert transaction into the database with proper parameterized query
        const result = await pool.query(
            `INSERT INTO crosschain_swap_history (
                wallet_address,
                hash,
                from_network,
                to_network,
                from_token,
                to_token,
                timestamp,
                type,
                provider,
                status,
                amount,
                explorer_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id`,
            [
                transaction.walletAddress,
                transaction.hash,
                transaction.fromNetwork,
                transaction.toNetwork,
                JSON.stringify(transaction.fromToken),
                JSON.stringify(transaction.toToken),
                transaction.timestamp,
                transaction.type,
                transaction.provider || null,
                transaction.status,
                transaction.amount || null,
                transaction.explorerUrl || null
            ]
        );

        return NextResponse.json({
            success: true,
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Error saving swap transaction:', error);

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
 * DELETE handler for removing swap history
 */
export async function DELETE(request: Request) {
    try {
        // Parse URL and get search params
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('walletAddress');
        const hash = searchParams.get('hash');
        const all = searchParams.get('all') === 'true';

        // Validate wallet address
        if (!walletAddress || !isValidWalletAddress(walletAddress)) {
            return NextResponse.json(
                { success: false, error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        // Get the database pool
        const pool = getUserHistoryPool();

        if (all) {
            // Delete all history for this wallet
            await pool.query(`
        DELETE FROM crosschain_swap_history 
        WHERE wallet_address = $1
      `, [walletAddress]);
        } else if (hash) {
            // Delete specific transaction by hash
            await pool.query(`
        DELETE FROM crosschain_swap_history 
        WHERE wallet_address = $1 
        AND hash = $2
      `, [walletAddress, hash]);
        } else {
            return NextResponse.json(
                { success: false, error: 'Either hash or all parameter is required' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('Error deleting swap history:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
