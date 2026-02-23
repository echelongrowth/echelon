export type SideProjectRevenuePotential = "Low" | "Moderate" | "High";
export type SideProjectExecutionComplexity = "Low" | "Medium" | "High";

export type StrategicSideProject = {
  title: string;
  strategicObjective: string;
  marketOpportunity: string;
  idealCustomerProfile: string;
  businessImpact: string;
  monetizationAngle: string;
  competitiveDifferentiation: string;
  aiIntegrationAngle: string;
  executionRoadmap: string;
  estimatedTimeline: string;
  skillsStrengthened: string[];
  resumeBulletExample: string;
  revenuePotential: SideProjectRevenuePotential;
  executionComplexity: SideProjectExecutionComplexity;
  riskAssessment: string;
};

export type StrategicSideProjectResponse = {
  projects: StrategicSideProject[];
};

export type SideProjectsUnavailableResponse = {
  feature_available: false;
  feature_unavailable_reason: string;
};

export type SideProjectsLimitResponse = {
  feature_available: true;
  regeneration_blocked: true;
  message: string;
};

export type SideProjectsSuccessResponse = {
  feature_available: true;
  regeneration_blocked: false;
  analysis_id: string | null;
  projects: StrategicSideProject[];
  generations_used_last_30_days: number;
};

export type SideProjectsApiResponse =
  | SideProjectsUnavailableResponse
  | SideProjectsLimitResponse
  | SideProjectsSuccessResponse;
