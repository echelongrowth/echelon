"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateFullNameAction,
  type UpdateFullNameState,
} from "@/app/dashboard/settings/actions";

const initialState: UpdateFullNameState = {
  status: "idle",
  message: "",
  fullName: null,
};

export function ProfileForm({ initialFullName }: { initialFullName: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateFullNameAction,
    initialState
  );

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="l2-surface rounded-xl p-4">
      <label className="text-xs uppercase tracking-[0.14em] text-slate-400" htmlFor="fullName">
        Full Name
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          className="h-10 min-w-72 flex-1 rounded-xl border border-slate-600/60 bg-slate-900/75 px-3 text-sm text-slate-100 outline-none transition-all duration-150 ease-out focus:border-indigo-300/55"
          defaultValue={initialFullName}
          name="fullName"
          required
          type="text"
          id="fullName"
          maxLength={80}
          placeholder="Enter full name"
        />
        <button
          className="inline-flex h-10 items-center justify-center rounded-xl border border-indigo-300/25 bg-indigo-400/20 px-4 text-sm font-medium text-indigo-100 transition-all duration-150 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
      {state.status !== "idle" ? (
        <p
          className={`mt-3 text-xs ${
            state.status === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
