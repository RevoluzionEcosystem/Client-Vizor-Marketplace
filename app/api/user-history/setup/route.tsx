import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Create tables for user history storage
 */
export async function GET() {
  try {
    // Create crosschain swap history table
    await sql`
      CREATE TABLE IF NOT EXISTS crosschain_swap_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(44) NOT NULL,
        hash VARCHAR(66) NOT NULL,
        from_network VARCHAR(50) NOT NULL,
        to_network VARCHAR(50) NOT NULL,
        from_token JSONB NOT NULL,
        to_token JSONB NOT NULL,
        timestamp BIGINT NOT NULL,
        type VARCHAR(20) NOT NULL,
        provider VARCHAR(50),
        status VARCHAR(20) NOT NULL,
        amount VARCHAR(100),
        explorer_url TEXT,
        UNIQUE(wallet_address, hash)
      )
    `;

    // Create imported tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS imported_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(44) NOT NULL,
        network VARCHAR(50) NOT NULL,
        address VARCHAR(66) NOT NULL,
        symbol VARCHAR(30) NOT NULL,
        name VARCHAR(100) NOT NULL,
        decimals INT NOT NULL,
        logo_uri TEXT,
        timestamp BIGINT NOT NULL,
        UNIQUE(wallet_address, network, address)
      )
    `;

    // Create favorite tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS favorite_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(44) NOT NULL,
        network VARCHAR(50) NOT NULL,
        address VARCHAR(66) NOT NULL,
        symbol VARCHAR(30) NOT NULL,
        name VARCHAR(100) NOT NULL,
        decimals INT NOT NULL,
        logo_uri TEXT,
        tags JSONB,
        notes TEXT,
        timestamp BIGINT NOT NULL,
        UNIQUE(wallet_address, network, address)
      )
    `;

    // Create indexes for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_swap_history_wallet_address 
      ON crosschain_swap_history(wallet_address)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_imported_tokens_wallet_address 
      ON imported_tokens(wallet_address)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_favorite_tokens_wallet_address 
      ON favorite_tokens(wallet_address)
    `;

    return NextResponse.json({
      success: true,
      message: 'User history tables created successfully'
    });
  } catch (error) {
    console.error('Error creating user history tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user history tables',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
