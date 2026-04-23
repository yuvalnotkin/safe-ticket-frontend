import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Real <input type="checkbox"> (sr-only) for keyboard + a11y; visual box is
// a peer-sibling span with checkmark revealed via
// peer-checked:[&>svg]:opacity-100.

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
          "inline-flex items-center gap-2.5 text-body text-ink",
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
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-border-strong bg-bone text-cream",
            "transition-colors duration-200 ease-out",
            "peer-checked:border-forest-900 peer-checked:bg-forest-900",
            "peer-focus-visible:ring-3 peer-focus-visible:ring-sage/30",
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
