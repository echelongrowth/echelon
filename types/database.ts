export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string;
          user_id: string;
          answers: Json;
          version_number: number;
          is_active: boolean;
          leverage_score: number | null;
          risk_score: number | null;
          intelligence_report: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          answers: Json;
          version_number?: number;
          is_active?: boolean;
          leverage_score?: number | null;
          risk_score?: number | null;
          intelligence_report?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          answers?: Json;
          version_number?: number;
          is_active?: boolean;
          leverage_score?: number | null;
          risk_score?: number | null;
          intelligence_report?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      resume_analyses: {
        Row: {
          id: string;
          user_id: string;
          resume_text: string;
          analysis_json: Json;
          executive_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_text: string;
          analysis_json: Json;
          executive_score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_text?: string;
          analysis_json?: Json;
          executive_score?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      resume_execution_tasks: {
        Row: {
          id: string;
          analysis_id: string;
          user_id: string;
          task_id: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          user_id: string;
          task_id: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          user_id?: string;
          task_id?: string;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      side_projects: {
        Row: {
          id: string;
          user_id: string;
          analysis_id: string | null;
          career_goal: string | null;
          generated_at: string;
          projects_json: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          analysis_id?: string | null;
          career_goal?: string | null;
          generated_at?: string;
          projects_json: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          analysis_id?: string | null;
          career_goal?: string | null;
          generated_at?: string;
          projects_json?: Json;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          plan: "free" | "pro" | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: "free" | "pro" | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          plan?: "free" | "pro" | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_resume_analysis_with_tasks: {
        Args: {
          p_resume_text: string;
          p_analysis_json: Json;
          p_executive_score: number;
          p_tasks: Json;
        };
        Returns: string;
      };
      count_side_projects_last_30_days: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      recalibrate_assessment: {
        Args: {
          p_previous_assessment_id: string | null;
          p_answers: Json;
          p_leverage_score: number;
          p_risk_score: number;
          p_intelligence_report: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
