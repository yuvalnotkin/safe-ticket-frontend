import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Uses a real <input type="checkbox"> (sr-only) for keyboard + a11y
// behavior; the visual box is a peer-sibling span. The checkmark SVG lives
// inside the visual span and is made visible via an arbitrary-selector
// variant: peer-checked:[&>svg]:opacity-100 (when the peer is checked,
// direct-child svg's opacity goes from 0 → 1).

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  label: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, id, className, disabled, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2 text-body text-navy-800",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-navy-300 bg-surface text-white",
            "transition-colors duration-150",
            "peer-checked:border-navy-900 peer-checked:bg-navy-900",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy-900",
            "peer-checked:[&>svg]:opacity-100",
          )}
        >
          <svg
            className="h-3.5 w-3.5 opacity-0 transition-opacity"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m3.5 8.5 3 3 6-7"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>{label}</span>
      </label>
    );
  },
);
