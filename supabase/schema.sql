-- =====================================================
-- FINABLE DATABASE SCHEMA
-- Platform Edukasi Investasi Inklusif
-- =====================================================

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE
TYPE disability_type AS ENUM (
    'tunanetra',
    'tunarungu',
    'disabilitas_daksa',
    'disabilitas_kognitif'
);

CREATE
TYPE accessibility_profile AS ENUM (
    'high_contrast',
    'screen_reader',
    'dyslexic_friendly',
    'audio_learning',
    'sign_language',
    'reduced_motion'
);

CREATE
TYPE financial_level AS ENUM (
    'basic',
    'intermediate',
    'advanced'
);

CREATE
TYPE risk_profile AS ENUM (
    'conservative',
    'moderate',
    'aggressive'
);

CREATE
TYPE difficulty_level AS ENUM (
    'basic',
    'intermediate',
    'advanced'
);

CREATE
TYPE content_type AS ENUM (
    'text',
    'audio',
    'visual',
    'mixed'
);

CREATE
TYPE investment_type AS ENUM (
    'saham',
    'reksa_dana',
    'obligasi',
    'deposito'
);

-- =====================================================
-- TABLES
-- =====================================================
-- USERS: Core user data and accessibility profile
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    disability_type disability_type,
    accessibility_profile accessibility_profile [],
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- FINANCIAL_ASSESSMENT: User's financial literacy assessment
CREATE TABLE financial_assessment (
    assessment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    financial_level financial_level NOT NULL,
    risk_profile risk_profile NOT NULL,
    readiness_score INTEGER CHECK (
        readiness_score >= 0
        AND readiness_score <= 100
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- LEARNING_MODULES: Micro-learning content modules
CREATE TABLE learning_modules (
    module_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    difficulty_level difficulty_level NOT NULL,
    content_type content_type NOT NULL,
    description TEXT
);

-- USER_PROGRESS: Learning progress tracking (many-to-many)
CREATE TABLE user_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES learning_modules (module_id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    progress_percentage INTEGER DEFAULT 0 CHECK (
        progress_percentage >= 0
        AND progress_percentage <= 100
    ),
    updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW (),
        UNIQUE (user_id, module_id)
);

-- OWI_CHAT_HISTORY: AI assistant conversation history
CREATE TABLE owi_chat_history (
    chat_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    owi_response TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- INVESTMENT_SIMULATION: Educational investment simulations
CREATE TABLE investment_simulation (
    simulation_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    investment_type investment_type NOT NULL,
    monthly_amount DECIMAL(15, 2) NOT NULL,
    duration_month INTEGER NOT NULL CHECK (duration_month > 0),
    estimated_return DECIMAL(15, 2),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW ()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE
INDEX idx_users_email ON users (email);

CREATE
INDEX idx_users_disability_type ON users (disability_type);

CREATE
INDEX idx_financial_assessment_user ON financial_assessment (user_id);

CREATE
INDEX idx_user_progress_user ON user_progress (user_id);

CREATE
INDEX idx_user_progress_module ON user_progress (module_id);

CREATE
INDEX idx_owi_chat_user ON owi_chat_history (user_id);

CREATE
INDEX idx_owi_chat_created ON owi_chat_history (created_at);

CREATE
INDEX idx_investment_sim_user ON investment_simulation (user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- Enable for Supabase Auth integration
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE financial_assessment ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE owi_chat_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE investment_simulation ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users FOR
SELECT USING (auth.uid ()::text = email);

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE USING (auth.uid ()::text = email);

-- Financial assessments - users can manage their own
CREATE POLICY "Users can view own assessments" ON financial_assessment FOR
SELECT USING (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                email = auth.uid ()::text
        )
    );

CREATE POLICY "Users can create own assessments" ON financial_assessment FOR
INSERT
WITH
    CHECK (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                email = auth.uid ()::text
        )
    );

-- Learning modules - public read access
CREATE POLICY "Anyone can view learning modules" ON learning_modules FOR
SELECT USING (true);

-- User progress - users can manage their own
CREATE POLICY "Users can view own progress" ON user_progress FOR ALL USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            email = auth.uid ()::text
    )
);

-- Chat history - users can manage their own
CREATE POLICY "Users can manage own chat history" ON owi_chat_history FOR ALL USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            email = auth.uid ()::text
    )
);

-- Investment simulations - users can manage their own
CREATE POLICY "Users can manage own simulations" ON investment_simulation FOR ALL USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            email = auth.uid ()::text
    )
);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Insert sample learning modules
INSERT INTO
    learning_modules (
        title,
        difficulty_level,
        content_type,
        description
    )
VALUES (
        'Pengenalan Investasi',
        'basic',
        'mixed',
        'Modul dasar tentang apa itu investasi dan mengapa penting untuk masa depan finansial.'
    ),
    (
        'Mengenal Reksa Dana',
        'basic',
        'text',
        'Pelajari dasar-dasar reksa dana sebagai instrumen investasi pemula.'
    ),
    (
        'Analisis Risiko Investasi',
        'intermediate',
        'visual',
        'Cara menganalisis risiko berbagai instrumen investasi.'
    ),
    (
        'Strategi Diversifikasi',
        'intermediate',
        'mixed',
        'Teknik diversifikasi portofolio untuk meminimalkan risiko.'
    ),
    (
        'Analisis Fundamental Saham',
        'advanced',
        'text',
        'Cara menganalisis laporan keuangan perusahaan untuk investasi saham.'
    ),
    (
        'Perencanaan Pensiun',
        'intermediate',
        'audio',
        'Panduan merencanakan investasi untuk masa pensiun.'
    );