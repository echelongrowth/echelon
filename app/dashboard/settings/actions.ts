"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export type UpdateFullNameState = {
  status: "idle" | "success" | "error";
  message: string;
  fullName: string | null;
};

export type DeleteAccountState = {
  status: "idle" | "success" | "error";
  message: string;
};

function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export async function updateFullNameAction(
  _previousState: UpdateFullNameState,
  formData: FormData
): Promise<UpdateFullNameState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Authentication required.",
      fullName: null,
    };
  }

  const fullName = normalizeName(String(formData.get("fullName") ?? ""));
  if (!fullName || fullName.length < 2 || fullName.length > 80) {
    return {
      status: "error",
      message: "Full Name must be between 2 and 80 characters.",
      fullName: null,
    };
  }

  const firstName = fullName.split(/\s+/)[0] ?? fullName;
  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      full_name: fullName,
    },
  });

  if (authUpdateError) {
    return {
      status: "error",
      message: `Unable to update Full Name right now. ${authUpdateError.message}`,
      fullName: null,
    };
  }

  // Best-effort sync to public.users profile table.
  const { error: profileSyncError } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
    },
    { onConflict: "id" }
  );

  if (profileSyncError) {
    return {
      status: "success",
      message:
        "Full Name updated. Profile table sync is pending due to access policy.",
      fullName,
    };
  }

  return {
    status: "success",
    message: "Full Name updated successfully.",
    fullName,
  };
}

export async function deleteAccountAction(
  _previousState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Authentication required.",
    };
  }

  const confirmation = String(formData.get("confirmation") ?? "").trim();
  const acknowledged = String(formData.get("acknowledge") ?? "") === "on";

  if (confirmation !== "DELETE") {
    return {
      status: "error",
      message: 'Type "DELETE" to confirm account deletion.',
    };
  }

  if (!acknowledged) {
    return {
      status: "error",
      message: "Please acknowledge irreversible deletion.",
    };
  }

  try {
    const admin = createSupabaseAdminClient();

    const cleanupCalls = [
      admin.from("notifications").delete().eq("user_id", user.id),
      admin.from("notification_preferences").delete().eq("user_id", user.id),
      admin.from("resume_execution_tasks").delete().eq("user_id", user.id),
      admin.from("resume_analyses").delete().eq("user_id", user.id),
      admin.from("side_projects").delete().eq("user_id", user.id),
      admin.from("assessments").delete().eq("user_id", user.id),
      admin.from("users").delete().eq("id", user.id),
    ];

    const results = await Promise.all(cleanupCalls);
    const cleanupError = results.find((result) => result.error)?.error;
    if (cleanupError) {
      return {
        status: "error",
        message: `Unable to delete account data: ${cleanupError.message}`,
      };
    }

    const { error: authDeleteError } = await admin.auth.admin.deleteUser(user.id);
    if (authDeleteError) {
      return {
        status: "error",
        message: `Unable to delete auth account: ${authDeleteError.message}`,
      };
    }

    return {
      status: "success",
      message: "Account deleted successfully.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      status: "error",
      message: `Account deletion failed: ${message}`,
    };
  }
}
