export default function AssessmentLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <section className="w-full space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <div className="h-3 w-36 animate-pulse rounded bg-slate-700/70" />
          <div className="h-8 w-72 animate-pulse rounded bg-slate-700/70" />
          <div className="h-2 w-full animate-pulse rounded-full bg-slate-800" />
          <div className="space-y-4">
            <div className="h-11 animate-pulse rounded bg-slate-700/70" />
            <div className="h-11 animate-pulse rounded bg-slate-700/70" />
            <div className="h-11 animate-pulse rounded bg-slate-700/70" />
          </div>
        </section>
      </div>
    </main>
  );
}
