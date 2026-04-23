"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/Toast";

// UI-only. Submit fires a "not yet available" toast; social buttons are
// disabled until public launch. Centered card on the cream surface.

export default function LoginPage() {
  const { t } = useLanguage();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    toast.show(t("toast.notYetAvailable"), { tone: "info" });
  }

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20 md:py-24">
      <div className="w-full max-w-md rounded-xl border border-border bg-bone p-8 shadow-sm md:p-10">
        <h1 className="font-display text-h1 font-medium leading-tight text-ink">
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-3 text-body text-ink-2">{t("auth.loginSubtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <Input
            type="email"
            label={t("auth.email")}
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            type="tel"
            label={t("auth.phone")}
            placeholder={t("auth.phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
          />
          <Button type="submit" variant="cta" size="lg">
            {t("auth.continueCta")}
          </Button>
          <p className="text-caption text-ink-3">{t("auth.termsAgree")}</p>
        </form>

        <div className="my-8 flex items-center gap-3">
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
          <p className="text-caption text-ink-3">{t("auth.socialDisabled")}</p>
        </div>

        <div className="mt-8 rounded-md border border-sage/30 bg-success-bg p-4">
          <p className="text-small text-forest-900">{t("auth.trustCopy")}</p>
        </div>
      </div>
    </section>
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
