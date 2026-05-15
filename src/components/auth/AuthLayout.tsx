"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Editorial split-layout used by /login and /signup. Form (left in LTR,
// right in RTL — grid flows with writing direction) sits in a bone card;
// the trust panel sits beside it on desktop and beneath it on mobile.
// Inspired by the home page SellerCta — forest tone with a faint
// stadium image, big serif headline, sage check bullets. Form behavior
// is owned by the calling page; this only wraps it.

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const bullets = [
    t("auth.panelBullet1"),
    t("auth.panelBullet2"),
    t("auth.panelBullet3"),
  ];

  return (
    <section className="flex flex-1 items-stretch px-4 py-12 md:px-12 md:py-20">
      <div className="mx-auto grid w-full max-w-[1120px] gap-6 md:grid-cols-[1.05fr_1fr] md:gap-10">
        <div className="flex items-center">
          <div className="w-full">{children}</div>
        </div>

        <aside className="relative isolate flex min-h-[280px] overflow-hidden rounded-xl bg-forest-900 text-cream shadow-md md:min-h-[560px]">
          <Image
            src="/images/stadium.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 520px, 100vw"
            className="object-cover opacity-30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-900/80 to-forest-950/95"
          />
          <div className="relative flex flex-col justify-between gap-8 p-8 md:p-12">
            <div className="flex flex-col gap-5">
              <span className="text-micro font-medium uppercase tracking-[0.12em] text-sage-soft">
                {t("auth.panelEyebrow")}
              </span>
              <h2 className="whitespace-pre-line font-display text-h1 font-medium leading-[1.08] text-cream md:text-display-md">
                {t("auth.panelHeadline")}
              </h2>
              <ul className="mt-2 flex flex-col gap-4">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage-soft" />
                    <span className="text-body text-ink-on-dark-2">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-caption text-ink-on-dark-2/85">
              {t("auth.panelRefundNote")}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8 12 3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
