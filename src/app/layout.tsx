import type { Metadata } from "next";
import { Rubik, Alef } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Alef = Hebrew-first sans display (headlines, hero). Rubik = geometric
// sans (body, UI, small numbers). Both are Hebrew-first — Latin-first
// fonts render Hebrew poorly and are forbidden per design_system.md §2.
const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const alef = Alef({
  subsets: ["latin", "hebrew"],
  weight: ["400", "700"],
  variable: "--font-alef",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Safe Ticket — כרטיסים מאומתים במחיר הנקוב",
    template: "%s · Safe Ticket",
  },
  description:
    "שוק משני של כרטיסים מאומתים. העברה רשמית בלבד. מחיר נקוב בלבד. הכסף בנאמנות עד להשלמת ההעברה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${alef.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLanguage="he">
          <ToastProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
