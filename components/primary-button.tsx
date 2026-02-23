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
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-4 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_24px_rgba(79,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
