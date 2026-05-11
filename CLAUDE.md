# Safe Ticket — Frontend

## Project

Secondary ticket marketplace for verified ticket resale at face value only. Israeli market, sports + cultural events. Acts as search engine + marketplace. Only official transfer mechanisms supported. Escrow holds funds until transfer completion.

## Multi-Repo Project — Where You Sit

This repo (`safe-ticket-frontend`) is one of three. The full project:

- **`safe-ticket-orchestrator`** — the human's tech-lead workspace. Owns `API_CONTRACT.md` (canonical), all phase plans, all ADRs, all dispatched executor prompts, and `STATUS.md` (the live progress tracker across both executors). You don't have read access to it. The human pastes prompts from there into your session.
- **`safe-ticket-backend`** — Express + TypeScript API on Railway. Owns the database (hosted Supabase), auth (issues Supabase JWTs), and every endpoint you call. A separate Claude Code agent works in that repo.
- **`safe-ticket-frontend`** — this repo. Next.js on Vercel. Renders the user-facing UI. **You only ever talk to our backend at `NEXT_PUBLIC_API_BASE_URL`. You never import the Supabase JS SDK. You never talk to Supabase, Stripe, ticketing providers, or any third-party data source directly.** Provider abstraction lives entirely on the backend.

The only file that crosses repo boundaries is `API_CONTRACT.md` — it's byte-synced into all three. Treat it as canonical and read-only here.

## Tech Stack

- Next.js 16+ (App Router) with TypeScript, strict mode
- Tailwind CSS v4, heavily customized via `@theme` block in `src/app/globals.css` (NOT the default theme)
- pnpm as package manager
- Plain `fetch` for backend calls (no SWR / TanStack Query / React Query — deliberate MVP choice, revisit later)
- Token storage: `localStorage` (deliberate MVP choice — XSS-vulnerable; revisit before Phase 4 ships real money)
- Deployed on Vercel (auto-deploy from `main`)

## Design Direction

See `design_system.md` for the full design system (tokens, fonts, RTL rules, anti-patterns). Summary:

