import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getPlanTypeForUser } from "@/lib/plan";
import { ProfileForm } from "@/app/dashboard/settings/components/profile-form";
import { DataControlsForm } from "@/app/dashboard/settings/components/data-controls-form";
import { NotificationPreferencesForm } from "@/app/dashboard/settings/components/notification-preferences-form";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "EC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getDisplayName(fullName: string | null, email: string | null): string {
  if (fullName && fullName.trim()) return fullName.trim();
  if (!email) return "Executive User";
  const localPart = email.split("@")[0] ?? "executive";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toPlanLabel(plan: "free" | "pro"): string {
  return plan === "pro" ? "Pro" : "Free";
}

export default async function DashboardSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email,full_name,avatar_url,plan")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email ?? user.email ?? null;
  const fullName = profile?.full_name ?? null;
  const avatarUrl = profile?.avatar_url ?? null;
  const plan =
    profile?.plan === "free" || profile?.plan === "pro"
      ? profile.plan
      : getPlanTypeForUser(user);
  const metadataFullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  const metadataFirstName =
    typeof user.user_metadata?.first_name === "string"
      ? user.user_metadata.first_name
      : null;

  const displayName = getDisplayName(
    fullName ?? metadataFullName ?? metadataFirstName ?? null,
    email
  );
  const initials = getInitials(displayName);

  return (
    <main className="dashboard-theme min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex flex-wrap gap-2.5">
          <Link
            className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
            href="/dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
        <section className="apple-surface rounded-[20px] p-6 sm:p-8">
          <p className="label-micro">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--db-text)]">
            Account Settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--db-muted)]">
            Manage account identity, plan access, and data controls for Echelon.
          </p>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="apple-surface h-fit rounded-[20px] p-5 sm:p-6">
            <p className="label-micro">Settings Navigation</p>
            <nav className="mt-4 space-y-2">
              {[
                { label: "Identity & Profile", href: "#identity-profile" },
                { label: "Plan & Billing", href: "#plan-billing" },
                { label: "Notifications", href: "#notifications" },
                { label: "Data & Privacy", href: "#data-privacy" },
              ].map((item, idx) => (
                <a
                  className={`block rounded-lg border px-3 py-2.5 text-sm ${
                    idx === 0
                      ? "border-[color-mix(in_oklab,var(--db-accent)_42%,transparent)] bg-[color-mix(in_oklab,var(--db-accent)_14%,transparent)] text-[var(--db-text)]"
                      : "border-[var(--db-border)] bg-[var(--db-surface-subtle)] text-[var(--db-muted)]"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-8">
          <section className="apple-surface rounded-[20px] p-6 sm:p-8" id="identity-profile">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={`${displayName} avatar`}
                  className="h-14 w-14 rounded-full border border-[var(--db-border)] object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--db-border)] bg-[var(--db-surface-subtle)] text-sm font-semibold text-[var(--db-text)]">
                  {initials}
                </div>
              )}
              <div>
                <p className="label-micro">Account</p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--db-text)]">
                  Identity & Profile
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProfileForm initialFullName={fullName ?? metadataFullName ?? displayName} />
              <div className="apple-surface-subtle rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">
                  Email
                </p>
                <p className="mt-2 text-sm text-[var(--db-text)]">{email ?? "Unavailable"}</p>
              </div>
              <div className="apple-surface-subtle rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">
                  Timezone
                </p>
                <p className="mt-2 text-sm text-[var(--db-muted)]">
                  Configurable in a future release.
                </p>
              </div>
              <div className="apple-surface-subtle rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">
                  Security
                </p>
                <p className="mt-2 text-sm text-[var(--db-muted)]">
                  Password reset and device sessions will be added here.
                </p>
              </div>
            </div>
          </section>

          <section className="apple-surface rounded-[20px] p-6 sm:p-8" id="plan-billing">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-micro">Plan & Billing</p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--db-text)]">
                  Subscription Controls
                </h2>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                  plan === "pro"
                    ? "border-[color-mix(in_oklab,var(--db-accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--db-accent)_16%,transparent)] text-[var(--db-accent)]"
                    : "border-[var(--db-border)] bg-[var(--db-surface-subtle)] text-[var(--db-muted)]"
                }`}
              >
                {toPlanLabel(plan)}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="apple-surface-subtle rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">
                  Current Access
                </p>
                <p className="mt-2 text-sm text-[var(--db-text)]">
                  {plan === "pro"
                    ? "Full strategic intelligence modules enabled."
                    : "Core assessment and limited intelligence preview enabled."}
                </p>
              </div>
              <div className="apple-surface-subtle rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">
                  Billing
                </p>
                <p className="mt-2 text-sm text-[var(--db-muted)]">
                  Invoice history and payment method management can be connected
                  in this section.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="apple-primary-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
                href="/pricing"
              >
                {plan === "pro" ? "View Plan Details" : "Upgrade to Pro"}
              </Link>
              <Link
                className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium"
                href="/pricing"
              >
                Manage Billing
              </Link>
            </div>
          </section>

          <section className="apple-surface rounded-[20px] p-6 sm:p-8" id="notifications">
            <p className="label-micro">Notifications</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--db-text)]">
              Notification Preferences
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--db-muted)]">
              Configure in-app and email delivery rules by priority and cadence.
            </p>
            <div className="mt-6">
              <NotificationPreferencesForm initialPlan={plan} />
            </div>
          </section>

          <section className="apple-surface rounded-[20px] p-6 sm:p-8" id="data-privacy">
            <p className="label-micro">Data & Privacy</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--db-text)]">
              Data Controls
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--db-muted)]">
              Data export, retention controls, and account deletion workflow can
              be governed from this section.
            </p>

            <DataControlsForm />
          </section>
          </div>
        </div>
      </div>
    </main>
  );
}
