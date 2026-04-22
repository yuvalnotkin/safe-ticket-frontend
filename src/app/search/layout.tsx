import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "חיפוש כרטיסים",
  description: "חיפוש כרטיסים מאומתים לאירועי ספורט ותרבות בישראל.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
