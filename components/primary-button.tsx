import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export function PrimaryButton({
  loading = false,
  loadingText = "Please wait...",
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex h-11 w-full items-center justify-center rounded-xl border border-indigo-300/30 bg-indigo-400/20 px-4 text-sm font-medium text-indigo-100 transition-all duration-200 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/30 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
