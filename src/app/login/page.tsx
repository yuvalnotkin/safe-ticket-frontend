"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ApiError } from "@/lib/api";
import {
  mapInvalidRequestDetails,
  type FieldErrorMap,
} from "@/lib/auth/error-mapping";

const LOGIN_FIELDS = ["email", "password"] as const;
type LoginField = (typeof LOGIN_FIELDS)[number];
type FieldErrors = FieldErrorMap<LoginField>;

// Renders an inline form error from an ApiError. Maps the contract's known
// codes to i18n strings; falls back to a generic message + technical detail.
function useAuthErrorCopy() {
  const { t } = useLanguage();
  return {
    invalidCredentials: t("auth.invalidCredentials"),
    invalidRequest: t("auth.invalidRequest"),
    generic: t("auth.genericError"),
  };
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <AuthLayout>
      <div className="w-full rounded-xl border border-border bg-bone p-8 shadow-sm md:p-10" />
    </AuthLayout>
  );
}

function LoginPageInner() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCopy = useAuthErrorCopy();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const next = searchParams.get("next") ?? "/";
  const signupHref = `/signup?next=${encodeURIComponent(next)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormDetails(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "invalid_credentials") {
          setFormError(errorCopy.invalidCredentials);
        } else if (err.code === "invalid_request") {
          const fields = mapInvalidRequestDetails(err.details, LOGIN_FIELDS);
          if (Object.keys(fields).length > 0) {
            setFieldErrors(fields);
          } else {
            setFormError(errorCopy.invalidRequest);
          }
        } else {
          setFormError(errorCopy.generic);
          setFormDetails(err.message);
        }
      } else {
        setFormError(errorCopy.generic);
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full rounded-xl border border-border bg-bone p-8 shadow-sm md:p-10">
        <h1 className="font-display text-h1 font-medium leading-tight text-ink">
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-3 text-body text-ink-2">{t("auth.loginSubtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" noValidate>
          <Input
            type="email"
            label={t("auth.email")}
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            error={fieldErrors.email}
            required
          />
          <Input
            type={showPassword ? "text" : "password"}
            label={t("auth.password")}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={fieldErrors.password}
            trailingSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-caption font-medium text-ink-3 hover:text-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/30 rounded px-1"
                aria-pressed={showPassword}
              >
                {showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              </button>
            }
            required
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

          <Button type="submit" variant="cta" size="lg" loading={submitting}>
            {submitting ? t("auth.submitting") : t("auth.loginCta")}
          </Button>
          <p className="text-caption text-ink-3">{t("auth.termsAgree")}</p>
        </form>

        <p className="mt-6 text-small text-ink-2">
          {t("auth.noAccountQuestion")}{" "}
          <Link href={signupHref} className="font-medium text-forest-900 underline">
            {t("auth.signupLink")}
          </Link>
        </p>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-micro uppercase tracking-[0.12em] text-ink-3">
            {t("common.or")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="md" disabled leadingIcon={<GoogleIcon />}>
            {t("auth.googleCta")}
          </Button>
          <Button variant="secondary" size="md" disabled leadingIcon={<AppleIcon />}>
            {t("auth.appleCta")}
          </Button>
          <p className="mt-1 text-caption text-ink-3">{t("auth.socialDisabled")}</p>
        </div>
      </div>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.8 10.2h-9.6v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.7 3-4.3 3-7.4 0-.7-.1-1.4-.2-2.1z"
        fill="currentColor"
      />
      <path
        d="M12.2 22c2.6 0 4.8-.9 6.4-2.3l-3.3-2.6c-.9.6-2.1 1-3.1 1a5.4 5.4 0 0 1-5.1-3.7H3.7v2.4A9.8 9.8 0 0 0 12.2 22z"
        fill="currentColor"
        opacity=".6"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.4 12.5c0-2.4 2-3.6 2.1-3.6-1.2-1.7-3-2-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.6 1.3 0 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.1-2.5.7-1 1.2-2.1 1.5-3.2-1.9-.7-3.2-2.5-3.2-4zM13.7 5.3c.7-.8 1.2-2 1-3.3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.3-.5 3-1.2z" />
    </svg>
  );
}
