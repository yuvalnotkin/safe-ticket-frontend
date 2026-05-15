// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Header } from "./Header";
import type { User } from "@/lib/types";

const FULL_USER: User = {
  id: "u1",
  email: "aviv@example.com",
  displayName: "Aviv Cohen",
  phone: null,
  avatarUrl: null,
  createdAt: "2026-01-15T00:00:00Z",
  updatedAt: "2026-01-15T00:00:00Z",
};

const { fixture, pushMock } = vi.hoisted(() => ({
  fixture: {
    status: "unauthenticated" as "loading" | "authenticated" | "unauthenticated",
    user: null as User | null,
  },
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    status: fixture.status,
    user: fixture.user,
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

vi.mock("./LanguageToggle", () => ({
  LanguageToggle: () => <button>lang</button>,
}));

beforeEach(() => {
  fixture.status = "unauthenticated";
  fixture.user = null;
  pushMock.mockReset();
  // jsdom doesn't implement matchMedia; stub the minimum the Header needs.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(() => cleanup());

describe("Header — mobile greeting", () => {
  it("shows no mobile greeting when unauthenticated", () => {
    fixture.status = "unauthenticated";
    fixture.user = null;
    render(<Header />);
    expect(screen.queryByTestId("mobile-greeting")).toBeNull();
  });

  it("shows no mobile greeting when status is loading", () => {
    fixture.status = "loading";
    fixture.user = null;
    render(<Header />);
    expect(screen.queryByTestId("mobile-greeting")).toBeNull();
  });

  it("shows the mobile greeting with the user's first name when authenticated", () => {
    fixture.status = "authenticated";
    fixture.user = { ...FULL_USER, displayName: "Aviv Cohen" };
    render(<Header />);
    const greeting = screen.getByTestId("mobile-greeting");
    expect(greeting).toBeTruthy();
    // Should contain the first name only, not the last name
    expect(greeting.textContent).toContain("Aviv");
    expect(greeting.textContent).not.toContain("Cohen");
  });

  it("uses the full displayName as first name when there is no space", () => {
    fixture.status = "authenticated";
    fixture.user = { ...FULL_USER, displayName: "Aviv" };
    render(<Header />);
    const greeting = screen.getByTestId("mobile-greeting");
    expect(greeting.textContent).toContain("Aviv");
  });
});