- Brand: Forest (#063B2E), Sage (#3B7C5F), Cream (#F4EFE6), Ochre CTA (#C97A3B — reserved use only). Source of truth: `@theme` block in `src/app/globals.css`.
- Fonts: Frank Ruhl Libre (display/serif) + Rubik (body/sans) — both Hebrew-first. Never Inter, Roboto, Arial, or system-ui.
- Tone: Calm, editorial, premium-without-luxury. Cloverly-inspired (honest, verified). NOT a bazaar, NOT fintech-flashy.
- References: Cloverly (visual language, typographic scale), StubHub (search UX), Revolut (trust-through-polish).
- Mobile-first responsive. Hebrew primary, English toggle.
- MUST look unique — avoid generic vibe-coded aesthetics.

## File Structure

```
src/
  app/           → Pages (Next.js App Router, file-based routing)
  components/    → Reusable UI components
  lib/           → Utilities, API client, shared types
  styles/        → Global styles, Tailwind config customizations
```

`src/lib/api.ts` is the only place that calls the backend. Pages and components call wrappers from there, never raw `fetch`.

## API Contract

`API_CONTRACT.md` in this repo is the canonical source for every backend endpoint, request/response shape, error envelope, and validation rule. **It is owned by the orchestrator and synced in.** Do not edit it locally — if you find a gap, ambiguity, or drift between contract and reality, surface it back to the human and the orchestrator updates it. A local edit will be overwritten on the next sync.

## Workflow — Branch + PR + Squash Merge

`main` is branch-protected on GitHub: PR required, no force pushes, no deletions, admins enforced. **Direct push to `main` is blocked at the platform layer** — it is not a soft convention.

For every segment of work:

1. Create a feature branch named `phase-<N>/segment-<M>-<slug>` (e.g. `phase-2/segment-1-foundation`).
2. Commit per logical change with descriptive messages.
3. Push the branch.
4. Open a PR against `main`. PR title format: `Phase <N> segment <M>: <short outcome>`. Body covers what changed, how to test, anything tricky to look at.
5. The human reviews and squash-merges. **You do not merge your own PRs.**
6. Vercel auto-deploys from `main` after merge.

If a subagent is dispatched (Superpowers `subagent-driven-development` etc.), the subagent's prompt must explicitly forbid `git push` — the parent agent owns all pushes. Defense in depth on top of branch protection.

## Verification Model

When you report a segment "done," that is *not* the authoritative completion signal. The orchestrator runs an independent verification before flipping the segment to ✅ in `STATUS.md` (which lives in the orchestrator repo, not here). Their checklist:

1. Diff your branch against `API_CONTRACT.md` — flag any drift.
2. Smoke-test the new functionality on the **live deploy** (Vercel hitting live Railway), not just localhost.
3. Run the segment-specific manual checklist from the dispatched prompt.

So when you finish a segment: ship it, open the PR, paste your test output and curl examples in the PR body, then *stand by* — don't assume the work is closed until you hear back. If the orchestrator finds drift or a verification failure, you'll be asked to fix it forward on the same branch (no force-push rollbacks).

`STATUS.md` lives in the orchestrator repo and is owned by the orchestrator. **Don't try to update it from here** — you don't have access, and even if you did, your status report is not the source of truth, the orchestrator's verification is.

## Superpowers

You have the Superpowers skill set. Use the relevant skills proactively:

- `test-driven-development` — for every non-trivial module (API client, money helpers, auth context, anything with branching logic). Default discipline this project, even when a phase plan doesn't explicitly require it.
- `verification-before-completion` — before reporting any segment done. Run the build, the type checker, the tests, and (where it exists) the lint command. Paste actual command output in the PR — don't claim success from memory.
- `brainstorming` — when a prompt is creative or ambiguous and the right move isn't obvious.
- `subagent-driven-development` / `dispatching-parallel-agents` — when a segment splits cleanly into independent tasks. Subagent prompts must forbid `git push` (see Workflow section).

## Rules

- Mobile-first responsive design.
- All prices show face value + service fee separately — NEVER combined.
- Money values from the API are integers in **agorot** (1 ILS = 100 agorot). Field names end with `Agorot`. Convert at the display layer via `src/lib/money.ts` helpers, never store floats. Buyer service fee is 10% of face value, integer-truncated.
- Provider IDs in the API contract are `eventim_il | hala | leaan | tmura` (and grow as connectors are added).
- Every ticket card shows verification badge.
- Ticket price is NEVER editable by seller (and is locked to face value at the listing layer in the backend).
- Buyer purchases a specific seat, not a category.
- Trust messaging repeated throughout: verified, face value, official transfer, escrow.
- Post-transfer refunds handled by ticketing provider — must be stated in UI.
- Every page needs loading, empty, and error states.
- Hebrew is the primary language, English toggle available.
- Do NOT use default Tailwind colors — use our custom palette.
- Never import the Supabase JS SDK or call Supabase / third-party services directly. All data flows through our backend at `NEXT_PUBLIC_API_BASE_URL`.

## Known Divergences (close as Phase 2 frontend ships)

- ~~**Money in shekels vs. agorot.** Phase-1 mocks use whole shekels (`price.faceValue: number`). The contract uses agorot integers (`faceValueAgorot`, `serviceFeeAgorot`). Type swap + display helpers land in Phase 2 segment 1; mocks die in segment 2. S1 (this branch) added the contract-aligned types and `formatPriceILS` helper; full closeout is at S2 when pages stop importing mocks.~~ **Closed 2026-05-11** on branch `phase-2/segment-2-wire-pages`: `/search`, `/tickets/[id]`, and home `FeaturedTickets` now read live agorot integers from the backend; `src/lib/mock-data.ts` deleted. (Closing squash-commit SHA filled in by the human reviewer at merge time.)
- ~~**Provider union outdated.** Phase-1 `src/lib/types.ts` has `ticketmaster | leaan | eventim | hadran`. The contract has `eventim_il | hala | leaan | tmura`. Swap lands in Phase 2 segment 1 alongside the agorot work. S1 (this branch) added the contract-aligned types and `formatPriceILS` helper; full closeout is at S2 when pages stop importing mocks.~~ **Closed 2026-05-11** on branch `phase-2/segment-2-wire-pages`: `FilterPanel` provider list now hard-coded to the contract union (`eventim_il | hala | leaan | tmura`) and verified against live backend responses; mock-derived `ALL_PROVIDERS` gone with `mock-data.ts`. (Closing squash-commit SHA filled in by the human reviewer at merge time.)

## Working With Me

- Describe the problem, not the solution. The human says what the outcome is; you figure out how.
- If something is ambiguous or contradictory, ask before guessing.
- If you think a constraint is wrong, say so. Better to argue now than refactor later.
- For meaningful decisions (state shape, auth model, anything with long-term consequences), pause and ask before committing.

## Current Phase

**Phase 2 — Frontend Integration** (in flight). Goal: replace every Phase-1 mock with real calls to the live backend; stand up the auth-gated surface. Four segments — foundation (env + API client + types swap), public read (wire `/search` and `/tickets/[id]`), auth (signup/login/logout/session), auth-gated routes (`/profile` real + `/dashboard/{buyer,seller}` placeholder shells). Each segment dispatched as its own prompt by the orchestrator; full plan lives there. Segments land one at a time with verification between them.
