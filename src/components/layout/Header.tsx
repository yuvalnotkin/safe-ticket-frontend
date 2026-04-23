"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sheet } from "@/components/ui/Sheet";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Sticky translucent top nav — matches the Cloverly reference:
// `backdrop-filter: blur(12px); background: rgba(244,239,230,0.78)`.
// Mobile collapses nav + Login into a Sheet triggered by the hamburger.
// The Sell CTA gets the ochre reserve treatment (design_system.md §2).

export function Header() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile nav when the viewport crosses up to md (768px+).
  // The hamburger trigger is `md:hidden`, so once the menu is open and the
  // user resizes up — or HMR / back-forward cache preserves menuOpen=true —
  // there'd otherwise be no visible control to close it. Initial check is
  // deferred to avoid sync setState inside the effect body.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) close();
    };
    const id = mq.matches ? window.setTimeout(close, 0) : 0;
    mq.addEventListener("change", onChange);
    return () => {
      window.clearTimeout(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const navLinks: Array<{ label: string; href: string }> = [
    { label: t("nav.browse"), href: "/search" },
    { label: t("nav.howItWorks"), href: "/how-it-works" },
    { label: t("nav.faq"), href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/78 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-4 py-4 md:px-12">
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30 rounded"
          aria-label={t("common.appName")}
        >
          <Image
            src="/brand/logo.svg"
            alt={t("common.appName")}
            width={130}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-small font-medium text-ink transition-colors hover:text-ink-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-small font-medium text-ink-2 hover:text-ink"
          >
            {t("nav.login")}
          </Link>
          <LanguageToggle />
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-md bg-ochre px-5 text-small font-medium text-white transition-colors hover:bg-ochre-deep focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
          >
            {t("nav.sell")}
          </Link>
        </div>

        <div className="ms-auto flex items-center gap-2 md:hidden">
          <Link
            href="/search"
            aria-label={t("nav.searchAria")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-bone focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
          >
            <SearchIcon />
          </Link>
          <LanguageToggle />
          <button
            type="button"
            aria-label={t("nav.menuAria")}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-bone focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t("common.appName")}
      >
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 font-display text-h4 font-medium text-ink hover:bg-cream"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-3 font-display text-h4 font-medium text-ink hover:bg-cream"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "mt-4 inline-flex h-12 items-center justify-center rounded-md",
              "bg-ochre text-body font-medium text-white transition-colors hover:bg-ochre-deep",
            )}
          >
            {t("nav.sell")}
          </Link>
        </nav>
      </Sheet>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m14 14 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
