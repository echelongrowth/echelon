import type { AssessmentAnswers } from "@/types/assessment";

export type PlanType = "free" | "pro";

export type IntelligenceReport = {
  marketPositioningSummary: string;
  strategicGaps: string[];
  roadmap30Days: string[];
  roadmap90Days: Array<{
    priority: number;
    action: string;
    impact: string;
  }>;
  skillRecommendations: string[];
  resumePositioningInsights: string;
  sideProjectSuggestions: string[];
};

export type FreeIntelligenceReport = Pick<
  IntelligenceReport,
  "marketPositioningSummary" | "strategicGaps" | "roadmap30Days"
>;

export type ScoreResult = {
  leverageScore: number;
  riskScore: number;
  leverageBreakdown: Record<string, number>;
  riskBreakdown: Record<string, number>;
};

export type GenerateIntelligenceRequest = {
  assessmentId: string;
};

export type GenerateIntelligenceResponse = {
  assessmentId: string;
  leverageScore: number;
  riskScore: number;
  planType: PlanType;
  intelligenceReport: IntelligenceReport | FreeIntelligenceReport;
};

export type ScoringInput = AssessmentAnswers;

