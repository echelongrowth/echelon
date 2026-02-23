export default function DashboardLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="h-3 w-32 animate-pulse rounded bg-stone-200" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-stone-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-stone-200" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
      </div>
    </main>
  );
}

