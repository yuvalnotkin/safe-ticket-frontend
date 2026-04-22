import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Variants:
//   primary  — solid navy. Default for most actions.
//   trust    — solid green. Reserved for trust-critical CTAs (Buy, List).
//              design_system.md §7: green is NOT a generic highlight; only
//              use `trust` where the action itself carries trust semantics.
//   secondary — outlined navy. Non-primary actions alongside a primary.
//   ghost     — no border, hover background. Tertiary / icon buttons.

type Variant = "primary" | "trust" | "secondary" | "ghost";
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
    "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 disabled:bg-navy-300",
  trust:
    "bg-green-700 text-white hover:bg-green-800 active:bg-green-900 disabled:bg-green-200",
  secondary:
    "border border-navy-900 text-navy-900 hover:bg-navy-50 active:bg-navy-100 disabled:border-navy-200 disabled:text-navy-300",
  ghost:
    "text-navy-900 hover:bg-navy-100 active:bg-navy-200 disabled:text-navy-300",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3 text-small gap-1.5",
  md: "h-11 px-5 text-body gap-2",
  lg: "h-13 px-6 text-body-lg gap-2",
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
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900",
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
