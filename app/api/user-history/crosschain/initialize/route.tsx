import { NextResponse } from 'next/server';
import { getUserHistoryPoolClient } from '@/lib/user-history-db';

/**
 * Initialize all the necessary tables for user history storage
 */
export async function GET() {
  try {
    console.log("Starting user history database initialization...");

    // Get connection pool using the centralized utility function
    const pool = getUserHistoryPoolClient();

    // Create crosschain swap history table
    await pool.query(`
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
    `);
    console.log("Created crosschain_swap_history table");

    // Create imported tokens table
    await pool.query(`
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
    `);
    console.log("Created imported_tokens table");

    // Create favorite tokens table
    await pool.query(`
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
    `);
    console.log("Created favorite_tokens table");

    // Create indices for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_swap_history_wallet_address 
      ON crosschain_swap_history(wallet_address)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_imported_tokens_wallet_address 
      ON imported_tokens(wallet_address)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_favorite_tokens_wallet_address 
      ON favorite_tokens(wallet_address)
    `);
    console.log("Created indices for all tables");

    // Test with a dummy record to verify tables exist
    try {
      const testTimestamp = Date.now();
      await pool.query(`
        INSERT INTO crosschain_swap_history (
          wallet_address, hash, from_network, to_network, 
          from_token, to_token, timestamp, type, status, amount
        ) VALUES (
          '0xTEST123', 
          '0xTEST_HASH', 
          'ETH', 
          'BSC', 
          '{"address":"0xtoken1","symbol":"TST1"}', 
          '{"address":"0xtoken2","symbol":"TST2"}', 
          ${testTimestamp}, 
          'SWAP', 
          'COMPLETED', 
          '1.0'
        )
        ON CONFLICT (wallet_address, hash) DO NOTHING
      `);
      console.log("Successfully inserted test record");

      // Verify we can read the test record
      const result = await pool.query(`
        SELECT * FROM crosschain_swap_history 
        WHERE wallet_address = '0xTEST123' 
        LIMIT 1
      `);
      console.log("Query result:", JSON.stringify(result.rows));
    } catch (insertError) {
      console.error("Error testing table:", insertError);
    }

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
