import type { Ticket } from "./types";

// Sprint 1.2 fixture. 16 realistic Israeli listings — mixed sports + culture,
// spread across May–August 2026, varied cities, providers, and price bands
// so filters and sort have something to chew on. Shape deliberately matches
// what a future API response would plausibly return; do not over-engineer.

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "t-001",
    event: {
      name: "מכבי תל אביב — הפועל באר שבע",
      date: "2026-05-04T20:15:00+03:00",
      venue: "היכל מנורה מבטחים",
      city: "תל אביב",
      category: "sports",
    },
    seat: { section: "103", row: "H", seat: "22" },
    price: { faceValue: 240, serviceFee: 18 },
    provider: "leaan",
  },
  {
    id: "t-002",
    event: {
      name: "הפועל תל אביב — מכבי חיפה",
      date: "2026-05-09T19:30:00+03:00",
      venue: "אצטדיון בלומפילד",
      city: "תל אביב",
      category: "sports",
    },
    seat: { section: "מערב", row: "12", seat: "8" },
    price: { faceValue: 180, serviceFee: 14 },
    provider: "ticketmaster",
  },
  {
    id: "t-003",
    event: {
      name: "עומר אדם — המופע הגדול",
      date: "2026-06-12T21:00:00+03:00",
      venue: "היכל מנורה מבטחים",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "פרקט", row: "5", seat: "14" },
    price: { faceValue: 450, serviceFee: 32 },
    provider: "eventim",
  },
  {
    id: "t-004",
    event: {
      name: "עברי לידר — הופעה אקוסטית",
      date: "2026-05-22T20:30:00+03:00",
      venue: "היכל התרבות",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "יציע מרכזי", row: "9", seat: "17" },
    price: { faceValue: 320, serviceFee: 24 },
    provider: "hadran",
  },
  {
    id: "t-005",
    event: {
      name: "נבחרת ישראל — רומניה",
      date: "2026-06-06T20:45:00+03:00",
      venue: "אצטדיון סמי עופר",
      city: "חיפה",
      category: "sports",
    },
    seat: { section: "דרום", row: "24", seat: "3" },
    price: { faceValue: 290, serviceFee: 21 },
    provider: "ticketmaster",
  },
  {
    id: "t-006",
    event: {
      name: "שלמה ארצי — קיסריה 2026",
      date: "2026-07-18T21:00:00+03:00",
      venue: "האמפיתיאטרון בקיסריה",
      city: "קיסריה",
      category: "culture",
    },
    seat: { section: "בלוק ב'", row: "14", seat: "31" },
    price: { faceValue: 520, serviceFee: 38 },
    provider: "leaan",
  },
  {
    id: "t-007",
    event: {
      name: "בית\"ר ירושלים — מכבי תל אביב",
      date: "2026-05-16T20:00:00+03:00",
      venue: "אצטדיון טדי",
      city: "ירושלים",
      category: "sports",
    },
    seat: { section: "מזרח", row: "7", seat: "19" },
    price: { faceValue: 165, serviceFee: 12 },
    provider: "hadran",
  },
  {
    id: "t-008",
    event: {
      name: "סטטיק ובן אל תבורי",
      date: "2026-06-28T20:30:00+03:00",
      venue: "פארק הירקון",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "כרטיס כניסה", row: "—", seat: "—" },
    price: { faceValue: 395, serviceFee: 29 },
    provider: "eventim",
  },
  {
    id: "t-009",
    event: {
      name: "הפועל ירושלים — הפועל תל אביב",
      date: "2026-05-01T20:00:00+03:00",
      venue: "ארנה ירושלים",
      city: "ירושלים",
      category: "sports",
    },
    seat: { section: "201", row: "C", seat: "11" },
    price: { faceValue: 210, serviceFee: 16 },
    provider: "leaan",
  },
  {
    id: "t-010",
    event: {
      name: "נטע ברזילי — הופעה מיוחדת",
      date: "2026-07-04T21:30:00+03:00",
      venue: "היכל מנורה מבטחים",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "יציע עליון", row: "22", seat: "5" },
    price: { faceValue: 380, serviceFee: 28 },
    provider: "ticketmaster",
  },
  {
    id: "t-011",
    event: {
      name: "הבימה — המלך ליר",
      date: "2026-05-27T20:00:00+03:00",
      venue: "תיאטרון הבימה",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "אולם מרכזי", row: "8", seat: "12" },
    price: { faceValue: 275, serviceFee: 20 },
    provider: "hadran",
  },
  {
    id: "t-012",
    event: {
      name: "התזמורת הפילהרמונית הישראלית",
      date: "2026-06-19T20:00:00+03:00",
      venue: "היכל התרבות",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "תא 14", row: "2", seat: "4" },
    price: { faceValue: 340, serviceFee: 25 },
    provider: "hadran",
  },
  {
    id: "t-013",
    event: {
      name: "מכבי תל אביב — ריאל מדריד",
      date: "2026-05-14T21:05:00+03:00",
      venue: "היכל מנורה מבטחים",
      city: "תל אביב",
      category: "sports",
    },
    seat: { section: "101", row: "B", seat: "6" },
    price: { faceValue: 720, serviceFee: 52 },
    provider: "leaan",
  },
  {
    id: "t-014",
    event: {
      name: "חנן בן ארי — אמפי בעברית",
      date: "2026-08-02T21:00:00+03:00",
      venue: "האמפיתיאטרון בקיסריה",
      city: "קיסריה",
      category: "culture",
    },
    seat: { section: "בלוק ד'", row: "9", seat: "18" },
    price: { faceValue: 410, serviceFee: 30 },
    provider: "leaan",
  },
  {
    id: "t-015",
    event: {
      name: "הפועל באר שבע — מכבי תל אביב",
      date: "2026-05-30T20:00:00+03:00",
      venue: "אצטדיון טרנר",
      city: "באר שבע",
      category: "sports",
    },
    seat: { section: "צפון", row: "16", seat: "24" },
    price: { faceValue: 155, serviceFee: 12 },
    provider: "ticketmaster",
  },
  {
    id: "t-016",
    event: {
      name: "קמרי — אבני דרך",
      date: "2026-06-03T20:30:00+03:00",
      venue: "תיאטרון הקאמרי",
      city: "תל אביב",
      category: "culture",
    },
    seat: { section: "אולם א'", row: "11", seat: "7" },
    price: { faceValue: 260, serviceFee: 19 },
    provider: "eventim",
  },
];

export const ALL_CITIES = Array.from(
  new Set(MOCK_TICKETS.map((t) => t.event.city)),
).sort();

export const ALL_PROVIDERS = Array.from(
  new Set(MOCK_TICKETS.map((t) => t.provider)),
).sort() as Array<Ticket["provider"]>;
