import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Pill-shaped inline indicators. Tone maps to the state palette.
// `trust` gets its own tone (vs `success`) because the design system
// reserves the brand green specifically for verification/trust signals —
// not as a generic green highlight.

type Tone = "neutral" | "trust" | "success" | "warning" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  leadingIcon?: ReactNode;
};

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-navy-100 text-navy-800",
  trust: "bg-green-100 text-green-800",
  success: "bg-success-bg text-green-800",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

export function Badge({
  tone = "neutral",
  leadingIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5",
        "text-caption font-medium",
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span aria-hidden="true" className="inline-flex">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  );
}
