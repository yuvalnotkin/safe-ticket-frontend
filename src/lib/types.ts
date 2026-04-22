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
