import Image from "next/image";

export const BRAND_LOGO_SRC = "/Echelon.png";

type BrandLogoProps = {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
};

const ICON_DIMENSIONS = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
} as const;

const FULL_DIMENSIONS = {
  sm: { width: 168, height: 36 },
  md: { width: 216, height: 44 },
  lg: { width: 260, height: 56 },
} as const;

const ICON_SIZE_CLASS = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
} as const;

const FULL_SIZE_CLASS = {
  sm: "h-9 w-[168px]",
  md: "h-11 w-[216px]",
  lg: "h-14 w-[260px]",
} as const;

export function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const dims = variant === "icon" ? ICON_DIMENSIONS[size] : FULL_DIMENSIONS[size];
  const sizeClass = variant === "icon" ? ICON_SIZE_CLASS[size] : FULL_SIZE_CLASS[size];

  if (variant === "full") {
    return (
      <span className={`relative inline-flex overflow-hidden ${sizeClass} ${className}`.trim()}>
        <Image
          alt="Echelon"
          className="object-cover object-center drop-shadow-[0_2px_12px_rgba(91,140,255,0.28)]"
          fill
          priority={priority}
          sizes="(max-width: 768px) 168px, 216px"
          src={BRAND_LOGO_SRC}
        />
      </span>
    );
  }

  return (
    <Image
      alt="Echelon"
      className={`${sizeClass} object-contain ${className}`.trim()}
      height={dims.height}
      priority={priority}
      src={BRAND_LOGO_SRC}
      width={dims.width}
    />
  );
}
