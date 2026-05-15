// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "./page";

const { loginMock, pushMock, fixture } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  pushMock: vi.fn(),
  fixture: { search: "" as string },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(fixture.search),
}));

vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    status: "unauthenticated" as const,
    user: null,
    session: null,
    signup: vi.fn(),
    login: loginMock,
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
  loginMock.mockReset();
  pushMock.mockReset();
  fixture.search = "";
});

afterEach(() => cleanup());

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("auth.email"), {
    target: { value: "a@b.com" },
  });
  fireEvent.change(screen.getByLabelText("auth.password"), {
    target: { value: "password123" },
  });
  return act(async () => {
    fireEvent.submit(
      screen.getByRole("button", { name: "auth.loginCta" }).closest("form")!,
    );
  });
}

describe("LoginPage", () => {
  it("on successful login, redirects to '/' by default (not /profile)", async () => {
    loginMock.mockResolvedValueOnce(undefined);
    render(<LoginPage />);
    await fillAndSubmit();
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("honors ?next=<path> when present (deep-link from RequireAuth)", async () => {
    fixture.search = "next=%2Fprofile";
    loginMock.mockResolvedValueOnce(undefined);
    render(<LoginPage />);
    await fillAndSubmit();
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/profile"));
  });

  it("on login failure, does NOT redirect", async () => {
    loginMock.mockRejectedValueOnce(new Error("boom"));
    render(<LoginPage />);
    await fillAndSubmit();
    await waitFor(() => {
      expect(
        (screen.getByRole("button", { name: "auth.loginCta" }) as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
