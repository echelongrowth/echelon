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
      className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#7aa4ff55] bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff] px-4 text-sm font-medium text-white transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[1px] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b8cff55] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
