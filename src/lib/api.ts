import type {
  Listing,
  ListingsQuery,
  ListingsResponse,
  Profile,
  Session,
  User,
} from "./types";

// --- Errors ---

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(args: { code: string; message: string; status: number; details?: unknown }) {
    super(args.message);
    this.name = "ApiError";
    this.code = args.code;
    this.status = args.status;
    this.details = args.details;
  }
}

// --- Token getter (swappable) ---

type TokenGetter = () => string | null;
let tokenGetter: TokenGetter = () => null;

export function setTokenGetter(fn: TokenGetter): void {
  tokenGetter = fn;
}

// --- Env ---

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.local.example to .env.local for local dev.",
    );
  }
  return base.replace(/\/+$/, "");
}

// --- Core request ---

type RequestOpts = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, unknown>;
  body?: unknown;
  parseJson?: boolean; // default true; set false for 204
};

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const base = getApiBaseUrl();
  const url = new URL(base + path, base.startsWith("http") ? undefined : "http://localhost");

  if (opts.query) {
    for (const [key, value] of Object.entries(opts.query)) {
      if (value === undefined || value === null) continue;
      const serialized = Array.isArray(value) ? value.join(",") : String(value);
      url.searchParams.set(key, serialized);
    }
  }

  const headers = new Headers({ "content-type": "application/json" });
  const token = tokenGetter();
  if (token) headers.set("authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    throw new ApiError({
      code: "network_error",
      message: e instanceof Error ? e.message : "Network request failed",
      status: 0,
      details: e,
    });
  }

  if (!res.ok) {
    let envelope: { error?: { code?: string; message?: string; details?: unknown } } = {};
    try {
      envelope = await res.json();
    } catch {
      // non-JSON error body — fall through with empty envelope
    }
    throw new ApiError({
      code: envelope.error?.code ?? "unknown_error",
      message: envelope.error?.message ?? `HTTP ${res.status}`,
      status: res.status,
      details: envelope.error?.details,
    });
  }

  if (opts.parseJson === false || res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

// --- Endpoints ---

export function listListings(query: ListingsQuery): Promise<ListingsResponse> {
  return request<ListingsResponse>("/listings", { query: query as Record<string, unknown> });
}

export function getListing(id: string): Promise<Listing> {
  return request<Listing>(`/listings/${encodeURIComponent(id)}`);
}

export function signup(payload: {
  email: string;
  password: string;
  displayName: string;
}): Promise<{ user: User; session: Session }> {
  return request("/auth/signup", { method: "POST", body: payload });
}

export function login(payload: {
  email: string;
  password: string;
}): Promise<{ user: User; session: Session }> {
  return request("/auth/login", { method: "POST", body: payload });
}

export function logout(): Promise<void> {
  return request<void>("/auth/logout", { method: "POST", parseJson: false });
}

export function me(): Promise<User> {
  return request<User>("/auth/me");
}

export function getProfile(): Promise<Profile> {
  return request<Profile>("/users/me/profile");
}

export function updateProfile(
  partial: Partial<Pick<Profile, "displayName" | "phone" | "avatarUrl">>,
): Promise<Profile> {
  return request<Profile>("/users/me/profile", { method: "PUT", body: partial });
}
