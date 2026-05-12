"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/Toast";
import { ApiError, updateProfile } from "@/lib/api";
import {
  mapInvalidRequestDetails,
  type FieldErrorMap,
} from "@/lib/auth/error-mapping";
import {
  buildProfileUpdatePayload,
  type ProfileFormState,
} from "@/lib/profile/diff-payload";
import type { User } from "@/lib/types";

const PROFILE_FIELDS = ["displayName", "phone", "avatarUrl"] as const;
type ProfileField = (typeof PROFILE_FIELDS)[number];

function userToForm(u: User): ProfileFormState {
  return {
    displayName: u.displayName,
    phone: u.phone ?? "",
    avatarUrl: u.avatarUrl ?? "",
  };
}

// The contract documents `code: "unrecognized_keys"` as the response when the
// PUT body contains a field outside the allowlist. Our form state has only
// allowed fields by construction, so seeing this is our bug — surface it
// generically rather than dropping it silently.
function hasUnrecognizedKeysIssue(details: unknown): boolean {
  if (!Array.isArray(details)) return false;
  return details.some(
    (d) =>
      d != null &&
      typeof d === "object" &&
      "code" in (d as object) &&
      (d as { code?: unknown }).code === "unrecognized_keys",
  );
}

function formatMemberSince(iso: string, language: string): string {
  try {
    return new Date(iso).toLocaleDateString(language === "he" ? "he-IL" : "en-US", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
}

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState<ProfileFormState>(() =>
    user ? userToForm(user) : { displayName: "", phone: "", avatarUrl: "" },
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap<ProfileField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState<string | null>(null);

  // Re-seed the form when the cached user changes (e.g., after setUser
  // following a successful save) — keeps the baseline in sync.
  useEffect(() => {
    if (user) setForm(userToForm(user));
  }, [user]);

  // user is guaranteed non-null because the (authed) layout's RequireAuth
  // only renders children when status === "authenticated" — which only
  // flips after /auth/me populates user. Bail-out below is defense in depth.
  if (!user) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setFormDetails(null);
    setFieldErrors({});

    const payload = buildProfileUpdatePayload(user, form);
    if (Object.keys(payload).length === 0) {
      toast.show(t("profile.noChanges"), { tone: "info" });
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateProfile(payload);
      setUser(updated);
      toast.show(t("profile.savedToast"), { tone: "success" });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "invalid_request") {
          if (hasUnrecognizedKeysIssue(err.details)) {
            setFormError(t("profile.errorGeneric"));
            setFormDetails(JSON.stringify(err.details));
          } else {
            const fields = mapInvalidRequestDetails(err.details, PROFILE_FIELDS);
            if (Object.keys(fields).length > 0) {
              setFieldErrors(fields);
            } else {
              setFormError(t("profile.errorGeneric"));
              setFormDetails(err.message);
            }
          }
        } else if (err.code === "unauthorized") {
          // 401 — AuthProvider's auth-expired listener has already cleared
          // the session; RequireAuth will redirect on the next render. No
          // duplicate handling here.
        } else {
          setFormError(t("profile.errorGeneric"));
          setFormDetails(err.message);
        }
      } else {
        setFormError(t("profile.errorGeneric"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-8 px-4 py-10 md:px-12 md:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-h1 font-medium leading-tight text-ink">
          {t("profile.title")}
        </h1>
        <p className="text-body text-ink-2">{t("profile.subtitle")}</p>
        <p className="text-caption text-ink-3">
          {t("profile.memberSince").replace(
            "{date}",
            formatMemberSince(user.createdAt, language),
          )}
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          type="email"
          label={t("profile.emailLabel")}
          value={user.email}
          readOnly
          disabled
          hint={t("profile.emailHint")}
          data-testid="profile-email"
        />
        <Input
          type="text"
          label={t("profile.displayNameLabel")}
          placeholder={t("profile.displayNamePlaceholder")}
          value={form.displayName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, displayName: e.target.value }))
          }
          error={fieldErrors.displayName}
          autoComplete="name"
          data-testid="profile-displayName"
          required
        />
        <Input
          type="tel"
          label={t("profile.phoneLabel")}
          placeholder={t("profile.phonePlaceholder")}
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
          error={fieldErrors.phone}
          hint={t("profile.phoneHint")}
          autoComplete="tel"
          inputMode="tel"
          data-testid="profile-phone"
        />
        <Input
          type="url"
          label={t("profile.avatarUrlLabel")}
          placeholder={t("profile.avatarUrlPlaceholder")}
          value={form.avatarUrl}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))
          }
          error={fieldErrors.avatarUrl}
          hint={t("profile.avatarUrlHint")}
          autoComplete="off"
          data-testid="profile-avatarUrl"
        />

        {formError && (
          <div
            role="alert"
            className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-small text-danger"
          >
            {formError}
            {formDetails && (
              <details className="mt-1 text-caption text-ink-3">
                <summary>details</summary>
                <pre className="mt-1 whitespace-pre-wrap break-words">{formDetails}</pre>
              </details>
            )}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          disabled={submitting}
          data-testid="profile-save"
        >
          {submitting ? t("auth.submitting") : t("profile.saveCta")}
        </Button>
      </form>
    </section>
  );
}
