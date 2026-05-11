import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  ApiError,
  setTokenGetter,
  listListings,
  getListing,
  signup,
  login,
  logout,
  me,
  getProfile,
  updateProfile,
} from "./api";
import type { ListingsQuery } from "./types";

const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function mockFetchOk(body: unknown, status = 200) {
  global.fetch = vi.fn(async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

function mockFetchError(envelope: unknown, status: number) {
  global.fetch = vi.fn(async () =>
    new Response(JSON.stringify(envelope), {
      status,
      headers: { "content-type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://test.local/api";
  setTokenGetter(() => null);
});

afterEach(() => {
  global.fetch = ORIGINAL_FETCH;
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_BASE;
});

describe("env reader", () => {
  it("throws loud when NEXT_PUBLIC_API_BASE_URL is undefined", async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    mockFetchOk({ items: [], page: 1, limit: 20, total: 0 });
    await expect(listListings({})).rejects.toThrow(/NEXT_PUBLIC_API_BASE_URL/);
  });
});

describe("ApiError parsing", () => {
  it("parses backend error envelope on non-2xx", async () => {
    mockFetchError(
      { error: { code: "listing_not_found", message: "not found" } },
      404,
    );
    try {
      await getListing("does-not-exist");
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      const err = e as ApiError;
      expect(err.code).toBe("listing_not_found");
      expect(err.status).toBe(404);
      expect(err.message).toBe("not found");
    }
  });

  it("wraps network failures as ApiError with code 'network_error'", async () => {
    global.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    try {
      await listListings({});
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).code).toBe("network_error");
      expect((e as ApiError).status).toBe(0);
    }
  });
});

describe("Authorization header", () => {
  it("omits Authorization when token getter returns null", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    await me().catch(() => {});
    const init = (fetchMock.mock.calls[0]?.[1] ?? {}) as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.has("authorization")).toBe(false);
  });

  it("attaches Bearer token when getter returns a string", async () => {
    setTokenGetter(() => "token-abc");
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    await me().catch(() => {});
    const init = (fetchMock.mock.calls[0]?.[1] ?? {}) as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get("authorization")).toBe("Bearer token-abc");
  });
});

describe("listListings query-param serialization", () => {
  it("joins array params with commas (cities, providers)", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ items: [], page: 1, limit: 20, total: 0 }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    await listListings({
      cities: ["Tel Aviv", "Haifa"],
      // Cast: the test exercises comma-join serialization; the second slug
      // is contract-valid post-Task 6 but not yet in the union here.
      providers: ["leaan", "tmura"] as ListingsQuery["providers"],
      page: 2,
      limit: 50,
    });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("cities=Tel+Aviv%2CHaifa");
    expect(url).toContain("providers=leaan%2Ctmura");
    expect(url).toContain("page=2");
    expect(url).toContain("limit=50");
  });

  it("omits undefined params", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ items: [], page: 1, limit: 20, total: 0 }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    await listListings({ q: "maccabi" });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("q=maccabi");
    expect(url).not.toContain("page=");
    expect(url).not.toContain("limit=");
    expect(url).not.toContain("cities=");
  });
});

describe("endpoints exist", () => {
  beforeEach(() => {
    mockFetchOk({});
  });
  it("signup returns the parsed body", async () => {
    mockFetchOk({ user: { id: "u1" }, session: { accessToken: "t" } });
    const out = await signup({ email: "a@b.com", password: "x", displayName: "A" });
    expect(out.user.id).toBe("u1");
  });
  it("login returns the parsed body", async () => {
    mockFetchOk({ user: { id: "u1" }, session: { accessToken: "t" } });
    const out = await login({ email: "a@b.com", password: "x" });
    expect(out.user.id).toBe("u1");
  });
  it("logout resolves on 204", async () => {
    global.fetch = vi.fn(async () => new Response(null, { status: 204 })) as unknown as typeof fetch;
    await expect(logout()).resolves.toBeUndefined();
  });
  it("getProfile returns parsed body", async () => {
    mockFetchOk({ id: "u1", email: "a@b.com", displayName: "A", phone: null, avatarUrl: null, createdAt: "", updatedAt: "" });
    const out = await getProfile();
    expect(out.id).toBe("u1");
  });
  it("updateProfile sends a PUT with body", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ id: "u1", email: "a@b.com", displayName: "B", phone: null, avatarUrl: null, createdAt: "", updatedAt: "" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    await updateProfile({ displayName: "B" });
    const init = (fetchMock.mock.calls[0]?.[1] ?? {}) as RequestInit;
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body as string)).toEqual({ displayName: "B" });
  });
});
