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

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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

  const memberSince = t("profile.memberSince").replace(
    "{date}",
    formatMemberSince(user.createdAt, language),
  );

  return (
    <section className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-10 px-4 py-10 md:gap-12 md:px-12 md:py-16">
      <header className="flex flex-col gap-3">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {t("profile.identityEyebrow")}
        </span>
        <h1 className="font-display text-h1 font-medium leading-tight text-ink md:text-display-md">
          {t("profile.title")}
        </h1>
        <p className="max-w-[560px] text-body-lg text-ink-2">
          {t("profile.subtitle")}
        </p>
      </header>

      <div className="flex flex-col items-start gap-5 rounded-lg border border-border bg-bone p-6 shadow-xs md:flex-row md:items-center md:gap-7 md:p-8">
        <Avatar
          url={user.avatarUrl ?? ""}
          fallbackInitials={initialsOf(user.displayName)}
          size="lg"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate font-display text-h3 font-medium leading-tight text-ink">
            {user.displayName}
          </p>
          <p className="truncate text-small text-ink-2" dir="ltr">
            {user.email}
          </p>
          <p className="text-caption text-ink-3">{memberSince}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
            {t("profile.editEyebrow")}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

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
          <div className="flex flex-col gap-3">
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
            <div className="flex items-center gap-3">
              <Avatar
                url={form.avatarUrl}
                fallbackInitials={initialsOf(form.displayName || user.displayName)}
                size="sm"
              />
              <span className="text-caption text-ink-3">
                {t("profile.avatarPreviewLabel")}
              </span>
            </div>
          </div>

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
      </div>
    </section>
  );
}

// Inline avatar primitive — image from `url` if it loads, initials fallback
// over forest-900 otherwise. `erroredUrl` tracks the last URL that failed
// to load; we derive `errored` from it during render so a fresh URL
// retries automatically without a setState-in-effect dance.
function Avatar({
  url,
  fallbackInitials,
  size,
}: {
  url: string;
  fallbackInitials: string;
  size: "sm" | "lg";
}) {
  const [erroredUrl, setErroredUrl] = useState<string | null>(null);
  const errored = erroredUrl !== null && erroredUrl === url;

  const showImage = url.trim().length > 0 && !errored;
  const sizeClasses =
    size === "lg"
      ? "h-20 w-20 text-h2"
      : "h-12 w-12 text-body-lg";

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        onError={() => setErroredUrl(url)}
        className={`${sizeClasses} shrink-0 rounded-full border border-border object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClasses} inline-flex shrink-0 items-center justify-center rounded-full bg-forest-900 font-display font-medium text-cream`}
    >
      {fallbackInitials}
    </span>
  );
}
