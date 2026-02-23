import type { AssessmentAnswers, SalaryBand } from "@/types/assessment";
import type { ScoreResult } from "@/types/intelligence";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function countSkills(text: string): number {
  return text
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean).length;
}

function mapSalaryPressure(salaryBand: SalaryBand | ""): number {
  const pressureByBand: Record<SalaryBand, number> = {
    "Under $75k": 20,
    "$75k-$100k": 35,
    "$100k-$150k": 55,
    "$150k-$200k": 75,
    "$200k+": 90,
  };

  return salaryBand ? pressureByBand[salaryBand] : 50;
}

function experienceSignal(years: number): number {
  if (years <= 2) return 35;
  if (years <= 5) return 55;
  if (years <= 10) return 75;
  return 90;
}

function aiSignal(level: AssessmentAnswers["skills"]["aiFamiliarity"]): number {
  if (level === "Beginner") return 30;
  if (level === "Intermediate") return 65;
  if (level === "Advanced") return 90;
  return 40;
}

function riskToleranceSignal(
  riskTolerance: AssessmentAnswers["positioning"]["riskTolerance"]
): number {
  if (riskTolerance === "Low") return 40;
  if (riskTolerance === "Medium") return 60;
  if (riskTolerance === "High") return 80;
  return 55;
}

function startupInterestSignal(
  interest: AssessmentAnswers["positioning"]["entrepreneurshipInterest"]
): number {
  if (interest === "Yes") return 75;
  if (interest === "No") return 45;
  return 50;
}

function skillStrengthSignal(answers: AssessmentAnswers): number {
  const primaryCount = countSkills(answers.skills.primarySkills);
  const secondaryCount = countSkills(answers.skills.secondarySkills);
  const weightedCount = primaryCount * 1.8 + secondaryCount;

  return clamp(20 + weightedCount * 8);
}

function roundScore(value: number): number {
  return Math.round(clamp(value));
}

export function calculateLeverageScore(answers: AssessmentAnswers): {
  score: number;
  breakdown: Record<string, number>;
} {
  // Deterministic weighted model:
  // Higher experience, AI capability, skill depth, and visibility increase leverage.
  const experience = experienceSignal(Number(answers.profile.yearsOfExperience) || 0);
  const ai = aiSignal(answers.skills.aiFamiliarity);
  const skills = skillStrengthSignal(answers);
  const leadership = clamp(answers.selfEvaluation.leadershipVisibility * 10);
  const riskTolerance = riskToleranceSignal(answers.positioning.riskTolerance);
  const startupInterest = startupInterestSignal(
    answers.positioning.entrepreneurshipInterest
  );

  const weightedScore =
    experience * 0.2 +
    ai * 0.2 +
    skills * 0.2 +
    leadership * 0.2 +
    riskTolerance * 0.1 +
    startupInterest * 0.1;

  return {
    score: roundScore(weightedScore),
    breakdown: {
      experience,
      ai,
      skills,
      leadership,
      riskTolerance,
      startupInterest,
    },
  };
}

export function calculateRiskScore(
  answers: AssessmentAnswers,
  leverageScore: number
): {
  score: number;
  breakdown: Record<string, number>;
} {
  // Deterministic weighted model:
  // Risk rises with low AI readiness, weak differentiation/technical relevance,
  // and high compensation expectations not matched by leverage.
  const aiRisk = 100 - aiSignal(answers.skills.aiFamiliarity);
  const differentiationRisk = 100 - clamp(answers.selfEvaluation.marketDifferentiation * 10);
  const technicalRisk = 100 - clamp(answers.selfEvaluation.technicalRelevance * 10);
  const salaryPressure = mapSalaryPressure(answers.profile.salaryBand);
  const salaryMismatchRisk = clamp(10 + (salaryPressure - leverageScore) * 1.5);

  const weightedScore =
    aiRisk * 0.3 +
    differentiationRisk * 0.25 +
    salaryMismatchRisk * 0.25 +
    technicalRisk * 0.2;

  return {
    score: roundScore(weightedScore),
    breakdown: {
      aiRisk,
      differentiationRisk,
      salaryMismatchRisk,
      technicalRisk,
    },
  };
}

export function calculateScores(answers: AssessmentAnswers): ScoreResult {
  const leverage = calculateLeverageScore(answers);
  const risk = calculateRiskScore(answers, leverage.score);

  return {
    leverageScore: leverage.score,
    riskScore: risk.score,
    leverageBreakdown: leverage.breakdown,
    riskBreakdown: risk.breakdown,
  };
}

