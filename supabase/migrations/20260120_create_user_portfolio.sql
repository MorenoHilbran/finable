-- Migration: Create user_portfolio table
-- This table stores user investment portfolio data

CREATE TABLE IF NOT EXISTS user_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    asset_id VARCHAR(50) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (
        type IN (
            'gold',
            'stock',
            'crypto',
            'mutual-fund'
        )
    ),
    purchase_date DATE,
    quantity DECIMAL(20, 8) NOT NULL DEFAULT 0,
    purchase_price DECIMAL(20, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'unit',
    notes TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- Create index for faster queries by user
CREATE INDEX idx_user_portfolio_user_id ON user_portfolio (user_id);

CREATE INDEX idx_user_portfolio_type ON user_portfolio(type);

-- Enable Row Level Security
ALTER TABLE user_portfolio ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see and modify their own portfolio
CREATE POLICY "Users can view own portfolio" ON user_portfolio FOR
SELECT USING (
        user_id = (
            SELECT user_id
            FROM users
            WHERE
                auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can insert own portfolio" ON user_portfolio FOR
INSERT
WITH
    CHECK (
        user_id = (
            SELECT user_id
            FROM users
            WHERE
                auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can update own portfolio" ON user_portfolio FOR
UPDATE USING (
    user_id = (
        SELECT user_id
        FROM users
        WHERE
            auth_id = auth.uid ()
    )
);

CREATE POLICY "Users can delete own portfolio" ON user_portfolio FOR
DELETE USING (
    user_id = (
        SELECT user_id
        FROM users
        WHERE
            auth_id = auth.uid ()
    )
);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on row changes
CREATE TRIGGER trigger_user_portfolio_updated_at
  BEFORE UPDATE ON user_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_updated_at();