import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Native <select> styled to match Input. Native is deliberate — a11y-complete
// and renders correctly on mobile (iOS picker, Android menu).

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
};

export type SelectProps<V extends string = string> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  label?: ReactNode;
  options: ReadonlyArray<SelectOption<V>>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, options, id, className, ...rest }, ref) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-caption font-medium text-ink-2"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-md border border-border bg-bone",
            "transition-all duration-200 ease-out",
            "hover:border-border-strong focus-within:border-forest-900 focus-within:ring-3 focus-within:ring-sage/30",
          )}
        >
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-11 w-full appearance-none bg-transparent ps-3 pe-10 text-body text-ink",
              "outline-none disabled:cursor-not-allowed disabled:text-ink-3",
              className,
            )}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute end-3 h-4 w-4 text-ink-3"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  },
);
