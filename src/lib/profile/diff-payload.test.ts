import { describe, it, expect } from "vitest";
import type { User } from "@/lib/types";
import { buildProfileUpdatePayload, type ProfileFormState } from "./diff-payload";

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "u1",
    email: "a@b.com",
    displayName: "Aviv Cohen",
    phone: "+972-50-1234567",
    avatarUrl: "https://example.com/aviv.jpg",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    ...overrides,
  };
}

function formFromUser(u: User): ProfileFormState {
  return {
    displayName: u.displayName,
    phone: u.phone ?? "",
    avatarUrl: u.avatarUrl ?? "",
  };
}

describe("buildProfileUpdatePayload", () => {
  it("returns an empty object when nothing changed", () => {
    const user = makeUser();
    expect(buildProfileUpdatePayload(user, formFromUser(user))).toEqual({});
  });

  it("includes only the changed displayName", () => {
    const user = makeUser();
    const form = { ...formFromUser(user), displayName: "Aviv C." };
    expect(buildProfileUpdatePayload(user, form)).toEqual({ displayName: "Aviv C." });
  });

  it("trims displayName before comparing and sending", () => {
    const user = makeUser({ displayName: "Aviv" });
    // trailing whitespace only → unchanged
    expect(
      buildProfileUpdatePayload(user, { ...formFromUser(user), displayName: "Aviv " }),
    ).toEqual({});
    // real change with surrounding whitespace → trimmed
    expect(
      buildProfileUpdatePayload(user, { ...formFromUser(user), displayName: "  Aviv C.  " }),
    ).toEqual({ displayName: "Aviv C." });
  });

  it("sends null when phone is cleared", () => {
    const user = makeUser({ phone: "+972-50-1234567" });
    const form = { ...formFromUser(user), phone: "" };
    expect(buildProfileUpdatePayload(user, form)).toEqual({ phone: null });
  });

  it("sends null when phone is cleared down to whitespace", () => {
    const user = makeUser({ phone: "+972-50-1234567" });
    const form = { ...formFromUser(user), phone: "   " };
    expect(buildProfileUpdatePayload(user, form)).toEqual({ phone: null });
  });

  it("does not include phone when baseline was null and form is empty", () => {
    const user = makeUser({ phone: null });
    const form = { ...formFromUser(user), phone: "" };
    expect(buildProfileUpdatePayload(user, form)).toEqual({});
  });

  it("sends the trimmed phone string when changed from null to a value", () => {
    const user = makeUser({ phone: null });
    const form = { ...formFromUser(user), phone: "  +972-50-1234567  " };
    expect(buildProfileUpdatePayload(user, form)).toEqual({ phone: "+972-50-1234567" });
  });

  it("sends null when avatarUrl is cleared", () => {
    const user = makeUser({ avatarUrl: "https://example.com/old.jpg" });
    const form = { ...formFromUser(user), avatarUrl: "" };
    expect(buildProfileUpdatePayload(user, form)).toEqual({ avatarUrl: null });
  });

  it("does not include avatarUrl when baseline was null and form is empty", () => {
    const user = makeUser({ avatarUrl: null });
    const form = { ...formFromUser(user), avatarUrl: "" };
    expect(buildProfileUpdatePayload(user, form)).toEqual({});
  });

  it("never includes email — the form state has no email field by construction", () => {
    const user = makeUser();
    const payload = buildProfileUpdatePayload(user, formFromUser(user));
    expect("email" in payload).toBe(false);
  });

  it("supports multiple simultaneous changes", () => {
    const user = makeUser({
      displayName: "Aviv",
      phone: "+972-50-1234567",
      avatarUrl: "https://old.com/a.jpg",
    });
    const form: ProfileFormState = {
      displayName: "Aviv C.",
      phone: "",
      avatarUrl: "https://new.com/a.jpg",
    };
    expect(buildProfileUpdatePayload(user, form)).toEqual({
      displayName: "Aviv C.",
      phone: null,
      avatarUrl: "https://new.com/a.jpg",
    });
  });
});
