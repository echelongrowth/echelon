"use server";

import { createHash } from "crypto";
import { getPlanTypeForUser } from "@/lib/plan";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Json } from "@/types/database";
import type { PlanType } from "@/types/intelligence";
import type {
  FreeResumeAnalysis,
  ResumeAnalysis,
  ResumeAnalysisActionState,
} from "@/types/resume-positioning";

const SYSTEM_PROMPT = `
You are a Strategic Career Positioning Intelligence Engine.

Audience: Executive recruiters, hiring committees, and compensation decision-makers.

Purpose:
Generate structured executive-level resume positioning analysis suitable for a consulting-grade strategic report.

You do not provide conversational responses.
You do not provide coaching language.
You do not provide encouragement.
You do not provide motivational phrasing.
You do not use first-person language.
You do not use second-person language.
You do not explain reasoning.
You do not include disclaimers.
You do not output markdown.

Tone Requirements:
- Analytical
- Executive
- Precise
- Structured
- Objective
- Consulting-grade
- Neutral and data-oriented

Language Restrictions:
Disallowed phrases include but are not limited to:
- "I think"
- "You should"
- "Based on your resume"
- "It seems"
- "Consider"
- "Recommend"
- "Try to"
- Any assistant-style commentary

Scoring Integrity Rules:
- All scores must be integers between 0 and 100.
- Scores must reflect realistic distribution.
- Avoid inflated scoring.
- If resume evidence is weak, scores must reflect weakness.
- Do not fabricate achievements or metrics.

Tier Mapping:
0-39 = Weak
40-54 = Developing
55-69 = Competitive
70-84 = Strong
85-100 = Elite

Analysis Dimensions:
1. Strategic Ownership Signaling
2. Leadership Visibility
3. Business Impact Quantification
4. Market Differentiation
5. Narrative Clarity
6. Executive Presence Framing

Output Rules:
Return ONLY valid JSON.
No markdown.
No extra text.
No prefix.
No suffix.
No explanations.

Return JSON in this exact structure:

{
  "executive_positioning_score": number,
  "ai_readiness_score": number,
  "positioning_tier": "Weak | Developing | Competitive | Strong | Elite",
  "strengths": ["string"],
  "critical_gaps": [
    {
      "title": "string",
      "severity": "Low | Medium | High",
      "analysis": "string"
    }
  ],
  "dimension_scores": {
    "strategic_ownership": number,
    "leadership_visibility": number,
    "business_impact": number,
    "market_differentiation": number,
    "narrative_clarity": number,
    "executive_presence": number
  },
  "promotion_alignment": {
    "current_level_fit": "string",
    "next_level_readiness_percentage": number,
    "readiness_gap_summary": "string"
  },
  "compensation_leverage_outlook": {
    "positioning_band": "string",
    "leverage_assessment": "string"
  },
  "strategic_rewrite_samples": [
    {
      "original_pattern": "string",
      "executive_rewrite": "string"
    }
  ],
  "tactical_execution_priorities": [
    {
      "id": "uuid-like string",
      "title": "string",
      "strategic_objective": "string",
      "impact_level": "High | Medium | Low"
    }
  ],
  "strategic_summary": "4-6 sentence executive analytical summary."
}
`;

const INITIAL_STATE: ResumeAnalysisActionState = {
  ok: false,
  error: null,
  analysis: null,
  analysisId: null,
};

function toInitialState(error: string): ResumeAnalysisActionState {
  return {
    ...INITIAL_STATE,
    error,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDimensionScores(
  value: unknown
): value is ResumeAnalysis["dimension_scores"] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.strategic_ownership === "number" &&
    typeof candidate.leadership_visibility === "number" &&
    typeof candidate.business_impact === "number" &&
    typeof candidate.market_differentiation === "number" &&
    typeof candidate.narrative_clarity === "number" &&
    typeof candidate.executive_presence === "number"
  );
}

function isCriticalGap(
  value: unknown
): value is ResumeAnalysis["critical_gaps"][number] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === "string" &&
    (candidate.severity === "Low" ||
      candidate.severity === "Medium" ||
      candidate.severity === "High") &&
    typeof candidate.analysis === "string"
  );
}

