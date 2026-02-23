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
        className="h-11 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 text-sm text-slate-100 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-500 focus:border-[#8B5CF6]/60 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        {...props}
      />
    </div>
  );
}
