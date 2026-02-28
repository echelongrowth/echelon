"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlanType } from "@/types/intelligence";
import type {
  NotificationPreferences,
  NotificationPreferencesResponse,
} from "@/types/notifications";

const EMPTY_PREFS: NotificationPreferences = {
  channelInApp: true,
  channelEmail: false,
  digestMode: "daily",
  reportReady: true,
  taskReminders: false,
  billing: true,
  security: true,
  productUpdates: false,
};

type Props = {
  initialPlan: PlanType;
};

export function NotificationPreferencesForm({ initialPlan }: Props) {
  const [planType, setPlanType] = useState<PlanType>(initialPlan);
  const [preferences, setPreferences] = useState<NotificationPreferences>(EMPTY_PREFS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isFree = useMemo(() => planType === "free", [planType]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/notifications/preferences", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });
        if (!response.ok) {
          setMessage("Unable to load notification preferences.");
          return;
        }
        const payload = (await response.json()) as NotificationPreferencesResponse;
        setPlanType(payload.planType);
        setPreferences(payload.preferences);
      } catch {
        setMessage("Unable to load notification preferences.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  function updatePreference<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        setMessage("Unable to save preferences right now.");
        return;
      }

      const payload = (await response.json()) as NotificationPreferencesResponse;
      setPlanType(payload.planType);
      setPreferences(payload.preferences);
      setMessage("Notification preferences updated.");
    } catch {
      setMessage("Unable to save preferences right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? <p className="text-sm text-[var(--db-muted)]">Loading notification settings...</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">In-app notifications</span>
          <input
            checked={preferences.channelInApp}
            className="h-4 w-4"
            onChange={(event) => updatePreference("channelInApp", event.target.checked)}
            type="checkbox"
          />
        </label>
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">Email notifications</span>
          <input
            checked={preferences.channelEmail}
            className="h-4 w-4"
            disabled={isFree}
            onChange={(event) => updatePreference("channelEmail", event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>

      <div className="apple-surface-subtle rounded-xl p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">Digest Frequency</p>
        <div className="mt-3">
          <select
            className="h-10 w-full rounded-lg border border-[var(--db-border)] bg-[var(--db-surface)] px-3 text-sm text-[var(--db-text)] outline-none"
            onChange={(event) =>
              updatePreference(
                "digestMode",
                event.target.value as NotificationPreferences["digestMode"]
              )
            }
            value={preferences.digestMode}
          >
            {!isFree ? <option value="instant">Instant</option> : null}
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">Report ready alerts</span>
          <input
            checked={preferences.reportReady}
            className="h-4 w-4"
            onChange={(event) => updatePreference("reportReady", event.target.checked)}
            type="checkbox"
          />
        </label>
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">Task reminders</span>
          <input
            checked={preferences.taskReminders}
            className="h-4 w-4"
            disabled={isFree}
            onChange={(event) => updatePreference("taskReminders", event.target.checked)}
            type="checkbox"
          />
        </label>
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">Billing events</span>
          <input
            checked={preferences.billing}
            className="h-4 w-4"
            onChange={(event) => updatePreference("billing", event.target.checked)}
            type="checkbox"
          />
        </label>
        <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
          <span className="text-[var(--db-text)]">Security alerts</span>
          <input
            checked={preferences.security}
            className="h-4 w-4"
            onChange={(event) => updatePreference("security", event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>

      <label className="apple-surface-subtle flex items-center justify-between rounded-xl p-4 text-sm">
        <span className="text-[var(--db-text)]">Product updates</span>
        <input
          checked={preferences.productUpdates}
          className="h-4 w-4"
          onChange={(event) => updatePreference("productUpdates", event.target.checked)}
          type="checkbox"
        />
      </label>

      {isFree ? (
        <p className="text-xs text-[var(--db-muted)]">
          Free plan includes in-app alerts and digest controls. Email and advanced task reminders are Pro-only.
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          className="apple-primary-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading || isSaving}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
        {message ? <p className="text-xs text-[var(--db-muted)]">{message}</p> : null}
      </div>
    </div>
  );
}
