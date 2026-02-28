"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  deleteAccountAction,
  type DeleteAccountState,
} from "@/app/dashboard/settings/actions";

const initialDeleteState: DeleteAccountState = {
  status: "idle",
  message: "",
};

export function DataControlsForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    deleteAccountAction,
    initialDeleteState
  );

  useEffect(() => {
    if (state.status !== "success") return;

    async function finalizeDeletion() {
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    }

    void finalizeDeletion();
  }, [router, state.status, supabase.auth]);

  async function handleExport() {
    setIsExporting(true);
    setExportMessage(null);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);

      const response = await fetch("/api/account/export", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; details?: string[] }
          | null;
        const detail = payload?.details?.[0];
        setExportMessage(
          detail
            ? `${payload?.error ?? "Unable to export data right now."} (${detail})`
            : payload?.error ?? "Unable to export data right now. Please try again."
        );
        return;
      }

      const blob = await response.blob();
      const fileNameHeader = response.headers.get("Content-Disposition");
      const match = fileNameHeader?.match(/filename="([^"]+)"/);
      const fileName = match?.[1] ?? `echelon-export-${Date.now()}.json`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setExportMessage("Export started. Your download should begin shortly.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportMessage(
          "Export timed out. Please retry in a moment. If this repeats, check Supabase connectivity."
        );
      } else {
        setExportMessage("Unable to export data right now. Please try again.");
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <button
        className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
        disabled={isExporting}
        onClick={() => void handleExport()}
        type="button"
      >
        {isExporting ? "Preparing Export..." : "Export My Data"}
      </button>
      {exportMessage ? (
        <p className="text-xs text-[var(--db-muted)]">{exportMessage}</p>
      ) : null}

      <form action={formAction} className="space-y-3 rounded-xl border border-[#a73a3550] bg-[#a73a3510] p-4">
        <p className="text-sm font-medium text-[#ff9a95]">Delete Account</p>
        <p className="text-xs leading-6 text-[var(--db-muted)]">
          This permanently deletes your account and associated records. Type
          <span className="mx-1 font-semibold text-[var(--db-text)]">DELETE</span>
          to confirm.
        </p>
        <input
          className="h-10 w-full rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 text-sm text-[var(--db-text)] outline-none focus:border-[#a73a35aa]"
          name="confirmation"
          placeholder='Type "DELETE"'
          required
          type="text"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--db-muted)]">
          <input className="h-4 w-4" name="acknowledge" type="checkbox" />
          I understand this action cannot be undone.
        </label>
        <button
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#a73a3555] bg-[#a73a3520] px-4 text-sm font-medium text-[#ff9a95] transition-all duration-150 hover:bg-[#a73a3530] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Deleting..." : "Delete Account"}
        </button>
        {state.status !== "idle" ? (
          <p
            className={`text-xs ${
              state.status === "success" ? "text-[#7de1b0]" : "text-[#ff9a95]"
            }`}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
