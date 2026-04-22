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
- Brand: Dark navy (#1B2A4A), Trust green (#2D6A4F), Clean white (#FAFAFA)
- Fonts: Rubik (display) + Assistant (body) — Hebrew-first. Never Inter, Roboto, Arial, or system-ui.
- Tone: Premium, trustworthy, fintech-like — NOT a bazaar or generic marketplace
- References: StubHub (search UX), Revolut (trust feel), Wolt (card design)
- Mobile-first responsive. Hebrew primary, English toggle.
- MUST look unique — avoid generic vibe-coded aesthetics

## File Structure
src/
  app/           → Pages (Next.js App Router, file-based routing)
  components/    → Reusable UI components
  lib/           → Utilities, API client, Supabase client, shared types
  styles/        → Global styles, Tailwind config customizations

## Current Sprint
Phase 1, Sprint 1.2 — Homepage + Search Results complete. Next: Sprint 1.3 (Ticket details, static pages, global nav + language toggle), pending human approval per `PHASE_1_PLAN.md`.

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
