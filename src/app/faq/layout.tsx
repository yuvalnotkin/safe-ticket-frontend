import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description:
    "המידע שאנחנו נשאלים הכי הרבה — אימות, נאמנות, החזרים, ספקים ופרטיות.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
