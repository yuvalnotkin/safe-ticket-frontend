"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  AUTH_EXPIRED_EVENT,
  login as loginRequest,
  logout as logoutRequest,
  me as meRequest,
  setTokenGetter,
  signup as signupRequest,
} from "@/lib/api";
import type { Session, User } from "@/lib/types";

const STORAGE_KEY = "safe-ticket-session";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  signup: (payload: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  // Replace the cached user (used by /profile after a successful save so the
  // PUT response propagates to nav greeting etc. without a second network
  // call — the contract guarantees PUT response is the same shape as GET).
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (
      typeof parsed?.accessToken === "string" &&
      typeof parsed?.refreshToken === "string" &&
      typeof parsed?.expiresAt === "number"
    ) {
      return parsed;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeStoredSession(session: Session): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Compute the initial session synchronously from localStorage so the
  // "no stored session → unauthenticated" path doesn't need a setState in an
  // effect. On SSR the lazy initializer returns null (no window), which
  // matches what the first client hydration sees in the no-session case.
  // The session-present case still renders "loading" until /auth/me resolves,
  // which is fine for hydration — the nav renders identically for "loading"
  // and "unauthenticated".
  const [session, setSession] = useState<Session | null>(() => readStoredSession());
  const [status, setStatus] = useState<AuthStatus>(() =>
    readStoredSession() ? "loading" : "unauthenticated",
  );
  const [user, setUser] = useState<User | null>(null);

  // Keep the latest session in a ref so the token-getter installed on api.ts
  // reads the current value without us re-installing the getter on every
  // render. Updating the ref inside an effect (not in render) keeps React's
  // refs-during-render rule happy.
  const sessionRef = useRef<Session | null>(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    setTokenGetter(() => sessionRef.current?.accessToken ?? null);
    return () => {
      setTokenGetter(() => null);
    };
  }, []);

  const teardown = useCallback(() => {
    clearStoredSession();
    sessionRef.current = null;
    setSession(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const hydrateMe = useCallback(async (nextSession: Session): Promise<void> => {
    setSession(nextSession);
    sessionRef.current = nextSession;
    const fullUser = await meRequest();
    setUser(fullUser);
    setStatus("authenticated");
  }, []);

  // Hydrate /auth/me once at mount if we booted with a stored session.
  useEffect(() => {
    if (!sessionRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const fullUser = await meRequest();
        if (cancelled) return;
        setUser(fullUser);
        setStatus("authenticated");
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          // Stale token — clear it silently.
          clearStoredSession();
          sessionRef.current = null;
          setSession(null);
          setStatus("unauthenticated");
          return;
        }
        // Network or other transient failure: keep storage, surface as unauth
        // so the UI doesn't strand the user in a permanent spinner.
        sessionRef.current = null;
        setSession(null);
        setStatus("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for 401-derived auth-expired events from the api layer.
  useEffect(() => {
    const handler = () => {
      teardown();
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [teardown]);

  // Cross-tab sync: if another tab removes the session, mirror that here.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === null && sessionRef.current !== null) {
        setSession(null);
        sessionRef.current = null;
        setUser(null);
        setStatus("unauthenticated");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const signup = useCallback<AuthContextValue["signup"]>(
    async (payload) => {
      const { session: nextSession } = await signupRequest(payload);
      writeStoredSession(nextSession);
      await hydrateMe(nextSession);
    },
    [hydrateMe],
  );

  const login = useCallback<AuthContextValue["login"]>(
    async (payload) => {
      const { session: nextSession } = await loginRequest(payload);
      writeStoredSession(nextSession);
      await hydrateMe(nextSession);
    },
    [hydrateMe],
  );

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    try {
      await logoutRequest();
    } catch {
      // Best-effort server-side revoke — clear locally even if it fails.
    }
    teardown();
  }, [teardown]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, session, signup, login, logout, setUser }),
    [status, user, session, signup, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
