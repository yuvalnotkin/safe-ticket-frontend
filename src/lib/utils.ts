// Minimal class-name joiner. Filters out falsy values so variant props can
// toggle classes with `condition && "class"` without extra plumbing.
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
