# Safe Ticket — Design System

> **For Claude Code:** Read this file before any UI work. It defines the **constraints and principles** for this project's UI. The concrete tokens live in the `@theme` block in `src/app/globals.css` — that file is the locked source of truth for the design system.

---

## 1. Aesthetic Direction

Safe Ticket is a **trust platform disguised as a marketplace**. The visual language is modeled on [Cloverly.com](https://cloverly.com): cream surface, deep forest green, editorial serif display, generous whitespace. Cloverly is a B2B carbon-credit platform — their aesthetic (calm, trustworthy, premium-without-luxury) maps onto Safe Ticket's positioning of "the honest, verified resale marketplace."

Every visual decision should make the user feel the product is:

- **Calm, not loud** — no aggressive deal-hunting energy, no "bargain bazaar" feel
- **Editorial, not corporate** — generous serif headlines, single sentence of display copy, content over chrome
- **Warm, not cold** — cream over pure white, forest over blue, ochre accent for the CTA that actually matters

**Reference points:** Cloverly (visual language, typographic scale, cream-on-cream), Revolut (trust-through-polish), StubHub (search UX structure).

**Hard aesthetic rules:**

- No purple/teal/blue tech gradients. No pastel clouds. No "AI SaaS 2023" look.
- No maximalist chaos, brutalism, or retro-futurism.
- No emoji in UI. No unicode glyphs (▶, ★) as icons.
- No stock illustration characters (no Lottie people with floating laptops).
- No animated gradients or auto-playing motion on the homepage hero.

**When in doubt:** err toward calm, quiet, and readable. A ticket marketplace is a high-anxiety context for users worried about fraud. Every visual decision should reduce anxiety, not create excitement.

---

## 2. Brand Tokens (locked — do not change)

These come from the product brief and are not up for negotiation. Defined in `src/app/globals.css` under `@theme`.

```css
/* Brand core */
--color-forest: #063b2e;      /* primary dark green — logo, headlines, primary button, footer */
--color-forest-deep: #032419; /* hover / press for forest */
--color-sage: #3b7c5f;        /* interactive accent, verified signal */
--color-cream: #f4efe6;       /* primary surface (page bg) — never pure white */
--color-cream-deep: #ebe3d4;  /* alt surface / hover */
--color-bone: #fbf8f2;        /* lightest surface — cards on cream */
--color-ochre: #c97a3b;       /* the ONE warm accent — reserved CTA only */
--color-ochre-deep: #a45e25;

/* Fonts */
--font-display: var(--font-frank-ruhl-libre);  /* Hebrew-first serif for headlines + editorial figures */
--font-body: var(--font-rubik);                /* Hebrew-first geometric sans for body + UI */
```

**Color usage principles:**

- **Forest is the default primary.** Logo, headlines, primary buttons, footer, nav text. Used heavily — authority without shouting.
- **Sage is the interactive accent.** Reserved for verification, success, and links that need to read as "safe." Never a generic green highlight.
- **Ochre is the ONE reserved CTA color.** Used only on the single most important action per view (Buy ticket, List a ticket, hero search submit). Overusing ochre dilutes its meaning.
- **Cream (#F4EFE6) is the page background, not pure white.** Pure white feels clinical; cream is warmer and premium.
- **Bone (#FBF8F2) is for cards sitting on cream** — a one-shade lift that doesn't compete with the page.
- You may derive a scale from these base colors (lighter/darker variants for borders, muted text, hover states) — see the `forest-*` and `neutral-*` scales already in `globals.css`.

**Font usage principles:**

- Both families are **Hebrew-first** with strong Latin coverage. Latin-first fonts with bolted-on Hebrew (Inter, Roboto, Open Sans) render Hebrew poorly and are **forbidden**.
- **Frank Ruhl Libre** (display) is firm and architectural — use for H1–H3, editorial quotes, hero copy, and prominent price numbers (in editorial contexts). Weight 400–700.
- **Rubik** (body) is a clean geometric sans — body, forms, small numbers, buttons, navigation. Weight 400–700.
- **Prices** use Frank Ruhl Libre in editorial contexts (ticket details page, compact price on cards); Rubik tabular-nums in dense rows (search lists, tables) where figures need to line up.
- **No italics.** Hebrew doesn't support them natively and Rubik / Frank Ruhl Libre italics are auto-generated slants that look cheap.
- Loaded via `next/font/google` in `src/app/layout.tsx` — self-hosted, no runtime request, no layout shift.

---

## 3. Type Scale

Sizes trend **large**. Hero headlines 48–80px. Body 16–18px. Max line length ~68ch.

```text
display-xl  80px / 1.02   — hero headlines (full-bleed)
display-lg  64px / 1.04   — page headers
display-md  48px / 1.08   — section headers
h1          40px / 1.12
h2          32px / 1.18
h3          24px / 1.25
h4          20px / 1.35   — sans-serif (Rubik semibold)
body-lg     18px / 1.6
body        16px / 1.6
small       14px / 1.55
caption     13px / 1.45
micro       12px / 1.4    — eyebrows, tabular uppercase labels (0.12em tracking)
```

All headings use sentence case. Never Title Case. Never ALL CAPS except in micro eyebrows.

---

## 4. Spacing, Radii, Shadows

**Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px. Section vertical padding 96–128px on desktop. Gutter 24px mobile, 48px desktop. Max content width 1200px.

**Corner radii:**

- `rounded-sm` 6px — inputs, chips
- `rounded-md` 12px — buttons
- `rounded-lg` 20px — cards, feature blocks
- `rounded-xl` 28px — hero images, modals
- `rounded-pill` 9999px
- Never mix radii within a single card. No hard 90° corners except possibly table rows.

**Shadows:** sparse and forest-tinted, never pure black.

- `shadow-xs` / `shadow-sm` — subtle borders-with-depth
- `shadow-md` — floating cards
- `shadow-lg` — modals / popovers
- `shadow-card-hover` — the deep card-hover shadow (interactive TicketCard)

---

## 5. RTL (Hebrew) Support — Non-Negotiable

- Root direction: `dir="rtl"` on `<html>` when Hebrew is active. Hebrew is the default on first load.
- Use **logical properties** everywhere: `ps-*` / `pe-*` / `ms-*` / `me-*` / `border-s-*` / `border-e-*`. Never `pl-*` / `pr-*` / `ml-*` / `mr-*` in components that need to mirror.
- Directional icons (arrows, chevrons, "back" indicators) must flip in RTL. For slide-in effects use `rtl:` variants explicitly.
- Numbers and Latin brand names ("Safe Ticket", "₪350") stay LTR inside RTL text. Wrap in `<span dir="ltr">` when needed.
- Tailwind v4 has built-in logical utilities — use them directly. No plugin needed.

---

## 6. Motion

Restrained. 160–260ms, `var(--ease-out)` by default.

**Allowed:** button/card hover transitions, dropdown/modal enter animations, subtle status-change animations, 6% image zoom on card hover, bottom sheet slide-up.

**Forbidden:** parallax scrolling, scroll-jacking, auto-playing carousels, particle/sparkle effects, animated SVG illustrations on the homepage, animated gradient text.

**Hover states** per the Cloverly language:

- Links: underline slides in from the start edge (`.link-underline` in `globals.css`).
- Buttons: one shade darker fill. Never scale up, never shadow-pop.
- Cards: 1px border steps from `--color-border` to `--color-forest`, plus 2px y-lift and `shadow-card-hover`. No heavy shadow bloom.

---

## 7. Component Tone (principles, not specs)

- **Buttons:** `primary` = solid forest; `cta` = solid ochre (Buy, List, hero Search — ONE per view); `secondary` = outlined forest; `ghost` = warm-grey border, transparent fill. No drop shadows.
- **Cards:** bone surface on the cream page bg, 1px warm-grey border, `shadow-xs`. Interactive cards lift subtly on hover (`shadow-card-hover`). Internal padding 20–32px.
- **Verification signal:** inline sage checkmark + word, no sticker background. Reads as a fact, not a label.
- **Inputs:** bone field, 1px warm-grey border, forest border on focus + sage ring. Never a glow.
- **Price display:** face value, service fee, and total are always shown separately — never combined. Face value eyebrow in small-caps sage. Prices in display serif at editorial sizes (details page); sans tabular-nums in dense card lists.

---

## 8. Anti-patterns — do not ship

- Any purple, teal, hot-orange, hot-pink that isn't a derived state color
- Pure white page backgrounds (use cream)
- Generic Unsplash hero photos of concert crowds (use real, observational imagery only)
- "Trusted by 10,000+ users" claims without real numbers
- Animated gradient text / mesh gradients
- Floating WhatsApp/Messenger chat bubbles
- Cookie banners that aren't minimal
- Dark mode (out of scope for MVP — revisit in Phase 6)
- Default Inter, Roboto, Arial, or system-ui as the primary font
- Pure-black shadows (always tint with forest)
- Hard 90° corners on cards, buttons, or inputs
- Emoji and unicode-glyph icons (▶, ★) — use line SVGs only

---

## 9. Content / Copy

**Tone:** Calm, confident, grown-up. The product's proposition is *trust*, so copy should feel like it has nothing to prove. Headlines are declarative, not clever.

**Casing:**

- Display headlines: Sentence case. Never Title Case, never ALL CAPS for long strings.
- UI labels, nav items, section eyebrows: lowercase or Sentence case. Eyebrows are lowercase micro-labels with `0.12em` tracking.
- Buttons: Sentence case ("Find tickets", "List a ticket"). Never "CLICK HERE".

**Avoid:** "revolutionary", "game-changing", "unlock", "seamless", exclamation marks, startup cringe, urgency tactics ("only 2 left!"), discount framing.

---

## 10. Imagery + Iconography

**Imagery.** Warm, generous, unstaged. Stadium silhouettes, concert crowds, observational stadium shots. Never cold blue-hour. Never stock businessy compositions. Light grain is fine.

**Icons.** Line-style (1.5px stroke, rounded caps). Rendered inline from SVG. No icon library dependency in Phase 1 — the icons in use are small enough to keep inline. Can graduate to Lucide later if the set grows.

**Logos.** `/public/brand/logo.svg` (wordmark, forest), `/public/brand/logo-cream.svg` (wordmark on dark), `/public/brand/mark.svg` (monogram / app icon / favicon).

---

## 11. Deliverable boundary

The `@theme` block in `src/app/globals.css` is the source of truth for every token. If a new token is needed, add it there first — don't inline it at the component level. This document only describes *principles*; the tokens themselves live in CSS.
