"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api";
import {
  mapInvalidRequestDetails,
  type FieldErrorMap,
} from "@/lib/auth/error-mapping";

const SIGNUP_FIELDS = ["email", "password", "displayName"] as const;
type SignupField = (typeof SIGNUP_FIELDS)[number];
type FieldErrors = FieldErrorMap<SignupField>;

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageFallback() {
  return (
    <AuthLayout>
      <div className="w-full rounded-xl border border-border bg-bone p-8 shadow-sm md:p-10" />
    </AuthLayout>
  );
}

function SignupPageInner() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const { show: showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const next = searchParams.get("next") ?? "/";
  const loginHref = `/login?next=${encodeURIComponent(next)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormDetails(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await signup({ email, password, displayName });
      const firstName = displayName.split(/\s+/)[0];
      showToast(
        t("auth.signupSuccessToast").replace("{name}", firstName),
        { tone: "success" },
      );
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "signup_failed") {
          setFormError(t("auth.signupFailed"));
        } else if (err.code === "invalid_request") {
          const fields = mapInvalidRequestDetails(err.details, SIGNUP_FIELDS);
          if (Object.keys(fields).length > 0) {
            setFieldErrors(fields);
          } else {
            setFormError(t("auth.invalidRequest"));
          }
        } else {
          setFormError(t("auth.genericError"));
          setFormDetails(err.message);
        }
      } else {
        setFormError(t("auth.genericError"));
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full rounded-xl border border-border bg-bone p-8 shadow-sm md:p-10">
        <h1 className="font-display text-h1 font-medium leading-tight text-ink">
          {t("auth.signupTitle")}
        </h1>
        <p className="mt-3 text-body text-ink-2">{t("auth.signupSubtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" noValidate>
          <Input
            type="text"
            label={t("auth.displayName")}
            placeholder={t("auth.displayNamePlaceholder")}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            error={fieldErrors.displayName}
            minLength={1}
            maxLength={80}
            required
          />
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
            hint={t("auth.passwordMinHint")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            error={fieldErrors.password}
            minLength={8}
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
            {submitting ? t("auth.submitting") : t("auth.signupCta")}
          </Button>
          <p className="text-caption text-ink-3">{t("auth.termsAgree")}</p>
        </form>

        <p className="mt-6 text-small text-ink-2">
          {t("auth.haveAccountQuestion")}{" "}
          <Link href={loginHref} className="font-medium text-forest-900 underline">
            {t("auth.loginLink")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
