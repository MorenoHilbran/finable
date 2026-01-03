-- Migration: Add new fields to learning_modules and role to users
-- Run this in Supabase SQL Editor

-- Add new columns to learning_modules
ALTER TABLE learning_modules
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW (),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW (),
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add role column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for faster queries
CREATE
INDEX IF NOT EXISTS idx_learning_modules_is_published ON learning_modules (is_published);

CREATE
INDEX IF NOT EXISTS idx_learning_modules_category ON learning_modules (category);

CREATE INDEX IF NOT EXISTS idx_users_role ON users ( role );

-- RLS Policies for learning_modules (public read for published, admin write)
-- Enable RLS if not already enabled
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published modules
DROP POLICY IF EXISTS "Public can view published modules" ON learning_modules;

CREATE POLICY "Public can view published modules" ON learning_modules FOR
SELECT USING (is_published = true);

-- Allow admin to do everything
DROP POLICY IF EXISTS "Admin full access to modules" ON learning_modules;

CREATE POLICY "Admin full access to modules" ON learning_modules FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

-- After creating admin account via register, run this to set admin role:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@finable.com';