function isRewriteSample(
  value: unknown
): value is ResumeAnalysis["strategic_rewrite_samples"][number] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.original_pattern === "string" &&
    typeof candidate.executive_rewrite === "string"
  );
}

function isTacticalPriority(
  value: unknown
): value is ResumeAnalysis["tactical_execution_priorities"][number] {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.strategic_objective === "string" &&
    (candidate.impact_level === "High" ||
      candidate.impact_level === "Medium" ||
      candidate.impact_level === "Low")
  );
}

function isResumeAnalysis(value: unknown): value is ResumeAnalysis {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  if (!candidate.promotion_alignment || typeof candidate.promotion_alignment !== "object") {
    return false;
  }

  if (
    !candidate.compensation_leverage_outlook ||
    typeof candidate.compensation_leverage_outlook !== "object"
  ) {
    return false;
  }

  const promotion = candidate.promotion_alignment as Record<string, unknown>;
  const compensation = candidate.compensation_leverage_outlook as Record<string, unknown>;

  return (
    typeof candidate.executive_positioning_score === "number" &&
    typeof candidate.ai_readiness_score === "number" &&
    ["Weak", "Developing", "Competitive", "Strong", "Elite"].includes(
      String(candidate.positioning_tier)
    ) &&
    isStringArray(candidate.strengths) &&
    Array.isArray(candidate.critical_gaps) &&
    candidate.critical_gaps.every(isCriticalGap) &&
    isDimensionScores(candidate.dimension_scores) &&
    typeof promotion.current_level_fit === "string" &&
    typeof promotion.next_level_readiness_percentage === "number" &&
    typeof promotion.readiness_gap_summary === "string" &&
    typeof compensation.positioning_band === "string" &&
    typeof compensation.leverage_assessment === "string" &&
    Array.isArray(candidate.strategic_rewrite_samples) &&
    candidate.strategic_rewrite_samples.every(isRewriteSample) &&
    Array.isArray(candidate.tactical_execution_priorities) &&
    candidate.tactical_execution_priorities.every(isTacticalPriority) &&
    typeof candidate.strategic_summary === "string"
  );
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toDeterministicTaskId(seed: string, index: number): string {
  const digest = createHash("sha1")
    .update(`${seed}:${index}`)
    .digest("hex")
    .slice(0, 32);

  return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-${digest.slice(
    12,
    16
  )}-${digest.slice(16, 20)}-${digest.slice(20, 32)}`;
}

function normalizeTacticalPriorities(
  priorities: ResumeAnalysis["tactical_execution_priorities"]
): ResumeAnalysis["tactical_execution_priorities"] {
  return priorities.map((item, index) => {
    const baseSeed = `${item.title}:${item.strategic_objective}:${item.impact_level}`;
    const deterministicId = toDeterministicTaskId(baseSeed, index);

    return {
      id: deterministicId,
      title: normalizeWhitespace(item.title),
      strategic_objective: normalizeWhitespace(item.strategic_objective),
      impact_level: item.impact_level,
    };
  });
}

function toFreeAnalysis(analysis: ResumeAnalysis): FreeResumeAnalysis {
  return {
    executive_positioning_score: analysis.executive_positioning_score,
    ai_readiness_score: analysis.ai_readiness_score,
    positioning_tier: analysis.positioning_tier,
    strengths: analysis.strengths.slice(0, 3),
    critical_gaps: analysis.critical_gaps.slice(0, 2),
    tactical_execution_priorities: analysis.tactical_execution_priorities.slice(0, 2),
  };
}

function extractPdfText(binaryText: string): string {
  const matches = binaryText.match(/\((?:\\.|[^\\()])*\)\s*Tj/g) ?? [];
  const chunks = matches
    .map((segment) => segment.replace(/\)\s*Tj$/, "").replace(/^\(/, ""))
    .map((segment) => segment.replace(/\\n/g, " ").replace(/\\r/g, " "))
    .map((segment) => segment.replace(/\\\(/g, "(").replace(/\\\)/g, ")"))
    .map((segment) => segment.replace(/\\([0-7]{1,3})/g, " "))
    .map((segment) => normalizeWhitespace(segment))
    .filter(Boolean);

  return normalizeWhitespace(chunks.join(" "));
}

async function resolveResumeText(formData: FormData): Promise<string> {
  const rawText = String(formData.get("resumeText") ?? "");
  const pastedText = normalizeWhitespace(rawText);
  if (pastedText) return pastedText;

  const uploadedFile = formData.get("resumeFile");
  if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
    throw new Error("Provide resume text or upload a PDF file.");
  }

  if (uploadedFile.type !== "application/pdf") {
    throw new Error("Only PDF files are supported for upload.");
  }

  const bytes = Buffer.from(await uploadedFile.arrayBuffer());
  const parsedText = extractPdfText(bytes.toString("latin1"));

  if (!parsedText) {
    throw new Error(
      "Unable to extract text from PDF. Paste resume text for accurate analysis."
    );
  }

  return parsedText;
}

async function getAuthorizedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const tablePlan = profile?.plan;
  const derivedPlan =
    tablePlan === "pro" || tablePlan === "free"
      ? tablePlan
      : getPlanTypeForUser(user);

  return { supabase, user, planType: derivedPlan as PlanType };
}

async function requestAnalysisFromOpenAI(resumeText: string): Promise<ResumeAnalysis> {
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
          name: "resume_positioning_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              executive_positioning_score: { type: "number" },
              ai_readiness_score: { type: "number" },
              positioning_tier: {
                type: "string",
                enum: ["Weak", "Developing", "Competitive", "Strong", "Elite"],
              },
              strengths: { type: "array", items: { type: "string" } },
              critical_gaps: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    severity: { type: "string", enum: ["Low", "Medium", "High"] },
                    analysis: { type: "string" },
                  },
                  required: ["title", "severity", "analysis"],
                },
              },
              dimension_scores: {
                type: "object",
                additionalProperties: false,
                properties: {
                  strategic_ownership: { type: "number" },
                  leadership_visibility: { type: "number" },
                  business_impact: { type: "number" },
                  market_differentiation: { type: "number" },
                  narrative_clarity: { type: "number" },
                  executive_presence: { type: "number" },
                },
                required: [
                  "strategic_ownership",
                  "leadership_visibility",
                  "business_impact",
                  "market_differentiation",
                  "narrative_clarity",
                  "executive_presence",
                ],
              },
              promotion_alignment: {
                type: "object",
                additionalProperties: false,
                properties: {
                  current_level_fit: { type: "string" },
                  next_level_readiness_percentage: { type: "number" },
                  readiness_gap_summary: { type: "string" },
                },
                required: [
                  "current_level_fit",
                  "next_level_readiness_percentage",
                  "readiness_gap_summary",
                ],
              },
              compensation_leverage_outlook: {
                type: "object",
                additionalProperties: false,
                properties: {
                  positioning_band: { type: "string" },
                  leverage_assessment: { type: "string" },
                },
                required: ["positioning_band", "leverage_assessment"],
              },
              strategic_rewrite_samples: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    original_pattern: { type: "string" },
                    executive_rewrite: { type: "string" },
                  },
                  required: ["original_pattern", "executive_rewrite"],
                },
              },
              tactical_execution_priorities: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    strategic_objective: { type: "string" },
                    impact_level: {
                      type: "string",
                      enum: ["High", "Medium", "Low"],
                    },
                  },
                  required: ["id", "title", "strategic_objective", "impact_level"],
                },
              },
              strategic_summary: { type: "string" },
            },
            required: [
              "executive_positioning_score",
              "ai_readiness_score",
              "positioning_tier",
              "strengths",
              "critical_gaps",
              "dimension_scores",
              "promotion_alignment",
              "compensation_leverage_outlook",
              "strategic_rewrite_samples",
              "tactical_execution_priorities",
              "strategic_summary",
            ],
          },
        },
      },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify({
            instruction:
              "Analyze this resume for executive positioning quality and return strict JSON only.",
            resume_text: resumeText,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to generate resume intelligence right now. Please try again."
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = JSON.parse(content) as unknown;
  if (!isResumeAnalysis(parsed)) {
    throw new Error("AI response did not match required resume schema.");
  }

  const normalizedPriorities = normalizeTacticalPriorities(
    parsed.tactical_execution_priorities
  );

  return {
    ...parsed,
    executive_positioning_score: clampScore(parsed.executive_positioning_score),
    ai_readiness_score: clampScore(parsed.ai_readiness_score),
    dimension_scores: {
      strategic_ownership: clampScore(parsed.dimension_scores.strategic_ownership),
      leadership_visibility: clampScore(parsed.dimension_scores.leadership_visibility),
      business_impact: clampScore(parsed.dimension_scores.business_impact),
      market_differentiation: clampScore(parsed.dimension_scores.market_differentiation),
      narrative_clarity: clampScore(parsed.dimension_scores.narrative_clarity),
      executive_presence: clampScore(parsed.dimension_scores.executive_presence),
    },
    promotion_alignment: {
      ...parsed.promotion_alignment,
      next_level_readiness_percentage: clampScore(
        parsed.promotion_alignment.next_level_readiness_percentage
      ),
    },
    tactical_execution_priorities: normalizedPriorities,
  };
}

export async function analyzeResume(
  resumeText: string
): Promise<{ analysis: ResumeAnalysis | FreeResumeAnalysis; analysisId: string }> {
  const normalizedText = normalizeWhitespace(resumeText);
  if (!normalizedText) {
    throw new Error("Resume text is required.");
  }

  const { supabase, user, planType } = await getAuthorizedUser();
  const fullAnalysis = await requestAnalysisFromOpenAI(normalizedText);

  if (planType === "free") {
    const freeAnalysis = toFreeAnalysis(fullAnalysis);

    // Free plan keeps only latest analysis and no execution task persistence.
    const { data: existingAnalyses, error: readError } = await supabase
      .from("resume_analyses")
      .select("id")
      .eq("user_id", user.id);

    if (readError) {
      throw new Error("Unable to prepare resume analysis storage.");
    }

    const existingIds = (existingAnalyses ?? []).map((row) => row.id);
    if (existingIds.length) {
      const { error: taskDeleteError } = await supabase
        .from("resume_execution_tasks")
        .delete()
        .eq("user_id", user.id);
      if (taskDeleteError) {
        throw new Error("Unable to reset previous execution data.");
      }

      const { error: analysisDeleteError } = await supabase
        .from("resume_analyses")
        .delete()
        .eq("user_id", user.id);
      if (analysisDeleteError) {
        throw new Error("Unable to reset previous analysis data.");
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from("resume_analyses")
      .insert({
        user_id: user.id,
        resume_text: normalizedText,
        analysis_json: freeAnalysis as unknown as Json,
        executive_score: freeAnalysis.executive_positioning_score,
      })
      .select("id")
      .single();

    if (insertError || !inserted?.id) {
      throw new Error("Unable to save resume analysis.");
    }

    return {
      analysis: freeAnalysis,
      analysisId: inserted.id,
    };
  }

  const { data: analysisId, error } = await supabase.rpc(
    "create_resume_analysis_with_tasks",
    {
      p_resume_text: normalizedText,
      p_analysis_json: fullAnalysis as unknown as Json,
      p_executive_score: fullAnalysis.executive_positioning_score,
      p_tasks: fullAnalysis.tactical_execution_priorities as unknown as Json,
    }
  );

  if (error || !analysisId) {
    throw new Error("Unable to save resume analysis.");
  }

  return {
    analysis: fullAnalysis,
    analysisId,
  };
}

export async function analyzeResumeSubmission(
  _previousState: ResumeAnalysisActionState,
  formData: FormData
): Promise<ResumeAnalysisActionState> {
  try {
    const resumeText = await resolveResumeText(formData);
    const { analysis, analysisId } = await analyzeResume(resumeText);

    return {
      ok: true,
      error: null,
      analysis,
      analysisId,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to process resume intelligence request.";

    return toInitialState(message);
  }
}
