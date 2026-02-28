import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-[var(--app-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center px-5 py-10 md:px-6 md:py-12">
        <div className="w-full space-y-5">
          <div className="flex justify-center">
            <Link className="inline-flex items-center" href="/">
              <BrandLogo priority size="lg" variant="full" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
