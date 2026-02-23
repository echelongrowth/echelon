export type SalaryBand =
  | "Under $75k"
  | "$75k-$100k"
  | "$100k-$150k"
  | "$150k-$200k"
  | "$200k+";

export type AIFamiliarity = "Beginner" | "Intermediate" | "Advanced";

export type CareerGoal =
  | "Promotion"
  | "Switch Role"
  | "Build Side Income"
  | "Launch Startup";

export type RiskTolerance = "Low" | "Medium" | "High";

export type EntrepreneurshipInterest = "Yes" | "No";

export type AssessmentAnswers = {
  profile: {
    currentRole: string;
    yearsOfExperience: number | "";
    industry: string;
    location: string;
    salaryBand: SalaryBand | "";
  };
  skills: {
    primarySkills: string;
    secondarySkills: string;
    aiFamiliarity: AIFamiliarity | "";
  };
  positioning: {
    careerGoal: CareerGoal | "";
    riskTolerance: RiskTolerance | "";
    entrepreneurshipInterest: EntrepreneurshipInterest | "";
  };
  selfEvaluation: {
    marketDifferentiation: number;
    leadershipVisibility: number;
    networkStrength: number;
    technicalRelevance: number;
  };
};

