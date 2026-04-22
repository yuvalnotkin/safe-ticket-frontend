import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "כניסה",
  description: "כניסה או הרשמה ל-Safe Ticket עם אימייל וטלפון.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
