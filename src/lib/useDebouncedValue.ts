import { useEffect, useState } from "react";

// Returns `value` delayed by `delayMs`. Used on the search query so every
// keystroke doesn't re-filter on large lists. 200ms matches typing cadence
// — long enough to coalesce keystrokes, short enough to feel instant.
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
