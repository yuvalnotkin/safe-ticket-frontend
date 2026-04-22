import type { Metadata } from "next";
import { Rubik, Assistant } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Rubik = display (headlines, prices, CTAs). Assistant = body (all other text).
// Both are Hebrew-first typefaces; Latin-first fonts (Inter/Roboto) are forbidden
// per design_system.md §2. next/font self-hosts, avoiding runtime requests and
// layout shift.
const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Safe Ticket — כרטיסים מאומתים במחיר הנקוב",
    template: "%s · Safe Ticket",
  },
  description:
    "פלטפורמת מכירה חוזרת של כרטיסים מאומתים במחיר הנקוב בלבד. העברה רשמית, נאמנות, ללא הונאות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hebrew is the server-rendered default. The LanguageProvider updates
  // <html> lang/dir client-side when the user toggles via the header or
  // footer controls.
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${assistant.variable} h-full antialiased`}
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
