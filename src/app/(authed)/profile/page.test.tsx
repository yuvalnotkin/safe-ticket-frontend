// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProfilePage from "./page";
import { ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

const FULL_USER: User = {
  id: "u1",
  email: "aviv@example.com",
  displayName: "Aviv Cohen",
  phone: "+972-50-1234567",
  avatarUrl: null,
  createdAt: "2026-01-15T00:00:00Z",
  updatedAt: "2026-01-15T00:00:00Z",
};

const { updateProfileMock, setUserMock, toastShowMock, fixture } = vi.hoisted(() => ({
  updateProfileMock: vi.fn(),
  setUserMock: vi.fn(),
  toastShowMock: vi.fn(),
  fixture: { user: null as User | null },
}));

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    updateProfile: updateProfileMock,
  };
});

vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => ({
    status: "authenticated" as const,
    user: fixture.user,
    session: null,
    setUser: setUserMock,
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
  }),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ show: toastShowMock }),
}));

vi.mock("@/lib/i18n/LanguageProvider", () => ({
  useLanguage: () => ({
    t: (k: string) => k,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

beforeEach(() => {
  updateProfileMock.mockReset();
  setUserMock.mockReset();
  toastShowMock.mockReset();
  fixture.user = { ...FULL_USER };
});

afterEach(() => cleanup());

function getInputByTestId(testId: string): HTMLInputElement {
  // <Input> spreads `data-testid` onto the inner <input> element directly,
  // so the testId-targeted node already IS the input.
  return screen.getByTestId(testId) as HTMLInputElement;
}

describe("ProfilePage", () => {
  it("seeds the form from the authed user", () => {
    render(<ProfilePage />);
    expect(getInputByTestId("profile-displayName").value).toBe("Aviv Cohen");
    expect(getInputByTestId("profile-phone").value).toBe("+972-50-1234567");
    expect(getInputByTestId("profile-avatarUrl").value).toBe("");
    expect(getInputByTestId("profile-email").value).toBe("aviv@example.com");
  });

  it("renders the email field as disabled (contract: email is read-only here)", () => {
    render(<ProfilePage />);
    expect(getInputByTestId("profile-email").disabled).toBe(true);
  });

  it("on submit with no changes, shows the noChanges toast and does NOT call updateProfile", async () => {
    render(<ProfilePage />);
    fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    expect(updateProfileMock).not.toHaveBeenCalled();
    expect(toastShowMock).toHaveBeenCalledWith("profile.noChanges", { tone: "info" });
  });

  it("on successful submit, calls updateProfile with only the changed keys and setUser with the response", async () => {
    const updated: User = { ...FULL_USER, displayName: "Aviv C.", updatedAt: "2026-05-12T00:00:00Z" };
    updateProfileMock.mockResolvedValueOnce(updated);
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-displayName"), { target: { value: "Aviv C." } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    expect(updateProfileMock).toHaveBeenCalledWith({ displayName: "Aviv C." });
    await waitFor(() => expect(setUserMock).toHaveBeenCalledWith(updated));
    expect(toastShowMock).toHaveBeenCalledWith("profile.savedToast", { tone: "success" });
  });

  it("on clear-phone, sends phone: null in the payload", async () => {
    updateProfileMock.mockResolvedValueOnce({ ...FULL_USER, phone: null });
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-phone"), { target: { value: "" } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    expect(updateProfileMock).toHaveBeenCalledWith({ phone: null });
  });

  it("maps invalid_request details with a phone path to an inline phone error", async () => {
    updateProfileMock.mockRejectedValueOnce(
      new ApiError({
        code: "invalid_request",
        message: "validation failed",
        status: 400,
        details: [
          { path: ["phone"], message: "phone format invalid", code: "invalid_string" },
        ],
      }),
    );
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-phone"), { target: { value: "abc" } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    await waitFor(() => {
      expect(screen.getByText("phone format invalid")).toBeTruthy();
    });
    expect(setUserMock).not.toHaveBeenCalled();
    expect(toastShowMock).not.toHaveBeenCalled();
  });

  it("on invalid_request with unrecognized_keys, renders the generic error block (not silent)", async () => {
    updateProfileMock.mockRejectedValueOnce(
      new ApiError({
        code: "invalid_request",
        message: "validation failed",
        status: 400,
        details: [
          { path: ["email"], message: "unrecognized", code: "unrecognized_keys" },
        ],
      }),
    );
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-displayName"), { target: { value: "X" } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain("profile.errorGeneric");
    });
    expect(setUserMock).not.toHaveBeenCalled();
  });

  it("on a generic api error code, renders the generic error block with the message", async () => {
    updateProfileMock.mockRejectedValueOnce(
      new ApiError({
        code: "server_error",
        message: "boom",
        status: 500,
      }),
    );
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-displayName"), { target: { value: "X" } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toContain("profile.errorGeneric");
      expect(alert.textContent).toContain("boom");
    });
  });

  it("on unauthorized, does NOT render a page-level error (AuthProvider handles redirect)", async () => {
    updateProfileMock.mockRejectedValueOnce(
      new ApiError({
        code: "unauthorized",
        message: "stale token",
        status: 401,
      }),
    );
    render(<ProfilePage />);

    fireEvent.change(getInputByTestId("profile-displayName"), { target: { value: "X" } });
    await act(async () => {
      fireEvent.submit(screen.getByTestId("profile-save").closest("form")!);
    });

    expect(screen.queryByRole("alert")).toBeNull();
    expect(setUserMock).not.toHaveBeenCalled();
  });
});
