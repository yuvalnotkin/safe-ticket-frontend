import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Variants:
//   primary   — solid forest. Default for most actions.
//   cta       — solid ochre. Reserved for the SINGLE most important action
//               on a view (Buy ticket, List a ticket, hero search).
//               Overusing ochre dilutes its meaning (design_system.md §2).
//   secondary — outlined forest, inverts on hover.
//   ghost     — no fill, warm-grey border. Tertiary / icon buttons.

type Variant = "primary" | "cta" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-forest-900 text-cream hover:bg-forest-950 active:bg-forest-950 disabled:bg-forest-300 disabled:text-cream",
  cta: "bg-ochre text-white hover:bg-ochre-deep active:bg-ochre-deep disabled:opacity-50",
  secondary:
    "border border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-cream active:bg-forest-950 disabled:border-forest-300 disabled:text-forest-300 disabled:hover:bg-transparent disabled:hover:text-forest-300",
  ghost:
    "border border-border-strong text-forest-900 hover:bg-bone active:bg-cream-deep disabled:text-neutral-500",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-caption gap-1.5",
  md: "h-11 px-5 text-small gap-2",
  lg: "h-13 px-6 text-body gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/40",
          "disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...rest}
      >
        {loading ? <Spinner /> : leadingIcon}
        <span>{children}</span>
        {!loading && trailingIcon}
      </button>
    );
  },
);

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
