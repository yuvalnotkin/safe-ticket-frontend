import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Native <select> styled to match Input. Deliberately not a custom dropdown —
// native selects are a11y-complete and behave correctly on mobile (iOS picker,
// Android menu). The caret is drawn with a background-image so the control
// reads as interactive on both light and dark surfaces.

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
            className="text-small font-medium text-navy-800"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-md border border-navy-200 bg-surface",
            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-navy-900",
            "hover:border-navy-300 focus-within:border-navy-900",
          )}
        >
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-11 w-full appearance-none bg-transparent ps-3 pe-10 text-body text-navy-900",
              "outline-none disabled:cursor-not-allowed disabled:text-navy-400",
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
            className="pointer-events-none absolute end-3 h-4 w-4 text-navy-500"
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
