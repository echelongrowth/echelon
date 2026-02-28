import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function sanitizeErrorMessage(message: string | undefined): string | null {
  if (!message) return null;
  const trimmed = message.trim();
  if (!trimmed) return null;
  // Avoid returning full upstream HTML/error pages to clients.
  if (trimmed.startsWith("<!DOCTYPE html") || trimmed.startsWith("<html")) {
    return "Upstream service error. Please try again.";
  }
  return trimmed.slice(0, 240);
}

type ExportRow = {
  section: string;
  record_id: string;
  timestamp: string;
  summary: string;
  data_json: string;
};

function toCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(rows: ExportRow[]): string {
  const headers: Array<keyof ExportRow> = [
    "section",
    "record_id",
    "timestamp",
    "summary",
    "data_json",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => toCsvValue(String(row[header] ?? ""))).join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Export query timed out.")), 18000);
  });

  async function runQuery<T>(
    label: string,
    query: Promise<{ data: T; error: { message?: string } | null }>
  ): Promise<{ data: T | null; warning: string | null }> {
    try {
      const result = await Promise.race([query, timeoutPromise]);
      if (result.error) {
        const message = sanitizeErrorMessage(result.error.message) ?? "Unknown error";
        console.error(`[export] ${label} query failed: ${message}`);
        return { data: null, warning: `${label}: ${message}` };
      }
      return { data: result.data, warning: null };
    } catch {
      console.error(`[export] ${label} query timed out`);
      return { data: null, warning: `${label}: timed out` };
    }
  }

  const [profile, assessments, resumeAnalyses, executionTasks, sideProjects] =
    await Promise.all([
      runQuery(
        "profile",
        supabase.from("users").select("*").eq("id", user.id).maybeSingle()
      ),
      runQuery(
        "assessments",
        supabase
          .from("assessments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ),
      runQuery(
        "resume_analyses",
        supabase
          .from("resume_analyses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ),
      runQuery(
        "resume_execution_tasks",
        supabase
          .from("resume_execution_tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ),
      runQuery(
        "side_projects",
        supabase
          .from("side_projects")
          .select("*")
          .eq("user_id", user.id)
          .order("generated_at", { ascending: false })
      ),
    ]);

  const warnings = [
    profile.warning,
    assessments.warning,
    resumeAnalyses.warning,
    executionTasks.warning,
    sideProjects.warning,
  ].filter(Boolean);
  const missingSections = warnings
    .map((warning) => warning.split(":")[0]?.trim())
    .filter(Boolean);

  const hasAnyData =
    profile.data !== null ||
    (assessments.data && assessments.data.length > 0) ||
    (resumeAnalyses.data && resumeAnalyses.data.length > 0) ||
    (executionTasks.data && executionTasks.data.length > 0) ||
    (sideProjects.data && sideProjects.data.length > 0);

  if (!hasAnyData && warnings.length > 0) {
    return NextResponse.json(
      {
        error: "Unable to export data right now.",
        details: warnings,
      },
      { status: 500 }
    );
  }

  const fallbackProfile = {
    id: user.id,
    email: user.email ?? null,
    full_name:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    avatar_url:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    plan: null,
  };

  const exportedAt = new Date().toISOString();
  const rows: ExportRow[] = [];

  rows.push({
    section: "meta",
    record_id: user.id,
    timestamp: exportedAt,
    summary: "Export generated",
    data_json: JSON.stringify({
      email: user.email ?? null,
      partial_export: missingSections.length > 0,
      missing_sections: missingSections,
    }),
  });

  const profileRecord = profile.data ?? fallbackProfile;
  rows.push({
    section: "profile",
    record_id: profileRecord.id ?? user.id,
    timestamp: exportedAt,
    summary: `email=${profileRecord.email ?? ""}; plan=${profileRecord.plan ?? ""}`,
    data_json: JSON.stringify(profileRecord),
  });

  for (const item of assessments.data ?? []) {
    rows.push({
      section: "assessments",
      record_id: item.id,
      timestamp: item.created_at,
      summary: `active=${item.is_active}; leverage=${item.leverage_score ?? ""}; risk=${item.risk_score ?? ""}`,
      data_json: JSON.stringify(item),
    });
  }

  for (const item of resumeAnalyses.data ?? []) {
    rows.push({
      section: "resume_analyses",
      record_id: item.id,
      timestamp: item.created_at,
      summary: `executive_score=${item.executive_score}`,
      data_json: JSON.stringify(item),
    });
  }

  for (const item of executionTasks.data ?? []) {
    rows.push({
      section: "resume_execution_tasks",
      record_id: item.id,
      timestamp: item.created_at,
      summary: `task_id=${item.task_id}; completed=${item.completed}`,
      data_json: JSON.stringify(item),
    });
  }

  for (const item of sideProjects.data ?? []) {
    rows.push({
      section: "side_projects",
      record_id: item.id,
      timestamp: item.generated_at,
      summary: `career_goal=${item.career_goal ?? ""}`,
      data_json: JSON.stringify(item),
    });
  }

  const csv = toCsv(rows);
  const fileName = `echelon-export-${user.id}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
