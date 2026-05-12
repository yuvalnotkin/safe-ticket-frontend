import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Route-group layout for every auth-gated surface. The gate runs on the
// client (auth state lives in localStorage); server-rendered shell is empty
// until hydration. See src/components/auth/RequireAuth.tsx for the three
// status-driven branches (loading / authenticated / unauthenticated).
export default function AuthedLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
