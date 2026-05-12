// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { RequireAuth } from "./RequireAuth";

// Hoisted so the vi.mock factories below can close over the same instances.
const { replaceMock, fixture } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  fixture: {
    status: "loading" as "loading" | "authenticated" | "unauthenticated",
    pathname: "/profile" as string | null,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn(), back: vi.fn() }),
  usePathname: () => fixture.pathname,
}));

vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    status: fixture.status,
    user: null,
    session: null,
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.mock("@/lib/i18n/LanguageProvider", () => ({
  useLanguage: () => ({
    t: (k: string) => k,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

beforeEach(() => {
  replaceMock.mockReset();
  fixture.status = "loading";
  fixture.pathname = "/profile";
});

afterEach(() => cleanup());

describe("RequireAuth", () => {
  it("renders a loading placeholder while status is 'loading' (does not flash redirect)", () => {
    fixture.status = "loading";
    render(
      <RequireAuth>
        <div data-testid="child">secret content</div>
      </RequireAuth>,
    );
    expect(screen.queryByTestId("child")).toBeNull();
    expect(screen.getByTestId("require-auth-loading")).toBeTruthy();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders children when authenticated", () => {
    fixture.status = "authenticated";
    render(
      <RequireAuth>
        <div data-testid="child">secret content</div>
      </RequireAuth>,
    );
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.queryByTestId("require-auth-loading")).toBeNull();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to /login?next=<encoded-path> when unauthenticated", () => {
    fixture.status = "unauthenticated";
    fixture.pathname = "/dashboard/buyer";
    render(
      <RequireAuth>
        <div data-testid="child">secret content</div>
      </RequireAuth>,
    );
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/login?next=%2Fdashboard%2Fbuyer");
    expect(screen.queryByTestId("child")).toBeNull();
  });

  it("falls back to '/' for next when pathname is null", () => {
    fixture.status = "unauthenticated";
    fixture.pathname = null;
    render(
      <RequireAuth>
        <div data-testid="child">secret content</div>
      </RequireAuth>,
    );
    expect(replaceMock).toHaveBeenCalledWith("/login?next=%2F");
  });
});
