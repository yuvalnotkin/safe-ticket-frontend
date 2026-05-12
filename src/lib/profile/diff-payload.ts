import type { User } from "@/lib/types";

// Form state for the /profile editor. Strings only (the inputs are
// `<input type="text|url">`); the empty string represents "cleared" for
// `phone` and `avatarUrl`, which the API contract accepts as `null`.
// `email` is deliberately absent — the contract rejects it with
// `unrecognized_keys`, so keeping it out of the form state by construction
// is the safest guarantee.
export type ProfileFormState = {
  displayName: string;
  phone: string;
  avatarUrl: string;
};

// Mirrors the strict allow-list documented in API_CONTRACT.md §
// "PUT /api/users/me/profile". Every key is optional; omitted keys are
// left unchanged on the server.
export type ProfileUpdatePayload = {
  displayName?: string;
  phone?: string | null;
  avatarUrl?: string | null;
};

export function buildProfileUpdatePayload(
  baseline: User,
  form: ProfileFormState,
): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {};

  const nextDisplayName = form.displayName.trim();
  if (nextDisplayName !== baseline.displayName) {
    payload.displayName = nextDisplayName;
  }

  const phoneTrimmed = form.phone.trim();
  const nextPhone: string | null = phoneTrimmed === "" ? null : phoneTrimmed;
  if (nextPhone !== baseline.phone) {
    payload.phone = nextPhone;
  }

  const avatarTrimmed = form.avatarUrl.trim();
  const nextAvatarUrl: string | null = avatarTrimmed === "" ? null : avatarTrimmed;
  if (nextAvatarUrl !== baseline.avatarUrl) {
    payload.avatarUrl = nextAvatarUrl;
  }

  return payload;
}
