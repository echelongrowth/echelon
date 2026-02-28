import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function InputField({ id, label, ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--app-text)]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="h-12 w-full rounded-xl border border-[var(--app-border)] bg-[#ffffff05] px-3.5 text-sm text-[var(--app-text)] outline-none transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] placeholder:text-[var(--app-muted)] focus:border-[#5b8cff77] focus:ring-2 focus:ring-[#5b8cff33]"
        {...props}
      />
    </div>
  );
}
