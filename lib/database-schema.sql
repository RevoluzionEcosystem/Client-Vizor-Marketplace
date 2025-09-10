-- Investment Insights Database Schema
-- Web3 Whales V3 - Simplified Investment Tracking

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    network VARCHAR(100) NOT NULL,
    project_address VARCHAR(255) NOT NULL,
    token_amount DECIMAL(20, 8),
    total_value DECIMAL(15, 2),
    token_price DECIMAL(15, 8),
    info TEXT, -- Project information/notes
    project_type VARCHAR(50) NOT NULL DEFAULT 'Other', -- DeFi, Nodes, GameFi, etc.
    is_launched BOOLEAN NOT NULL DEFAULT false, -- Whether project is launched
    vesting_info TEXT, -- Token vesting information
    investment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- When investment was made
    added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255), -- For future user support
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for dashboard preferences
CREATE TABLE IF NOT EXISTS investment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) DEFAULT 'default',
    default_sort_by VARCHAR(50) DEFAULT 'added_date',
    default_sort_order VARCHAR(10) DEFAULT 'desc',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_added_date ON investments(added_date);
CREATE INDEX IF NOT EXISTS idx_investments_project_name ON investments(project_name);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON investments(symbol);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist before creating
DROP TRIGGER IF EXISTS update_investments_updated_at ON investments;
DROP TRIGGER IF EXISTS update_investment_settings_updated_at ON investment_settings;

CREATE TRIGGER update_investments_updated_at 
    BEFORE UPDATE ON investments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_settings_updated_at 
    BEFORE UPDATE ON investment_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO investment_settings (user_id, default_sort_by, default_sort_order)
VALUES ('default', 'added_date', 'desc')
ON CONFLICT (user_id) DO NOTHING;

-- Add new columns if they don't exist (for existing databases)
ALTER TABLE investments ADD COLUMN IF NOT EXISTS info TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS project_type VARCHAR(50) DEFAULT 'Other';
ALTER TABLE investments ADD COLUMN IF NOT EXISTS is_launched BOOLEAN DEFAULT false;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS vesting_info TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS investment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE investments ADD COLUMN IF NOT EXISTS added_date TIMESTAMP WITH TIME ZONE DEFAULT created_at;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT updated_at;
