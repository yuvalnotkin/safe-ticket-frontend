import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Thin border, outline focus (not glow), navy focus color — design_system.md §7.
// Label + hint + error are first-class props so every form field has them by
// construction and a11y (aria-describedby / aria-invalid) wires up automatically.

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  leadingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, id, className, ...rest },
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
          className="text-small font-medium text-navy-800"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-surface px-3",
          "transition-colors duration-150",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-navy-900",
          error
            ? "border-danger"
            : "border-navy-200 hover:border-navy-300 focus-within:border-navy-900",
        )}
      >
        {leadingIcon && (
          <span className="text-navy-400" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 flex-1 bg-transparent text-body text-navy-900 placeholder:text-navy-400",
            "outline-none disabled:cursor-not-allowed disabled:text-navy-400",
            className,
          )}
          {...rest}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-small text-navy-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
