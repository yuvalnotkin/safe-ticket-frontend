import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Bone surface sitting on the cream page bg, 1px warm-grey border, sparse
// forest-tinted shadow. `interactive` opt-in for clickable cards — on hover
// the border steps up to forest, a subtle 2px lift and deeper shadow.
// Deliberately no padding token — callers own their inner spacing.

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-bone shadow-xs",
        interactive &&
          "cursor-pointer transition-all duration-250 ease-out hover:-translate-y-0.5 hover:border-forest-900 hover:shadow-card-hover",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
