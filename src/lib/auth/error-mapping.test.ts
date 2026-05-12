import { describe, it, expect } from "vitest";
import { mapInvalidRequestDetails } from "./error-mapping";

describe("mapInvalidRequestDetails", () => {
  it("returns an empty object when details is not an array", () => {
    expect(mapInvalidRequestDetails(undefined, ["email"])).toEqual({});
    expect(mapInvalidRequestDetails(null, ["email"])).toEqual({});
    expect(mapInvalidRequestDetails({ foo: "bar" }, ["email"])).toEqual({});
  });

  it("extracts allowed field errors from a Zod issue array", () => {
    const details = [
      { path: ["email"], message: "Invalid email", code: "invalid_string" },
      { path: ["password"], message: "Too short", code: "too_small" },
    ];
    expect(
      mapInvalidRequestDetails(details, ["email", "password", "displayName"]),
    ).toEqual({ email: "Invalid email", password: "Too short" });
  });

  it("ignores issues whose path[0] is not in the allowed list", () => {
    const details = [
      { path: ["unknownField"], message: "Hi", code: "x" },
      { path: ["email"], message: "Bad", code: "y" },
    ];
    expect(mapInvalidRequestDetails(details, ["email"])).toEqual({ email: "Bad" });
  });

  it("ignores malformed issues", () => {
    const details = [
      { path: "email", message: "no array path" },
      { path: ["email"] },
      null,
      "string",
    ];
    expect(mapInvalidRequestDetails(details, ["email"])).toEqual({});
  });
});
