// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignupPage from "./page";

const { signupMock, pushMock, toastShowMock, fixture } = vi.hoisted(() => ({
  signupMock: vi.fn(),
  pushMock: vi.fn(),
  toastShowMock: vi.fn(),
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
    signup: signupMock,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ show: toastShowMock }),
}));

vi.mock("@/lib/i18n/LanguageProvider", () => ({
  useLanguage: () => ({
    // Returns the key verbatim except for templated strings, where we mimic the
    // dictionary's `{name}` placeholder so the page's .replace() call has work
    // to do — that's the behaviour the assertions below check.
    t: (k: string) =>
      k === "auth.signupSuccessToast" ? "Welcome, {name}." : k,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

beforeEach(() => {
  signupMock.mockReset();
  pushMock.mockReset();
  toastShowMock.mockReset();
  fixture.search = "";
});

afterEach(() => cleanup());

function fillAndSubmit(displayName = "Aviv Cohen") {
  fireEvent.change(screen.getByLabelText("auth.displayName"), {
    target: { value: displayName },
  });
  fireEvent.change(screen.getByLabelText("auth.email"), {
    target: { value: "a@b.com" },
  });
  fireEvent.change(screen.getByLabelText("auth.password"), {
    target: { value: "password123" },
  });
  return act(async () => {
    fireEvent.submit(
      screen.getByRole("button", { name: "auth.signupCta" }).closest("form")!,
    );
  });
}

describe("SignupPage", () => {
  it("on successful signup, redirects to '/' by default (not /profile)", async () => {
    signupMock.mockResolvedValueOnce(undefined);
    render(<SignupPage />);
    await fillAndSubmit();
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("on successful signup, fires a success toast with the user's first name", async () => {
    signupMock.mockResolvedValueOnce(undefined);
    render(<SignupPage />);
    await fillAndSubmit("Aviv Cohen");
    await waitFor(() => expect(toastShowMock).toHaveBeenCalledTimes(1));
    const [message, opts] = toastShowMock.mock.calls[0];
    // Localization key is rendered raw by the test t() stub; verify the
    // placeholder got replaced with the first name from the form.
    expect(message).toContain("Aviv");
    expect(message).not.toContain("Cohen");
    expect(message).not.toContain("{name}");
    expect(opts).toMatchObject({ tone: "success" });
  });

  it("honors ?next=<path> when present (deep-link from RequireAuth)", async () => {
    fixture.search = "next=%2Fdashboard%2Fbuyer";
    signupMock.mockResolvedValueOnce(undefined);
    render(<SignupPage />);
    await fillAndSubmit();
    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/dashboard/buyer"),
    );
  });

  it("on signup failure, does NOT redirect and does NOT toast", async () => {
    signupMock.mockRejectedValueOnce(new Error("boom"));
    render(<SignupPage />);
    await fillAndSubmit();
    await waitFor(() => {
      // The form re-enables (submitting flips back to false) — that's our
      // marker that the failure path ran.
      expect(
        (screen.getByRole("button", { name: "auth.signupCta" }) as HTMLButtonElement)
          .disabled,
      ).toBe(false);
    });
    expect(pushMock).not.toHaveBeenCalled();
    expect(toastShowMock).not.toHaveBeenCalled();
  });
});
