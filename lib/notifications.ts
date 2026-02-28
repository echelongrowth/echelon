import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { PlanType } from "@/types/intelligence";
import type {
  NotificationChannel,
  NotificationItem,
  NotificationPreferences,
  NotificationStatus,
  NotificationType,
} from "@/types/notifications";

type NotificationPreferencesRow = Database["public"]["Tables"]["notification_preferences"]["Row"];
type NotificationPreferencesInsert = Database["public"]["Tables"]["notification_preferences"]["Insert"];

const FREE_ALLOWED_TYPES: ReadonlySet<NotificationType> = new Set([
  "intelligence_ready",
  "recalibration_ready",
  "resume_analysis_ready",
  "billing_event",
  "security_alert",
]);

export function defaultNotificationPreferences(planType: PlanType): NotificationPreferences {
  return {
    channelInApp: true,
    channelEmail: false,
    digestMode: planType === "pro" ? "instant" : "daily",
    reportReady: true,
    taskReminders: planType === "pro",
    billing: true,
    security: true,
    productUpdates: false,
  };
}

function rowToPreferences(row: NotificationPreferencesRow): NotificationPreferences {
  return {
    channelInApp: row.channel_in_app,
    channelEmail: row.channel_email,
    digestMode: row.digest_mode,
    reportReady: row.report_ready,
    taskReminders: row.task_reminders,
    billing: row.billing,
    security: row.security,
    productUpdates: row.product_updates,
  };
}

function preferencesToRow(
  userId: string,
  preferences: NotificationPreferences
): NotificationPreferencesInsert {
  return {
    user_id: userId,
    channel_in_app: preferences.channelInApp,
    channel_email: preferences.channelEmail,
    digest_mode: preferences.digestMode,
    report_ready: preferences.reportReady,
    task_reminders: preferences.taskReminders,
    billing: preferences.billing,
    security: preferences.security,
    product_updates: preferences.productUpdates,
    updated_at: new Date().toISOString(),
  };
}

export function sanitizePreferencesForPlan(
  planType: PlanType,
  preferences: NotificationPreferences
): NotificationPreferences {
  if (planType === "pro") return preferences;

  return {
    ...preferences,
    channelEmail: false,
    taskReminders: false,
    digestMode: preferences.digestMode === "instant" ? "daily" : preferences.digestMode,
  };
}

function shouldSendByPreferences(
  type: NotificationType,
  preferences: NotificationPreferences
): boolean {
  if (
    type === "intelligence_ready" ||
    type === "recalibration_ready" ||
    type === "resume_analysis_ready" ||
    type === "side_projects_ready"
  ) {
    return preferences.reportReady;
  }
  if (type === "task_reminder") return preferences.taskReminders;
  if (type === "billing_event") return preferences.billing;
  if (type === "security_alert") return preferences.security;
  if (type === "product_update") return preferences.productUpdates;
  return true;
}

export function isNotificationAllowedForPlan(planType: PlanType, type: NotificationType): boolean {
  if (planType === "pro") return true;
  return FREE_ALLOWED_TYPES.has(type);
}

export async function getOrCreateNotificationPreferences(
  supabase: SupabaseClient<Database>,
  userId: string,
  planType: PlanType
): Promise<NotificationPreferences> {
  const defaults = defaultNotificationPreferences(planType);

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return defaults;
  }

  if (data) {
    return sanitizePreferencesForPlan(planType, rowToPreferences(data));
  }

  const sanitized = sanitizePreferencesForPlan(planType, defaults);
  await supabase.from("notification_preferences").upsert(preferencesToRow(userId, sanitized), {
    onConflict: "user_id",
  });
  return sanitized;
}

export async function saveNotificationPreferences(
  supabase: SupabaseClient<Database>,
  userId: string,
  planType: PlanType,
  rawPreferences: NotificationPreferences
): Promise<NotificationPreferences> {
  const preferences = sanitizePreferencesForPlan(planType, rawPreferences);
  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert(preferencesToRow(userId, preferences), { onConflict: "user_id" })
    .select("*")
    .single();

  if (error || !data) return preferences;
  return sanitizePreferencesForPlan(planType, rowToPreferences(data));
}

type CreateNotificationInput = {
  userId: string;
  planType: PlanType;
  type: NotificationType;
  title: string;
  body: string;
  ctaUrl?: string;
  channel?: NotificationChannel;
  dedupeKey?: string;
};

export async function createNotification(
  supabase: SupabaseClient<Database>,
  input: CreateNotificationInput
): Promise<void> {
  if (!isNotificationAllowedForPlan(input.planType, input.type)) return;

  const preferences = await getOrCreateNotificationPreferences(
    supabase,
    input.userId,
    input.planType
  );
  const channel = input.channel ?? "in_app";

  if ((channel === "in_app" && !preferences.channelInApp) || !shouldSendByPreferences(input.type, preferences)) {
    return;
  }

  if (channel === "email" && !preferences.channelEmail) {
    return;
  }

  await supabase.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    cta_url: input.ctaUrl ?? null,
    channel,
    status: "unread",
    dedupe_key: input.dedupeKey ?? null,
  });
}

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export function mapNotificationRow(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body,
    ctaUrl: row.cta_url,
    status: row.status as NotificationStatus,
    channel: row.channel as NotificationChannel,
    createdAt: row.created_at,
  };
}
