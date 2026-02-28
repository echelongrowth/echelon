import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { mapNotificationRow } from "@/lib/notifications";
import type { NotificationInboxResponse } from "@/types/notifications";

export const runtime = "nodejs";

type MarkReadPayload = {
  id?: string;
  markAll?: boolean;
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("channel", "in_app")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Unable to fetch notifications." }, { status: 500 });
  }

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("channel", "in_app")
    .eq("status", "unread");

  const body: NotificationInboxResponse = {
    items: (data ?? []).map(mapNotificationRow),
    unreadCount: unreadCount ?? 0,
  };

  return NextResponse.json(body, { status: 200 });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as MarkReadPayload;
  const now = new Date().toISOString();

  if (payload.markAll) {
    const { error } = await supabase
      .from("notifications")
      .update({ status: "read", read_at: now })
      .eq("user_id", user.id)
      .eq("status", "unread");

    if (error) {
      return NextResponse.json({ error: "Unable to update notifications." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!payload.id) {
    return NextResponse.json({ error: "Notification id is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: now })
    .eq("id", payload.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Unable to update notification." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
