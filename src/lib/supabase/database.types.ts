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

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number;
          auth_id: string;
          full_name: string;
          email: string;
          disability_type: DisabilityType | null;
          accessibility_profile: AccessibilityProfile[] | null;
          created_at: string;
        };
        Insert: {
          user_id?: number;
          auth_id: string;
          full_name: string;
          email: string;
          disability_type?: DisabilityType | null;
          accessibility_profile?: AccessibilityProfile[] | null;
          created_at?: string;
        };
        Update: {
          user_id?: number;
          auth_id?: string;
          full_name?: string;
          email?: string;
          disability_type?: DisabilityType | null;
          accessibility_profile?: AccessibilityProfile[] | null;
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
          difficulty_level: DifficultyLevel;
          content_type: ContentType;
          description: string;
        };
        Insert: {
          module_id?: number;
          title: string;
          difficulty_level: DifficultyLevel;
          content_type: ContentType;
          description: string;
        };
        Update: {
          module_id?: number;
          title?: string;
          difficulty_level?: DifficultyLevel;
          content_type?: ContentType;
          description?: string;
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
