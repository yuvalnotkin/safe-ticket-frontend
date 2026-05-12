"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Gates the route group at src/app/(authed)/ — and reusable for any page
// that should not render to anonymous viewers.
//
// Three states from useAuth().status:
//   "loading"        → render a quiet placeholder; DO NOT redirect (a hard
//                      reload by an authenticated user must not flash through
//                      the unauthenticated branch).
//   "authenticated"  → render children.
//   "unauthenticated"→ replace() to /login?next=<current-path> so the user
//                      lands back on the originally-requested page after
//                      logging in. replace, not push — the gated URL
//                      shouldn't pollute the back button.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    if (status !== "unauthenticated") return;
    const next = pathname ?? "/";
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [status, pathname, router]);

  if (status === "authenticated") return <>{children}</>;

  if (status === "loading") {
    return (
      <section
        data-testid="require-auth-loading"
        className="flex flex-1 items-center justify-center px-6 py-20 md:py-24"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-3 text-ink-3">
          <Spinner />
          <p className="text-small">{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  // unauthenticated — the effect above fires router.replace(); render nothing
  // in the meantime to avoid a flash of protected content.
  return null;
}

function Spinner() {
  return (
    <svg
      className="h-6 w-6 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
