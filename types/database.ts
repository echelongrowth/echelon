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
