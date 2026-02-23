import type { AssessmentAnswers } from "@/types/assessment";
import type {
  FreeIntelligenceReport,
  IntelligenceReport,
  PlanType,
} from "@/types/intelligence";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRoadmap90Item(
  value: unknown
): value is IntelligenceReport["roadmap90Days"][number] {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.priority === "number" &&
    typeof candidate.action === "string" &&
    typeof candidate.impact === "string"
  );
}

function isIntelligenceReport(value: unknown): value is IntelligenceReport {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.marketPositioningSummary === "string" &&
    isStringArray(candidate.strategicGaps) &&
    isStringArray(candidate.roadmap30Days) &&
    Array.isArray(candidate.roadmap90Days) &&
    candidate.roadmap90Days.every(isRoadmap90Item) &&
    isStringArray(candidate.skillRecommendations) &&
    typeof candidate.resumePositioningInsights === "string" &&
    isStringArray(candidate.sideProjectSuggestions)
  );
}

function parseStrictReport(rawContent: string): IntelligenceReport {
  const parsed = JSON.parse(rawContent) as unknown;

  if (!isIntelligenceReport(parsed)) {
    throw new Error("AI response did not match required intelligence schema.");
  }

  return parsed;
}

export async function generateIntelligenceReport(params: {
  answers: AssessmentAnswers;
  leverageScore: number;
  riskScore: number;
  planType: PlanType;
}): Promise<IntelligenceReport> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "echelon_intelligence_report",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              marketPositioningSummary: { type: "string" },
              strategicGaps: { type: "array", items: { type: "string" } },
              roadmap30Days: { type: "array", items: { type: "string" } },
              roadmap90Days: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    priority: { type: "number" },
                    action: { type: "string" },
                    impact: { type: "string" },
                  },
                  required: ["priority", "action", "impact"],
                },
              },
              skillRecommendations: {
                type: "array",
                items: { type: "string" },
              },
              resumePositioningInsights: { type: "string" },
              sideProjectSuggestions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "marketPositioningSummary",
              "strategicGaps",
              "roadmap30Days",
              "roadmap90Days",
              "skillRecommendations",
              "resumePositioningInsights",
              "sideProjectSuggestions",
            ],
          },
        },
      },
      messages: [
        {
          role: "system",
          content: `You are a strategic career intelligence engine designed for high-agency professionals.

Your role is NOT to provide motivational advice.
Your role is to deliver market-aware, positioning-focused, executive-level analysis.

Guidelines:

- Be analytical, not inspirational.
- Focus on leverage, defensibility, positioning, and market forces.
- Identify structural risks, not emotional weaknesses.
- Avoid generic advice like "network more" or "keep learning."
- Provide direct, strategic language suitable for senior professionals.
- Frame recommendations in terms of asymmetric upside and downside risk.
- Highlight competitive differentiation gaps.
- Emphasize AI disruption exposure where relevant.
- Make recommendations actionable and prioritized.

Tone:
- Executive brief.
- Precise.
- Concise.
- No fluff.
- No career clichés.

If leverageScore < 50:
  Emphasize defensive repositioning and risk mitigation.

If leverageScore > 70:
  Emphasize asymmetric expansion and asset leverage.

If riskScore > 60:
  Clearly state risk horizon (short / medium / long term).

Always connect recommendations directly to leverageScore and riskScore.

Return ONLY valid JSON matching the schema.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            instruction:
              "Generate a strategic executive intelligence brief based strictly on the structured assessment profile and calculated leverage/risk scores. Identify structural positioning strengths, exposure risks, competitive gaps, and high-impact leverage moves. Avoid generic career advice.",
            planType: params.planType,
            leverageScore: params.leverageScore,
            riskScore: params.riskScore,
            answers: params.answers,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to generate intelligence report right now. Please try again."
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return parseStrictReport(content);
}

export function filterReportByPlan(
  report: IntelligenceReport,
  planType: PlanType
): IntelligenceReport | FreeIntelligenceReport {
  if (planType === "pro") {
    return report;
  }

  return {
    marketPositioningSummary: report.marketPositioningSummary,
    strategicGaps: report.strategicGaps.slice(0, 2),
    roadmap30Days: report.roadmap30Days.slice(0, 5),
  };
}