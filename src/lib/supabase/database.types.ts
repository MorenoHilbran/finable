/**
 * Database Types for Finable
 * Based on ERD from README.md
 * 
 * To generate types automatically from your Supabase project:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DisabilityType =
  | "tunanetra"
  | "tunarungu"
  | "disabilitas_daksa"
  | "disabilitas_kognitif";

export type AccessibilityProfile =
  | "high_contrast"
  | "screen_reader"
  | "dyslexic_friendly"
  | "audio_learning"
  | "sign_language"
  | "reduced_motion";

export type FinancialLevel = "basic" | "intermediate" | "advanced";
export type RiskProfile = "conservative" | "moderate" | "aggressive";
export type DifficultyLevel = "basic" | "intermediate" | "advanced";
export type ContentType = "text" | "audio" | "visual" | "mixed";
export type InvestmentType = "saham" | "reksa_dana" | "obligasi" | "deposito";
export type UserRole = "user" | "admin";

export interface Database {
  public: {
    Tables: {
      // Master Data Tables
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          icon: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          icon?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          icon?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      difficulty_levels: {
        Row: {
          id: number;
          code: string;
          name: string;
          color_class: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          color_class?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          color_class?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      duration_units: {
        Row: {
          id: number;
          code: string;
          name: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      content_types: {
        Row: {
          id: number;
          code: string;
          name: string;
          icon: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          icon?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          icon?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      // Core Tables
      users: {
        Row: {
          user_id: number;
          auth_id: string;
          full_name: string;
          email: string;
          disability_type: DisabilityType | null;
          accessibility_profile: AccessibilityProfile[] | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          user_id?: number;
          auth_id: string;
          full_name: string;
          email: string;
          disability_type?: DisabilityType | null;
          accessibility_profile?: AccessibilityProfile[] | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          auth_id?: string;
          full_name?: string;
          email?: string;
          disability_type?: DisabilityType | null;
          accessibility_profile?: AccessibilityProfile[] | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      financial_assessment: {
        Row: {
          assessment_id: number;
          user_id: number;
          financial_level: FinancialLevel;
          risk_profile: RiskProfile;
          readiness_score: number;
          created_at: string;
        };
        Insert: {
          assessment_id?: number;
          user_id: number;
          financial_level: FinancialLevel;
          risk_profile: RiskProfile;
          readiness_score: number;
          created_at?: string;
        };
        Update: {
          assessment_id?: number;
          user_id?: number;
          financial_level?: FinancialLevel;
          risk_profile?: RiskProfile;
          readiness_score?: number;
          created_at?: string;
        };
      };
      learning_modules: {
        Row: {
          module_id: number;
          title: string;
          // Legacy ENUM fields (kept for backward compatibility)
          difficulty_level: DifficultyLevel;
          content_type: ContentType;
          description: string;
          thumbnail_url: string | null;
          category: string | null;
          duration: string | null;
          content: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          order_index: number;
          // New foreign key fields
          category_id: number | null;
          difficulty_level_id: number | null;
          content_type_id: number | null;
          duration_value: number | null;
          duration_unit_id: number | null;
        };
        Insert: {
          module_id?: number;
          title: string;
          difficulty_level: DifficultyLevel;
          content_type: ContentType;
          description: string;
          thumbnail_url?: string | null;
          category?: string | null;
          duration?: string | null;
          content?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          order_index?: number;
          category_id?: number | null;
          difficulty_level_id?: number | null;
          content_type_id?: number | null;
          duration_value?: number | null;
          duration_unit_id?: number | null;
        };
        Update: {
          module_id?: number;
          title?: string;
          difficulty_level?: DifficultyLevel;
          content_type?: ContentType;
          description?: string;
          thumbnail_url?: string | null;
          category?: string | null;
          duration?: string | null;
          content?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          order_index?: number;
          category_id?: number | null;
          difficulty_level_id?: number | null;
          content_type_id?: number | null;
          duration_value?: number | null;
          duration_unit_id?: number | null;
        };
      };
      user_progress: {
        Row: {
          progress_id: number;
          user_id: number;
          module_id: number;
          completed: boolean;
          progress_percentage: number;
          updated_at: string;
        };
        Insert: {
          progress_id?: number;
          user_id: number;
          module_id: number;
          completed?: boolean;
          progress_percentage?: number;
          updated_at?: string;
        };
        Update: {
          progress_id?: number;
          user_id?: number;
          module_id?: number;
          completed?: boolean;
          progress_percentage?: number;
          updated_at?: string;
        };
      };
      owi_chat_history: {
        Row: {
          chat_id: number;
          user_id: number;
          user_message: string;
          owi_response: string;
          created_at: string;
        };
        Insert: {
          chat_id?: number;
          user_id: number;
          user_message: string;
          owi_response: string;
          created_at?: string;
        };
        Update: {
          chat_id?: number;
          user_id?: number;
          user_message?: string;
          owi_response?: string;
          created_at?: string;
        };
      };
      investment_simulation: {
        Row: {
          simulation_id: number;
          user_id: number;
          investment_type: InvestmentType;
          monthly_amount: number;
          duration_month: number;
          estimated_return: number;
          created_at: string;
        };
        Insert: {
          simulation_id?: number;
          user_id: number;
          investment_type: InvestmentType;
          monthly_amount: number;
          duration_month: number;
          estimated_return: number;
          created_at?: string;
        };
        Update: {
          simulation_id?: number;
          user_id?: number;
          investment_type?: InvestmentType;
          monthly_amount?: number;
          duration_month?: number;
          estimated_return?: number;
          created_at?: string;
        };
      };
      module_lessons: {
        Row: {
          id: number;
          module_id: number;
          parent_id: number | null;
          title: string;
          content: string | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          module_id: number;
          parent_id?: number | null;
          title: string;
          content?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          module_id?: number;
          parent_id?: number | null;
          title?: string;
          content?: string | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_enrollments: {
        Row: {
          id: number;
          user_id: number;
          module_id: number;
          enrolled_at: string;
          last_accessed_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          module_id: number;
          enrolled_at?: string;
          last_accessed_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          module_id?: number;
          enrolled_at?: string;
          last_accessed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      disability_type: DisabilityType;
      accessibility_profile: AccessibilityProfile;
      financial_level: FinancialLevel;
      risk_profile: RiskProfile;
      difficulty_level: DifficultyLevel;
      content_type: ContentType;
      investment_type: InvestmentType;
      user_role: UserRole;
    };
  };
}

// Helper types for easier usage
export type User = Database["public"]["Tables"]["users"]["Row"];
export type FinancialAssessment = Database["public"]["Tables"]["financial_assessment"]["Row"];
export type LearningModule = Database["public"]["Tables"]["learning_modules"]["Row"];
export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];
export type OwiChatHistory = Database["public"]["Tables"]["owi_chat_history"]["Row"];
export type InvestmentSimulation = Database["public"]["Tables"]["investment_simulation"]["Row"];

// Master Data Types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type DifficultyLevelData = Database["public"]["Tables"]["difficulty_levels"]["Row"];
export type DurationUnit = Database["public"]["Tables"]["duration_units"]["Row"];
export type ContentTypeData = Database["public"]["Tables"]["content_types"]["Row"];

// Extended LearningModule with joined master data
export interface LearningModuleWithRelations extends LearningModule {
  categories?: Category | null;
  difficulty_levels?: DifficultyLevelData | null;
  content_types?: ContentTypeData | null;
  duration_units?: DurationUnit | null;
}

// Master Data collection type
export interface MasterData {
  categories: Category[];
  difficultyLevels: DifficultyLevelData[];
  durationUnits: DurationUnit[];
  contentTypes: ContentTypeData[];
}

// Module Lesson types
export interface ModuleLesson {
  id: number;
  module_id: number;
  parent_id: number | null;
  title: string;
  content: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleLessonInsert {
  module_id: number;
  parent_id?: number | null;
  title: string;
  content?: string | null;
  order_index?: number;
  is_published?: boolean;
}

export interface ModuleLessonUpdate {
  title?: string;
  content?: string | null;
  order_index?: number;
  is_published?: boolean;
  parent_id?: number | null;
}

// Lesson with children for tree structure
export interface ModuleLessonWithChildren extends ModuleLesson {
  children?: ModuleLessonWithChildren[];
}

// User Enrollment types
export interface UserEnrollment {
  id: number;
  user_id: number;
  module_id: number;
  enrolled_at: string;
  last_accessed_at: string;
}

export interface UserEnrollmentInsert {
  user_id: number;
  module_id: number;
}

export interface UserEnrollmentWithModule extends UserEnrollment {
  learning_modules?: LearningModule;
}

// User Lesson Progress types
export interface UserLessonProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface UserLessonProgressInsert {
  user_id: number;
  lesson_id: number;
  is_completed?: boolean;
}
