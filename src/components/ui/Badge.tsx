import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Pill / capsule inline indicators. `tone` maps to the state palette.
// `verified` and `provider` are distinct tones so trust and attribution
// don't collapse into generic green/neutral.

type Tone = "neutral" | "verified" | "face-value" | "success" | "warning" | "danger" | "info";
type Shape = "pill" | "square";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  shape?: Shape;
  leadingIcon?: ReactNode;
  /** Uppercase + letter-spaced — for provider tags like TICKETMASTER, or lifecycle chips like IN ESCROW. */
  mono?: boolean;
};

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-cream-deep text-ink",
  verified: "bg-success-bg text-sage border border-sage/30",
  "face-value": "bg-forest-900 text-cream",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-ochre-deep",
  danger: "bg-danger-bg text-danger",
  info: "bg-cream-deep text-ink-2",
};

export function Badge({
  tone = "neutral",
  shape = "pill",
  mono = false,
  leadingIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5",
        shape === "pill" ? "rounded-pill" : "rounded-xs",
        mono
          ? "text-micro font-semibold tracking-[0.12em] uppercase"
          : "text-caption font-medium",
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
