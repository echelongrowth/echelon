export type PositioningTier =
  | "Weak"
  | "Developing"
  | "Competitive"
  | "Strong"
  | "Elite";

export type GapSeverity = "Low" | "Medium" | "High";

export type ResumeAnalysis = {
  executive_positioning_score: number;
  ai_readiness_score: number;
  positioning_tier: PositioningTier;
  strengths: string[];
  critical_gaps: Array<{
    title: string;
    severity: GapSeverity;
    analysis: string;
  }>;
  dimension_scores: {
    strategic_ownership: number;
    leadership_visibility: number;
    business_impact: number;
    market_differentiation: number;
    narrative_clarity: number;
    executive_presence: number;
  };
  promotion_alignment: {
    current_level_fit: string;
    next_level_readiness_percentage: number;
    readiness_gap_summary: string;
  };
  compensation_leverage_outlook: {
    positioning_band: string;
    leverage_assessment: string;
  };
  strategic_rewrite_samples: Array<{
    original_pattern: string;
    executive_rewrite: string;
  }>;
  tactical_execution_priorities: Array<{
    id: string;
    title: string;
    strategic_objective: string;
    impact_level: "High" | "Medium" | "Low";
  }>;
  strategic_summary: string;
};

export type FreeResumeAnalysis = {
  executive_positioning_score: number;
  ai_readiness_score: number;
  positioning_tier: PositioningTier;
  strengths: string[];
  critical_gaps: Array<{
    title: string;
    severity: GapSeverity;
    analysis: string;
  }>;
  tactical_execution_priorities: Array<{
    id: string;
    title: string;
    strategic_objective: string;
    impact_level: "High" | "Medium" | "Low";
  }>;
};

export type ResumeAnalysisActionState = {
  ok: boolean;
  error: string | null;
  analysis: ResumeAnalysis | FreeResumeAnalysis | null;
  analysisId: string | null;
};
