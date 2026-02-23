import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getPlanTypeForUser } from "@/lib/plan";
import { ProfileForm } from "@/app/dashboard/settings/components/profile-form";

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
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <section className="l1-surface rounded-xl p-8">
          <p className="label-micro">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
            Account Settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Manage account identity, plan access, and data controls for Echelon.
          </p>
        </section>

        <div className="mt-8 space-y-8">
          <section className="l1-surface rounded-xl p-8">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={`${displayName} avatar`}
                  className="h-14 w-14 rounded-full border border-slate-600/70 object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/70 text-sm font-semibold text-slate-100">
                  {initials}
                </div>
              )}
              <div>
                <p className="label-micro">Account</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-100">
                  Identity & Profile
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProfileForm
                initialFullName={fullName ?? metadataFullName ?? displayName}
              />
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Email
                </p>
                <p className="mt-2 text-sm text-slate-100">{email ?? "Unavailable"}</p>
              </div>
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Timezone
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Configurable in a future release.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Security
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Password reset and device sessions will be added here.
                </p>
              </div>
            </div>
          </section>

          <section className="l1-surface rounded-xl p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-micro">Plan & Billing</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-100">
                  Subscription Controls
                </h2>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                  plan === "pro"
                    ? "border-indigo-300/45 bg-indigo-400/15 text-indigo-100"
                    : "border-slate-500/60 bg-slate-700/45 text-slate-200"
                }`}
              >
                {toPlanLabel(plan)}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Current Access
                </p>
                <p className="mt-2 text-sm text-slate-100">
                  {plan === "pro"
                    ? "Full strategic intelligence modules enabled."
                    : "Core assessment and limited intelligence preview enabled."}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Billing
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Invoice history and payment method management can be connected
                  in this section.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-indigo-300/25 bg-indigo-400/20 px-4 text-sm font-medium text-indigo-100 transition-all duration-150 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28"
                href="/pricing"
              >
                {plan === "pro" ? "View Plan Details" : "Upgrade to Pro"}
              </Link>
              <button
                className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-slate-600/70 bg-slate-800/50 px-4 text-sm font-medium text-slate-400"
                disabled
                type="button"
              >
                Billing Portal (Coming Soon)
              </button>
            </div>
          </section>

          <section className="l1-surface rounded-xl p-8">
            <p className="label-micro">Data & Privacy</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-100">
              Data Controls
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Data export, retention controls, and account deletion workflow can
              be governed from this section.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-slate-600/70 bg-slate-800/50 px-4 text-sm font-medium text-slate-400"
                disabled
                type="button"
              >
                Export Data (Coming Soon)
              </button>
              <button
                className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg border border-rose-500/45 bg-rose-500/10 px-4 text-sm font-medium text-rose-300/80"
                disabled
                type="button"
              >
                Delete Account (Protected Flow)
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
