"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageToggleSegmented } from "./LanguageToggle";

// Forest-green footer with cream content, per the Cloverly reference. Trust
// row is the repeated promise one last time before the user leaves; columns
// are Product / Support / Legal; segmented language toggle sits alongside
// copyright.

export function Footer() {
  const { t } = useLanguage();

  const columns: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }> = [
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.browse"), href: "/search" },
        { label: t("footer.sell"), href: "/login" },
        { label: t("footer.howItWorks"), href: "/how-it-works" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.faq"), href: "/faq" },
        { label: t("footer.contact"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.terms"), href: "#" },
        { label: t("footer.privacy"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-forest-900 py-16 text-cream md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Image
              src="/brand/logo-cream.svg"
              alt={t("common.appName")}
              width={130}
              height={28}
              className="h-7 w-auto"
            />
            <p className="max-w-[320px] text-body leading-[1.6] text-ink-on-dark-2">
              {t("footer.tagline")}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h4 className="text-micro font-semibold uppercase tracking-[0.12em] text-ink-on-dark-2">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-small text-cream transition-opacity hover:opacity-80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border-on-dark pt-6">
          <p className="text-micro font-medium uppercase tracking-[0.08em] text-ink-on-dark-2">
            {t("footer.trustRow")}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-ink-on-dark-2">
            {t("footer.copyright")}
          </p>
          <LanguageToggleSegmented />
        </div>
      </div>
    </footer>
  );
}
