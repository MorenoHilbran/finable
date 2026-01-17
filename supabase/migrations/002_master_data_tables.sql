-- =====================================================
-- Migration: Master Data Tables for Learning Modules
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- MASTER DATA TABLES
-- =====================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW ()
);

-- Difficulty Levels Table
CREATE TABLE IF NOT EXISTS difficulty_levels (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    color_class VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW ()
);

-- Duration Units Table
CREATE TABLE IF NOT EXISTS duration_units (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW ()
);

-- Content Types Table
CREATE TABLE IF NOT EXISTS content_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW ()
);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Categories
INSERT INTO
    categories (
        name,
        description,
        icon,
        order_index
    )
VALUES (
        'Cryptocurrency',
        'Pembelajaran tentang mata uang kripto dan blockchain',
        '₿',
        1
    ),
    (
        'Saham',
        'Investasi saham dan analisis fundamental/teknikal',
        '📈',
        2
    ),
    (
        'Emas',
        'Investasi emas dan logam mulia',
        '🥇',
        3
    ),
    (
        'Reksa Dana',
        'Diversifikasi investasi melalui reksa dana',
        '📊',
        4
    ),
    (
        'Obligasi',
        'Surat utang dan fixed income instruments',
        '📃',
        5
    ),
    (
        'Properti',
        'Investasi real estate dan properti',
        '🏠',
        6
    ) ON CONFLICT (name) DO NOTHING;

-- Insert Difficulty Levels
INSERT INTO
    difficulty_levels (
        code,
        name,
        color_class,
        order_index
    )
VALUES (
        'basic',
        'Pemula',
        'bg-green-100 text-green-700',
        1
    ),
    (
        'intermediate',
        'Menengah',
        'bg-yellow-100 text-yellow-700',
        2
    ),
    (
        'advanced',
        'Lanjutan',
        'bg-red-100 text-red-700',
        3
    ) ON CONFLICT (code) DO NOTHING;

-- Insert Duration Units
INSERT INTO
    duration_units (code, name, order_index)
VALUES ('minutes', 'Menit', 1),
    ('hours', 'Jam', 2),
    ('days', 'Hari', 3),
    ('weeks', 'Minggu', 4),
    ('months', 'Bulan', 5) ON CONFLICT (code) DO NOTHING;

-- Insert Content Types
INSERT INTO
    content_types (code, name, icon, order_index)
VALUES ('text', 'Teks', '📝', 1),
    ('audio', 'Audio', '🔊', 2),
    ('visual', 'Visual', '🎬', 3),
    ('mixed', 'Campuran', '📚', 4) ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- UPDATE learning_modules TABLE
-- =====================================================

-- Add new foreign key columns
ALTER TABLE learning_modules
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories (id),
ADD COLUMN IF NOT EXISTS difficulty_level_id INTEGER REFERENCES difficulty_levels (id),
ADD COLUMN IF NOT EXISTS content_type_id INTEGER REFERENCES content_types (id),
ADD COLUMN IF NOT EXISTS duration_value INTEGER,
ADD COLUMN IF NOT EXISTS duration_unit_id INTEGER REFERENCES duration_units (id);

-- =====================================================
-- MIGRATE EXISTING DATA
-- =====================================================

-- Migrate category data (match existing category text to new table)
UPDATE learning_modules lm
SET
    category_id = c.id
FROM categories c
WHERE
    lm.category = c.name
    AND lm.category_id IS NULL;

-- Migrate difficulty_level data
UPDATE learning_modules lm
SET
    difficulty_level_id = dl.id
FROM difficulty_levels dl
WHERE
    lm.difficulty_level::text = dl.code
    AND lm.difficulty_level_id IS NULL;

-- Migrate content_type data
UPDATE learning_modules lm
SET
    content_type_id = ct.id
FROM content_types ct
WHERE
    lm.content_type::text = ct.code
    AND lm.content_type_id IS NULL;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE
INDEX IF NOT EXISTS idx_categories_is_active ON categories (is_active);

CREATE
INDEX IF NOT EXISTS idx_difficulty_levels_is_active ON difficulty_levels (is_active);

CREATE
INDEX IF NOT EXISTS idx_duration_units_is_active ON duration_units (is_active);

CREATE
INDEX IF NOT EXISTS idx_content_types_is_active ON content_types (is_active);

CREATE
INDEX IF NOT EXISTS idx_learning_modules_category_id ON learning_modules (category_id);

CREATE
INDEX IF NOT EXISTS idx_learning_modules_difficulty_level_id ON learning_modules (difficulty_level_id);

CREATE
INDEX IF NOT EXISTS idx_learning_modules_content_type_id ON learning_modules (content_type_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on master data tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE difficulty_levels ENABLE ROW LEVEL SECURITY;

ALTER TABLE duration_units ENABLE ROW LEVEL SECURITY;

ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;

-- Public read access for master data
CREATE POLICY "Public can view active categories" ON categories FOR
SELECT USING (is_active = true);

CREATE POLICY "Public can view active difficulty levels" ON difficulty_levels FOR
SELECT USING (is_active = true);

CREATE POLICY "Public can view active duration units" ON duration_units FOR
SELECT USING (is_active = true);

CREATE POLICY "Public can view active content types" ON content_types FOR
SELECT USING (is_active = true);

-- Admin full access to master data
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

CREATE POLICY "Admin full access to difficulty levels" ON difficulty_levels FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

CREATE POLICY "Admin full access to duration units" ON duration_units FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

CREATE POLICY "Admin full access to content types" ON content_types FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);