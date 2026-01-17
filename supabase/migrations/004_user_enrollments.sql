-- =====================================================
-- Migration: User Enrollments and Lesson Progress
-- Run this in Supabase SQL Editor
-- =====================================================

-- User Enrollments Table - Track which classes users have enrolled in
CREATE TABLE IF NOT EXISTS user_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES learning_modules (module_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW (),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW (),
    UNIQUE (user_id, module_id)
);

-- User Lesson Progress Table - Track progress per lesson
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES module_lessons (id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW (),
    UNIQUE (user_id, lesson_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE
INDEX IF NOT EXISTS idx_user_enrollments_user_id ON user_enrollments (user_id);

CREATE
INDEX IF NOT EXISTS idx_user_enrollments_module_id ON user_enrollments (module_id);

CREATE
INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress (user_id);

CREATE
INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress (lesson_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- User Enrollments policies
CREATE POLICY "Users can view own enrollments" ON user_enrollments FOR
SELECT USING (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                users.auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can enroll themselves" ON user_enrollments FOR
INSERT
WITH
    CHECK (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                users.auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can update own enrollments" ON user_enrollments FOR
UPDATE USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            users.auth_id = auth.uid ()
    )
);

CREATE POLICY "Users can delete own enrollments" ON user_enrollments FOR
DELETE USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            users.auth_id = auth.uid ()
    )
);

-- User Lesson Progress policies
CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress FOR
SELECT USING (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                users.auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can create own lesson progress" ON user_lesson_progress FOR
INSERT
WITH
    CHECK (
        user_id IN (
            SELECT user_id
            FROM users
            WHERE
                users.auth_id = auth.uid ()
        )
    );

CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress FOR
UPDATE USING (
    user_id IN (
        SELECT user_id
        FROM users
        WHERE
            users.auth_id = auth.uid ()
    )
);

-- Admin full access
CREATE POLICY "Admin full access to enrollments" ON user_enrollments FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);

CREATE POLICY "Admin full access to lesson progress" ON user_lesson_progress FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.auth_id = auth.uid ()
            AND users.role = 'admin'
    )
);