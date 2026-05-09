// Shared domain types. Mock data (Sprint 1.2) and the eventual API (Phase 2)
// both conform to these shapes. Keep narrow — only what the UI needs today.

export type EventCategory = "sports" | "culture";

export type TicketProvider =
  | "ticketmaster"
  | "leaan"
  | "eventim"
  | "hadran";

export type Ticket = {
  id: string;
  event: {
    name: string;
    date: string; // ISO 8601
    venue: string;
    city: string;
    category: EventCategory;
  };
  seat: {
    section: string;
    row?: string;
    seat?: string;
  };
  price: {
    faceValue: number;  // shekels, whole number
    serviceFee: number; // shekels, whole number
  };
  provider: TicketProvider;
};

// --- Phase 2 contract-aligned types ---

export type Listing = Ticket; // alias for contract terminology; same runtime shape

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix epoch seconds
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

export type Profile = User; // /users/me/profile returns same shape as /auth/me

export type ListingsQuery = {
  q?: string;
  category?: "sports" | "culture";
  cities?: ReadonlyArray<string>;
  providers?: ReadonlyArray<TicketProvider>;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  minPriceAgorot?: number;
  maxPriceAgorot?: number;
  sort?: "soonest" | "lowestPrice" | "newest";
  page?: number;
  limit?: number;
};

export type ListingsResponse = {
  items: Listing[];
  page: number;
  limit: number;
  total: number;
};
