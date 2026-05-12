// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useEffect } from "react";
import { act, render, screen, waitFor, cleanup } from "@testing-library/react";
import { AuthProvider, useAuth, type AuthContextValue } from "./AuthContext";
import { AUTH_EXPIRED_EVENT } from "../api";

const STORAGE_KEY = "safe-ticket-session";
const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const FULL_USER = {
  id: "u1",
  email: "a@b.com",
  displayName: "Aviv",
  phone: null,
  avatarUrl: null,
  createdAt: "2026-04-01T00:00:00Z",
  updatedAt: "2026-04-01T00:00:00Z",
};

const SESSION = {
  accessToken: "tok",
  refreshToken: "ref",
  expiresAt: 1777281113,
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

type FetchHandler = (url: string, init?: RequestInit) => Response | Promise<Response>;

function setFetchHandler(handler: FetchHandler): void {
  global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init),
  ) as unknown as typeof fetch;
}

function Probe({ onAuth }: { onAuth?: (auth: AuthContextValue) => void }) {
  const auth = useAuth();
  useEffect(() => {
    onAuth?.(auth);
  }, [auth, onAuth]);
  return (
    <div>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="user-id">{auth.user?.id ?? ""}</span>
      <span data-testid="user-displayname">{auth.user?.displayName ?? ""}</span>
      <span data-testid="user-phone">{auth.user?.phone ?? "—"}</span>
    </div>
  );
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://test.local/api";
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  global.fetch = ORIGINAL_FETCH;
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_BASE;
});

describe("AuthProvider — boot", () => {
  it("with no stored session, boots into unauthenticated and never calls /auth/me", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(screen.getByTestId("user-id").textContent).toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("with stored session + /auth/me success, lands authenticated with full User", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    setFetchHandler((url, init) => {
      expect(url).toContain("/auth/me");
      const headers = new Headers(init?.headers);
      expect(headers.get("authorization")).toBe(`Bearer ${SESSION.accessToken}`);
      return jsonResponse(FULL_USER);
    });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });
    expect(screen.getByTestId("user-id").textContent).toBe("u1");
    expect(screen.getByTestId("user-displayname").textContent).toBe("Aviv");
  });

  it("with stored session but /auth/me returns 401, clears storage and becomes unauthenticated", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    setFetchHandler(() =>
      jsonResponse({ error: { code: "unauthorized", message: "stale" } }, 401),
    );
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });

  it("with stored session but /auth/me network error, keeps storage and surfaces unauthenticated", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    global.fetch = vi.fn(async () => {
      throw new TypeError("net");
    }) as unknown as typeof fetch;
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(localStorage.getItem(STORAGE_KEY)).not.toBe(null);
  });

  it("with corrupted JSON in storage, treats as no session", async () => {
    localStorage.setItem(STORAGE_KEY, "{not-json");
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });
});

describe("AuthProvider — signup / login / logout", () => {
  it("signup writes session to storage, fetches /auth/me, lands authenticated", async () => {
    setFetchHandler((url) => {
      if (url.includes("/auth/signup")) {
        return jsonResponse(
          {
            user: { id: FULL_USER.id, email: FULL_USER.email, displayName: FULL_USER.displayName },
            session: SESSION,
          },
          201,
        );
      }
      if (url.includes("/auth/me")) return jsonResponse(FULL_USER);
      throw new Error("unexpected url: " + url);
    });

    let current: AuthContextValue | null = null;
    render(
      <AuthProvider>
        <Probe
          onAuth={(a) => {
            current = a;
          }}
        />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });

    await act(async () => {
      await current!.signup({ email: "a@b.com", password: "password123", displayName: "Aviv" });
    });

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(SESSION));
    expect(screen.getByTestId("user-id").textContent).toBe("u1");
  });

  it("login throws on 401 invalid_credentials and leaves state unauthenticated", async () => {
    setFetchHandler(() =>
      jsonResponse({ error: { code: "invalid_credentials", message: "bad" } }, 401),
    );

    let current: AuthContextValue | null = null;
    render(
      <AuthProvider>
        <Probe
          onAuth={(a) => {
            current = a;
          }}
        />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });

    await expect(
      current!.login({ email: "a@b.com", password: "wrong" }),
    ).rejects.toMatchObject({ code: "invalid_credentials" });
    expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });

  it("logout clears state and storage", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    setFetchHandler((url) => {
      if (url.includes("/auth/me")) return jsonResponse(FULL_USER);
      if (url.includes("/auth/logout")) return new Response(null, { status: 204 });
      throw new Error("unexpected url: " + url);
    });

    let current: AuthContextValue | null = null;
    render(
      <AuthProvider>
        <Probe
          onAuth={(a) => {
            current = a;
          }}
        />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });

    await act(async () => {
      await current!.logout();
    });
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });

  it("logout still clears local state when the server logout call fails", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    setFetchHandler((url) => {
      if (url.includes("/auth/me")) return jsonResponse(FULL_USER);
      if (url.includes("/auth/logout")) {
        return jsonResponse({ error: { code: "server_error", message: "down" } }, 500);
      }
      throw new Error("unexpected url: " + url);
    });

    let current: AuthContextValue | null = null;
    render(
      <AuthProvider>
        <Probe
          onAuth={(a) => {
            current = a;
          }}
        />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });

    await act(async () => {
      await current!.logout();
    });
    expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });
});

describe("AuthProvider — 401 mid-session", () => {
  it("safeticket:auth-expired event clears state without calling /auth/logout", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SESSION));
    const calls: string[] = [];
    setFetchHandler((url) => {
      calls.push(url);
      if (url.includes("/auth/me")) return jsonResponse(FULL_USER);
      if (url.includes("/auth/logout")) throw new Error("must not call /auth/logout");
      throw new Error("unexpected url: " + url);
    });
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });

    await act(async () => {
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    });
    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
    expect(calls.some((c) => c.includes("/auth/logout"))).toBe(false);
  });
});
