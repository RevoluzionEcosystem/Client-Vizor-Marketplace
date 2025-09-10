import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserHistoryPool } from '../utils/db';
import { isValidWalletAddress } from '@/lib/history-utils';

// Define the favorite token schema
const FavoriteTokenSchema = z.object({
  walletAddress: z.string().refine(isValidWalletAddress, {
    message: 'Invalid wallet address format'
  }),
  network: z.string(),
  address: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  timestamp: z.number().optional()
});

/**
 * GET handler for retrieving favorite tokens
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
      SELECT * FROM favorite_tokens 
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

    // Execute query
    // Get the database pool
    const pool = getUserHistoryPool();
    
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
      tags: row.tags || [],
      notes: row.notes,
      timestamp: Number(row.timestamp)
    }));
    
    return NextResponse.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Error retrieving favorite tokens:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * POST handler for adding favorite token
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate token data
    const token = FavoriteTokenSchema.parse(body);
    
    // Set timestamp if not provided
    if (!token.timestamp) {
      token.timestamp = Date.now();
    }
    
    // Check if token already exists    // Get the database pool
    const pool = getUserHistoryPool();
    
    const existingToken = await pool.query(`
      SELECT id FROM favorite_tokens
      WHERE wallet_address = $1
      AND network = $2
      AND address = $3
    `, [token.walletAddress, token.network, token.address]);
      if (existingToken.rowCount > 0) {
      // Update existing token
      const result = await pool.query(`
        UPDATE favorite_tokens
        SET
          symbol = $1,
          name = $2,
          decimals = $3,
          logo_uri = $4,
          tags = $5,
          notes = $6,
          timestamp = $7
        WHERE wallet_address = $8
        AND network = $9
        AND address = $10
        RETURNING id
      `, [
          token.symbol,
          token.name,
          token.decimals,
          token.logoURI || null,
          token.tags ? JSON.stringify(token.tags) : null,
          token.notes || null,
          token.timestamp,
          token.walletAddress,
          token.network,
          token.address
      ]);
      
      return NextResponse.json({
        success: true,
        id: result.rows[0].id,
        updated: true
      });    } else {
      // Insert new token
      const result = await pool.query(`
        INSERT INTO favorite_tokens (
          wallet_address,
          network,
          address,
          symbol,
          name,
          decimals,
          logo_uri,
          tags,
          notes,
          timestamp
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
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
        token.tags ? JSON.stringify(token.tags) : null,
        token.notes || null,
        token.timestamp
      ]);
      
      return NextResponse.json({
        success: true,
        id: result.rows[0].id,
        created: true
      });
    }
  } catch (error) {
    console.error('Error saving favorite token:', error);
    
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
 * DELETE handler for removing favorite token
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
      );
    }    // Get the database pool
    const pool = getUserHistoryPool();

    // Delete the token
    await pool.query(`
      DELETE FROM favorite_tokens 
      WHERE wallet_address = $1
      AND address = $2
      AND network = $3
    `, [walletAddress, tokenAddress, network]);
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting favorite token:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
