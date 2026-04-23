import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Bone-on-cream field with a 1px warm-grey border. Focus lifts to forest
// border + a subtle sage ring (never a glow). Label + hint + error are
// first-class props so a11y (aria-describedby, aria-invalid) wires up
// automatically for every form field.

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, trailingSlot, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-caption font-medium text-ink-2"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-bone ps-3 pe-3",
          "transition-all duration-200 ease-out",
          "focus-within:ring-3 focus-within:ring-sage/30",
          error
            ? "border-danger"
            : "border-border hover:border-border-strong focus-within:border-forest-900",
        )}
      >
        {leadingIcon && (
          <span className="text-ink-3" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 flex-1 bg-transparent text-body text-ink placeholder:text-ink-3",
            "outline-none disabled:cursor-not-allowed disabled:text-ink-3",
            className,
          )}
          {...rest}
        />
        {trailingSlot}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-caption text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
