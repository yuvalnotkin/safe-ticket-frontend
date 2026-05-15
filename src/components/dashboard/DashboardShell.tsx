"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Shared structure for the auth-gated dashboard shells (buyer + seller).
// The dashboards have no real data yet (Phase 3 surfaces), so this gives
// them weight: editorial header band + soft empty-state card + a "what
// you'll find here" preview strip. Anti-pattern guarded against:
// previewItems are dashed-bordered + ink-3 muted so they read as a
// roadmap, not as fake data masquerading as real cards.

export type PreviewItem = {
  icon: ReactNode;
  title: string;
  body: string;
};

export type DashboardShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  empty: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: { href: string; label: string };
    icon: ReactNode;
  };
  preview: {
    eyebrow: string;
    items: [PreviewItem, PreviewItem, PreviewItem];
  };
};

export function DashboardShell({
  eyebrow,
  title,
  subtitle,
  empty,
  preview,
}: DashboardShellProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(/\s+/)[0] ?? "";
  const greeting = firstName
    ? t("dashboard.greeting").replace("{name}", firstName)
    : null;

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-12 px-4 py-10 md:gap-16 md:px-12 md:py-16">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
            {eyebrow}
          </span>
          {greeting && (
            <span className="text-caption text-ink-3">· {greeting}</span>
          )}
        </div>
        <h1 className="font-display text-h1 font-medium leading-tight text-ink md:text-display-md">
          {title}
        </h1>
        <p className="max-w-[560px] text-body-lg text-ink-2">{subtitle}</p>
        <span aria-hidden="true" className="mt-1 block h-px w-12 bg-sage" />
      </header>

      <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-bone p-10 text-center shadow-xs md:p-16">
        <span
          aria-hidden="true"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-sage"
        >
          {empty.icon}
        </span>
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {empty.eyebrow}
        </span>
        <h2 className="max-w-md font-display text-h2 font-medium leading-tight text-ink">
          {empty.heading}
        </h2>
        <p className="max-w-md text-body text-ink-2">{empty.body}</p>
        <Link
          href={empty.cta.href}
          className="mt-2 inline-flex h-11 items-center rounded-md border border-forest-900 px-5 text-small font-medium text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
        >
          {empty.cta.label}
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {preview.eyebrow}
        </span>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {preview.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-lg border border-dashed border-border-strong bg-cream/40 p-6"
            >
              <span aria-hidden="true" className="text-sage">
                {item.icon}
              </span>
              <h3 className="font-display text-h4 font-medium text-ink">
                {item.title}
              </h3>
              <p className="text-small text-ink-3">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
