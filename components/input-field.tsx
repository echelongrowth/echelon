import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function InputField({ id, label, ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="h-11 w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3.5 text-sm text-slate-100 outline-none transition-all duration-200 ease-out placeholder:text-slate-500 focus:border-indigo-300/55 focus:bg-slate-900/70"
        {...props}
      />
    </div>
  );
}
