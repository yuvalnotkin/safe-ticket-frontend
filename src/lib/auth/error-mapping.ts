// Translates the backend's `invalid_request` Zod issue array into a
// per-field error map the form can render. The contract documents each
// issue as `{ path: string[], message: string, code: string }`; we filter
// down to only the fields the calling form actually renders so a stray
// server-side `code: "unrecognized_keys"` issue can't bind to a non-existent
// input.

export type FieldErrorMap<Field extends string> = Partial<Record<Field, string>>;

export function mapInvalidRequestDetails<Field extends string>(
  details: unknown,
  allowedFields: ReadonlyArray<Field>,
): FieldErrorMap<Field> {
  if (!Array.isArray(details)) return {};
  const out: FieldErrorMap<Field> = {};
  for (const item of details) {
    if (!item || typeof item !== "object") continue;
    const path = (item as { path?: unknown }).path;
    const message = (item as { message?: unknown }).message;
    if (!Array.isArray(path) || typeof message !== "string") continue;
    const field = path[0];
    if (typeof field !== "string") continue;
    if ((allowedFields as ReadonlyArray<string>).includes(field)) {
      (out as Record<string, string>)[field] = message;
    }
  }
  return out;
}
