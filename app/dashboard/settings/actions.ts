"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type UpdateFullNameState = {
  status: "idle" | "success" | "error";
  message: string;
  fullName: string | null;
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
