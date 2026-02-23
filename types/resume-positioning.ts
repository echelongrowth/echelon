export type PositioningTier =
  | "Weak"
  | "Developing"
  | "Competitive"
  | "Strong"
  | "Elite";

export type GapSeverity = "Low" | "Medium" | "High";

export type ResumeAnalysis = {
  executive_positioning_score: number;
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
  strategic_summary: string;
};

export type ResumeAnalysisActionState = {
  ok: boolean;
  error: string | null;
  analysis: ResumeAnalysis | null;
};

