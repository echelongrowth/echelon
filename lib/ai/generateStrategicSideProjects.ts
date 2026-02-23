import type { StrategicSideProjectResponse } from "@/types/side-projects";

type SideProjectInput = {
  analysis_json: unknown;
  user_profile: {
    full_name: string | null;
    plan: "free" | "pro" | null;
  };
  career_goal: string;
  industry: string;
  current_role: string;
  years_experience: number;
  skill_stack: string[];
  skill_gaps: string[];
  ai_readiness_level: string;
  risk_leverage_index: number;
  market_exposure: number;
};

const SYSTEM_PROMPT = `You are a venture strategist, startup advisor, and executive career architect.

Your role is to generate strategic, capital-efficient, AI-leveraged side projects
for high-performing professionals with entrepreneurial intent.

This is NOT an idea generation task.
This is a strategic advisory output.

OBJECTIVE

Generate 3 strategic side projects that:

Strengthen long-term independence

Increase leadership positioning

Expand monetization capability

Leverage AI structurally

Are executable within 3–6 months

Do NOT require institutional funding

Align tightly with user's industry

MANDATORY STRATEGIC LAYERS

For EACH project include:

Strategic alignment

Market opportunity logic

Ideal customer profile

Monetization pathway

Competitive differentiation

Structural AI leverage

Execution roadmap

Resume positioning impact

Risk framing

STRICT CONSTRAINTS

No hobby projects

No blogging/content-only ideas

No vague consulting suggestions

No generic SaaS ideas

No high-capital startup concepts

No unrealistic scale projections

Tone:
Executive.
Analytical.
Structured.
Concise.
No emojis.
No casual language.

OUTPUT FORMAT (STRICT JSON ONLY)

{
"projects": [
{
"title": "",
"strategicObjective": "",
"marketOpportunity": "",
"idealCustomerProfile": "",
"businessImpact": "",
"monetizationAngle": "",
"competitiveDifferentiation": "",
"aiIntegrationAngle": "",
"executionRoadmap": "",
"estimatedTimeline": "",
"skillsStrengthened": [],
"resumeBulletExample": "",
"revenuePotential": "Low | Moderate | High",
"executionComplexity": "Low | Medium | High",
"riskAssessment": ""
}
]
}

Return valid JSON only.`;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isProject(value: unknown): value is StrategicSideProjectResponse["projects"][number] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === "string" &&
    typeof candidate.strategicObjective === "string" &&
    typeof candidate.marketOpportunity === "string" &&
    typeof candidate.idealCustomerProfile === "string" &&
    typeof candidate.businessImpact === "string" &&
    typeof candidate.monetizationAngle === "string" &&
    typeof candidate.competitiveDifferentiation === "string" &&
    typeof candidate.aiIntegrationAngle === "string" &&
    typeof candidate.executionRoadmap === "string" &&
    typeof candidate.estimatedTimeline === "string" &&
    isStringArray(candidate.skillsStrengthened) &&
    typeof candidate.resumeBulletExample === "string" &&
    (candidate.revenuePotential === "Low" ||
      candidate.revenuePotential === "Moderate" ||
      candidate.revenuePotential === "High") &&
    (candidate.executionComplexity === "Low" ||
      candidate.executionComplexity === "Medium" ||
      candidate.executionComplexity === "High") &&
    typeof candidate.riskAssessment === "string"
  );
}

function isStrategicSideProjectResponse(
  value: unknown
): value is StrategicSideProjectResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.projects) &&
    candidate.projects.length === 3 &&
    candidate.projects.every(isProject)
  );
}

export async function generateStrategicSideProjects(
  input: SideProjectInput
): Promise<StrategicSideProjectResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
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
            name: "strategic_side_projects",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                projects: {
                  type: "array",
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      title: { type: "string" },
                      strategicObjective: { type: "string" },
                      marketOpportunity: { type: "string" },
                      idealCustomerProfile: { type: "string" },
                      businessImpact: { type: "string" },
                      monetizationAngle: { type: "string" },
                      competitiveDifferentiation: { type: "string" },
                      aiIntegrationAngle: { type: "string" },
                      executionRoadmap: { type: "string" },
                      estimatedTimeline: { type: "string" },
                      skillsStrengthened: {
                        type: "array",
                        items: { type: "string" },
                      },
                      resumeBulletExample: { type: "string" },
                      revenuePotential: {
                        type: "string",
                        enum: ["Low", "Moderate", "High"],
                      },
                      executionComplexity: {
                        type: "string",
                        enum: ["Low", "Medium", "High"],
                      },
                      riskAssessment: { type: "string" },
                    },
                    required: [
                      "title",
                      "strategicObjective",
                      "marketOpportunity",
                      "idealCustomerProfile",
                      "businessImpact",
                      "monetizationAngle",
                      "competitiveDifferentiation",
                      "aiIntegrationAngle",
                      "executionRoadmap",
                      "estimatedTimeline",
                      "skillsStrengthened",
                      "resumeBulletExample",
                      "revenuePotential",
                      "executionComplexity",
                      "riskAssessment",
                    ],
                  },
                },
              },
              required: ["projects"],
            },
          },
        },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to generate strategic side-project analysis right now.");
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    const parsed = JSON.parse(content) as unknown;
    if (!isStrategicSideProjectResponse(parsed)) {
      throw new Error("AI response did not match required side-project schema.");
    }

    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}
