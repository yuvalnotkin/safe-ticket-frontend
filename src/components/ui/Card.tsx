import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// White surface on the #FAFAFA background, thin border, subtle shadow.
// `interactive` adds a hover lift for clickable cards (e.g. TicketCard).
// Deliberately no padding token — callers pick their own inner spacing to
// keep the component flexible (design_system.md: composition over wide props).

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
        "rounded-lg border border-navy-100 bg-surface shadow-sm",
        interactive &&
          "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-navy-200",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
