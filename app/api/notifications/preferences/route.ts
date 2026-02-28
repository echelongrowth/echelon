import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getPlanTypeForUser } from "@/lib/plan";
import {
  getOrCreateNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/notifications";
import type {
  NotificationPreferences,
  NotificationPreferencesResponse,
} from "@/types/notifications";

export const runtime = "nodejs";

function isNotificationPreferences(value: unknown): value is NotificationPreferences {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.channelInApp === "boolean" &&
    typeof candidate.channelEmail === "boolean" &&
    (candidate.digestMode === "instant" ||
      candidate.digestMode === "daily" ||
      candidate.digestMode === "weekly") &&
    typeof candidate.reportReady === "boolean" &&
    typeof candidate.taskReminders === "boolean" &&
    typeof candidate.billing === "boolean" &&
    typeof candidate.security === "boolean" &&
    typeof candidate.productUpdates === "boolean"
  );
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planType = getPlanTypeForUser(user);
  const preferences = await getOrCreateNotificationPreferences(
    supabase,
    user.id,
    planType
  );

  const body: NotificationPreferencesResponse = {
    planType,
    preferences,
  };

  return NextResponse.json(body, { status: 200 });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    preferences?: unknown;
  };

  if (!isNotificationPreferences(payload.preferences)) {
    return NextResponse.json({ error: "Invalid notification preferences payload." }, { status: 400 });
  }

  const planType = getPlanTypeForUser(user);
  const preferences = await saveNotificationPreferences(
    supabase,
    user.id,
    planType,
    payload.preferences
  );

  const body: NotificationPreferencesResponse = {
    planType,
    preferences,
  };

  return NextResponse.json(body, { status: 200 });
}
