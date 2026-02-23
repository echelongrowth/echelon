export default function SignupLoading() {
  return (
    <section className="w-full rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
      <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
      <div className="mt-4 h-8 w-56 animate-pulse rounded bg-stone-200" />
      <div className="mt-8 space-y-4">
        <div className="h-11 animate-pulse rounded bg-stone-200" />
        <div className="h-11 animate-pulse rounded bg-stone-200" />
        <div className="h-11 animate-pulse rounded bg-stone-300" />
      </div>
    </section>
  );
}

