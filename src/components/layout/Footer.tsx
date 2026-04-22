"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageToggleSegmented } from "./LanguageToggle";

// Global site footer. Trust row repeats the core promise one last time
// before the user leaves; columns are Product / Support / Legal; the
// segmented language toggle sits alongside copyright for end-of-page
// access (plan: "language toggle" also in the footer).

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
    <footer className="border-t border-navy-100 bg-surface py-10">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <p className="mb-8 text-caption font-medium uppercase tracking-wide text-green-700">
          {t("footer.trustRow")}
        </p>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-2">
            <span className="font-display text-h3 font-bold text-navy-900">
              {t("common.appName")}
            </span>
            <p className="text-small text-navy-600">{t("footer.tagline")}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="text-small font-semibold text-navy-900">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-small text-navy-600 hover:text-navy-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-navy-100 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-navy-500">{t("footer.copyright")}</p>
          <LanguageToggleSegmented />
        </div>
      </div>
    </footer>
  );
}
