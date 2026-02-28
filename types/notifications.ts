import type { PlanType } from "@/types/intelligence";

export type NotificationType =
  | "intelligence_ready"
  | "recalibration_ready"
  | "resume_analysis_ready"
  | "side_projects_ready"
  | "task_reminder"
  | "billing_event"
  | "security_alert"
  | "product_update";

export type NotificationChannel = "in_app" | "email";
export type NotificationStatus = "unread" | "read" | "archived";
export type DigestMode = "instant" | "daily" | "weekly";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  ctaUrl: string | null;
  status: NotificationStatus;
  channel: NotificationChannel;
  createdAt: string;
};

export type NotificationPreferences = {
  channelInApp: boolean;
  channelEmail: boolean;
  digestMode: DigestMode;
  reportReady: boolean;
  taskReminders: boolean;
  billing: boolean;
  security: boolean;
  productUpdates: boolean;
};

export type NotificationInboxResponse = {
  items: NotificationItem[];
  unreadCount: number;
};

export type NotificationPreferencesResponse = {
  planType: PlanType;
  preferences: NotificationPreferences;
};
