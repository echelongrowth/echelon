import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center px-6 py-12">
        {children}
      </div>
    </main>
  );
}
