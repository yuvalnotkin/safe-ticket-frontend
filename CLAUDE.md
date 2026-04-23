# Safe Ticket — Frontend

## Project
Secondary ticket marketplace for verified ticket resale at face value only.
Israeli market, sports + cultural events. Acts as search engine + marketplace.
Only official transfer mechanisms supported. Escrow holds funds until transfer completion.

## Tech Stack
- Next.js 14+ (App Router) with TypeScript
- Tailwind CSS (heavily customized — NOT default theme)
- Supabase client for auth + data fetching
- pnpm as package manager
- Deployed on Vercel (auto-deploy from main branch)

## Design Direction
See `design_system.md` for the full design system (tokens, fonts, RTL rules, anti-patterns). Summary:
- Brand: Forest (#063B2E), Sage (#3B7C5F), Cream (#F4EFE6), Ochre CTA (#C97A3B — reserved use only). Source of truth: `@theme` block in `src/app/globals.css`.
- Fonts: Frank Ruhl Libre (display/serif) + Rubik (body/sans) — both Hebrew-first. Never Inter, Roboto, Arial, or system-ui.
- Tone: Calm, editorial, premium-without-luxury. Cloverly-inspired (honest, verified). NOT a bazaar, NOT fintech-flashy.
- References: Cloverly (visual language, typographic scale), StubHub (search UX), Revolut (trust-through-polish).
- Mobile-first responsive. Hebrew primary, English toggle.
- MUST look unique — avoid generic vibe-coded aesthetics

## File Structure
src/
  app/           → Pages (Next.js App Router, file-based routing)
  components/    → Reusable UI components
  lib/           → Utilities, API client, Supabase client, shared types
  styles/        → Global styles, Tailwind config customizations

## Current Sprint
Phase 1 complete + comprehensive design refresh (Cloverly-inspired cream/forest/serif direction). Full walkthrough: `/` → `/search` → `/tickets/[id]` → `/how-it-works` → `/faq` → `/login`. Next: Phase 2 planning (backend integration), pending human direction.

## API Contract
See API_CONTRACT.md for all backend endpoints.

## Rules
- Mobile-first responsive design
- All prices show face value + service fee separately — NEVER combined
- Every ticket card shows verification badge
- Ticket price is NEVER editable by seller
- Buyer purchases a specific seat, not a category
- Trust messaging repeated throughout: verified, face value, official transfer, escrow
- Post-transfer refunds handled by ticketing provider — must be stated in UI
- Every page needs loading, empty, and error states
- Hebrew is the primary language, English toggle available
- Do NOT use default Tailwind colors — use our custom palette
- Commit after each working feature with descriptive messages
