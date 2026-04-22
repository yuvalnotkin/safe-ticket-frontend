# Phase 1 — Static MVP (Frontend)

This file defines the Phase 1 scope. For project-wide context read `CLAUDE.md`. For design tokens and component language read `design_system.md`. This file assumes you have both loaded and does not repeat them.

## Operating rules

1. **Sprint gating.** Phase 1 has three sprints (1.1, 1.2, 1.3). Stop at the end of each and wait for explicit human approval before starting the next. Do not chain sprints.
2. **Decision escalation.** When you hit an ambiguity you can't resolve alone, stop and ask in the terminal using this format:
   ```
   DECISION NEEDED: <one-line summary>
   Context: <what you're trying to do>
   Options:
     A) <option> — <trade-off>
     B) <option> — <trade-off>
   Recommendation: <A or B, and why>
   ```
   Then wait.
3. **Small, reviewable commits.** One feature or component per commit. Clear messages (`feat:`, `fix:`, `chore:`, `docs:`). The human reads diffs to learn.
4. **Teach as you go.** When a new React / Next.js / Tailwind pattern first appears, add a short comment explaining *why you chose it* — not what it does. Brief, not verbose.
5. **No backend.** Phase 1 is 100% mock data. No Supabase client, no fetch calls. All data in `src/lib/mock-data.ts`.
6. **Don't touch `API_CONTRACT.md`.** That's Phase 2.

---

## Sprint 1.1 — Design System Foundation

**Goal:** A working, self-documenting design system. Everything built later in Phase 1 consumes these primitives instead of inventing its own.

**Must exist at the end of the sprint:**

- Design tokens wired into the `@theme` block in `src/app/globals.css` per `design_system.md` (Tailwind v4 CSS-first config — no `tailwind.config.ts`).
- Chosen font pair loaded via `next/font`, supporting Hebrew correctly. Justify the choice in a commit message.
- Living style guide page at `/style-guide` that renders every primitive and component in every state. Internal page, not linked from main nav.
- Base primitives: Button (primary / secondary / ghost, with loading and disabled), Input, Badge, Card — plus anything else you'll clearly need in 1.2 / 1.3.
- Safe Ticket components: `TicketCard`, `PriceBreakdown`, `VerificationBadge`. (`TransactionTimeline` moves to 1.3 — it isn't consumed by 1.2 and its states are better defined once the details page exists.)
- RTL correctness: every component renders correctly under `dir="rtl"`. Verify on the style guide page.
- i18n scaffolding: `useLanguage()` hook + two JSON dictionaries (`he.json`, `en.json`) wired in from day one. Every string in 1.1 goes through the dictionary — Hebrew populated, English stubbed. This avoids a rip-and-replace refactor at the end of 1.3. The language toggle UI itself still lands in 1.3.

**Constraints:** Strict types (no `any`). Prefer composition over wide prop surfaces. Accessibility basics from day one (semantic HTML, focus rings, keyboard operability).

**Stop condition:** commit, push, report: *"Sprint 1.1 complete. Review at `/style-guide`. Ready for 1.2 on approval."* Wait.

---

## Sprint 1.2 — Homepage + Search Results

**Goal:** A visitor lands, understands Safe Ticket in under 5 seconds, searches and filters tickets. Mock data only.

**Must exist at the end of the sprint:**

- Mock data file (`src/lib/mock-data.ts`) with 15–20 realistic Israeli listings. Mix of sports (Maccabi, Hapoel, national team) and culture (Omer Adam, Ivri Lider, Israeli theatre). Varied dates, venues, prices, seat locations, providers. Shape should plausibly match a future backend response, but don't over-engineer.
- Homepage: hero with value prop, prominent search, trust indicators row (verified / face-value / official transfer / escrow), "how it works" (3 steps), footer. Hebrew-first copy.
- Search Results page (`/search` or `/tickets` — your call): search bar, filters (event type, city, date range, provider, price range), result grid using `TicketCard`, sort control (soonest / lowest price / most recent).
- Client-side search + filters, combining correctly (AND across types, OR within). Debounced input.
- Empty state, loading skeleton, no-results state — all reachable and polished.
- Mobile filter panel: slide-out or bottom sheet, not a cramped sidebar.

**Out of scope this sprint:** ticket details page, auth UI, dashboards. `TicketCard` can route to `/tickets/[id]` with a placeholder.

**Stop condition:** commit, push, report: *"Sprint 1.2 complete. Homepage `/`, search `/search`. Ready for 1.3 on approval."* Wait.

---

## Sprint 1.3 — Details, Static Pages, Navigation

**Goal:** Site is fully browsable end-to-end. Every link works. A visitor can imagine the whole product even with nothing wired to a backend.

**Must exist at the end of the sprint:**

- `TransactionTimeline` component (static — data hookup is Phase 4). Rendered on the ticket details page and in the style guide.
- Ticket details page (`/tickets/[id]`): full event info, exact seat, provider badge, `PriceBreakdown`, `TransactionTimeline`, seller profile preview, prominent Buy CTA (non-functional — opens a "coming soon" state), "Why is this safe?" trust callout.
- How It Works page: 5-step flow (Connect → Verify → List → Transfer → Pay) with icons and copy. Hebrew-first.
- FAQ / Trust & Safety: 8–12 questions (verification, escrow, refunds, face-value rule, transfer failure, provider support). Accordion pattern.
- Login / Signup (UI only): email + phone, social login buttons (disabled), trust copy. Submit does nothing or shows a "not yet available" toast.
- Global header: logo, search (or search-icon on mobile), Sell Ticket CTA, login/signup, language toggle (HE ⇄ EN). Sticky, collapses on mobile.
- Global footer: site links, trust row, social placeholders, language toggle, copyright.
- Language toggle functional at UI level — switches `dir` and swaps copy via a simple `useLanguage()` hook with two JSON dictionaries. Backfill earlier sprints' copy into both languages.
- Per-page `<title>` and `<meta description>`. OG tags can wait.

**Out of scope:** real auth, real buy action, tests.

**Stop condition:** commit, push, report: *"Phase 1 complete. Full walkthrough: `/` → search → ticket → how it works → FAQ → login. Ready for Phase 2 planning."*

---

## Definition of Done for Phase 1

- Every page: no console errors or warnings.
- Every page works at 375px (iPhone SE) and 1280px (laptop).
- Every page renders correctly in both LTR (English) and RTL (Hebrew).
- Lighthouse on Vercel preview: Performance ≥ 80, Accessibility ≥ 90. If you can't hit these, report why — don't hide it.
- Every component appears in the style guide.
- No `any` types. No unused imports. No commented-out code blocks.
- Vercel preview URL shows the full site.

---

## Explicitly out of scope for Phase 1

Real auth, Supabase integration, any backend call, seller wizard, buy flow, payment, escrow UI, provider connectors, tests, real-data dashboards, notifications. If you reach for any of these, stop — you're out of scope.
