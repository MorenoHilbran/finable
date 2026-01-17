-- =====================================================
-- Migration: Module Lessons with Hierarchical Structure
-- Run this in Supabase SQL Editor
-- =====================================================

-- Module Lessons Table
CREATE TABLE IF NOT EXISTS module_lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES learning_modules (module_id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES module_lessons (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW (),
    updated_at TIMESTAMPTZ DEFAULT NOW ()
);

-- Indexes
CREATE
INDEX IF NOT EXISTS idx_module_lessons_module_id ON module_lessons (module_id);

CREATE
INDEX IF NOT EXISTS idx_module_lessons_parent_id ON module_lessons (parent_id);

CREATE
INDEX IF NOT EXISTS idx_module_lessons_order ON module_lessons (module_id, order_index);

-- Enable RLS
ALTER TABLE module_lessons ENABLE ROW LEVEL SECURITY;

-- Public can view published lessons
CREATE POLICY "Public can view published lessons" ON module_lessons FOR
SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "Admin full access to lessons" ON module_lessons FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_module_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS module_lessons_updated_at ON module_lessons;

CREATE TRIGGER module_lessons_updated_at
    BEFORE UPDATE ON module_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_module_lessons_updated_at();