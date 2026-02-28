export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0B0D12_0%,#0F141C_100%)] text-[#F5F7FA]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6">
        <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_18px_36px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9BA3AF]">
            Echelon
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#F5F7FA]">
            Loading Workspace
          </h1>
          <p className="mt-3 text-sm text-[#9BA3AF]">
            Preparing strategic intelligence...
          </p>
          <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[#5B8CFF]" />
          </div>
        </section>
      </div>
    </main>
  );
}
