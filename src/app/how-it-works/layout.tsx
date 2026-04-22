import type { Metadata } from "next";

// Route-level metadata. Split from page.tsx because that file is marked
// "use client"; metadata exports only work from server components.
export const metadata: Metadata = {
  title: "איך זה עובד",
  description:
    "חמישה שלבים: התחברות, אימות, פרסום, העברה רשמית, ושחרור הכסף מהנאמנות.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
