export default function DashboardLoading() {
  return (
    <main className="dashboard-theme mx-auto min-h-screen w-full max-w-[1440px] px-6 py-10">
      <div className="rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)] p-7 shadow-[var(--db-shadow)]">
        <div className="h-3 w-32 animate-pulse rounded bg-[var(--db-border)]" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-[var(--db-border)]" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[var(--db-border)]" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-40 animate-pulse rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)]" />
        <div className="h-40 animate-pulse rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)]" />
        <div className="h-40 animate-pulse rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)]" />
      </div>
    </main>
  );
}
